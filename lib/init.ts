import { SaleInvoice } from "@/types";

export const initSaleInvoice = () : SaleInvoice => ({
  paymentType: "CASH",
  paymentMethod: "CASH",
  currency: "SYP",
  discountType: "PERCENTAGE",
  discount: 0,
  paidAmount: 0,
  totalAmount: 0,
  items: [],
});
