import { useEffect, useState } from 'react'

export default function WidgetFrame({
  title,
  showTitle,
  children,
  onTitleChange,
  onShowTitleChange,
  onRemove,
  settingsOpen,
  onToggleSettings,
  settings,
}: {
  title: string
  showTitle: boolean
  children: React.ReactNode
  onTitleChange: (value: string) => void
  onShowTitleChange: (value: boolean) => void
  onRemove: () => void
  settingsOpen: boolean
  onToggleSettings: () => void
  settings?: React.ReactNode
}) {
  const [localTitle, setLocalTitle] = useState(title)

  useEffect(() => {
    setLocalTitle(title)
  }, [title])

  return (
    <div className="widget">
      <div className="widget-header">
        {showTitle ? (
          <div className="widget-title">{title}</div>
        ) : (
          <div className="widget-title muted">Hidden title</div>
        )}
        <div className="widget-actions">
          <button className="icon-button" onClick={onToggleSettings} aria-label="Widget settings">
            {settingsOpen ? 'CLOSE' : 'EDIT'}
          </button>
        </div>
      </div>
      {settingsOpen && (
        <div className="widget-settings">
          <div className="settings-row">
            <label>Widget name</label>
            <input
              value={localTitle}
              onChange={(event) => {
                setLocalTitle(event.target.value)
                onTitleChange(event.target.value)
              }}
            />
          </div>
          <div className="settings-row inline">
            <label>Show name</label>
            <input
              type="checkbox"
              checked={showTitle}
              onChange={(event) => onShowTitleChange(event.target.checked)}
              aria-hidden
            />
          </div>
          {settings}
          <button className="button danger" onClick={onRemove}>
            Remove widget
          </button>
        </div>
      )}
      <div className="widget-body">{children}</div>
    </div>
  )
}
