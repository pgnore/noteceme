import { useRef, useState } from 'react'
import type { ImageData, Widget } from '../../types'
import { useBoardStore } from '../../store/boardStore'
import { uploadMedia } from '../../lib/storage'
import GifSearchModal from '../modals/GifSearchModal'

export default function ImageWidget({ widget }: { widget: Widget }) {
  const { updateWidgetData, session } = useBoardStore()
  const data = widget.data as ImageData
  const [gifOpen, setGifOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const userId = session?.user?.id ?? 'demo-user'

  const handleUpload = async (file: File) => {
    const url = await uploadMedia(file, userId, widget.board_id)
    updateWidgetData(widget.id, { ...data, url, isGif: file.type.includes('gif') })
  }

  const updateUrl = (url: string, isGif: boolean) => {
    updateWidgetData(widget.id, { ...data, url, isGif })
  }

  return (
    <div className="widget-fill">
      <div className="widget-scroll">
        {data.url ? (
          <div className="image-tile">
            <img src={data.url} alt={data.caption || 'Moodboard'} />
          </div>
        ) : (
          <div className="image-tile empty">
            <p>{data.caption || 'Drop a cozy image or GIF here.'}</p>
          </div>
        )}
      </div>
      <div className="widget-footer">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="button soft" onClick={() => fileRef.current?.click()}>
            Upload
          </button>
          <button className="button ghost" onClick={() => setGifOpen(true)}>
            GIF search
          </button>
          <button
            className="button ghost"
            onClick={() => {
              const url = window.prompt('Paste an image or GIF URL')
              if (url) updateUrl(url, url.endsWith('.gif'))
            }}
          >
            Paste URL
          </button>
        </div>
        <input
          className="mood-input"
          value={data.caption ?? ''}
          placeholder="Caption"
          onChange={(event) => updateWidgetData(widget.id, { ...data, caption: event.target.value })}
        />
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />
      <GifSearchModal
        open={gifOpen}
        onClose={() => setGifOpen(false)}
        onSelect={(url) => updateUrl(url, true)}
      />
    </div>
  )
}
