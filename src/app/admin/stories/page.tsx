"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Star, 
  MapPin, 
  Calendar, 
  Check, 
  X, 
  Trash2, 
  Edit2, 
  Eye, 
  EyeOff,
  Award,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface SuccessStory {
  id: string;
  customerName: string;
  location: string;
  customerPhoto: string | null;
  productPhoto: string;
  productId: string | null;
  productName: string;
  comment: string;
  rating: number;
  deliveredAt: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    category: string;
  } | null;
}

export default function AdminStoriesPage() {
  const router = useRouter();
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "published" | "drafts">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [products, setProducts] = useState<Array<{ id: string; name: string }>>([]);

  // Form state
  const [formData, setFormData] = useState({
    customerName: "",
    location: "",
    customerPhoto: "",
    productPhoto: "",
    productId: "",
    productName: "",
    comment: "",
    rating: 5,
    deliveredAt: new Date().toISOString().split('T')[0],
    featured: false,
    published: true,
  });

  useEffect(() => {
    fetchStories();
    fetchProducts();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await fetch("/api/admin/stories?limit=100");
      const data = await response.json();
      if (data.success) {
        setStories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products?status=all&limit=100");
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })));
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingStory 
        ? `/api/admin/stories/${editingStory.id}` 
        : "/api/admin/stories";
      const method = editingStory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchStories();
        resetForm();
        setShowForm(false);
        setEditingStory(null);
      }
    } catch (error) {
      console.error("Failed to save story:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this story?")) return;

    try {
      const response = await fetch(`/api/admin/stories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchStories();
      }
    } catch (error) {
      console.error("Failed to delete story:", error);
    }
  };

  const handleTogglePublish = async (story: SuccessStory) => {
    try {
      const response = await fetch(`/api/admin/stories/${story.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...story, published: !story.published }),
      });

      if (response.ok) {
        fetchStories();
      }
    } catch (error) {
      console.error("Failed to toggle publish:", error);
    }
  };

  const handleToggleFeatured = async (story: SuccessStory) => {
    try {
      const response = await fetch(`/api/admin/stories/${story.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...story, featured: !story.featured }),
      });

      if (response.ok) {
        fetchStories();
      }
    } catch (error) {
      console.error("Failed to toggle featured:", error);
    }
  };

  const startEdit = (story: SuccessStory) => {
    setEditingStory(story);
    setFormData({
      customerName: story.customerName,
      location: story.location,
      customerPhoto: story.customerPhoto || "",
      productPhoto: story.productPhoto,
      productId: story.productId || "",
      productName: story.productName,
      comment: story.comment,
      rating: story.rating,
      deliveredAt: new Date(story.deliveredAt).toISOString().split('T')[0],
      featured: story.featured,
      published: story.published,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      location: "",
      customerPhoto: "",
      productPhoto: "",
      productId: "",
      productName: "",
      comment: "",
      rating: 5,
      deliveredAt: new Date().toISOString().split('T')[0],
      featured: false,
      published: true,
    });
  };

  const filteredStories = stories.filter((story) => {
    if (activeTab === "published") return story.published;
    if (activeTab === "drafts") return !story.published;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">Success Stories</h1>
          <p className="text-stone-500 mt-1">Manage customer testimonials and delivery photos</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingStory(null);
            setShowForm(!showForm);
          }}
          className="btn-primary flex items-center gap-2 px-5 py-2.5 w-full sm:w-auto justify-center"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Story"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Stories</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{stories.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Published</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stories.filter(s => s.published).length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Featured</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stories.filter(s => s.featured).length}</p>
        </div>
        <div className="stat-card">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Drafts</p>
          <p className="text-2xl font-bold text-stone-400 mt-1">{stories.filter(s => !s.published).length}</p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="premium-card p-6 animate-fade-in-up">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">
            {editingStory ? "Edit Story" : "Add New Story"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder="e.g., Mumbai, Maharashtra"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Customer Photo URL (optional)</label>
                <input
                  type="url"
                  value={formData.customerPhoto}
                  onChange={(e) => setFormData({ ...formData, customerPhoto: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Product Photo URL</label>
                <input
                  type="url"
                  value={formData.productPhoto}
                  onChange={(e) => setFormData({ ...formData, productPhoto: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder="https://..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Link to Product (optional)</label>
                <select
                  value={formData.productId}
                  onChange={(e) => {
                    const product = products.find(p => p.id === e.target.value);
                    setFormData({ 
                      ...formData, 
                      productId: e.target.value,
                      productName: product?.name || formData.productName
                    });
                  }}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  <option value="">-- Select Product --</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Testimonial</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>{rating} Stars</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Delivery Date</label>
                <input
                  type="date"
                  value={formData.deliveredAt}
                  onChange={(e) => setFormData({ ...formData, deliveredAt: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex items-end gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                  />
                  <span className="text-sm text-stone-700">Featured</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-stone-700">Published</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingStory(null);
                  resetForm();
                }}
                className="btn-secondary px-6 py-2.5"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary px-6 py-2.5">
                {editingStory ? "Update Story" : "Create Story"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        {(["all", "published", "drafts"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-amber-500 text-amber-600"
                : "border-transparent text-stone-500 hover:text-stone-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="ml-2 bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full text-xs">
              {tab === "all" 
                ? stories.length 
                : tab === "published" 
                  ? stories.filter(s => s.published).length 
                  : stories.filter(s => !s.published).length}
            </span>
          </button>
        ))}
      </div>

      {/* Stories List */}
      <div className="space-y-4">
        {filteredStories.length === 0 ? (
          <div className="premium-card p-12 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-stone-300" />
            </div>
            <h3 className="font-semibold text-stone-900 mb-2">No stories found</h3>
            <p className="text-stone-500">Start by adding your first success story</p>
          </div>
        ) : (
          filteredStories.map((story) => (
            <div
              key={story.id}
              className="premium-card p-4 md:p-5 flex flex-col md:flex-row gap-4"
            >
              {/* Product Photo */}
              <div className="w-full md:w-32 h-32 md:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-stone-100">
                <img
                  src={story.productPhoto}
                  alt={story.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-stone-900">{story.customerName}</h3>
                      {story.featured && (
                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Featured
                        </span>
                      )}
                      {!story.published && (
                        <span className="bg-stone-100 text-stone-600 text-xs px-2 py-0.5 rounded-full">
                          Draft
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 mt-1 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {story.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(story.deliveredAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-stone-600 text-sm mt-2 line-clamp-2">{story.comment}</p>

                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs font-medium text-stone-500">Product: {story.productName}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex md:flex-col items-center md:items-end gap-2">
                <button
                  onClick={() => handleTogglePublish(story)}
                  className={`p-2 rounded-lg transition-colors ${
                    story.published 
                      ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200" 
                      : "bg-stone-100 text-stone-400 hover:bg-stone-200"
                  }`}
                  title={story.published ? "Unpublish" : "Publish"}
                >
                  {story.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                
                <button
                  onClick={() => handleToggleFeatured(story)}
                  className={`p-2 rounded-lg transition-colors ${
                    story.featured 
                      ? "bg-amber-100 text-amber-600 hover:bg-amber-200" 
                      : "bg-stone-100 text-stone-400 hover:bg-stone-200"
                  }`}
                  title={story.featured ? "Remove from featured" : "Mark as featured"}
                >
                  <Award className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => startEdit(story)}
                  className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => handleDelete(story.id)}
                  className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
