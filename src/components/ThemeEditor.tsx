import { useMemo } from 'react'
import { useBoardStore } from '../store/boardStore'
import { bodyFontOptions, fontOptions } from '../lib/theme'
import type { Theme } from '../types'

const patternOptions: { value: Theme['backgroundPattern']; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'dots', label: 'Dots' },
  { value: 'gingham', label: 'Gingham' },
  { value: 'strawberry', label: 'Strawberry' },
]

export default function ThemeEditor() {
  const { board, updateTheme, setThemeEditorOpen } = useBoardStore()

  const theme = board?.theme
  const controls = useMemo(() => theme, [theme])

  if (!controls) return null

  const update = (partial: Partial<Theme>) => {
    updateTheme({ ...controls, ...partial })
  }

  return (
    <aside className="theme-panel">
      <h3>Theme editor</h3>
      <button className="button ghost" onClick={() => setThemeEditorOpen(false)}>
        Close
      </button>
      <div className="theme-row">
        <label>Heading font</label>
        <select
          value={controls.fontHeading}
          onChange={(event) => update({ fontHeading: event.target.value })}
        >
          {fontOptions.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>
      <div className="theme-row">
        <label>Body font</label>
        <select
          value={controls.fontBody}
          onChange={(event) => update({ fontBody: event.target.value })}
        >
          {bodyFontOptions.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>
      <div className="theme-row">
        <label>Heading size</label>
        <input
          type="range"
          min={22}
          max={40}
          value={controls.fontSizes.heading}
          onChange={(event) =>
            update({
              fontSizes: { ...controls.fontSizes, heading: Number(event.target.value) },
            })
          }
        />
      </div>
      <div className="theme-row">
        <label>Body size</label>
        <input
          type="range"
          min={14}
          max={20}
          value={controls.fontSizes.body}
          onChange={(event) =>
            update({
              fontSizes: { ...controls.fontSizes, body: Number(event.target.value) },
            })
          }
        />
      </div>
      <div className="theme-row">
        <label>Small text</label>
        <input
          type="range"
          min={11}
          max={16}
          value={controls.fontSizes.small}
          onChange={(event) =>
            update({
              fontSizes: { ...controls.fontSizes, small: Number(event.target.value) },
            })
          }
        />
      </div>
      <div className="theme-row">
        <label>Background</label>
        <input
          type="color"
          value={controls.colors.bg}
          onChange={(event) => update({ colors: { ...controls.colors, bg: event.target.value } })}
        />
      </div>
      <div className="theme-row">
        <label>Surface</label>
        <input
          type="color"
          value={controls.colors.surface}
          onChange={(event) =>
            update({ colors: { ...controls.colors, surface: event.target.value } })
          }
        />
      </div>
      <div className="theme-row">
        <label>Text</label>
        <input
          type="color"
          value={controls.colors.text}
          onChange={(event) => update({ colors: { ...controls.colors, text: event.target.value } })}
        />
      </div>
      <div className="theme-row">
        <label>Accent</label>
        <input
          type="color"
          value={controls.colors.accent}
          onChange={(event) =>
            update({ colors: { ...controls.colors, accent: event.target.value } })
          }
        />
      </div>
      <div className="theme-row">
        <label>Muted</label>
        <input
          type="color"
          value={controls.colors.muted}
          onChange={(event) =>
            update({ colors: { ...controls.colors, muted: event.target.value } })
          }
        />
      </div>
      <div className="theme-row">
        <label>Card border</label>
        <input
          type="color"
          value={controls.colors.cardBorder}
          onChange={(event) =>
            update({ colors: { ...controls.colors, cardBorder: event.target.value } })
          }
        />
      </div>
      <div className="theme-row">
        <label>Border radius</label>
        <input
          type="range"
          min={6}
          max={20}
          value={controls.borderRadius}
          onChange={(event) => update({ borderRadius: Number(event.target.value) })}
        />
      </div>
      <div className="theme-row">
        <label>Shadow</label>
        <input
          type="range"
          min={4}
          max={24}
          value={controls.shadow}
          onChange={(event) => update({ shadow: Number(event.target.value) })}
        />
      </div>
      <div className="theme-row">
        <label>Grid gap</label>
        <input
          type="range"
          min={8}
          max={28}
          value={controls.gridGap}
          onChange={(event) => update({ gridGap: Number(event.target.value) })}
        />
      </div>
      <div className="theme-row">
        <label>Pattern</label>
        <select
          value={controls.backgroundPattern}
          onChange={(event) =>
            update({ backgroundPattern: event.target.value as Theme['backgroundPattern'] })
          }
        >
          {patternOptions.map((pattern) => (
            <option key={pattern.value} value={pattern.value}>
              {pattern.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  )
}
