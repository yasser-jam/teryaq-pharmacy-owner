import { Card, CardContent } from '@/components/ui/card'

interface PropsInterface   {
  title: string
  id?: string
  children: React.ReactNode
  contentClassName?: string
}

export default function Section({
  title,
  id,
  children , 
  contentClassName
}:PropsInterface ) {
  return (
    <Card id={id} className='relative overflow-visible mt-6 '>
      <div className="absolute -top-3 bg-surface px-3 start-6 text-lg font-bold">
        {title}
      </div>
      <CardContent className="p-6">
        <div className={contentClassName ? contentClassName: 'grid md:grid-cols-2 grid-cols-1 gap-4'}>{children}</div>
      </CardContent>
    </Card>
  )
}

 

//
