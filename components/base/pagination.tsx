'use client'

import { MoreHorizontal } from 'lucide-react'

import { type Pagination as PaginationType } from '@/types'

import { cn } from '@/lib/utils'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface PropsInterface {
  pagination?: PaginationType
  onPaginationChange?: (pagination: PaginationType) => void
  limitOptions?: number[]
  className?: string
}

export default function BasePagination({
  pagination = {
    size: 10,
    page: 0,
    totalElements: 10
  },
  onPaginationChange,
  limitOptions = [10, 20, 50, 100],
  className = ''
}: PropsInterface) {
  const { page, size, totalElements } = pagination

  const totalPages = Math.ceil(totalElements / size)
  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPaginationChange?.({ ...pagination, page: newPage })
    }
  }

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= 4) {
      // Show all pages if 4 or fewer
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page (0-indexed)
      pages.push(0)

      if (page <= 2) {
        // Show pages 0, 1, 2, ..., last
        pages.push(1, 2)
        if (totalPages > 3) {
          pages.push('ellipsis')
        }
        pages.push(totalPages - 1)
      } else if (page >= totalPages - 3) {
        // Show 0, ..., last-2, last-1, last
        pages.push('ellipsis')
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1)
      } else {
        // Show 0, ..., current, ..., last
        pages.push('ellipsis')
        pages.push(page)
        pages.push('ellipsis')
        pages.push(totalPages - 1)
      }
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  // Hide pagination if only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={cn(className, 'flex justify-between items-center px-4 py-2')}
    >
      <div className="text-xs flex items-center gap-2">
        {/* <spf className="text-text-secondary">show</span> */}
        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="size-8 font-bold">
              {limit}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-20">
            {limitOptions.map(option => (
              <DropdownMenuItem
                key={option}
                onSelect={() => handleLimitChange(option.toString())}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}
        {/* <span className="text-nowrap text-text-secondary">
          {' '}
          records from <span className="text-foreground">
            {totalElements}
 sizespan>{' '}
          records
        </span> */}
      </div>
      <div className="flex gap-4 items-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(page - 1)}
                className={
                  page === 0
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>

            {visiblePages.map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === 'ellipsis' ? (
                  <div className="flex h-9 w-9 items-center justify-center">
                    <MoreHorizontal className="h-4 w-4" />
                  </div>
                ) : (
                  <PaginationLink
                    onClick={() => handlePageChange(pageNum)}
                    isActive={pageNum === page}
                    className="cursor-pointer"
                  >
                    {pageNum + 1}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(page + 1)}
                className={
                  page === totalPages - 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
