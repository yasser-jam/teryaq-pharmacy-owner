'use client'
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function Page({ children }: { children: React.ReactNode }) {

  useQuery({
    queryKey: ['me'],
    queryFn: () => api('/users/me')
  })

  return (
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 60)',
            '--header-height': 'calc(var(--spacing) * 14)',
          } as React.CSSProperties
        }
      >
        <AppSidebar />

        <SidebarInset className='flex flex-col gap-4 min-h-screen'>
          <SiteHeader />
          <div className='px-4'>

          <div className='container px-4 py-2 bg-white rounded-sm' style={{minHeight: 'calc(100vh - 100px)'}}>{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
  );
}
