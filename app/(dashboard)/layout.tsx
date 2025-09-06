"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Page({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { isFetching } = useQuery({
    queryKey: ["me"],
    queryFn: () => api("/users/me").catch(() => router.replace("/auth/login")),
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 14)",
          position: "relative",
        } as React.CSSProperties
      }
    >
      <div className="relative">
        <AppSidebar />
      </div>

      <SidebarInset className="flex flex-col gap-4 min-h-screen">
        <SiteHeader loading={isFetching} />
        <div className="px-4">
          <div
            className="container px-4 py-2 bg-white rounded-sm"
            style={{ minHeight: "calc(100vh - 100px)" }}
          >
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
