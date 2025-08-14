import { Avatar, AvatarFallback } from '../ui/avatar'
import { EditPencil } from 'iconoir-react'


export default function BaseAvatarLogo({ fallback }: { fallback: string }) {
  return (
    <>
      <div className="relative">
        <EditPencil className="z-10 absolute bottom-2 end-2 size-5 bg-surface border-surface border-4 rounded-full" />
        <Avatar className="size-28 bg-tertiary text-tertiary-foreground text-4xl">
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>
      </div>
    </>
  )
}

