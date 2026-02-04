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
import type { Widget, WidgetType } from '../types'

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

export default function Planner() {
  const {
    board,
    widgets,
    themeEditorOpen,
    setThemeEditorOpen,
    updateWidgetTitle,
    removeWidget,
    applyLayouts,
    addWidget,
    demoMode,
    session,
  } = useBoardStore()

  const layouts = useMemo(() => buildLayouts(widgets), [widgets])
  const [newWidgetType, setNewWidgetType] = useState<WidgetType>('notes')

  if (!board) return null

  const gap = board.theme.gridGap

  const handleSignOut = async () => {
    await supabase?.auth.signOut()
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
          {widgets.map((widget) => (
            <div key={widget.id}>
              <WidgetFrame
                title={widget.title}
                onTitleChange={(value) => updateWidgetTitle(widget.id, value)}
                onRemove={() => removeWidget(widget.id)}
              >
                {renderWidget(widget)}
              </WidgetFrame>
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>

      {themeEditorOpen && <ThemeEditor />}
    </div>
  )
}
