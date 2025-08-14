import { Switch } from "@/components/ui/switch"

interface BaseSwitchProps {
  title: string
  subtitle: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function BaseSwitch({ title, subtitle, checked, onCheckedChange }: BaseSwitchProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border-amber-500 text-amber-800 border border-dashed bg-amber-50">
      <div className="space-y-1">
        <h3 className="font-medium leading-none">{title}</h3>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
