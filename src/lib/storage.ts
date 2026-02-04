import { mediaBucket, supabase, isDemoMode } from './supabase'

export async function uploadMedia(file: File, userId: string, boardId: string) {
  if (isDemoMode || !supabase) {
    return URL.createObjectURL(file)
  }

  const path = `${userId}/${boardId}/${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from(mediaBucket).upload(path, file, {
    upsert: true,
    contentType: file.type,
  })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage.from(mediaBucket).getPublicUrl(path)
  return data.publicUrl
}
