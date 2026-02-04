const apiKey = import.meta.env.VITE_GIPHY_KEY

export type GifResult = {
  id: string
  title: string
  url: string
  preview: string
}

export async function searchGifs(query: string): Promise<GifResult[]> {
  if (!apiKey) {
    throw new Error('Missing VITE_GIPHY_KEY')
  }

  const endpoint = new URL('https://api.giphy.com/v1/gifs/search')
  endpoint.searchParams.set('api_key', apiKey)
  endpoint.searchParams.set('q', query)
  endpoint.searchParams.set('limit', '24')
  endpoint.searchParams.set('rating', 'g')
  endpoint.searchParams.set('lang', 'en')

  const response = await fetch(endpoint.toString())
  if (!response.ok) {
    throw new Error('Failed to load GIFs')
  }
  const payload = await response.json()
  return (payload.data ?? []).map((item: any) => ({
    id: item.id,
    title: item.title,
    url: item.images?.original?.url,
    preview: item.images?.fixed_width_small?.url,
  }))
}
