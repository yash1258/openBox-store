"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import ImageUploader from "./ImageUploader";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    description: string | null;
    category: string;
    condition: string;
    originalPrice: number | null;
    sellingPrice: number;
    images: string;
    status: string;
  };
  sellerId?: string;
}

interface Category {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
}

const DEFAULT_CATEGORIES = [
  "Electronics",
  "Mobiles",
  "Laptops",
  "Accessories",
  "Home",
  "Other",
];

const CONDITIONS = [
  { value: "openbox", label: "Openbox" },
  { value: "like_new", label: "Like New" },
  { value: "used", label: "Used" },
];

export default function ProductForm({ product, sellerId }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(
    product ? JSON.parse(product.images || "[]") : []
  );
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Load categories from API
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data: { success?: boolean; data?: { custom?: Category[] } }) => {
        const fetchedCategories = data.data?.custom || [];
        if (fetchedCategories.length > 0) {
          const catNames = fetchedCategories.map((c) => c.name);
          // Merge with defaults if not all there
          const allCats = [...new Set([...DEFAULT_CATEGORIES, ...catNames])];
          setCategories(allCats);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      description: formData.get("description"),
      category: formData.get("category"),
      condition: formData.get("condition"),
      originalPrice: formData.get("originalPrice")
        ? parseFloat(formData.get("originalPrice") as string)
        : null,
      sellingPrice: parseFloat(formData.get("sellingPrice") as string),
      images: JSON.stringify(images),
      status: formData.get("status"),
      sellerId: sellerId,
    };

    const url = product
      ? `/api/products/${product.id}`
      : "/api/products";

    const method = product ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        alert("Error saving product");
      }
    } catch {
      alert("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const res = await fetch(`/api/products/${product?.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh();
    } else {
      alert("Error deleting product");
    }
  };



  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/products"
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {product ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-gray-500 mt-1">
              {product ? "Update product details" : "List a new product for sale"}
            </p>
          </div>
          {product && (
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Info</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                required
                defaultValue={product?.name}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., iPhone 14 Pro Max"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={product?.description || ""}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe the product condition, features, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <div className="flex gap-2">
                  <select
                    name="category"
                    required
                    defaultValue={product?.category || "Electronics"}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__new__">+ Add New Category</option>
                  </select>
                </div>
                {showCategoryInput && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New category name"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCategoryName && !categories.includes(newCategoryName)) {
                          setCategories([...categories, newCategoryName]);
                          setNewCategoryName("");
                          setShowCategoryInput(false);
                        }
                      }}
                      className="px-3 py-2 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condition *
                </label>
                <select
                  name="condition"
                  required
                  defaultValue={product?.condition || "openbox"}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Pricing</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  step="0.01"
                  min="0"
                  defaultValue={product?.originalPrice || ""}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 99999"
                />
                <p className="text-xs text-gray-500 mt-1">
                  MRP or original price (for display)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  name="sellingPrice"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={product?.sellingPrice}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., 74999"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Images</h2>
              <span className="text-xs text-gray-500">
                {images.length}/10 images
              </span>
            </div>

            <ImageUploader
              images={images}
              onImagesChange={setImages}
              maxImages={10}
              disabled={loading}
            />

            <p className="text-xs text-gray-500">
              Upload product images. First image will be the cover photo.
            </p>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Status</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Status
              </label>
              <select
                name="status"
                defaultValue={product?.status || "available"}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link
              href="/admin/products"
              className="px-6 py-2 border rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
