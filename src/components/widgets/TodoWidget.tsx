import { nanoid } from 'nanoid'
import { useState } from 'react'
import type { TodosData, Widget } from '../../types'
import { useBoardStore } from '../../store/boardStore'

export default function TodoWidget({ widget }: { widget: Widget }) {
  const { updateWidgetData } = useBoardStore()
  const data = widget.data as TodosData & { showCompleted?: boolean }
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

  const removeItem = (id: string) => {
    const items = data.items.filter((item) => item.id !== id)
    updateWidgetData(widget.id, { ...data, items })
  }

  const addItem = () => {
    if (!text.trim()) return
    const item = { id: nanoid(), text: text.trim(), done: false, order: data.items.length }
    updateWidgetData(widget.id, { ...data, items: [...data.items, item] })
    setText('')
  }

  const visibleItems = data.showCompleted === false
    ? data.items.filter((item) => !item.done)
    : data.items

  return (
    <div className="widget-fill">
      <div className="widget-scroll">
        {visibleItems.map((item) => (
          <div key={item.id} className={`todo-item ${item.done ? 'done' : ''}`}>
            <span className={`checkbox ${item.done ? 'checked' : ''}`} onClick={() => toggle(item.id)}>
              {item.done ? 'x' : ''}
            </span>
            <input
              type="text"
              value={item.text}
              onChange={(event) => updateText(item.id, event.target.value)}
            />
            <button className="icon-button" onClick={() => removeItem(item.id)}>
              x
            </button>
          </div>
        ))}
      </div>
      <div className="widget-footer">
        <input
          type="text"
          placeholder="Add a task"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') addItem()
          }}
        />
        <button className="button soft" onClick={addItem}>
          Add
        </button>
      </div>
    </div>
  )
}
