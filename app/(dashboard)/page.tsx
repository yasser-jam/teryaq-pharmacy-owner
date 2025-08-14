import BaseCardButton from '@/components/base/base-card-button'

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pharmacy Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <BaseCardButton title='Add Medicine'  variant={'primary'} />
        <BaseCardButton title='Add Employee'  variant={'secondary'} />
        <BaseCardButton title='Make a Sale'  variant={'destructive'} />
      </div>

    </div>
  )
}
