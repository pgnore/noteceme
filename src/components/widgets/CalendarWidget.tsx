import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import type { CalendarData, Widget } from '../../types'
import { useBoardStore } from '../../store/boardStore'

export default function CalendarWidget({ widget }: { widget: Widget }) {
  const { updateWidgetData } = useBoardStore()
  const data = widget.data as CalendarData & { showWeekdays?: boolean }
  const monthDate = new Date(data.year, data.month, 1)

  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const rows = []
  let day = startDate

  while (day <= endDate) {
    const days = []
    for (let i = 0; i < 7; i += 1) {
      days.push(day)
      day = addDays(day, 1)
    }
    rows.push(days)
  }

  const changeMonth = (offset: number) => {
    const next = new Date(data.year, data.month + offset, 1)
    updateWidgetData(widget.id, { month: next.getMonth(), year: next.getFullYear() })
  }

  return (
    <div className="widget-fill">
      <div className="widget-scroll">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="button ghost" onClick={() => changeMonth(-1)}>
            Prev
          </button>
          <strong>{format(monthDate, 'MMMM yyyy')}</strong>
          <button className="button ghost" onClick={() => changeMonth(1)}>
            Next
          </button>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 6,
            marginTop: 12,
            fontSize: 'var(--font-size-small)',
          }}
        >
          {(data.showWeekdays !== false ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : []).map(
            (label) => (
              <div key={label} style={{ textAlign: 'center', color: 'var(--muted)' }}>
                {label}
              </div>
            )
          )}
          {rows.map((week, index) =>
            week.map((date) => (
              <div
                key={`${index}-${date.toISOString()}`}
                style={{
                  textAlign: 'center',
                  padding: 6,
                  borderRadius: 10,
                  background: isToday(date) ? 'rgba(239, 111, 165, 0.2)' : 'transparent',
                  color: isSameMonth(date, monthDate) ? 'var(--text)' : 'var(--muted)',
                }}
              >
                {format(date, 'd')}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
