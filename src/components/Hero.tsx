import { useRef, useState } from 'react'
import { useBoardStore } from '../store/boardStore'
import { uploadMedia } from '../lib/storage'

export default function Hero({ userId }: { userId: string }) {
  const { board, updateBoard, editMode } = useBoardStore()
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  if (!board) return null

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const url = await uploadMedia(file, userId, board.id)
      updateBoard({ hero_image_url: url })
    } catch (error) {
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="hero">
      {board.hero_image_url && <img src={board.hero_image_url} alt="Hero" />}
      <div className="hero-content">
        {editMode ? (
          <input
            value={board.title}
            onChange={(event) => updateBoard({ title: event.target.value })}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'calc(var(--font-size-heading) + 6px)',
              border: 'none',
              background: 'transparent',
              color: 'var(--text)',
              fontWeight: 600,
            }}
          />
        ) : (
          <h1 className="hero-title">{board.title}</h1>
        )}
        <p className="hero-subtitle">
          A cozy dashboard for habits, plans, notes, and soft rituals.
        </p>
        {editMode && (
          <div className="hero-actions">
            <button className="button" onClick={() => fileRef.current?.click()}>
              {uploading ? 'Uploading...' : 'Change hero image'}
            </button>
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
          </div>
        )}
      </div>
    </section>
  )
}
