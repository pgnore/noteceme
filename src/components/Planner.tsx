import { useMemo, useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { buildLayouts, breakpoints, cols } from '../lib/layout'
import { useBoardStore } from '../store/boardStore'
import { supabase } from '../lib/supabase'
import Hero from './Hero'
import ThemeEditor from './ThemeEditor'
import WidgetFrame from './widgets/WidgetFrame'
import ClockWidget from './widgets/ClockWidget'
import HabitsWidget from './widgets/HabitsWidget'
import TodoWidget from './widgets/TodoWidget'
import NotesWidget from './widgets/NotesWidget'
import ImageWidget from './widgets/ImageWidget'
import CalendarWidget from './widgets/CalendarWidget'
import MoodWidget from './widgets/MoodWidget'
import type { ClockData, Widget, WidgetType } from '../types'

const ResponsiveGridLayout = WidthProvider(Responsive)

const widgetLabel: Record<WidgetType, string> = {
  clock: 'Clock',
  habits: 'Habit tracker',
  todos: 'To-do list',
  notes: 'Notes',
  image: 'Image/GIF',
  calendar: 'Calendar',
  mood: 'Mood/Quote',
}

const defaultClockOrder: Array<'time' | 'date' | 'note'> = ['time', 'date', 'note']

export default function Planner() {
  const {
    board,
    widgets,
    themeEditorOpen,
    setThemeEditorOpen,
    updateWidgetTitle,
    updateWidgetData,
    removeWidget,
    applyLayouts,
    addWidget,
    demoMode,
    session,
  } = useBoardStore()

  const layouts = useMemo(() => buildLayouts(widgets), [widgets])
  const [newWidgetType, setNewWidgetType] = useState<WidgetType>('notes')
  const [settingsOpen, setSettingsOpen] = useState<Record<string, boolean>>({})

  if (!board) return null

  const gap = board.theme.gridGap

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
  }

  const toggleSettings = (id: string) => {
    setSettingsOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'clock':
        return <ClockWidget widget={widget} />
      case 'habits':
        return <HabitsWidget widget={widget} />
      case 'todos':
        return <TodoWidget widget={widget} />
      case 'notes':
        return <NotesWidget widget={widget} />
      case 'image':
        return <ImageWidget widget={widget} />
      case 'calendar':
        return <CalendarWidget widget={widget} />
      case 'mood':
        return <MoodWidget widget={widget} />
      default:
        return null
    }
  }

  const renderSettings = (widget: Widget) => {
    if (widget.type === 'clock') {
      const data = widget.data as ClockData
      const order = data.layoutOrder ?? defaultClockOrder

      const moveItem = (index: number, direction: number) => {
        const next = [...order]
        const target = index + direction
        if (target < 0 || target >= next.length) return
        const temp = next[index]
        next[index] = next[target]
        next[target] = temp
        updateWidgetData(widget.id, { ...data, layoutOrder: next })
      }

      return (
        <div className="settings-group">
          <div className="settings-row">
            <label>Clock style</label>
            <select
              value={data.style ?? 'serif'}
              onChange={(event) => updateWidgetData(widget.id, { ...data, style: event.target.value as any })}
            >
              <option value="digital">Digital</option>
              <option value="serif">Serif</option>
              <option value="minimal">Minimal</option>
              <option value="analog">Analog</option>
            </select>
          </div>
          <div className="settings-row">
            <label>Date display</label>
            <select
              value={data.dateDisplay ?? 'dayMonth'}
              onChange={(event) =>
                updateWidgetData(widget.id, { ...data, dateDisplay: event.target.value as any })
              }
            >
              <option value="none">None</option>
              <option value="day">Day only</option>
              <option value="dayMonth">Day + month</option>
            </select>
          </div>
          <div className="settings-row">
            <label>Note</label>
            <input
              value={data.note ?? ''}
              placeholder="Add a small note"
              onChange={(event) => updateWidgetData(widget.id, { ...data, note: event.target.value })}
            />
          </div>
          <div className="settings-row">
            <label>Layout order</label>
            <div className="order-list">
              {order.map((item, index) => (
                <div key={item} className="order-item">
                  <span>{item}</span>
                  <div className="order-buttons">
                    <button className="button ghost" onClick={() => moveItem(index, -1)}>
                      Up
                    </button>
                    <button className="button ghost" onClick={() => moveItem(index, 1)}>
                      Down
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-badge">n</span>
          notece.me
        </div>
        <div className="header-actions">
          <button className="button ghost" onClick={() => setThemeEditorOpen(!themeEditorOpen)}>
            Theme
          </button>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select
              value={newWidgetType}
              onChange={(event) => setNewWidgetType(event.target.value as WidgetType)}
              className="widget-control"
            >
              {Object.entries(widgetLabel).map(([key, label]) => (
                <option value={key} key={key}>
                  {label}
                </option>
              ))}
            </select>
            <button className="button secondary" onClick={() => addWidget(newWidgetType)}>
              Add widget
            </button>
          </div>
          {!demoMode && (
            <button className="button ghost" onClick={handleSignOut}>
              Sign out
            </button>
          )}
        </div>
      </header>

      {demoMode && (
        <div className="demo-banner">
          Demo mode is active. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable sync.
        </div>
      )}

      <Hero userId={session?.user?.id ?? 'demo-user'} />

      <div className="grid-wrap">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={breakpoints}
          cols={cols}
          rowHeight={34}
          margin={[gap, gap]}
          containerPadding={[gap, gap]}
          isDraggable
          isResizable
          draggableHandle=".widget-header"
          onLayoutChange={(_layout, allLayouts) => {
            applyLayouts(allLayouts)
          }}
        >
          {widgets.map((widget) => {
            const showTitle = (widget.data as any).showTitle !== false
            return (
              <div key={widget.id}>
                <WidgetFrame
                  title={widget.title}
                  showTitle={showTitle}
                  onTitleChange={(value) => updateWidgetTitle(widget.id, value)}
                  onShowTitleChange={(value) =>
                    updateWidgetData(widget.id, { ...(widget.data as any), showTitle: value })
                  }
                  onRemove={() => removeWidget(widget.id)}
                  settingsOpen={!!settingsOpen[widget.id]}
                  onToggleSettings={() => toggleSettings(widget.id)}
                  settings={renderSettings(widget)}
                >
                  {renderWidget(widget)}
                </WidgetFrame>
              </div>
            )
          })}
        </ResponsiveGridLayout>
      </div>

      {themeEditorOpen && <ThemeEditor />}
    </div>
  )
}
