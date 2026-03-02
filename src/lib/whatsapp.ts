// WhatsApp Deep Link utilities

/**
 * Generates a WhatsApp deep link for direct messaging
 * @param phone - Phone number in international format (e.g., 919876543210)
 * @param message - Pre-filled message
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Generates a share link for sharing a product
 */
export function generateProductShareLink(
  baseUrl: string,
  productName: string,
  productPrice: number,
  productId: string
): string {
  const message = `Hey! Check out this product:\n\n${productName}\n₹${productPrice}\n\n${baseUrl}/product/${productId}`;
  return message;
}

/**
 * Generates inquiry message for a product
 */
export function generateInquiryMessage(
  productName: string,
  productPrice: number,
  shopName: string
): string {
  return `Hi! I'm interested in "${productName}" listed at ₹${productPrice} at ${shopName}. Is it still available?`;
}
