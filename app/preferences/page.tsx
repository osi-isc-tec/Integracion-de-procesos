"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import { locales, localeNames, type Locale } from "@/lib/i18n-config"

export default function PreferencesPage() {
  const { t, locale, setLocale } = useLocale()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8" />
              <h1 className="text-3xl font-bold">{t.preferencesTitle}</h1>
            </div>
            <p className="text-muted-foreground">{t.selectLanguage}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t.language}</CardTitle>
              <CardDescription>{t.selectLanguage}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">{t.language}</Label>
                <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locales.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {localeNames[loc]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
