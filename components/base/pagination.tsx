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
    limit: 10,
    page: 1,
    totalCount: 0
  },
  onPaginationChange,
  limitOptions = [10, 20, 50, 100],
  className = ''
}: PropsInterface) {
  const { page, limit, totalCount } = pagination

  const totalPages = Math.ceil(totalCount / limit)
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPaginationChange?.({ ...pagination, page: newPage })
    }
  }

  const handleLimitChange = (newLimit: string) => {
    const limitNum = Number.parseInt(newLimit)

    // reset to page 0

    onPaginationChange?.({
      ...pagination,
      limit: limitNum,
      page: 1
    })
  }

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = []

    if (totalPages <= 4) {
      // Show all pages if 4 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (page <= 3) {
        // Show pages 1, 2, 3, ..., last
        pages.push(2, 3)
        if (totalPages > 4) {
          pages.push('ellipsis')
        }
        pages.push(totalPages)
      } else if (page >= totalPages - 2) {
        // Show 1, ..., last-2, last-1, last
        pages.push('ellipsis')
        pages.push(totalPages - 2, totalPages - 1, totalPages)
      } else {
        // Show 1, ..., current, ..., last
        pages.push('ellipsis')
        pages.push(page)
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div
      className={cn(className, 'flex justify-between items-center px-4 py-2')}
    >
      <div className="text-xs flex items-center gap-2">
        <span className="text-text-secondary">show</span>
        <DropdownMenu>
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
        </DropdownMenu>
        <span className="text-nowrap text-text-secondary">
          {' '}
          records from <span className="text-foreground">
            {totalCount}
          </span>{' '}
          records
        </span>
      </div>

      <div className="flex gap-4 items-center">
        <Pagination>
          <PaginationContent>
            {totalPages > 1 && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={
                    page === 1
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            )}

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
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            {totalPages > 1 && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={
                    page === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
