'use client'

import * as React from "react"
import { Monitor, Moon, Leaf, Terminal, BookHeart } from "lucide-react"
import { useTheme } from "next-themes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const themes = [
  {
    value: "light",
    label: "Light",
    icon: Monitor
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon
  },
  {
    value: "forest",
    label: "Forest",
    icon: Leaf
  },
  {
    value: "geek",
    label: "Geek",
    icon: Terminal
  },
  {
    value: "girly",
    label: "Girly",
    icon: BookHeart 
  }
] as const

export function ThemeSelect() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-[130px]">
        <SelectValue placeholder="Select theme">
          {theme && (
            <div className="flex items-center gap-2">
              {React.createElement(
                themes.find(t => t.value === theme)?.icon || Monitor,
                { className: "h-4 w-4" }
              )}
              <span className="capitalize">{theme}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {themes.map(({ value, label, icon: Icon }) => (
          <SelectItem key={value} value={value}>
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}