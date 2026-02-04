import type { MoodData, Widget } from '../../types'
import { useBoardStore } from '../../store/boardStore'

export default function MoodWidget({ widget }: { widget: Widget }) {
  const { updateWidgetData } = useBoardStore()
  const data = widget.data as MoodData

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        className="mood-input"
        value={data.emoji ?? ''}
        placeholder="Emoji or icon"
        onChange={(event) => updateWidgetData(widget.id, { ...data, emoji: event.target.value })}
      />
      <textarea
        className="mood-input"
        rows={4}
        value={data.text}
        placeholder="How does your day feel?"
        onChange={(event) => updateWidgetData(widget.id, { ...data, text: event.target.value })}
      />
    </div>
  )
}
