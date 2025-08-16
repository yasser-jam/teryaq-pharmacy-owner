'use client'
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { api } from '@/lib/api';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

export default function Page({ children }: any) {

  const { data } = useQuery({
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

        <SidebarInset>
          <SiteHeader />
          <div className='container p-4'>{children}</div>
        </SidebarInset>
      </SidebarProvider>
  );
}
