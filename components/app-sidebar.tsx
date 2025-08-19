'use client';

import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Cable,
  ChevronDown,
  ChevronRight,
  Home,
  LogOut,
  Package,
  Pill,
  ShoppingCart,
  User,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface MenuItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: {
    title: string;
    url: string;
  }[];
}

interface SidebarProps {
  logoTitle?: string;
  onLogout?: () => void;
}

export function AppSidebar({ logoTitle = 'Teryaq', onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title]
    );
  };

  const isExpanded = (title: string) => expandedItems.includes(title);

  const isActive = (url: string) => pathname === url;

  const isParentActive = (item: MenuItem) => {
    if (isActive(item.url)) return true;
    return item.children?.some((child) => isActive(child.url)) || false;
  };

  const menuItems = [
    {
      title: 'Home',
      url: '/',
      icon: Home,
    },
    {
      title: 'Medicines',
      url: '/medicines',
      icon: Pill,
    },
    {
      title: 'Employees',
      url: '/employees',
      icon: User,
    },
    {
      title: 'Suppliers',
      url: '/suppliers',
      icon: Cable,
    },
    {
      title: 'Purchase Orders',
      url: '/purchase-orders',
      icon: ShoppingCart,
    },
    {
      title: 'Stock',
      url: '/stock',
      icon: Package,
    },
    {
      title: 'Customers',
      url: '/customers',
      icon: Users,
      children: [
        {
          title: 'List',
          url: '/customers/list',
        },
        {
          title: 'Debts',
          url: '/customers/debts',
        },
      ],
    },
  ];

  return (
    <div className='flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border'>
      {/* Logo and Title */}
      <div className='flex items-center gap-3 px-6 py-4 border-b border-sidebar-border'>
        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary'>
          <div className='h-4 w-4 rounded-sm bg-sidebar-primary-foreground' />
        </div>
        <h1 className='text-lg font-semibold text-sidebar-foreground'>
          {logoTitle}
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className='flex-1 overflow-y-auto px-4 py-4'>
        <ul className='space-y-2'>
          {menuItems.map((item) => (
            <li key={item.title}>
              {item.children ? (
                // Parent item with children
                <div>
                  <button
                    onClick={() => toggleExpanded(item.title)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ',
                      isParentActive(item)
                        ? 'text-primary'
                        : 'text-sidebar-foreground'
                    )}
                  >
                    <div className='flex items-center gap-3'>
                      {item.icon && <item.icon className='h-4 w-4' />}
                      <span>{item.title}</span>
                    </div>
                    {isExpanded(item.title) ? (
                      <ChevronDown className='h-4 w-4' />
                    ) : (
                      <ChevronRight className='h-4 w-4' />
                    )}
                  </button>

                  {/* Children items */}
                  {isExpanded(item.title) && (
                    <ul className='ml-6 mt-2 space-y-1'>
                      {item.children.map((child) => (
                        <li key={child.title}>
                          <Link
                            href={child.url}
                            className={cn(
                              'block rounded-lg px-3 py-2 text-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                              isActive(child.url)
                                ? 'bg-primary text-sidebar-primary-foreground'
                                : 'text-sidebar-foreground'
                            )}
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Single item without children
                <Link
                  href={item.url}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive(item.url)
                      ? 'bg-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground'
                  )}
                >
                  {item.icon && <item.icon className='h-4 w-4' />}
                  <span>{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Menu */}
      <div className='border-t border-sidebar-border p-4'>
        <Button
          variant='ghost'
          className='w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          onClick={onLogout}
        >
          <LogOut className='h-4 w-4' />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
