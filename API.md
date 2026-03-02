# OpenBox Store API Documentation

> REST API for managing an OpenBox/used products e-commerce storefront. Enables AI agents to perform all seller operations including cart and order management.

---

## Table of Contents
1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [Seller Auth](#seller-auth)
4. [Products](#products)
5. [Cart](#cart)
6. [Orders](#orders)
7. [Categories](#categories)
8. [Settings](#settings)
9. [Success Stories](#success-stories)
10. [Analytics](#analytics)
11. [Error Codes](#error-codes)
12. [Rate Limiting](#rate-limiting)

---

## Quick Start

### Base URL
```
http://localhost:3000/api
```

### Authentication
All endpoints require authentication via:
- **API Key** (for AI agents): `X-API-Key` header
- **Session Cookie** (for web dashboard): HTTP-only cookie

### Test with cURL
```bash
# Check API is running
curl http://localhost:3000/api/capabilities

# List products
curl http://localhost:3000/api/products \
  -H "x-api-key: dev-api-key-12345"
```

---

## Authentication

### API Key Authentication (For AI Agents)

All API endpoints (except `/capabilities`) require API key authentication via the `X-API-Key` header.

**Development Key:**
```
x-api-key: dev-api-key-12345
```

**Production:**
Generate a key via:
```bash
curl -X POST http://localhost:3000/api/settings/api-key \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-12345" \
  -d '{"label": "My AI Agent"}'
```

Or create in admin dashboard at `/admin/settings`.

---

## Seller Auth

> **Note:** These endpoints are for the seller web dashboard. AI agents should use API keys.

### Check Setup Status
```
GET /api/auth/setup
```

**Response:**
```json
{
  "success": true,
  "data": {
    "needsSetup": true,
    "sellerCount": 0
  }
}
```

### Create Seller Account (Setup)
```
POST /api/auth/setup
```

Only works if no seller exists. Rate limited to **3 attempts per hour**.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Seller email |
| password | string | Yes | Password (min 6 chars) |
| name | string | Yes | Seller name |
| shopName | string | No | Store name |

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@example.com","password":"password123","name":"John","shopName":"My Store"}'
```

### Login
```
POST /api/auth/login
```

Rate limited to **5 attempts per minute** per IP.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Seller email |
| password | string | Yes | Password |

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seller@example.com","password":"password123"}'
```

**Response:** Sets HTTP-only cookie for session auth.

### Signup
```
POST /api/auth/signup
```

Register a new seller account. Rate limited to **3 attempts per hour** per IP.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| password | string | Yes | Min 8 chars, uppercase, lowercase, number, special char |
| confirmPassword | string | Yes | Must match password |
| name | string | Yes | Full name (min 2 chars) |
| shopName | string | Yes | Store name (min 2 chars) |
| whatsapp | string | Yes | WhatsApp with country code (e.g., +919999999999) |
| address | string | No | Business address (min 10 chars) |

**Password Requirements:**
- At least 8 characters
- One uppercase letter (A-Z)
- One lowercase letter (a-z)
- One number (0-9)
- One special character (@$!%*?&)

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "name": "John Doe",
    "shopName": "John's Electronics",
    "whatsapp": "+919999999999",
    "address": "123 Main Street, Mumbai, India"
  }'
```

**Response:** Sets HTTP-only cookie and returns seller info.

### Dev Login (Development Only)
```
POST /api/auth/dev-login
```

**⚠️ Development mode only - Returns 403 in production**

Bypass authentication for development/testing. Requires dev secret.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| devSecret | string | Yes | Must match `DEV_LOGIN_SECRET` env var (default: `dev-mode-123`) |

**Example:**
```bash
curl -X POST http://localhost:3000/api/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"devSecret": "dev-mode-123"}'
```

### Logout
```
POST /api/auth/logout
```

### Get Current Session
```
GET /api/auth/session
```

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Discovery

### Get API Capabilities
```
GET /api/capabilities
```

Returns all available endpoints. **No authentication required.**

**Response:**
```json
{
  "name": "OpenBox Store API",
  "version": "2.0.0",
  "endpoints": { ... },
  "features": ["cart", "orders", "bulk_import"]
}
```

---

## Products

### List Products
```
GET /api/products
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | string | all | `available`, `reserved`, `sold` |
| category | string | all | Category name |
| condition | string | all | `openbox`, `used`, `like_new` |
| q | string | - | Search query |
| limit | number | 50 | Max results (max 100) |
| offset | number | 0 | Pagination offset |

**Example:**
```bash
curl "http://localhost:3000/api/products?status=available&limit=10" \
  -H "x-api-key: dev-api-key-12345"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cmm...",
      "name": "iPhone 14 Pro Max 256GB",
      "description": "Deep Purple, 85% battery...",
      "category": "Mobiles",
      "condition": "like_new",
      "originalPrice": 139999,
      "sellingPrice": 89999,
      "images": ["https://..."],
      "status": "available",
      "stockQuantity": 1,
      "createdAt": "2026-02-27T17:44:36.764Z"
    }
  ],
  "meta": {
    "total": 20,
    "limit": 10,
    "offset": 0,
    "hasMore": false
  }
}
```

### Get Single Product
```
GET /api/products/:id
```

### Create Product
```
POST /api/products
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Product name (max 200 chars) |
| category | string | Yes | Category name |
| sellingPrice | number | Yes | Price in INR (positive) |
| description | string | No | Description (max 2000 chars) |
| condition | string | No | `openbox`, `used`, `like_new` |
| originalPrice | number | No | MRP |
| images | string[] | No | Image URLs (max 10) |
| status | string | No | `available`, `reserved`, `sold` |

**Example:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-12345" \
  -d '{
    "name": "iPhone 15 Pro",
    "category": "Mobiles",
    "condition": "like_new",
    "sellingPrice": 95000,
    "images": ["https://example.com/iphone15.jpg"]
  }'
```

### Create Multiple Products (Bulk)
```
POST /api/products/bulk
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| products | object[] | Yes | Array of products (max 100) |

**Example:**
```bash
curl -X POST http://localhost:3000/api/products/bulk \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-12345" \
  -d '{
    "products": [
      {"name": "Product 1", "category": "Electronics", "sellingPrice": 5000},
      {"name": "Product 2", "category": "Mobiles", "sellingPrice": 10000}
    ]
  }'
```

### Import Products from JSON
```
POST /api/products/import
```

Import products from external JSON source. Rate limited to **10 imports per minute**.

**Request Body:** Array of product objects (max 100)

**Example:**
```bash
curl -X POST http://localhost:3000/api/products/import \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-12345" \
  -d '[
    {"name": "iPhone 13", "category": "Mobiles", "sellingPrice": 60000},
    {"name": "MacBook Air", "category": "Laptops", "sellingPrice": 80000}
  ]'
```

### Update Product
```
PUT /api/products/:id
```

### Quick Status Update
```
PUT /api/products/:id/status
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| status | string | Yes | `available`, `reserved`, `sold` |

### Delete Product
```
DELETE /api/products/:id
```

---

## Cart

Customer shopping cart operations. Cart is session-based with 30-day persistence.

### Get Cart
```
GET /api/cart
```

Returns current cart with items and totals.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cart_session_id",
    "items": [
      {
        "id": "cart_item_id",
        "productId": "prod_id",
        "name": "iPhone 14 Pro",
        "sellingPrice": 89999,
        "quantity": 2,
        "images": ["https://..."]
      }
    ],
    "total": 179998,
    "itemCount": 2
  }
}
```

### Add to Cart
```
POST /api/cart
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| productId | string | Yes | Product ID |
| quantity | number | Yes | Quantity (1-99) |

**Example:**
```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId": "cmm...", "quantity": 1}'
```

### Update Cart Item Quantity
```
PUT /api/cart/:itemId
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| quantity | number | Yes | New quantity (0 to remove) |

**Example:**
```bash
curl -X PUT http://localhost:3000/api/cart/cart_item_id \
  -H "Content-Type: application/json" \
  -d '{"quantity": 3}'
```

### Remove from Cart
```
DELETE /api/cart/:itemId
```

---

## Orders

Order management for the storefront.

### List Orders
```
GET /api/orders
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | string | - | `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED` |
| paymentStatus | string | - | `PENDING`, `PAID`, `FAILED`, `REFUNDED` |
| page | number | 1 | Page number |
| limit | number | 20 | Results per page |

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_id",
        "customerName": "John Doe",
        "customerEmail": "john@example.com",
        "totalAmount": 179998,
        "status": "PENDING",
        "paymentStatus": "PENDING",
        "paymentMethod": "cod",
        "items": [...],
        "createdAt": "2026-03-01T10:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

### Create Order
```
POST /api/orders
```

Creates an order from cart items. Clears cart after successful creation.

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| customerName | string | Yes | Customer full name |
| customerEmail | string | Yes | Valid email address |
| customerPhone | string | Yes | Phone number (min 10 digits) |
| address | string | Yes | Delivery address (max 500 chars) |
| items | array | Yes | Array of `{productId, quantity}` |
| paymentMethod | string | Yes | `cod`, `upi`, or `card` |

**Example:**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "9876543210",
    "address": "123 Main St, Mumbai",
    "items": [
      {"productId": "cmm...", "quantity": 1},
      {"productId": "cmm...", "quantity": 2}
    ],
    "paymentMethod": "cod"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order_id",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "totalAmount": 179998,
    "items": [...]
  },
  "meta": {
    "message": "Order created successfully"
  }
}
```

---

## Categories

### List Categories
```
GET /api/categories
```

**Response:**
```json
{
  "success": true,
  "data": {
    "custom": [
      {
        "id": "cmm...",
        "name": "Electronics",
        "slug": "electronics",
        "icon": "Cpu",
        "color": "#3b82f6",
        "productCount": 5
      }
    ],
    "all": ["Electronics", "Mobiles", "Laptops"]
  }
}
```

### Create Category
```
POST /api/categories
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Category name |
| icon | string | No | Lucide icon name |
| color | string | No | Hex color code |

### Update Category
```
PUT /api/categories/:id
```

### Delete Category
```
DELETE /api/categories/:id
```

Note: Cannot delete category if it has products.

---

## Settings

### Get Settings
```
GET /api/settings
```

### Update Settings
```
PUT /api/settings
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| shopName | string | No | Store name |
| whatsapp | string | No | WhatsApp number (with country code) |
| address | string | No | Store address |

### Generate API Key
```
POST /api/settings/api-key
```

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| label | string | No | Label for the key |

**Response:**
```json
{
  "success": true,
  "data": {
    "apiKey": "ob_AbCdEfGhIjKlMnOpQrStUvWxYz...",
    "label": "Sales Bot",
    "created": "2026-02-28T12:00:00.000Z"
  },
  "meta": {
    "message": "API key generated. Save this key - it won't be shown again!"
  }
}
```

### List API Keys
```
GET /api/settings/api-key
```

Returns masked keys only.

### Revoke API Key
```
DELETE /api/settings/api-key
```

**Request Body:**
```json
{
  "apiKey": "ob_AbCdEfGhIjKlMnOpQrStUvWxYz..."
}
```

---

## Success Stories

Customer testimonials and delivery photos to build trust.

### List Public Stories
```
GET /api/stories
```

Get published success stories for display on the storefront.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| featured | boolean | - | Filter featured stories only |
| limit | number | 20 | Max results |
| offset | number | 0 | Pagination offset |

**Example:**
```bash
curl "http://localhost:3000/api/stories?featured=true&limit=3"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "story_id",
      "customerName": "Rahul Sharma",
      "location": "Mumbai, Maharashtra",
      "customerPhoto": "https://...",
      "productPhoto": "https://...",
      "productName": "iPhone 14 Pro Max",
      "comment": "Got my iPhone in perfect condition! Saved over ₹50k.",
      "rating": 5,
      "deliveredAt": "2025-02-15T00:00:00.000Z",
      "featured": true,
      "product": {
        "id": "prod_id",
        "name": "iPhone 14 Pro Max 256GB",
        "category": "Mobiles"
      }
    }
  ],
  "meta": {
    "total": 8,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

### Admin: List All Stories
```
GET /api/admin/stories
```

**Authentication:** Session cookie (admin only)

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| published | boolean | - | Filter by published status |
| limit | number | 50 | Max results |
| offset | number | 0 | Pagination offset |

### Admin: Create Story
```
POST /api/admin/stories
```

**Authentication:** Session cookie (admin only)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| customerName | string | Yes | Customer name |
| location | string | Yes | City/State |
| customerPhoto | string | No | URL to customer photo |
| productPhoto | string | Yes | URL to product photo |
| productId | string | No | Link to product ID |
| productName | string | Yes | Product name for display |
| comment | string | Yes | Testimonial text |
| rating | number | Yes | 1-5 stars |
| deliveredAt | string | Yes | ISO date string |
| featured | boolean | No | Show on homepage |
| published | boolean | No | Published status |

**Example:**
```bash
curl -X POST http://localhost:3000/api/admin/stories \
  -H "Content-Type: application/json" \
  -H "Cookie: seller_session=xxx" \
  -d '{
    "customerName": "Priya Patel",
    "location": "Delhi, NCR",
    "productPhoto": "https://example.com/macbook.jpg",
    "productName": "MacBook Pro 14",
    "comment": "Amazing deal! Fast delivery.",
    "rating": 5,
    "deliveredAt": "2025-02-18",
    "featured": true,
    "published": true
  }'
```

### Admin: Update Story
```
PUT /api/admin/stories/:id
```

**Authentication:** Session cookie (admin only)

### Admin: Delete Story
```
DELETE /api/admin/stories/:id
```

**Authentication:** Session cookie (admin only)

---

## Analytics

### Get Statistics
```
GET /api/stats
```

Returns comprehensive inventory and sales analytics.

**Response:**
```json
{
  "success": true,
  "data": {
    "inventory": {
      "total": 20,
      "available": 18,
      "reserved": 1,
      "sold": 1
    },
    "categories": [
      { "name": "Mobiles", "count": 5 }
    ],
    "conditions": [
      { "name": "like_new", "count": 10 }
    ],
    "financials": {
      "totalInventoryValue": 1317992,
      "potentialSavingsForBuyers": 625453,
      "totalRevenue": 9999,
      "averageProductPrice": 65899.6
    },
    "recentActivity": [
      { "id": "...", "name": "iPhone 14 Pro", "status": "sold" }
    ]
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid API key/session |
| VALIDATION_ERROR | 400 | Invalid request body |
| NOT_FOUND | 404 | Resource not found |
| DUPLICATE_ERROR | 409 | Resource already exists |
| EMAIL_EXISTS | 409 | Email already registered |
| CREATE_ERROR | 500 | Failed to create resource |
| UPDATE_ERROR | 500 | Failed to update resource |
| DELETE_ERROR | 500 | Failed to delete resource |
| CATEGORY_IN_USE | 409 | Cannot delete category with products |
| RATE_LIMITED | 429 | Too many requests |
| CART_ERROR | 400 | Cart operation failed |
| ORDER_ERROR | 400 | Order operation failed |
| FORBIDDEN | 403 | Operation not allowed (e.g., dev login in production) |

---

## Rate Limiting

API endpoints have rate limiting to prevent abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /auth/login` | 5 attempts | per minute |
| `POST /auth/signup` | 3 attempts | per hour |
| `POST /auth/setup` | 3 attempts | per hour |
| `POST /products/import` | 10 requests | per minute |
| `POST /orders` | 10 requests | per minute |
| `POST /auth/dev-login` | 10 attempts | per minute |
| All other endpoints | 100 requests | per minute |

**Rate Limit Headers:**
```
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1709300000000
```

---

## AI Agent Workflow

Recommended pattern for AI agents managing the store:

```python
import requests

API_URL = "http://localhost:3000/api"
API_KEY = "dev-api-key-12345"
HEADERS = {"x-api-key": API_KEY, "Content-Type": "application/json"}

# 1. Discover capabilities
GET /api/capabilities

# 2. Check current state
stats = requests.get(f"{API_URL}/stats", headers=HEADERS).json()

# 3. List available inventory
products = requests.get(f"{API_URL}/products?status=available", headers=HEADERS).json()

# 4. Add products to cart (customer flow)
requests.post(f"{API_URL}/cart", headers=HEADERS, json={
    "productId": "product_id",
    "quantity": 1
})

# 5. Create order (customer checkout)
order = requests.post(f"{API_URL}/orders", headers=HEADERS, json={
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "9876543210",
    "address": "123 Main St",
    "items": [{"productId": "prod_id", "quantity": 1}],
    "paymentMethod": "cod"
}).json()

# 6. Update inventory
requests.put(f"{API_URL}/products/{product_id}/status", 
    headers=HEADERS, json={"status": "sold"})
```

---

## Code Examples

### Python (requests)
```python
import requests

API_URL = "http://localhost:3000/api"
API_KEY = "dev-api-key-12345"
HEADERS = {"x-api-key": API_KEY, "Content-Type": "application/json"}

# Get stats
stats = requests.get(f"{API_URL}/stats", headers=HEADERS).json()

# Create product
product = requests.post(
    f"{API_URL}/products",
    headers=HEADERS,
    json={
        "name": "iPhone 15 Pro",
        "category": "Mobiles",
        "sellingPrice": 95000
    }
).json()

# Add to cart
requests.post(f"{API_URL}/cart", headers=HEADERS, json={
    "productId": product["data"]["id"],
    "quantity": 1
})

# Create order
order = requests.post(f"{API_URL}/orders", headers=HEADERS, json={
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "9876543210",
    "address": "123 Main St",
    "items": [{"productId": product["data"]["id"], "quantity": 1}],
    "paymentMethod": "cod"
})
```

### JavaScript (fetch)
```javascript
const API_URL = "http://localhost:3000/api";
const API_KEY = "dev-api-key-12345";
const HEADERS = {
  "x-api-key": API_KEY,
  "Content-Type": "application/json"
};

// Get products
const products = await fetch(`${API_URL}/products`, { headers: HEADERS })
  .then(r => r.json());

// Add to cart
await fetch(`${API_URL}/cart`, {
  method: "POST",
  headers: HEADERS,
  body: JSON.stringify({
    productId: products.data[0].id,
    quantity: 1
  })
});
```

### cURL
```bash
# List available products
curl "http://localhost:3000/api/products?status=available" \
  -H "x-api-key: dev-api-key-12345"

# Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-12345" \
  -d '{"name":"MacBook Air M2","category":"Laptops","sellingPrice":75000}'

# Add to cart
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{"productId":"PRODUCT_ID","quantity":1}'

# Create order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName":"John Doe",
    "customerEmail":"john@example.com",
    "customerPhone":"9876543210",
    "address":"123 Main St",
    "items":[{"productId":"PRODUCT_ID","quantity":1}],
    "paymentMethod":"cod"
  }'

# Get stats
curl http://localhost:3000/api/stats \
  -H "x-api-key: dev-api-key-12345"
```

---

## Changelog

### v3.0.0 (2026-03-02)
- ✨ Added Success Stories feature with photo gallery
- ✨ Added Amazon rating display on product pages
- ✨ Added secure seller signup with strong password requirements
- ✨ Added dev bypass button for development testing
- 🗄️ Migrated from SQLite to PostgreSQL (Neon)
- 🎨 Added Stories page (`/stories`) with customer testimonials
- 🛠️ Added Stories admin dashboard (`/admin/stories`)
- 🔐 Enhanced password validation (8+ chars, mixed case, numbers, special chars)
- 📱 Added "Create Account" link on login page

### v2.0.0 (2026-03-01)
- ✨ Added shopping cart functionality
- ✨ Added order management system
- ✨ Added product import endpoint
- 🔒 Implemented bcrypt password hashing
- 🔒 Added rate limiting (login, setup, import)
- ✅ Added Zod validation for all inputs
- 📱 Improved mobile navigation with cart button
- 🎨 Enhanced UI with animations and gradients

### v1.0.0 (2026-02-27)
- Initial release
- Product CRUD operations
- Category management
- Seller authentication
- API key management
