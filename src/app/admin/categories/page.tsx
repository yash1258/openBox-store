"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Package, Smartphone, Laptop, Home, Headphones, Watch, MoreHorizontal, X, Check } from "lucide-react";

const DEFAULT_ICONS: Record<string, string> = {
  Electronics: "laptop",
  Mobiles: "smartphone",
  Laptops: "laptop",
  Accessories: "headphones",
  Home: "home",
  Other: "package",
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphone: Smartphone,
  laptop: Laptop,
  home: Home,
  headphones: Headphones,
  watch: Watch,
  package: Package,
  default: MoreHorizontal,
};

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  color?: string | null;
  productCount?: number;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", icon: "package", color: "#b45309" });

  // Load categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data?.custom || []);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
    const method = editingCategory ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", icon: "package", color: "#b45309" });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    router.refresh();
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon || "package",
      color: category.color || "#b45309",
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Categories</h1>
          <p className="text-sm text-stone-500">Manage product categories</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "", icon: "package", color: "#b45309" });
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-medium"
        >
          <Plus className="h-5 w-5" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {categories.map((category) => {
          const IconComponent = ICON_MAP[category.icon || "default"] || Package;
          return (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="p-2.5 rounded-xl"
                  style={{ backgroundColor: (category.color || "#b45309") + "20", color: category.color || "#b45309" }}
                >
                  <IconComponent
                    className="h-5 w-5"
                  />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(category)}
                    className="p-1.5 hover:bg-stone-100 rounded-lg"
                  >
                    <Edit2 className="h-4 w-4 text-stone-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-stone-900">{category.name}</h3>
              <p className="text-sm text-stone-500">
                {category.productCount || 0} products
              </p>
            </div>
          );
        })}

        {/* Add Category Card */}
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: "", icon: "package", color: "#b45309" });
            setIsModalOpen(true);
          }}
          className="bg-white rounded-2xl border-2 border-dashed border-stone-200 p-4 hover:border-amber-300 hover:bg-amber-50/50 transition-colors flex flex-col items-center justify-center min-h-[120px]"
        >
          <Plus className="h-8 w-8 text-stone-300 mb-2" />
          <span className="text-sm font-medium text-stone-500">Add Category</span>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-stone-900">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-stone-100 rounded-lg"
              >
                <X className="h-5 w-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Mobiles, Laptops"
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(ICON_MAP).map((iconKey) => {
                    const Icon = ICON_MAP[iconKey];
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: iconKey })}
                        className={`p-3 rounded-xl border-2 transition-colors ${
                          formData.icon === iconKey
                            ? "border-amber-500 bg-amber-50"
                            : "border-stone-200 hover:border-stone-300"
                        }`}
                      >
                        <Icon className="h-5 w-5 mx-auto" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {["#b45309", "#dc2626", "#2563eb", "#16a34a", "#7c3aed", "#db2777"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-full border-2 transition-transform ${
                        formData.color === color ? "border-stone-900 scale-110" : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 border border-stone-200 rounded-xl font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium"
                >
                  {editingCategory ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
