import { startOfWeek } from 'date-fns'
import { nanoid } from 'nanoid'
import type { Board, Theme, Widget, WidgetLayout, WidgetType } from '../types'

export const defaultTheme: Theme = {
  fontHeading: '"Fraunces", serif',
  fontBody: '"Quicksand", sans-serif',
  fontSizes: {
    heading: 28,
    body: 16,
    small: 13,
  },
  colors: {
    bg: '#f8edf2',
    surface: '#fff7fb',
    text: '#4a2c3a',
    accent: '#f06aa0',
    muted: '#b48aa3',
    cardBorder: '#f4cadc',
  },
  borderRadius: 18,
  shadow: 22,
  gridGap: 16,
  backgroundPattern: 'strawberry',
}

export const defaultBoard = (userId: string): Board => ({
  id: nanoid(),
  user_id: userId,
  title: 'notece.me',
  hero_image_url: null,
  theme: defaultTheme,
})

const baseLayouts: Record<WidgetType, WidgetLayout> = {
  clock: {
    lg: { x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    md: { x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    sm: { x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    xs: { x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    xxs: { x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
  },
  habits: {
    lg: { x: 2, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    md: { x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    sm: { x: 0, y: 2, w: 6, h: 4, minW: 4, minH: 3 },
    xs: { x: 0, y: 2, w: 4, h: 4, minW: 3, minH: 3 },
    xxs: { x: 0, y: 2, w: 2, h: 4, minW: 2, minH: 3 },
  },
  todos: {
    lg: { x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
    md: { x: 6, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
    sm: { x: 0, y: 6, w: 6, h: 4, minW: 4, minH: 3 },
    xs: { x: 0, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
    xxs: { x: 0, y: 6, w: 2, h: 4, minW: 2, minH: 3 },
  },
  notes: {
    lg: { x: 0, y: 4, w: 8, h: 6, minW: 4, minH: 4 },
    md: { x: 0, y: 6, w: 8, h: 6, minW: 4, minH: 4 },
    sm: { x: 0, y: 10, w: 6, h: 6, minW: 4, minH: 4 },
    xs: { x: 0, y: 10, w: 4, h: 6, minW: 3, minH: 4 },
    xxs: { x: 0, y: 10, w: 2, h: 6, minW: 2, minH: 4 },
  },
  image: {
    lg: { x: 8, y: 4, w: 4, h: 5, minW: 3, minH: 3 },
    md: { x: 8, y: 6, w: 4, h: 5, minW: 3, minH: 3 },
    sm: { x: 0, y: 16, w: 6, h: 5, minW: 4, minH: 3 },
    xs: { x: 0, y: 16, w: 4, h: 5, minW: 3, minH: 3 },
    xxs: { x: 0, y: 16, w: 2, h: 5, minW: 2, minH: 3 },
  },
  calendar: {
    lg: { x: 8, y: 9, w: 4, h: 4, minW: 3, minH: 3 },
    md: { x: 8, y: 11, w: 4, h: 4, minW: 3, minH: 3 },
    sm: { x: 0, y: 21, w: 6, h: 4, minW: 4, minH: 3 },
    xs: { x: 0, y: 21, w: 4, h: 4, minW: 3, minH: 3 },
    xxs: { x: 0, y: 21, w: 2, h: 4, minW: 2, minH: 3 },
  },
  mood: {
    lg: { x: 0, y: 10, w: 6, h: 3, minW: 3, minH: 2 },
    md: { x: 0, y: 12, w: 6, h: 3, minW: 3, minH: 2 },
    sm: { x: 0, y: 25, w: 6, h: 3, minW: 3, minH: 2 },
    xs: { x: 0, y: 25, w: 4, h: 3, minW: 3, minH: 2 },
    xxs: { x: 0, y: 25, w: 2, h: 3, minW: 2, minH: 2 },
  },
}

export const layoutForType = (type: WidgetType): WidgetLayout => {
  const layout = baseLayouts[type]
  return {
    lg: { ...layout.lg, y: Infinity },
    md: { ...layout.md, y: Infinity },
    sm: { ...layout.sm, y: Infinity },
    xs: { ...layout.xs, y: Infinity },
    xxs: { ...layout.xxs, y: Infinity },
  }
}

const defaultNotesContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Cozy notes corner' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Romanticize your routine. Add text, checklists, images, and GIFs here.',
        },
      ],
    },
  ],
}

const defaultHabits = ['Hydrate', 'Stretch', 'Read 10 mins', 'Skincare', 'Gratitude']

export const createDefaultWidgets = (boardId: string): Widget[] => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const widgets: Widget[] = [
    {
      id: nanoid(),
      board_id: boardId,
      type: 'clock',
      title: 'Soft clock',
      layout: baseLayouts.clock,
      data: { style: 'digital' },
    },
    {
      id: nanoid(),
      board_id: boardId,
      type: 'habits',
      title: 'Habit tracker',
      layout: baseLayouts.habits,
      data: {
        weekStart: weekStart.toISOString(),
        habits: defaultHabits.map((name) => ({
          id: nanoid(),
          name,
          checks: Array.from({ length: 7 }, () => false),
        })),
      },
    },
    {
      id: nanoid(),
      board_id: boardId,
      type: 'todos',
      title: 'To-do list',
      layout: baseLayouts.todos,
      data: {
        items: [
          { id: nanoid(), text: 'Light a candle', done: false, order: 0 },
          { id: nanoid(), text: 'Plan cute outfit', done: true, order: 1 },
          { id: nanoid(), text: 'Send a sweet text', done: false, order: 2 },
        ],
      },
    },
    {
      id: nanoid(),
      board_id: boardId,
      type: 'notes',
      title: 'Weekly notes',
      layout: baseLayouts.notes,
      data: {
        title: 'Main character energy',
        content: defaultNotesContent,
      },
    },
    {
      id: nanoid(),
      board_id: boardId,
      type: 'image',
      title: 'Moodboard',
      layout: baseLayouts.image,
      data: {
        url: '',
        caption: 'Drop an image or GIF',
        isGif: false,
      },
    },
    {
      id: nanoid(),
      board_id: boardId,
      type: 'calendar',
      title: 'Mini calendar',
      layout: baseLayouts.calendar,
      data: {
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
      },
    },
    {
      id: nanoid(),
      board_id: boardId,
      type: 'mood',
      title: 'Mood',
      layout: baseLayouts.mood,
      data: {
        text: 'Feeling soft, cozy, and adored.',
        emoji: ':)',
      },
    },
  ]

  return widgets
}
