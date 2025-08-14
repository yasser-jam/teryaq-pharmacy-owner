import { Check, Xmark } from 'iconoir-react'
import { Label } from '../ui/label'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'
import { Dot } from 'lucide-react'

export default function BaseStatusInput({
  value,
  onChange,
  onClear,
  label,
  ...props
}: {
  value?: boolean | null
  label: string
  onChange?: (value?: boolean | null) => boolean | undefined | null | void
  onClear?: () => void
}) {
  const handleOnValueChange = (value: string) => {
    const newValue = value == 'true' ? true : value == 'false' ? false : null
    onChange?.(newValue)

    if(newValue === null)
      onClear?.()
  }

  return (
    <div className="border border-input flex items-center justify-between ps-2 pe-0.5 bg-background h-8 rounded-sm">
      <Label>{label}</Label>

      <ToggleGroup
        {...props}
        type="single"
        value={value == true ? 'true' : value == false ? 'false' : 'null'}
        onValueChange={handleOnValueChange}
        className="p-0.5 bg-surface rounded-full"
      >
        <ToggleGroupItem
          className="data-[state=on]:bg-background hover:bg-background/70 size-5 rounded-full! cursor-pointer"
          size="sm"
          value="true"
        >
          <Check className="size-4 text-text-secondary" />
        </ToggleGroupItem>
        <ToggleGroupItem
          className="data-[state=on]:bg-background hover:bg-background/70 size-5 rounded-full! cursor-pointer"
          size="sm"
          value="null"
        >
          <Dot className="text-text-secondary" />
        </ToggleGroupItem>
        <ToggleGroupItem
          className="data-[state=on]:bg-background hover:bg-background/70 size-5 rounded-full! cursor-pointer"
          size="sm"
          value="false"
        >
          <Xmark className="size-4 text-text-secondary" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
