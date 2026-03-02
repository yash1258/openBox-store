import { z } from 'zod';

// Product validation
export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  category: z.string().min(1, 'Category is required'),
  condition: z.enum(['openbox', 'like_new', 'used']),
  sellingPrice: z.number().positive('Price must be positive'),
  originalPrice: z.number().positive().optional(),
  images: z.array(z.string().url()).max(10, 'Maximum 10 images allowed'),
  status: z.enum(['available', 'sold', 'reserved']).default('available'),
});

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Signup validation
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  shopName: z.string().min(2, 'Shop name must be at least 2 characters').max(100),
  whatsapp: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, 'Invalid WhatsApp number. Include country code (e.g., +919999999999)'),
  address: z.string().min(10, 'Address must be at least 10 characters').max(500).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Search params validation
export const searchParamsSchema = z.object({
  category: z.string().max(50).optional(),
  condition: z.enum(['all', 'openbox', 'like_new', 'used']).optional(),
  q: z.string().max(100).optional(),
  status: z.enum(['all', 'available', 'sold', 'reserved']).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});

// Cart item validation
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1').max(99, 'Maximum 99 items'),
});

// Order validation
export const orderSchema = z.object({
  customerName: z.string().min(1, 'Name is required').max(100),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required').max(500),
  items: z.array(cartItemSchema).min(1, 'At least one item required'),
  paymentMethod: z.enum(['cod', 'upi', 'card']),
});

export type ProductInput = z.infer<typeof productSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SearchParamsInput = z.infer<typeof searchParamsSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
