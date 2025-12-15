export const themeClasses = {
  bg: {
    primary: 'bg-white dark:bg-zinc-900',
    secondary: 'bg-gray-50 dark:bg-zinc-800',
    tertiary: 'bg-gray-100 dark:bg-zinc-700',
    hover: 'hover:bg-gray-100 dark:hover:bg-zinc-800',
    hoverSecondary: 'hover:bg-gray-200 dark:hover:bg-zinc-700',
  },
  text: {
    primary: 'text-black dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-400',
    tertiary: 'text-gray-500 dark:text-gray-500',
  },
  border: 'border-gray-300 dark:border-zinc-700',
  input:
    'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700 text-black dark:text-white',
  ring: 'ring-offset-white dark:ring-offset-zinc-900',
}

export const getThemeStyles = (isDark: boolean) => ({
  bg: {
    primary: isDark ? 'bg-zinc-900' : 'bg-white',
    secondary: isDark ? 'bg-zinc-800' : 'bg-gray-50',
    tertiary: isDark ? 'bg-zinc-700' : 'bg-gray-100',
    hover: isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100',
    hoverSecondary: isDark ? 'hover:bg-zinc-700' : 'hover:bg-gray-200',
  },
  text: {
    primary: isDark ? 'text-white' : 'text-black',
    secondary: isDark ? 'text-gray-400' : 'text-gray-600',
    tertiary: isDark ? 'text-gray-500' : 'text-gray-500',
  },
  border: isDark ? 'border-zinc-700' : 'border-gray-300',
  ring: isDark ? 'ring-offset-zinc-900' : 'ring-offset-white',
})
