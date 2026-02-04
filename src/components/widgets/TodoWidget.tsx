import { nanoid } from 'nanoid'
import { useState } from 'react'
import type { TodosData, Widget } from '../../types'
import { useBoardStore } from '../../store/boardStore'

export default function TodoWidget({ widget }: { widget: Widget }) {
  const { updateWidgetData } = useBoardStore()
  const data = widget.data as TodosData
  const [text, setText] = useState('')

  const toggle = (id: string) => {
    const items = data.items.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    )
    updateWidgetData(widget.id, { ...data, items })
  }

  const updateText = (id: string, value: string) => {
    const items = data.items.map((item) =>
      item.id === id ? { ...item, text: value } : item
    )
    updateWidgetData(widget.id, { ...data, items })
  }

  const addItem = () => {
    if (!text.trim()) return
    const item = { id: nanoid(), text: text.trim(), done: false, order: data.items.length }
    updateWidgetData(widget.id, { ...data, items: [...data.items, item] })
    setText('')
  }

  return (
    <div>
      {data.items.map((item) => (
        <div key={item.id} className={`todo-item ${item.done ? 'done' : ''}`}>
          <span className={`checkbox ${item.done ? 'checked' : ''}`} onClick={() => toggle(item.id)}>
            {item.done ? 'x' : ''}
          </span>
          <input
            type="text"
            value={item.text}
            onChange={(event) => updateText(item.id, event.target.value)}
          />
        </div>
      ))}
      <div className="todo-item">
        <input
          type="text"
          placeholder="Add a task"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') addItem()
          }}
        />
        <button className="widget-control" onClick={addItem}>
          Add
        </button>
      </div>
    </div>
  )
}
