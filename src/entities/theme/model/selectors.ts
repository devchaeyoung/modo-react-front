import { ThemeState } from './types'

// 순수 선택자 함수들
export const selectTheme = (state: ThemeState) => state.theme
export const selectIsDark = (state: ThemeState) => state.isDark
export const selectSetTheme = (state: ThemeState) => state.setTheme
export const selectToggleTheme = (state: ThemeState) => state.toggleTheme

