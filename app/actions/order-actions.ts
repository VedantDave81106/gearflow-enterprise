"use server";

import { revalidatePath } from "next/cache";
import { orderSchema, OrderFormData } from "@/lib/validations/order-schema";
import { OrderMutationResponse } from "@/lib/types";
import { INITIAL_PRODUCTS } from "@/lib/data/products";

/**
 * Server Action for Hardware Order & Provisioning Mutation.
 * Demonstrates CO2: Type-safe server mutation, backend sanitization,
 * security guard against client-side price tampering, and revalidation.
 */
export async function submitOrderMutation(
  rawPayload: unknown
): Promise<OrderMutationResponse> {
  // Simulate network / database execution latency for realistic suspense & pending state
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 1. Strict Server-Side Validation via shared Zod schema
  const parsed = await orderSchema.safeParseAsync(rawPayload);

  if (!parsed.success) {
    const flattenedErrors = parsed.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Validation failed. Please verify input fields according to schema.",
      timestamp: new Date().toISOString(),
      errors: flattenedErrors as Record<string, string[]>,
    };
  }

  const data: OrderFormData = parsed.data;

  // 2. Backend Security Check: Verify item prices against canonical server product records
  // Prevents malicious clients from modifying unitPrice in client state!
  let serverCalculatedSubtotal = 0;

  for (const item of data.items) {
    const canonicalProduct = INITIAL_PRODUCTS.find((p) => p.id === item.productId);
    if (!canonicalProduct) {
      return {
        success: false,
        message: `Product ID '${item.productId}' not found in canonical server inventory.`,
        timestamp: new Date().toISOString(),
      };
    }

    // Backend Inventory Check
    if (item.quantity > canonicalProduct.stock) {
      return {
        success: false,
        message: `Insufficient inventory for '${canonicalProduct.name}'. Requested ${item.quantity}, available: ${canonicalProduct.stock}.`,
        timestamp: new Date().toISOString(),
      };
    }

    serverCalculatedSubtotal += canonicalProduct.price * item.quantity;
  }

  // 3. Backend Discount Calculation
  let discountRate = 0;
  if (data.discountCode) {
    const code = data.discountCode.toUpperCase();
    if (code === "ENTERPRISE20") discountRate = 0.2;
    else if (code === "NEXT15") discountRate = 0.15;
  }

  const discountAmount = serverCalculatedSubtotal * discountRate;
  const taxAmount = (serverCalculatedSubtotal - discountAmount) * 0.08;
  const serverFinalTotal = serverCalculatedSubtotal - discountAmount + taxAmount;

  // 4. Generate unique cryptographic Order ID & Tracking Reference
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;
  const trackingNumber = `TRK-${data.priority.toUpperCase().substring(0, 3)}-${randomSuffix}`;

  // 5. Invalidate Next.js cache so any server-cached inventory views reflect updates
  revalidatePath("/");

  return {
    success: true,
    orderId,
    trackingNumber,
    totalAmount: Math.round(serverFinalTotal * 100) / 100,
    message: `Provisioning order ${orderId} successfully registered and queued for hardware dispatch!`,
    timestamp: new Date().toISOString(),
  };
}
