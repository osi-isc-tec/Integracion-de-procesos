"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { defaultLocale, type Locale } from "./i18n-config"
import { getTranslation } from "./translations"

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: ReturnType<typeof getTranslation>
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [t, setT] = useState(() => getTranslation(defaultLocale))

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale) {
      setLocaleState(savedLocale)
      setT(getTranslation(savedLocale))
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    setT(getTranslation(newLocale))
    localStorage.setItem("locale", newLocale)
  }

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider")
  }
  return context
}
