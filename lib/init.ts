import { SaleInvoice } from "@/types";

export const initSaleInvoice = () : SaleInvoice => ({
  paymentType: "CASH",
  paymentMethod: "CASH",
  currency: "SYP",
  paidAmount: 0,
  items: [],
});
