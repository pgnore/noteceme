import { useEffect, useState } from 'react'

export default function WidgetFrame({
  title,
  children,
  onTitleChange,
  onRemove,
}: {
  title: string
  children: React.ReactNode
  onTitleChange: (value: string) => void
  onRemove: () => void
}) {
  const [localTitle, setLocalTitle] = useState(title)

  useEffect(() => {
    setLocalTitle(title)
  }, [title])

  return (
    <div className="widget">
      <div className="widget-header">
        <input
          value={localTitle}
          onChange={(event) => {
            setLocalTitle(event.target.value)
            onTitleChange(event.target.value)
          }}
          className="widget-title"
          style={{ border: 'none', background: 'transparent' }}
        />
        <div className="widget-actions">
          <button className="widget-control danger" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
      <div className="widget-body">{children}</div>
    </div>
  )
}
