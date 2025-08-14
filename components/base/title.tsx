import { cn } from "@/lib/utils"

interface PropsInterface {
  children: React.ReactNode
  className?: string
}

export default function BaseTitle({ children, className }: PropsInterface) {
  return <div className={cn("text-2xl font-bold", className)}>{children}</div>
}
