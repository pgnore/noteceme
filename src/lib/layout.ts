import type { Layout, Layouts } from 'react-grid-layout'
import type { Widget, WidgetLayout } from '../types'

export const breakpoints = { lg: 1280, md: 1024, sm: 768, xs: 480, xxs: 0 }
export const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }

const toLayout = (id: string, layout: WidgetLayout, key: keyof WidgetLayout): Layout => ({
  i: id,
  x: layout[key].x,
  y: layout[key].y,
  w: layout[key].w,
  h: layout[key].h,
  minW: layout[key].minW,
  minH: layout[key].minH,
  static: layout[key].static,
})

export const buildLayouts = (widgets: Widget[]): Layouts => ({
  lg: widgets.map((widget) => toLayout(widget.id, widget.layout, 'lg')),
  md: widgets.map((widget) => toLayout(widget.id, widget.layout, 'md')),
  sm: widgets.map((widget) => toLayout(widget.id, widget.layout, 'sm')),
  xs: widgets.map((widget) => toLayout(widget.id, widget.layout, 'xs')),
  xxs: widgets.map((widget) => toLayout(widget.id, widget.layout, 'xxs')),
})

const fromLayout = (item: Layout): WidgetLayout['lg'] => ({
  x: item.x,
  y: item.y,
  w: item.w,
  h: item.h,
  ...(item.minW !== undefined ? { minW: item.minW } : {}),
  ...(item.minH !== undefined ? { minH: item.minH } : {}),
  ...(item.static !== undefined ? { static: item.static } : {}),
})

export function applyLayoutsToWidgets(widgets: Widget[], layouts: Layouts): Widget[] {
  return widgets.map((widget) => {
    const nextLayout: WidgetLayout = { ...widget.layout }
    ;(['lg', 'md', 'sm', 'xs', 'xxs'] as const).forEach((key) => {
      const layoutItem = layouts[key]?.find((item) => item.i === widget.id)
      if (layoutItem) {
        nextLayout[key] = { ...nextLayout[key], ...fromLayout(layoutItem) }
      }
    })
    return { ...widget, layout: nextLayout }
  })
}
