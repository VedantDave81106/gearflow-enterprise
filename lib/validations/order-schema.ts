import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  productName: z.string().min(1, "Product Name is required"),
  quantity: z
    .number()
    .int()
    .min(1, "Quantity must be at least 1")
    .max(10, "Maximum 10 units per item"),
  unitPrice: z.number().positive("Price must be positive"),
});

export const orderSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),

  address: z
    .string({ required_error: "Shipping address is required" })
    .min(5, "Address must be at least 5 characters"),

  city: z
    .string({ required_error: "City is required" })
    .min(2, "City must be at least 2 characters"),

  postalCode: z
    .string({ required_error: "Postal code is required" })
    .min(3, "Please enter a valid postal code"),

  paymentMethod: z.enum(["card", "cod", "upi"], {
    errorMap: () => ({ message: "Please select a payment method" }),
  }),

  discountCode: z
    .string()
    .optional()
    .refine(
      (code) => !code || code.toUpperCase() === "STUDENT10",
      {
        message: "Invalid discount code. Try 'STUDENT10' for 10% off!",
      }
    ),

  items: z
    .array(orderItemSchema)
    .min(1, "Your cart must contain at least one product"),
});

export type OrderFormData = z.infer<typeof orderSchema>;
