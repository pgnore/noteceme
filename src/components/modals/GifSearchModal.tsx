import { useState } from 'react'
import { searchGifs, type GifResult } from '../../lib/giphy'

export default function GifSearchModal({
  open,
  onClose,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
}) {
  const [query, setQuery] = useState('cozy')
  const [results, setResults] = useState<GifResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await searchGifs(query)
      setResults(data)
    } catch (err: any) {
      setError(err.message || 'Unable to load GIFs')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            className="mood-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search GIFs"
          />
          <button className="button" onClick={handleSearch} disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button className="button ghost" onClick={onClose}>
            Close
          </button>
        </div>
        {error && <p>{error}</p>}
        <div className="modal-grid">
          {results.map((gif) => (
            <img
              key={gif.id}
              src={gif.preview || gif.url}
              alt={gif.title}
              onClick={() => {
                onSelect(gif.url)
                onClose()
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
