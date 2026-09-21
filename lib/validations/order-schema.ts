import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productName: z.string().min(1, "Product Name is required"),
  quantity: z
    .number({ invalid_type_error: "Quantity must be a number" })
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1")
    .max(50, "Bulk allocation maximum is 50 units per order"),
  unitPrice: z.number().positive("Price must be greater than zero"),
});

export const orderSchema = z.object({
  organizationName: z
    .string({ required_error: "Organization name is required" })
    .min(3, "Organization name must be at least 3 characters")
    .max(80, "Organization name cannot exceed 80 characters"),

  contactEmail: z
    .string({ required_error: "Contact email is required" })
    .email("Please provide a valid enterprise email address")
    .refine(
      (email) => !email.endsWith("@test.com") && !email.endsWith("@fake.com"),
      {
        message: "Disposable or test email domains are not permitted for hardware allocation",
      }
    ),

  contactPhone: z
    .string({ required_error: "Contact phone number is required" })
    .regex(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      "Enter a valid international or US phone number (e.g. +1 555-019-2834)"
    ),

  street: z
    .string({ required_error: "Street address is required" })
    .min(5, "Delivery address must be at least 5 characters"),

  city: z
    .string({ required_error: "City is required" })
    .min(2, "City must be at least 2 characters"),

  state: z
    .string({ required_error: "State / Province is required" })
    .min(2, "State must be at least 2 characters"),

  postalCode: z
    .string({ required_error: "Postal code is required" })
    .regex(/^[a-zA-Z0-9\s-]{3,10}$/, "Enter a valid postal/ZIP code"),

  country: z
    .string({ required_error: "Country is required" })
    .min(2, "Country name is required"),

  priority: z.enum(["standard", "expedited", "critical-mission"], {
    errorMap: () => ({ message: "Select a valid delivery SLA priority tier" }),
  }),

  paymentMethod: z.enum(["corporate-po", "wire-transfer", "credit-card"], {
    errorMap: () => ({ message: "Select a valid enterprise payment method" }),
  }),

  discountCode: z
    .string()
    .optional()
    .refine(
      (code) => !code || ["ENTERPRISE20", "NEXT15"].includes(code.toUpperCase()),
      {
        message: "Invalid promo code. Permitted codes: 'NEXT15' or 'ENTERPRISE20'",
      }
    ),

  notes: z
    .string()
    .max(300, "Notes cannot exceed 300 characters")
    .optional(),

  items: z
    .array(orderItemSchema)
    .min(1, "Your cart must contain at least one hardware item before submitting"),
});

export type OrderFormData = z.infer<typeof orderSchema>;
