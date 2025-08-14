import { forwardRef, useRef, useState } from 'react'

import {
  Country,
  FlagProps,
  getCountryCallingCode,
  Props,
  Value
} from 'react-phone-number-input'

import RPNInput from 'react-phone-number-input'

import flags from 'react-phone-number-input/flags'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'

import { Input } from '@/components/ui/input'

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowSeparateVertical, Check } from 'iconoir-react'

type PhoneInputProps = Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value' | 'ref' | 'variant'
> &
  Omit<Props<typeof RPNInput>, 'onChange'> & {
    onChange?: (value: Value) => void
    variant?: React.ComponentProps<typeof Input>
  }

const BasePhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> = forwardRef<
  React.ElementRef<typeof RPNInput>,
  PhoneInputProps
>(({ className, onChange, value, ...props }, ref) => {
  return (
    <RPNInput
      ref={ref}
      className={cn('flex', className)}
      flagComponent={FlagComponent}
      countrySelectComponent={countrySelectProps =>
        CountrySelect({
          ...countrySelectProps,
          variant: props.variant || 'input'
        })
      }
      inputComponent={InputComponent}
      value={value || undefined}
      /**
       * Handles the onChange event.
       *
       * react-phone-number-input might trigger the onChange event as undefined
       * when a valid phone number is not entered. To prevent this,
       * the value is coerced to an empty string.
       *
       * @param {E164Number | undefined} value - The entered value
       */
      onChange={value => onChange?.(value || ('' as Value))}
      {...props}
    />
  )
})
BasePhoneInput.displayName = 'BasePhoneInput'

const InputComponent = forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => (
  <Input
    className={cn('[&_input]:rounded-s-none', className)}
    placeholder="Phone Input"
    {...(props as any)}
    ref={ref}
  />
))
InputComponent.displayName = 'InputComponent'

type CountryEntry = { label: string; value: Country | undefined }

type CountrySelectProps = {
  disabled?: boolean
  value: Country
  variant?: React.ComponentProps<typeof Button>['variant']
  options: CountryEntry[]
  onChange: (country: Country) => void
}

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  variant = 'default',
  options: countryList,
  onChange
}: CountrySelectProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal>
      <PopoverTrigger asChild>
        <Button
          className="flex h-11 gap-1 rounded-e-none rounded-s-lg border-input border-r-0 px-3 focus:z-10"
          type="button"
          variant={variant}
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ArrowSeparateVertical
            className={cn(
              '-mr-2 size-4 opacity-50',
              disabled ? 'hidden' : 'opacity-100'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            value={searchValue}
            onValueChange={value => {
              setSearchValue(value)
              setTimeout(() => {
                if (scrollAreaRef.current) {
                  const viewportElement = scrollAreaRef.current.querySelector(
                    '[data-radix-scroll-area-viewport]'
                  )
                  if (viewportElement) {
                    viewportElement.scrollTop = 0
                  }
                }
              }, 0)
            }}
            placeholder="Search country..."
          />
          <CommandList>
            <ScrollArea ref={scrollAreaRef} className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                    />
                  ) : null
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface CountrySelectOptionProps extends FlagProps {
  selectedCountry: Country
  onChange: (country: Country) => void
  onSelectComplete: () => void
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country)
    onSelectComplete()
  }

  return (
    <CommandItem className="gap-2" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-sm text-foreground/50">{`+${getCountryCallingCode(
        country
      )}`}</span>
      <Check
        className={`ml-auto size-4 ${
          country === selectedCountry ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </CommandItem>
  )
}

const FlagComponent = ({ country, countryName }: FlagProps) => {
  const Flag = flags[country]

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  )
}

export { BasePhoneInput }
