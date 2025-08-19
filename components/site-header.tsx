import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Search, User } from "lucide-react"
import { Input } from "./ui/input"
import { LayoutUserMenu } from "./layout/user-menu"

export function SiteHeader() {
  return (
    <header className="bg-white flex h-20 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex justify-between w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <h1 className="text-2xl font-medium text-primary">Home</h1>

        <Input placeholder="Search at project" prefix={<Search />} className="w-128" />

        <LayoutUserMenu />
      </div>
    </header>
  )
}
