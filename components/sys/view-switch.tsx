"use client"

import { Grid3X3, Table, List } from "lucide-react"
import { Button } from "@/components/ui/button"

export type ViewMode = "cards" | "table" | "inline-cards"

interface ViewModeSwitchProps {
  mode: ViewMode
  onModeChange: (mode: ViewMode) => void
}

const viewModes = [
  {
    value: "cards" as const,
    icon: Grid3X3,
  },
  {
    value: "table" as const,
    icon: Table,
  },
  {
    value: "inline-cards" as const,
    icon: List,
  },
]

export function SysViewSwitch({ mode, onModeChange }: ViewModeSwitchProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg border">
      {viewModes.map((viewMode) => {
        const Icon = viewMode.icon
        const isActive = mode === viewMode.value

        return (
          <Button
            key={viewMode.value}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onModeChange(viewMode.value)}
            className={`flex items-center justify-center w-8 h-8 transition-all ${
              isActive ? "bg-blue-500 text-white shadow-sm hover:bg-blue-600" : "hover:bg-background/50"
            }`}
          >
            <Icon className="h-3 w-3" />
          </Button>
        )
      })}
    </div>
  )
}
