import { cn } from "@/lib/utils"

export default function Placeholder({
  src = '/images/placeholder.svg',
  title,
  subtitle,
  item = 'Item',
  className,
  ...props
}: {
  src?: string
  title?: string
  subtitle?: string
  item?: string
  className?: string
}) {
  const titleToShow = title || `No ${item} found`
  const subtitleToShow = subtitle || 'There`s not data to show'

  return (
    <div
      {...props}
      className={cn('m-6 flex flex-col items-center justify-center gap-3 text-center', className)}
    >
      <img alt="" width={300} src={src} />
      <div>
        <div className="text-xl font-bold">{titleToShow}</div>
        <div className="text-text-secondary">{subtitleToShow}</div>
      </div>
    </div>
  )
}
