import { Pagination } from '@/types'

import { cn } from '@/lib/utils'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table'
import { Separator } from '@/components/ui/separator'

import BasePagination from '@/components/base/pagination'

interface PropsInterface {
  columns: ColumnDef<any>[]
  data: any[]
  pagination?: Pagination
  className?: string
  hidePagination?: boolean
  onPaginationChange?: (pagination: Pagination) => void
}

export default function BaseTable({
  columns,
  data,
  className,
  pagination,
  hidePagination,
  onPaginationChange
}: PropsInterface) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: row => row.children,
    manualPagination: true
  })

  return (
    <>
      <Table className={className}>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow className="!bg-transparent" key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id} className='text-gray-400 font-medium text-xs'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
              <TableRow
                className={cn(!!row.depth && 'bg-background/25')}
                key={row.id}
              >
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {!hidePagination && (
        <>
          <Separator />

          <BasePagination
            pagination={pagination}
            onPaginationChange={onPaginationChange}
          />
        </>
      )}
    </>
  )
}
