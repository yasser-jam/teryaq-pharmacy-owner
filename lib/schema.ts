import z from 'zod';

const requiredString = () => {
  return z.string().trim().nonempty();
};

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .refine(
    (password) => {
      const hasNumber = /[0-9]/.test(password);
      const hasUppercase = /[A-Z]/.test(password);
      const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
      
      return hasNumber && hasUppercase && hasSpecialChar;
    },
    {
      message: "Password must contain at least one number, one uppercase letter, and one special character",
    }
  );


export const EMPLOYEE_SCHEMA = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  dateOfHire: z.string().min(1, 'Date of hire is required'),
  roleId: requiredString(),
  pharmacyId: z.number().optional(),
  workingHours: z.array(
    z.object({
      daysOfWeek: z.array(
        z.enum([
          'MONDAY',
          'TUESDAY',
          'WEDNESDAY',
          'THURSDAY',
          'FRIDAY',
          'SATURDAY',
          'SUNDAY',
        ])
      ),
      shifts: z.array(
        z.object({
          startTime: z
            .string()
            .regex(
              /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
              'Invalid time format (HH:MM)'
            ),
          endTime: z
            .string()
            .regex(
              /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
              'Invalid time format (HH:MM)'
            ),
          description: z.string().optional(),
        })
      ),
    })
  ).optional(),
});

export type Employee = z.infer<typeof EMPLOYEE_SCHEMA>;

// Role and Permission Types
export interface Permission {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  active: boolean;
  systemGenerated: boolean;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  active: boolean;
  system: boolean;
  systemGenerated: boolean;
}

// Schema for role creation/update
export const ROLE_SCHEMA = z.object({
  name: z.string().min(1, 'Role name is required'),
  description: z.string().min(1, 'Role description is required'),
  permissions: z
    .array(z.number())
    .min(1, 'At least one permission is required'),
  active: z.boolean().default(true),
});

export type RoleFormData = z.infer<typeof ROLE_SCHEMA>;

// Login Schema
export const LOGIN_SCHEMA = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof LOGIN_SCHEMA>;

export const MEDICINE_SCHEMA = z.object({
  tradeName: requiredString(),
  tradeNameAr: requiredString(),
  scientificName: requiredString(),
  scientificNameAr: requiredString(),
  concentration: z.string().optional(),
  size: requiredString(),
  notes: z.string().optional(),
  tax: z.number().optional(),
  barcodes: z.array(z.string()).min(1, 'You should at least add one barcode'),
  typeId: z.string().optional(),
  formId: z.string().optional(),
  manufacturerId: z.string().min(1, 'Manufacturer is required'),
  categoryIds: z.array(z.number()).optional(),
  requiresPrescription: z.boolean().transform((value) => !!value),

});

export const REGISTER_SCHEMA = z.object({
  newPassword: passwordSchema,
  location: requiredString(),
  pharmacyEmail: requiredString().email(),
  pharmacyPhone: requiredString(),
  managerFirstName: requiredString(),
  managerLastName: requiredString(),
  startTime: requiredString(),
  endTime: requiredString()
});

export const SUPPLIER_SCHEMA = z.object({
  name: requiredString(),
  phone: requiredString(),
  // preferredCurrency: z.string().optional(),
  address: requiredString(),
});

export const CUSTOMER_SCHEMA = z.object({
  name: requiredString(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})