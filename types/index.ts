export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
}

export interface Medicine {
  id: number;
  tradeName: string;
  scientificName: string;
  concentration?: string;
  size: string;
  notes?: string;
  tax?: number;
  barcodes: string[];
  requiresPrescription: boolean;
  typeId?: number;
  formId?: number;
  manufacturerId?: number;
  categories: string[];
  categoryIds?: number[];
  type?: "PHARMACY" | "MASTER";
  manufacturer?: string;
  form?: string;
  translations?: MedicineTranslation[];
  productTypeName: "MASTER" | "PHARMACY" | "مركزي" | "صيدلية";
  refSellingPrice?: number;
}

export interface MedicineTranslation {
  tradeName: string;
  scientificName: string;
  languageCode: string;
}

export interface Manufacturer {
  id: number;
  name: string;
}

export interface Type {
  id: number;
  name: string;
}

export interface Form {
  id: number;
  name: string;
}

export interface MedicineRecord {
  id: number;
  tradeName: string;
  scientificName: string;
  typeId: number;
  formId: number;
  manufacturerId: number;
  categoryIds: number[];
  translations: MedicineTranslation[];
}

export type Currency = "SYP" | "USD";

export interface SaleInvoice {
  id?: number;
  customerId?: number;
  customerName?: string;
  invoiceDate?: string;
  totalAmount: number;
  paymentType: "CASH" | "CREDIT";
  paymentMethod: string;
  currency: Currency;
  discount?: number;
  discountType?: string;
  paidAmount: number;
  remainingAmount?: number;
  status?: string;
  items: SaleInvoiceItem[];
}

type DaysOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
export interface WorkingHour {
  daysOfWeek: DaysOfWeek[];
  shifts: {
    startTime: {
      hour: string;
      minute: string;
      second: string;
      nano: string;
    };
    endTime: {
      hour: string;
      minute: string;
      second: string;
      nano: string;
    };
    description: string;
  }[];
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  roleId: number;
  status: "ACTIVE" | "INACTIVE";
  phoneNumber: string;
  email: string;
  role?: string;
  dateOfHire?: string;
  workingHours: WorkingHour[];
}

export interface Supplier {
  id: number;
  name: string;
  phone: string;
  preferredCurrency: string;
  address: string;
}

export interface Customer {
  id: number;
  name: string;
  phoneNumber?: string;
  address?: string;
  notes?: string;
}

export type ProductType = "MASTER" | "PHARMACY" | "مركزي" | "صيدلية";
export interface PurchaseItem {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  barcode: string;
  productType: ProductType;
}

export interface PurchaseOrder {
  id: number;
  supplierId: number;
  supplierName: string;
  currency: Currency;
  total: number;
  status: "PENDING" | "RECEIVED" | "CANCELLED" | "DONE";
  createdAt: [number, number, number, number, number, number, number];
  createdBy: number;
  items: PurchaseItem[];
}

export interface InvoiceItem {
  id?: number;
  productId: number;
  productName: string;
  receivedQty: number;
  bonusQty: number;
  invoicePrice: number;
  batchNo: string;
  expiryDate: string;
  productType: ProductType;
  sellingPrice: number;
  minStockLevel: number;
}

export interface PurchaseInvoice {
  id: number;
  purchaseOrderId: number;
  invoiceNumber: string;
  invoiceDate: string;
  total: number;
  status: "PENDING" | "RECEIVED" | "CANCELLED";
  createdAt: [number, number, number, number, number, number, number];
  createdBy: number;
  items: InvoiceItem[];
}

export interface StockItem {
  id: number;
  productId: number;
  productName: string;
  productType: ProductType;
  barcodes: string[];
  totalQuantity: number;
  totalBonusQuantity: number;
  averagePurchasePrice: number;
  totalValue: number;
  categories: string[];
  sellingPrice: number;
  minStockLevel: number;
  hasExpiredItems: boolean;
  hasExpiringSoonItems: boolean;
  earliestExpiryDate: string;
  latestExpiryDate: string;
  numberOfBatches: number;
  pharmacyId: number;
}

export interface StockItemDetails {
  totalQuantity: number;
  productId: number;
  stockItems: [
    {
      id: number;
      productId: number;
      productName: string;
      productType: ProductType;
      barcodes: string[];
      quantity: number;
      bonusQty: number;
      total: number;
      supplier: string;
      categories: string[];
      minStockLevel: number;
      expiryDate: string;
      batchNo: string;
      actualPurchasePrice: number;
      sellingPrice: number;
      dateAdded: string;
      addedBy: number;
      purchaseInvoiceId: number;
      isExpired: boolean;
      isExpiringSoon: boolean;
      daysUntilExpiry: number;
      pharmacyId: number;
      purchaseInvoiceNumber: string;
    }
  ];
  minStockLevel: number;
  productType: ProductType;
}

export interface SaleInvoiceItem {
  stockItemId: number;
  quantity: number;
  unitPrice: number;
}
