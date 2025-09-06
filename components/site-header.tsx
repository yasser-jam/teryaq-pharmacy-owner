'use client'
import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { LayoutUserMenu } from "./layout/user-menu"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import BaseSkeleton from "./base/base-skeleton"
import { Skeleton } from "./ui/skeleton"

export function SiteHeader({ loading }: { loading?: boolean }) {

  const queryClient = useQueryClient()

  const user = queryClient.getQueryData(["me"]) as any

  const t = useTranslations("")

  return (
    <header className="bg-white sticky top-0 z-10 flex h-20 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex justify-between w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {
          loading ?
            <Skeleton className="h-12 w-64" /> :

            <h1 className="text-2xl font-medium text-primary">{user?.pharmacyName}</h1>
        }

        {/* <Input placeholder={t("Placeholder.searchProject")} prefix={<Search />} className="w-128" /> */}

        {
          loading ?
            <Skeleton className="h-11 w-11 rounded-full" /> :
            <LayoutUserMenu />

        }
      </div>
    </header>
  )
}
