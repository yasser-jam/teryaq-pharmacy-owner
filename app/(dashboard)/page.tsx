'use client'
import BaseCardButton from '@/components/base/base-card-button'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Dashboard() {

  const router = useRouter()
  return (
    <div className="flex-1 space-y-6 p-6">
      <Button variant={'default'} onClick={() => router.push('/pos')}>Make a Sale</Button>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          {/* <h1 className="text-3xl font-bold tracking-tight">Pharmacy Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back!
          </p> */}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* <BaseCardButton title='Add Medicine'  variant={'primary'} />
        <BaseCardButton title='Add Employee'  variant={'secondary'} />
        <BaseCardButton title='Make a Sale'  variant={'destructive'} /> */}
      </div>

    </div>
  )
}
