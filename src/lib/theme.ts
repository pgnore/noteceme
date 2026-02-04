import type { Theme } from '../types'

const patterns: Record<Theme['backgroundPattern'], string> = {
  none: 'none',
  dots:
    'radial-gradient(circle at 1px 1px, rgba(240, 106, 160, 0.2) 1px, transparent 0) 0 0 / 18px 18px',
  gingham:
    'linear-gradient(90deg, rgba(255, 255, 255, 0.45) 50%, transparent 50%) 0 0 / 24px 24px, linear-gradient(rgba(255, 255, 255, 0.35) 50%, transparent 50%) 0 0 / 24px 24px',
  strawberry:
    'radial-gradient(circle at 10px 12px, rgba(240, 106, 160, 0.18) 2px, transparent 0) 0 0 / 28px 28px, radial-gradient(circle at 22px 20px, rgba(250, 184, 207, 0.25) 2px, transparent 0) 0 0 / 28px 28px',
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.style.setProperty('--bg', theme.colors.bg)
  root.style.setProperty('--surface', theme.colors.surface)
  root.style.setProperty('--text', theme.colors.text)
  root.style.setProperty('--accent', theme.colors.accent)
  root.style.setProperty('--muted', theme.colors.muted)
  root.style.setProperty('--card-border', theme.colors.cardBorder)
  root.style.setProperty('--radius', `${theme.borderRadius}px`)
  root.style.setProperty('--shadow', `${theme.shadow}px`)
  root.style.setProperty('--grid-gap', `${theme.gridGap}px`)
  root.style.setProperty('--font-heading', theme.fontHeading)
  root.style.setProperty('--font-body', theme.fontBody)
  root.style.setProperty('--font-size-heading', `${theme.fontSizes.heading}px`)
  root.style.setProperty('--font-size-body', `${theme.fontSizes.body}px`)
  root.style.setProperty('--font-size-small', `${theme.fontSizes.small}px`)
  root.style.setProperty('--pattern', patterns[theme.backgroundPattern])
}

export const fontOptions = ['"Instrument Serif", serif', '"DM Serif Display", serif']

export const bodyFontOptions = ['"Manrope", sans-serif', '"Nunito", sans-serif']
