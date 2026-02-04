import { useEffect, useMemo, useState } from 'react'
import type { ClockData, Widget } from '../../types'
import { useBoardStore } from '../../store/boardStore'

const defaultOrder: Array<'time' | 'date' | 'note'> = ['time', 'date', 'note']

export default function ClockWidget({ widget }: { widget: Widget }) {
  const { updateWidgetData } = useBoardStore()
  const [now, setNow] = useState(new Date())
  const data = widget.data as ClockData

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const style = data.style ?? 'serif'
  const dateDisplay = data.dateDisplay ?? 'dayMonth'
  const order = data.layoutOrder ?? defaultOrder

  const timeFormat =
    style === 'minimal'
      ? { hour: '2-digit' as const, minute: '2-digit' as const }
      : ({
          hour: '2-digit' as const,
          minute: '2-digit' as const,
          ...(style === 'serif' ? { second: '2-digit' as const } : {}),
        } as Intl.DateTimeFormatOptions)

  const dateText = useMemo(() => {
    if (dateDisplay === 'none') return ''
    if (dateDisplay === 'day') {
      return now.toLocaleDateString([], { weekday: 'long' })
    }
    return now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
  }, [now, dateDisplay])

  const analogHands = useMemo(() => {
    const seconds = now.getSeconds()
    const minutes = now.getMinutes() + seconds / 60
    const hours = (now.getHours() % 12) + minutes / 60
    return {
      hour: (hours / 12) * 360,
      minute: (minutes / 60) * 360,
      second: (seconds / 60) * 360,
    }
  }, [now])

  const elements: Record<'time' | 'date' | 'note', React.ReactNode> = {
    time:
      style === 'analog' ? (
        <div className="analog-clock">
          <div className="clock-face" />
          <div className="hand hour" style={{ transform: `rotate(${analogHands.hour}deg)` }} />
          <div className="hand minute" style={{ transform: `rotate(${analogHands.minute}deg)` }} />
          <div className="hand second" style={{ transform: `rotate(${analogHands.second}deg)` }} />
          <div className="center-dot" />
        </div>
      ) : (
        <div className={`clock-display ${style}`}>{now.toLocaleTimeString([], timeFormat)}</div>
      ),
    date: dateText ? <div className="clock-sub">{dateText}</div> : null,
    note: data.note ? <p className="clock-note">{data.note}</p> : null,
  }

  return (
    <div className="widget-fill">
      {order.map((key) => (
        <div key={key}>{elements[key]}</div>
      ))}
      {!data.note && (
        <button
          className="button ghost"
          onClick={() => updateWidgetData(widget.id, { ...data, note: 'soft moments' })}
        >
          Add note
        </button>
      )}
    </div>
  )
}
