import { create } from 'zustand'
import type { Layouts } from 'react-grid-layout'
import type { Board, Theme, Widget, WidgetData, WidgetType } from '../types'
import { createDefaultWidgets, defaultBoard, layoutForType } from '../data/defaults'
import { nanoid } from 'nanoid'
import { applyLayoutsToWidgets } from '../lib/layout'
import { debounce } from '../lib/debounce'
import { isDemoMode, supabase } from '../lib/supabase'

const DEMO_BOARD_KEY = 'notece.demo.board'
const DEMO_WIDGETS_KEY = 'notece.demo.widgets'

const saveBoardDebounced = debounce(async (board: Board) => {
  if (isDemoMode || !supabase) {
    localStorage.setItem(DEMO_BOARD_KEY, JSON.stringify(board))
    return
  }
  await supabase
    .from('boards')
    .update({
      title: board.title,
      hero_image_url: board.hero_image_url,
      theme: board.theme,
      updated_at: new Date().toISOString(),
    })
    .eq('id', board.id)
})

const saveWidgetsDebounced = debounce(async (widgets: Widget[]) => {
  if (isDemoMode || !supabase) {
    localStorage.setItem(DEMO_WIDGETS_KEY, JSON.stringify(widgets))
    return
  }

  await supabase.from('widgets').upsert(
    widgets.map((widget) => ({
      id: widget.id,
      board_id: widget.board_id,
      type: widget.type,
      title: widget.title,
      layout: widget.layout,
      data: widget.data,
      updated_at: new Date().toISOString(),
    })),
    {
      onConflict: 'id',
    }
  )
})

export type BoardState = {
  status: 'idle' | 'loading' | 'ready' | 'error'
  error?: string
  session: any | null
  board: Board | null
  widgets: Widget[]
  themeEditorOpen: boolean
  demoMode: boolean
  setSession: (session: any | null) => void
  loadBoard: (userId: string) => Promise<void>
  setThemeEditorOpen: (value: boolean) => void
  updateBoard: (partial: Partial<Board>) => void
  updateTheme: (theme: Theme) => void
  updateWidgetTitle: (id: string, title: string) => void
  updateWidgetData: (id: string, data: WidgetData) => void
  applyLayouts: (layouts: Layouts) => void
  addWidget: (type: WidgetType) => void
  removeWidget: (id: string) => void
}

const loadDemoData = (userId: string) => {
  const storedBoard = localStorage.getItem(DEMO_BOARD_KEY)
  const storedWidgets = localStorage.getItem(DEMO_WIDGETS_KEY)

  if (storedBoard && storedWidgets) {
    return {
      board: JSON.parse(storedBoard) as Board,
      widgets: JSON.parse(storedWidgets) as Widget[],
    }
  }

  const board = defaultBoard(userId)
  const widgets = createDefaultWidgets(board.id)
  localStorage.setItem(DEMO_BOARD_KEY, JSON.stringify(board))
  localStorage.setItem(DEMO_WIDGETS_KEY, JSON.stringify(widgets))
  return { board, widgets }
}

export const useBoardStore = create<BoardState>((set, get) => ({
  status: 'idle',
  error: undefined,
  session: null,
  board: null,
  widgets: [],
  themeEditorOpen: false,
  demoMode: isDemoMode,
  setSession: (session) => set({ session }),
  loadBoard: async (userId: string) => {
    set({ status: 'loading', error: undefined })

    try {
      if (isDemoMode || !supabase) {
        const { board, widgets } = loadDemoData(userId)
        set({ board, widgets, status: 'ready' })
        return
      }

      const { data: board, error: boardError } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle()

      if (boardError) {
        throw boardError
      }

      let activeBoard = board as Board | null
      if (!activeBoard) {
        const newBoard = defaultBoard(userId)
        const { data: createdBoard, error: createError } = await supabase
          .from('boards')
          .insert({
            id: newBoard.id,
            user_id: newBoard.user_id,
            title: newBoard.title,
            hero_image_url: newBoard.hero_image_url,
            theme: newBoard.theme,
          })
          .select('*')
          .single()

        if (createError) {
          throw createError
        }
        activeBoard = createdBoard as Board
      }

      const { data: widgets, error: widgetError } = await supabase
        .from('widgets')
        .select('*')
        .eq('board_id', activeBoard.id)

      if (widgetError) {
        throw widgetError
      }

      let activeWidgets = (widgets ?? []) as Widget[]
      if (activeWidgets.length === 0) {
        activeWidgets = createDefaultWidgets(activeBoard.id)
        await supabase.from('widgets').insert(activeWidgets)
      }

      set({ board: activeBoard, widgets: activeWidgets, status: 'ready' })
    } catch (error: any) {
      set({ status: 'error', error: error?.message ?? 'Unable to load board' })
    }
  },
  setThemeEditorOpen: (value) => set({ themeEditorOpen: value }),
  updateBoard: (partial) => {
    const board = get().board
    if (!board) return
    const nextBoard = { ...board, ...partial }
    set({ board: nextBoard })
    saveBoardDebounced(nextBoard)
  },
  updateTheme: (theme) => {
    const board = get().board
    if (!board) return
    const nextBoard = { ...board, theme }
    set({ board: nextBoard })
    saveBoardDebounced(nextBoard)
  },
  updateWidgetTitle: (id, title) => {
    const widgets = get().widgets.map((widget) =>
      widget.id === id ? { ...widget, title } : widget
    )
    set({ widgets })
    saveWidgetsDebounced(widgets)
  },
  updateWidgetData: (id, data) => {
    const widgets = get().widgets.map((widget) =>
      widget.id === id ? { ...widget, data } : widget
    )
    set({ widgets })
    saveWidgetsDebounced(widgets)
  },
  applyLayouts: (layouts) => {
    const widgets = applyLayoutsToWidgets(get().widgets, layouts)
    set({ widgets })
    saveWidgetsDebounced(widgets)
  },
  addWidget: (type) => {
    const board = get().board
    if (!board) return
    const newWidget: Widget = {
      id: nanoid(),
      board_id: board.id,
      type,
      title: type === 'image' ? 'Image' : type.charAt(0).toUpperCase() + type.slice(1),
      layout: layoutForType(type),
      data: type === 'notes'
        ? { title: 'Notes', content: { type: 'doc', content: [] }, showTitle: true }
        : type === 'todos'
        ? { items: [], showTitle: true }
        : type === 'habits'
        ? {
            weekStart: new Date().toISOString(),
            habits: [],
            showTitle: true,
          }
        : type === 'image'
        ? { url: '', caption: '', isGif: false, showTitle: true }
        : type === 'calendar'
        ? { month: new Date().getMonth(), year: new Date().getFullYear(), showTitle: true }
        : type === 'mood'
        ? { text: '', emoji: '', showTitle: true }
        : { style: 'digital', showTitle: true },
    }
    const widgets = [...get().widgets, newWidget]
    set({ widgets })
    saveWidgetsDebounced(widgets)
  },
  removeWidget: (id) => {
    const widgets = get().widgets.filter((widget) => widget.id !== id)
    set({ widgets })
    saveWidgetsDebounced(widgets)
  },
}))
