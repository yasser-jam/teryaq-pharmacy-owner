"use client"
import { useState } from 'react'
import { useTranslations } from 'next-intl'

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
    <Button variant="ghost" size="icon">
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
  onEdit?: () => void
  onDelete?: () => any
  onView?: () => void
}) {

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const t = useTranslations('ActionMenu')

  const handleDelete = async () => {
    if (!onDelete) return
    setLoading(true)
    onDelete()?.then(() => {
      setLoading(false)
      setDeleteOpen(false)
    })?.finally(() => {
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
              <Eye /> {t('view')}
            </DropdownMenuItem>
          )}
          {editAction && (
            <DropdownMenuItem onClick={() => (onEdit ? onEdit() : null)}>
              <EditPencil /> {t('edit')}
            </DropdownMenuItem>
          )}
          {deleteAction && (
            <DropdownMenuItem onClick={() => setDeleteOpen(true)}>
              <Trash /> {t('delete')}
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
        action={t('delete')}
        title={t('deleteConfirmTitle')}
        subtitle={t('deleteConfirmDescription', { item })}
        onAction={handleDelete}
        loading={loading}
      ></AlertDialog>
    </div>
  )
}
