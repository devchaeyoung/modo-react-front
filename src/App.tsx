import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import { AuthProvider } from './contexts/AuthContext'
import { useEffect } from 'react'
import { useThemeStore } from 'entities/theme'

function App() {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const isDark = useThemeStore.getState().isDark
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <BrowserRouter basename={__BASE_PATH__}>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </I18nextProvider>
  )
}

export default App
