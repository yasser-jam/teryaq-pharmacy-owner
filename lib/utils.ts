import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Cookies from 'js-cookie';
import { Medicine, ProductType, StockItem } from '@/types';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCookie = (name: string) => {
  return Cookies.get(name);
};

export const setCookie = (name: string, value: string) => {
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const isProduction = process.env.NODE_ENV === 'production';
  
  Cookies.set(name, value, {
    secure: isProduction && isHttps,
    sameSite: 'lax',
    path: '/',
    expires: 7, // 7 days
    // Don't set domain in production to avoid subdomain issues
    domain: isProduction ? undefined : undefined,
  });
};

export const isMasterProduct = (med: Medicine) => {
  return med.productTypeName?.toLowerCase() == "master" || med.productTypeName == "مركزي";
}

// Debug utility for cookie issues
export const debugCookies = () => {
  if (typeof window !== 'undefined') {
    console.log('Cookie Debug Info:');
    console.log('- Protocol:', window.location.protocol);
    console.log('- Host:', window.location.host);
    console.log('- Domain:', window.location.hostname);
    console.log('- Access Token:', Cookies.get('tp.access-token'));
    console.log('- All Cookies:', document.cookie);
  }
};

export const getProductType = (type: ProductType) => {
  console.log('type  is ', type);
  
  return type == "MASTER" || type == "مركزي" ? "MASTER" : "PHARMACY";
}

// this function to merge all products with same id from different batch to make them in one product with sum of all qtn and oldest expiry date
export const mergeStockItems = (items: StockItem[]) => {
  const merged: any = {};

  items.forEach(item => {
    if (!merged[item.productId]) {
      // If product not yet added, copy it
      merged[item.productId] = { ...item };
    } else {
      const existing = merged[item.productId];
      
      // Sum quantities
      existing.quantity += item.quantity;
      
      // Keep the earliest expiry date
      existing.expiryDate = (new Date(item.expiryDate) < new Date(existing.expiryDate))
        ? item.expiryDate
        : existing.expiryDate;
    }
  });

  return Object.values(merged)

}

export const getRoleName = (role: string) => {
  
  const t = useTranslations('Roles');

  switch (role) {
    case "PHARMACY_MANAGER":
      return t('PHARMACY_MANAGER');
    case "PHARMACY_EMPLOYEE":
      return t('PHARMACY_EMPLOYEE');
    case "PHARMACY_TRAINEE":
      return t('PHARMACY_TRAINEE');
    default:
      return t('Unknown');
  }
}


export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const getTime = (time: number[]) => {
    return {
      default: `${time[0]}-${time[1]}-${time[2]} ${time[3]}:${time[4]}`,
      date: `${time[0]}-${time[1]}-${time[2]}`,
      time: `${time[3]}:${time[4]}`
    }
}

export function getNextMonthFromNow(): string {
  return dayjs().add(1, "month").format("YYYY-MM-DD")
}

export function getCurrentMonthRange(): { start: string; end: string } {
  const start = dayjs().startOf("month").format("YYYY-MM-DD")
  const end = dayjs().endOf("month").format("YYYY-MM-DD")
  return { start, end }
}