import { Pagination, SaleInvoice } from '@/types';

export const initSaleInvoice = (): SaleInvoice => ({
  paymentType: 'CASH',
  paymentMethod: 'CASH',
  currency: 'SYP',
  sellingPrice: 0,
  sellingPriceUSD: 0,
  paidAmount: 0,
  items: [],
});

export const initPagination = (): Pagination => ({
  page: 0,
  size: 10,
  totalElements: 10,
});
