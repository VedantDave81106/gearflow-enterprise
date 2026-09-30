"use server";

import { revalidatePath } from "next/cache";
import { orderSchema, OrderFormData } from "@/lib/validations/order-schema";
import { OrderMutationResponse } from "@/lib/types";
import { INITIAL_PRODUCTS } from "@/lib/data/products";

/**
 * Next.js Server Action for Checkout Order Mutation (CO2).
 * Runs strictly on the server to validate input with Zod,
 * re-verify prices, and prevent tampering.
 */
export async function submitOrderMutation(
  rawPayload: unknown
): Promise<OrderMutationResponse> {
  // Artificial delay so user can see the loading state
  await new Promise((resolve) => setTimeout(resolve, 600));

  // 1. Validate payload with Zod on the server
  const result = await orderSchema.safeParseAsync(rawPayload);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Please fix the errors in the form.",
      timestamp: new Date().toLocaleTimeString(),
      errors: errors as Record<string, string[]>,
    };
  }

  const data: OrderFormData = result.data;

  // 2. Security Check: Recalculate price on the server to prevent client tampering
  let subtotal = 0;
  for (const item of data.items) {
    const product = INITIAL_PRODUCTS.find((p) => p.id === item.productId);
    if (!product) {
      return {
        success: false,
        message: `Product ${item.productName} is currently unavailable.`,
        timestamp: new Date().toLocaleTimeString(),
      };
    }
    subtotal += product.price * item.quantity;
  }

  // 3. Apply discount if valid
  let discount = 0;
  if (data.discountCode && data.discountCode.toUpperCase() === "STUDENT10") {
    discount = subtotal * 0.1; // 10% student discount
  }

  const finalTotal = subtotal - discount;
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  // 4. Invalidate cache
  revalidatePath("/");

  return {
    success: true,
    orderId,
    totalAmount: Math.round(finalTotal * 100) / 100,
    message: `Thank you, ${data.fullName}! Your order ${orderId} has been placed successfully.`,
    timestamp: new Date().toLocaleTimeString(),
  };
}
