export const locales = ["es", "en", "fr", "de", "it", "pt", "ja"] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  es: "Español",
  en: "English",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ja: "日本語",
}

export const defaultLocale: Locale = "es"
