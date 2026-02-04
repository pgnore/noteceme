import { addDays, format, startOfWeek } from 'date-fns'
import { useState } from 'react'
import type { HabitsData, Widget } from '../../types'
import { useBoardStore } from '../../store/boardStore'
import { nanoid } from 'nanoid'

const weekStartsOn = 1

export default function HabitsWidget({ widget }: { widget: Widget }) {
  const { updateWidgetData } = useBoardStore()
  const data = widget.data as HabitsData
  const [newHabit, setNewHabit] = useState('')

  const weekStartDate = data.weekStart
    ? new Date(data.weekStart)
    : startOfWeek(new Date(), { weekStartsOn })
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStartDate, index))

  const toggleCheck = (habitId: string, dayIndex: number) => {
    const habits = data.habits.map((habit) => {
      if (habit.id !== habitId) return habit
      const checks = [...habit.checks]
      checks[dayIndex] = !checks[dayIndex]
      return { ...habit, checks }
    })
    updateWidgetData(widget.id, { ...data, habits })
  }

  const addHabit = () => {
    if (!newHabit.trim()) return
    const habits = [
      ...data.habits,
      { id: nanoid(), name: newHabit.trim(), checks: Array.from({ length: 7 }, () => false) },
    ]
    updateWidgetData(widget.id, { ...data, habits })
    setNewHabit('')
  }

  const updateHabitName = (habitId: string, value: string) => {
    const habits = data.habits.map((habit) =>
      habit.id === habitId ? { ...habit, name: value } : habit
    )
    updateWidgetData(widget.id, { ...data, habits })
  }

  const removeHabit = (habitId: string) => {
    const habits = data.habits.filter((habit) => habit.id !== habitId)
    updateWidgetData(widget.id, { ...data, habits })
  }

  const resetWeek = () => {
    const freshWeek = startOfWeek(new Date(), { weekStartsOn })
    const habits = data.habits.map((habit) => ({
      ...habit,
      checks: Array.from({ length: 7 }, () => false),
    }))
    updateWidgetData(widget.id, { ...data, weekStart: freshWeek.toISOString(), habits })
  }

  const totalChecks = data.habits.reduce(
    (sum, habit) => sum + habit.checks.filter(Boolean).length,
    0
  )
  const possible = data.habits.length * 7
  const overall = possible ? Math.round((totalChecks / possible) * 100) : 0

  return (
    <div className="widget-fill">
      <div className="widget-scroll">
        <table className="habit-table">
          <thead>
            <tr>
              <th>Habit</th>
              {days.map((day) => (
                <th key={day.toISOString()}>{format(day, 'EEE')}</th>
              ))}
              <th>Efficiency</th>
            </tr>
          </thead>
          <tbody>
            {data.habits.map((habit) => {
              const total = habit.checks.filter(Boolean).length
              const efficiency = Math.round((total / 7) * 100)
              return (
                <tr key={habit.id}>
                  <td>
                    <div className="habit-pill">
                      <input
                        className="habit-input"
                        value={habit.name}
                        onChange={(event) => updateHabitName(habit.id, event.target.value)}
                      />
                      <button className="icon-button" onClick={() => removeHabit(habit.id)}>
                        x
                      </button>
                    </div>
                  </td>
                  {habit.checks.map((checked, index) => (
                    <td key={index}>
                      <span
                        className={`checkbox ${checked ? 'checked' : ''}`}
                        onClick={() => toggleCheck(habit.id, index)}
                      >
                        {checked ? 'x' : ''}
                      </span>
                    </td>
                  ))}
                  <td>{efficiency}%</td>
                </tr>
              )}
            )}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 8, color: 'var(--muted)', fontSize: 'var(--font-size-small)' }}>
        Weekly efficiency: {overall}% complete
      </p>
      <div className="widget-footer">
        <input
          value={newHabit}
          onChange={(event) => setNewHabit(event.target.value)}
          placeholder="Add a habit"
          className="mood-input"
        />
        <button className="button soft" onClick={addHabit}>
          Add
        </button>
        <button className="button ghost" onClick={resetWeek}>
          New week
        </button>
      </div>
    </div>
  )
}
