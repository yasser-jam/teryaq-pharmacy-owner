"use client"
import { useState } from 'react'

import { EditPencil, Eye, InfoCircle, MoreVert, Trash } from 'iconoir-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'

import AlertDialog from '@/components/base/alert-dialog'

export default function ActionMenu({
  children,
  toggler = (
    <Button variant="ghost" size="action">
      <MoreVert />
    </Button>
  ),
  item = 'Item',
  editAction,
  deleteAction,
  viewAction,
  onDelete,
  onEdit,
  onView
}: {
  children?: React.ReactNode
  toggler?: React.ReactNode
  item?: string
  editAction?: boolean
  deleteAction?: boolean
  viewAction?: boolean
  onEdit?: () => any
  onDelete?: () => any
  onView?: () => any
}) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!onDelete) return

    setLoading(true)

    await onDelete()?.finally(() => {
      setLoading(false)

      setDeleteOpen(false)
    })
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{toggler}</DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {viewAction && (
            <DropdownMenuItem onClick={() => (onView ? onView() : null)}>
              <Eye /> View
            </DropdownMenuItem>
          )}
          {editAction && (
            <DropdownMenuItem onClick={() => (onEdit ? onEdit() : null)}>
              <EditPencil /> Edit
            </DropdownMenuItem>
          )}
          {deleteAction && (
            <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
              <Trash /> Delete
            </DropdownMenuItem>
          )}
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={deleteOpen}
        onOpenChange={open => setDeleteOpen(open)}
        Icon={InfoCircle}
        variant="destructive"
        action="Delete"
        title="Are you absolutely sure?"
        subtitle={`Are you sure you want to delete this ${item}, this cannot be undone`}
        onAction={handleDelete}
        loading={loading}
      ></AlertDialog>
    </div>
  )
}
