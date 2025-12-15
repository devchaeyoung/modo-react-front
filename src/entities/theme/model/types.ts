export type Theme = 'light' | 'dark' | 'system'

export interface ThemeState {
  theme: Theme
  isDark: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

