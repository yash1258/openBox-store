import { ReactNode } from 'react'
import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

// Custom render with providers (if needed in the future)
function render(ui: ReactNode, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, { ...options })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { render }

// Test data factories
export const createMockProduct = (overrides = {}) => ({
  id: 'cmm' + Math.random().toString(36).substring(7),
  name: 'Test Product',
  description: 'A test product description',
  category: 'Electronics',
  condition: 'openbox',
  originalPrice: 100000,
  sellingPrice: 75000,
  images: JSON.stringify(['https://example.com/image.jpg']),
  status: 'available',
  sellerId: 'seller123',
  stockQuantity: 5,
  amazonRating: 4.5,
  amazonReviewCount: 100,
  amazonUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createMockSeller = (overrides = {}) => ({
  id: 'seller' + Math.random().toString(36).substring(7),
  email: 'test@example.com',
  password: 'hashedpassword',
  name: 'Test Seller',
  shopName: 'Test Shop',
  whatsapp: '+919999999999',
  address: 'Test Address',
  apiKeys: JSON.stringify([]),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

export const createMockOrder = (overrides = {}) => ({
  id: 'order' + Math.random().toString(36).substring(7),
  customerName: 'Test Customer',
  customerEmail: 'customer@example.com',
  customerPhone: '9876543210',
  address: 'Test Address',
  totalAmount: 75000,
  status: 'PENDING',
  paymentStatus: 'PENDING',
  paymentMethod: 'cod',
  sellerId: 'seller123',
  items: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
})

// API test helpers
export const createMockRequest = (body = {}, headers: Record<string, string> = {}) => ({
  json: vi.fn().mockResolvedValue(body),
  headers: {
    get: vi.fn((key: string) => headers[key] || null),
    has: vi.fn((key: string) => key in headers),
  },
  url: 'http://localhost:3000/api/test',
})

export const createMockSearchParams = (params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams(params)
  return {
    get: (key: string) => searchParams.get(key),
    getAll: (key: string) => searchParams.getAll(key),
    has: (key: string) => searchParams.has(key),
    forEach: (callback: (value: string, key: string) => void) => searchParams.forEach(callback),
    entries: () => searchParams.entries(),
    keys: () => searchParams.keys(),
    values: () => searchParams.values(),
    toString: () => searchParams.toString(),
  }
}
