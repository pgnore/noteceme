import { useEffect, useState } from 'react'
import type { ClockData, Widget } from '../../types'
import { useBoardStore } from '../../store/boardStore'

export default function ClockWidget({ widget }: { widget: Widget }) {
  const { updateWidgetData } = useBoardStore()
  const [now, setNow] = useState(new Date())
  const data = widget.data as ClockData

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const style = data.style ?? 'serif'
  const timeFormat =
    style === 'minimal'
      ? { hour: '2-digit' as const, minute: '2-digit' as const }
      : ({
          hour: '2-digit' as const,
          minute: '2-digit' as const,
          ...(style === 'serif' ? { second: '2-digit' as const } : {}),
        } as Intl.DateTimeFormatOptions)

  return (
    <div className="widget-fill">
      <div className={`clock-display ${style}`}>
        {now.toLocaleTimeString([], timeFormat)}
      </div>
      <div className="clock-sub">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      <p style={{ color: 'var(--muted)', marginTop: 12 }}>Stay soft, stay on time.</p>
      <div className="widget-footer">
        {(['digital', 'serif', 'minimal'] as const).map((option) => (
          <button
            key={option}
            className={`button ghost ${style === option ? 'active' : ''}`}
            onClick={() => updateWidgetData(widget.id, { ...data, style: option })}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
