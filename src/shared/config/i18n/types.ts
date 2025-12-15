export type Locale = 'ko' | 'en'

export const LOCALES: Record<Locale, { name: string; flag: string }> = {
  ko: { name: '한국어', flag: '🇰🇷' },
  en: { name: 'English', flag: '🇺🇸' },
}

export const DEFAULT_LOCALE: Locale = 'ko'

