import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// API Capabilities - AI Agent Friendly Documentation
export async function GET() {
  const settings = await prisma.settings.findFirst();

  const capabilities = {
    name: "OpenBox Store API",
    version: "1.0.0",
    description: "REST API for managing an OpenBox/used products storefront. Enables AI agents to perform all seller operations including product management, inventory tracking, and analytics.",

    store: {
      name: settings?.shopName || "OpenBox Store",
      whatsapp: settings?.whatsapp || null,
    },

    endpoints: {
      // Capabilities Discovery
      "GET /api/capabilities": {
        description: "Returns this capabilities document",
        authentication: "Optional",
      },

      // Products
      "GET /api/products": {
        description: "List all products with optional filters",
        authentication: "Required",
        queryParams: {
          status: "Filter by status: available, sold, reserved",
          category: "Filter by category name",
          condition: "Filter by condition: openbox, used, like_new",
          q: "Search in name and description",
          limit: "Limit number of results (default 50)",
          offset: "Offset for pagination",
        },
        example: "/api/products?status=available&category=Mobiles",
      },
      "GET /api/products/:id": {
        description: "Get a single product by ID",
        authentication: "Required",
      },
      "POST /api/products": {
        description: "Create a new product",
        authentication: "Required",
        body: {
          name: "Product name (required)",
          description: "Product description",
          category: "Category (required)",
          condition: "openbox | used | like_new",
          originalPrice: "Original price in INR",
          sellingPrice: "Selling price in INR (required)",
          images: "JSON array of image URLs",
          status: "available | sold | reserved",
        },
        example: {
          name: "iPhone 14 Pro",
          category: "Mobiles",
          condition: "like_new",
          sellingPrice: 75000,
          originalPrice: 120000,
        },
      },
      "POST /api/products/bulk": {
        description: "Create multiple products at once",
        authentication: "Required",
        body: {
          products: "Array of product objects",
        },
      },
      "PUT /api/products/:id": {
        description: "Update an existing product",
        authentication: "Required",
        body: "Same as POST /api/products (all fields optional)",
      },
      "DELETE /api/products/:id": {
        description: "Delete a product",
        authentication: "Required",
      },
      "PUT /api/products/:id/status": {
        description: "Update product status (quick status change)",
        authentication: "Required",
        body: { status: "available | sold | reserved" },
      },

      // Categories
      "GET /api/categories": {
        description: "List all categories",
        authentication: "Required",
      },
      "POST /api/categories": {
        description: "Create a new category",
        authentication: "Required",
        body: {
          name: "Category name (required)",
          icon: "Lucide icon name",
          color: "Hex color code",
        },
      },
      "PUT /api/categories/:id": {
        description: "Update a category",
        authentication: "Required",
      },
      "DELETE /api/categories/:id": {
        description: "Delete a category",
        authentication: "Required",
      },

      // Settings
      "GET /api/settings": {
        description: "Get store settings",
        authentication: "Required",
      },
      "PUT /api/settings": {
        description: "Update store settings",
        authentication: "Required",
        body: {
          shopName: "Store name",
          whatsapp: "WhatsApp number (with country code)",
          address: "Store address",
        },
      },
      "POST /api/settings/api-key": {
        description: "Generate a new API key",
        authentication: "Required",
      },

      // Analytics
      "GET /api/stats": {
        description: "Get inventory and sales statistics",
        authentication: "Required",
        returns: {
          total: "Total products",
          available: "Available products",
          reserved: "Reserved products",
          sold: "Sold products",
          categories: "List of categories with counts",
          totalValue: "Total inventory value",
        },
      },
    },

    // AI Agent Specific Features
    aiAgent: {
      capabilities: [
        "Create, read, update, delete products",
        "Manage product categories",
        "Update product status (mark as sold/reserved)",
        "Bulk import products",
        "View inventory statistics",
        "Update store settings",
        "Generate API keys for sub-agents",
      ],
      rateLimit: "100 requests per minute (recommended)",
      recommendedPattern: "1. Call GET /api/stats to understand current state\n2. Call GET /api/products to list inventory\n3. Use POST/PUT/DELETE for modifications\n4. Use bulk endpoints for batch operations",
    },
  };

  return NextResponse.json(capabilities);
}
