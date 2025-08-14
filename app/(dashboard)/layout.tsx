import { AppSidebar } from '@/components/app-sidebar';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Page({ children }: any) {
  return (
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 60)',
            '--header-height': 'calc(var(--spacing) * 14)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant='inset' />

        <SidebarInset>
          <SiteHeader />
          <div className='container p-4'>{children}</div>
        </SidebarInset>
      </SidebarProvider>
  );
}
