export type FontSizes = {
  heading: number
  body: number
  small: number
}

export type ThemeColors = {
  bg: string
  surface: string
  text: string
  accent: string
  muted: string
  cardBorder: string
}

export type Theme = {
  fontHeading: string
  fontBody: string
  fontSizes: FontSizes
  colors: ThemeColors
  borderRadius: number
  shadow: number
  gridGap: number
  backgroundPattern: 'none' | 'dots' | 'gingham' | 'strawberry'
}

export type WidgetType =
  | 'clock'
  | 'habits'
  | 'todos'
  | 'notes'
  | 'image'
  | 'calendar'
  | 'mood'

export type LayoutItem = {
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  static?: boolean
}

export type WidgetLayout = {
  lg: LayoutItem
  md: LayoutItem
  sm: LayoutItem
  xs: LayoutItem
  xxs: LayoutItem
}

export type TodoItem = {
  id: string
  text: string
  done: boolean
  order: number
}

export type Habit = {
  id: string
  name: string
  checks: boolean[]
}

export type WidgetCommon = {
  showTitle?: boolean
}

export type NotesData = WidgetCommon & {
  title?: string
  content: Record<string, unknown>
  showToolbar?: boolean
}

export type TodosData = WidgetCommon & {
  items: TodoItem[]
  showCompleted?: boolean
}

export type HabitsData = WidgetCommon & {
  weekStart: string
  habits: Habit[]
  compact?: boolean
}

export type ImageData = WidgetCommon & {
  url: string
  caption?: string
  isGif?: boolean
  showCaption?: boolean
}

export type MoodData = WidgetCommon & {
  text: string
  emoji?: string
  singleLine?: boolean
}

export type CalendarData = WidgetCommon & {
  month: number
  year: number
  showWeekdays?: boolean
}

export type ClockData = WidgetCommon & {
  timezone?: string
  style?: 'digital' | 'serif' | 'minimal' | 'analog'
  dateDisplay?: 'none' | 'day' | 'dayMonth'
  note?: string
  layoutOrder?: Array<'time' | 'date' | 'note'>
}

export type WidgetData =
  | NotesData
  | TodosData
  | HabitsData
  | ImageData
  | MoodData
  | CalendarData
  | ClockData

export type Widget = {
  id: string
  board_id: string
  type: WidgetType
  title: string
  layout: WidgetLayout
  data: WidgetData
  created_at?: string
  updated_at?: string
}

export type Board = {
  id: string
  user_id: string
  title: string
  hero_image_url: string | null
  theme: Theme
  created_at?: string
  updated_at?: string
}
