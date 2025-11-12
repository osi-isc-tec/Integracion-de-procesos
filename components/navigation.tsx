"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Map, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/locale-context"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()
  const { t } = useLocale()

  const links = [
    { href: "/", label: t.home, icon: Home },
    { href: "/map-search", label: t.mapSearch, icon: Map },
    { href: "/custom-search", label: t.customSearch, icon: Search },
    { href: "/preferences", label: t.preferences, icon: Settings },
  ]

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            {t.appTitle}
          </Link>
          <div className="flex gap-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Button
                  key={link.href}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={cn(!isActive && "text-muted-foreground")}
                >
                  <Link href={link.href}>
                    <Icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
