# OpenBox AI Agent Skill

> Guide for AI agents to control the OpenBox e-commerce platform

## Overview

OpenBox is a storefront platform for sellers in India selling openbox/used products. It integrates with WhatsApp for customer communication. AI agents can manage the entire store through the REST API.

## Base URL

```
http://localhost:3002/api
```

For production, replace with your deployed URL.

---

## Authentication

### Option 1: API Key (Recommended for AI Agents)

AI agents should use API keys for authentication:

```bash
curl -H "x-api-key: YOUR_API_KEY" http://localhost:3002/api/stats
```

**Getting an API Key:**
1. Login to seller dashboard at `/login`
2. Go to Settings
3. Generate API key

**Development Key (local only):**
```
x-api-key: dev-api-key-12345
```

### Option 2: Seller Session (Web Dashboard)

For web-based operations, sellers can login at `/login` with email/password.

---

## Quick Reference

| Action | Endpoint | Method |
|--------|----------|--------|
| Get store stats | `/stats` | GET |
| List products | `/products` | GET |
| Create product | `/products` | POST |
| Update product | `/products/:id` | PUT |
| Delete product | `/products/:id` | DELETE |
| Update status | `/products/:id/status` | PUT |
| Bulk create | `/products/bulk` | POST |
| List categories | `/categories` | GET |
| Create category | `/categories` | POST |
| Get settings | `/settings` | GET |
| Update settings | `/settings` | PUT |
| Generate API key | `/settings/api-key` | POST |

---

## Core Operations

### 1. Get Store Overview

Always start here to understand current state:

```bash
curl http://localhost:3002/api/stats \
  -H "x-api-key: dev-api-key-12345"
```

**Response includes:**
- Total products, available, reserved, sold counts
- Category breakdown
- Inventory value
- Recent activity

---

### 2. Product Management

**List all products:**
```bash
curl "http://localhost:3002/api/products?status=available" \
  -H "x-api-key: dev-api-key-12345"
```

**Filter options:**
- `status`: available, reserved, sold
- `category`: Mobiles, Laptops, Electronics, etc.
- `condition`: openbox, used, like_new
- `q`: Search query
- `limit`: Max results (default 50)
- `offset`: Pagination offset

**Create a product:**
```bash
curl -X POST http://localhost:3002/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-12345" \
  -d '{
    "name": "iPhone 14 Pro 256GB",
    "category": "Mobiles",
    "condition": "like_new",
    "sellingPrice": 85000,
    "originalPrice": 120000,
    "description": "Deep Purple, 90% battery",
    "images": ["https://example.com/iphone.jpg"]
  }'
```

**Update a product:**
```bash
curl -X PUT http://localhost:3002/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-12345" \
  -d '{
    "sellingPrice": 80000,
    "status": "reserved"
  }'
```

**Quick status change (most common):**
```bash
curl -X PUT http://localhost:3002/api/products/PRODUCT_ID/status \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-12345" \
  -d '{"status": "sold"}'
```

**Delete a product:**
```bash
curl -X DELETE http://localhost:3002/api/products/PRODUCT_ID \
  -H "x-api-key: dev-api-key-12345"
```

---

### 3. Bulk Operations

**Create multiple products at once:**
```bash
curl -X POST http://localhost:3002/api/products/bulk \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-12345" \
  -d '{
    "products": [
      {
        "name": "Product 1",
        "category": "Electronics",
        "sellingPrice": 5000
      },
      {
        "name": "Product 2",
        "category": "Mobiles",
        "sellingPrice": 10000
      }
    ]
  }'
```

---

### 4. Categories

**List categories:**
```bash
curl http://localhost:3002/api/categories \
  -H "x-api-key: dev-api-key-12345"
```

**Create category:**
```bash
curl -X POST http://localhost:3002/api/categories \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-12345" \
  -d '{
    "name": "Gaming",
    "icon": "Gamepad2",
    "color": "#8b5cf6"
  }'
```

**Delete category (must have no products):**
```bash
curl -X DELETE http://localhost:3002/api/categories/CATEGORY_ID \
  -H "x-api-key: dev-api-key-12345"
```

---

### 5. Settings

**Get current settings:**
```bash
curl http://localhost:3002/api/settings \
  -H "x-api-key: dev-api-key-12345"
```

**Update store settings:**
```bash
curl -X PUT http://localhost:3002/api/settings \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-12345" \
  -d '{
    "shopName": "My OpenBox Store",
    "whatsapp": "919876543210",
    "address": "Mumbai, India"
  }'
```

**Generate new API key:**
```bash
curl -X POST http://localhost:3002/api/settings/api-key \
  -H "Content-Type: application/json" \
  -H "x-api-key: dev-api-key-12345" \
  -d '{"label": "Sales Bot"}'
```

---

## Common AI Agent Workflows

### Workflow 1: List and Update Inventory

```python
# 1. Get current state
stats = GET /api/stats

# 2. List available products
products = GET /api/products?status=available

# 3. For each product, decide action
for product in products:
    if should_reserve(product):
        PUT /api/products/{id}/status {"status": "reserved"}
    elif should_mark_sold(product):
        PUT /api/products/{id}/status {"status": "sold"}
```

### Workflow 2: Add New Product Listing

```python
# 1. Create product
product = POST /api/products {
    "name": "iPhone 15 Pro",
    "category": "Mobiles",
    "sellingPrice": 95000,
    "condition": "like_new",
    "description": "Natural Titanium, 256GB"
}

# 2. Verify created
GET /api/products/{product.id}
```

### Workflow 3: Bulk Import Products

```python
# Read from source (CSV, database, etc.)
source_products = read_products()

# Transform to OpenBox format
products = transform(source_products)

# Bulk create
result = POST /api/products/bulk { products }
```

### Workflow 4: Daily Sales Report

```python
# Get stats
stats = GET /api/stats

# Extract key metrics
sold_count = stats.inventory.sold
revenue = stats.financials.totalRevenue
available = stats.inventory.available

# Generate report
report = f"Sold: {sold_count}, Revenue: ₹{revenue}, Available: {available}"
```

---

## Response Format

All API responses follow this structure:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "message": "..." }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| UNAUTHORIZED | Invalid or missing API key |
| VALIDATION_ERROR | Invalid request data |
| NOT_FOUND | Resource not found |
| DUPLICATE_ERROR | Resource already exists |
| CREATE_ERROR | Failed to create |
| UPDATE_ERROR | Failed to update |
| DELETE_ERROR | Failed to delete |

---

## WhatsApp Integration

The storefront includes WhatsApp deep links. When customers click "Chat on WhatsApp", they get a pre-filled message with the product name and price.

**Format:**
```
wa.me/WHATSAPP_NUMBER?text=Hi!+I+interested+in+PRODUCT+NAME+-+₹PRICE
```

---

## Complete Python Example

```python
import requests

API_URL = "http://localhost:3002/api"
API_KEY = "dev-api-key-12345"
HEADERS = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json"
}

class OpenBoxAgent:
    def __init__(self, api_url=API_URL, api_key=API_KEY):
        self.api_url = api_url
        self.api_key = api_key
        self.headers = {"x-api-key": api_key, "Content-Type": "application/json"}

    def get_stats(self):
        return requests.get(f"{self.api_url}/stats", headers=self.headers).json()

    def list_products(self, status=None, category=None):
        params = {}
        if status: params["status"] = status
        if category: params["category"] = category
        return requests.get(f"{self.api_url}/products", headers=self.headers, params=params).json()

    def create_product(self, name, category, selling_price, **kwargs):
        data = {
            "name": name,
            "category": category,
            "sellingPrice": selling_price,
            **kwargs
        }
        return requests.post(f"{self.api_url}/products", headers=self.headers, json=data).json()

    def update_status(self, product_id, status):
        return requests.put(
            f"{self.api_url}/products/{product_id}/status",
            headers=self.headers,
            json={"status": status}
        ).json()

    def delete_product(self, product_id):
        return requests.delete(f"{self.api_url}/products/{product_id}", headers=self.headers).json()

# Usage
agent = OpenBoxAgent()

# Get stats
stats = agent.get_stats()
print(f"Total products: {stats['data']['inventory']['total']}")

# Create product
result = agent.create_product(
    name="iPhone 14 Pro",
    category="Mobiles",
    selling_price=75000,
    condition="like_new",
    original_price=120000
)
print(f"Created: {result['data']['id']}")

# Mark as sold
agent.update_status(result['data']['id'], "sold")
```

---

## Best Practices

1. **Always check stats first** - Understand current state before making changes
2. **Use bulk operations** - When creating multiple products, use `/products/bulk`
3. **Validate before deleting** - Check if category has products before deleting
4. **Keep API keys secure** - Never expose in client-side code
5. **Handle errors gracefully** - Check `success` field in response

---

## Capabilities Discovery

To get the latest capabilities:

```bash
curl http://localhost:3002/api/capabilities
```

This returns the full API documentation.
