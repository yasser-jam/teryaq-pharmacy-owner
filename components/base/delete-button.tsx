'use client'

import { useState } from 'react'

import { InfoCircle, Trash } from 'iconoir-react'

import { Button } from '@/components/ui/button'

import AlertDialog from '@/components/base/alert-dialog'

export default function DeleteButton({
  toggler,
  item = 'Item',
  disabled = false,
  onDelete
}: {
  toggler?: React.ReactNode
  item?: string
  disabled?: boolean
  onDelete?: () => any
}) {
  const togglerToShow = toggler || (
    <Button
      disabled={disabled}
      variant="outline"
      className="text-secondary"
      size="icon"
    >
      <Trash />
    </Button>
  )

  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return

    setLoading(true)

    await onDelete()?.finally(() => {
      setLoading(false)

      setOpen(false)
    })
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={open => setOpen(open)}
      Icon={InfoCircle}
      variant="destructive"
      action="Delete"
      title="Are you absolutely sure?"
      subtitle={`Are you sure you want to delete this ${item}, this cannot be undone`}
      onAction={handleDelete}
      loading={loading}
    >
      {togglerToShow}
    </AlertDialog>
  )
}
