import { useEffect, useState } from 'react'
import type { Widget } from '../../types'

export default function ClockWidget({ widget }: { widget: Widget }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div className="widget-fill">
      <div className="clock-display">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <div className="clock-sub">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      <p style={{ color: 'var(--muted)', marginTop: 12 }}>Stay soft, stay on time.</p>
    </div>
  )
}
