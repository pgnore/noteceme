import { useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import type { NotesData, Widget } from '../../types'
import { useBoardStore } from '../../store/boardStore'
import { uploadMedia } from '../../lib/storage'
import GifSearchModal from '../modals/GifSearchModal'

export default function NotesWidget({ widget }: { widget: Widget }) {
  const { updateWidgetData, session } = useBoardStore()
  const data = widget.data as NotesData
  const [gifOpen, setGifOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: 'Write something sweet...' }),
    ],
    content: data.content,
    onUpdate: ({ editor }) => {
      updateWidgetData(widget.id, { ...data, content: editor.getJSON() })
    },
  })

  const userId = session?.user?.id ?? 'demo-user'

  const insertImage = (url: string) => {
    editor?.chain().focus().setImage({ src: url }).run()
  }

  const handleUpload = async (file: File) => {
    const url = await uploadMedia(file, userId, widget.board_id)
    insertImage(url)
  }

  if (!editor) return null

  return (
    <div>
      <div className="notes-toolbar">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>Italic</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()}>Underline</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
        <button onClick={() => editor.chain().focus().toggleTaskList().run()}>Checklist</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Paste a link')
            if (url) {
              editor.chain().focus().setLink({ href: url }).run()
            }
          }}
        >
          Link
        </button>
        <button onClick={() => fileRef.current?.click()}>Image</button>
        <button onClick={() => setGifOpen(true)}>GIF</button>
      </div>
      <EditorContent editor={editor} className="tiptap" />
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
        onSelect={(url) => insertImage(url)}
      />
    </div>
  )
}
