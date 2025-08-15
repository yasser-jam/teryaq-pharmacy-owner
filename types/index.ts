export interface Pagination {
  page: number
  limit: number
  totalCount: number
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
  type?: string
  manufacturer?: string
  form?: string
  translations?: MedicineTranslation[];
  productTypeName?: string
}

export interface MedicineTranslation {
  tradeName: string;
  scientificName: string;
  languageCode: string;
}

export interface Manufacturer {
  id: number
  name: string
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

export interface SaleItemRecord {
  id: number,
  stockItemId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: string;
  subTotal: number;
}

export interface SaleRecord {
  id: number;
  customerId: number;
  customerName: string;
  invoiceDate: string;
  totalAmount: number;
  paymentType: string;
  paymentMethod: string;
  currency: string;
  discount: number;
  discountType: string;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  items: SaleItemRecord[];
}

type DaysOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export interface WorkingHour {
  daysOfWeek: DaysOfWeek[];
  shifts: {
    startTime: {
      hour: string
      minute: string
      second: string
      nano: string
    },
    endTime: {
      hour: string
      minute: string
      second: string
      nano: string
    },
    description: string
  }[]
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  roleId: number;
  status: 'ACTIVE' | 'INACTIVE';
  phoneNumber: string;
  email: string;
  role?: string;
  dateOfHire?: string;
  workingHours: WorkingHour[];
}

export interface Supplier {
  id: number
  name: string
  phone: string
  preferredCurrency: string
  address: string
}

export interface Customer {
  id: number
  name: string
  phoneNumber?: string
  address?: string
  notes?: string
}