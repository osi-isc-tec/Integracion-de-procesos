"use client"

import { MessageCircle } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

export function WhatsAppButton() {
  const { t } = useLocale()
  const phoneNumber = "5219514487213" // +52 951 448 72 13
  const message = encodeURIComponent(t.whatsapp.defaultMessage)
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
      aria-label={t.whatsapp.sendSuggestion}
      title={t.whatsapp.sendSuggestion}
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
