import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import Cookies from 'js-cookie';
import { Medicine } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCookie = (name: string) => {
  return Cookies.get(name);
};

export const setCookie = (name: string, value: string) => {
  Cookies.set(name, value, {
    secure: process.env.NODE_ENV == 'production',
    sameSite: 'lax',
  });
};

export const isMasterProduct = (med: Medicine) => {
  return med.productTypeName == "MASTER" || med.productTypeName == "مركزي";
}
