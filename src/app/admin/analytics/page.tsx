"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign,
  Package,
  Eye,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Clock
} from "lucide-react";
import Link from "next/link";

// Simple bar chart component
function SimpleBarChart({ data, maxValue }: { data: number[]; maxValue: number }) {
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((value, i) => {
        const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
        return (
          <div
            key={i}
            className="flex-1 bg-amber-500 rounded-t transition-all duration-500 hover:bg-amber-600"
            style={{ height: `${height}%` }}
            title={`${value} orders`}
          />
        );
      })}
    </div>
  );
}

// Simple line chart component
function SimpleLineChart({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1 || 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="#f59e0b"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      {/* Fill area under line */}
      <polygon
        points={`${points} 100,100 0,100`}
        fill="url(#gradient)"
        opacity="0.3"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface LiveStats {
  pageViews: number;
  uniqueVisitors: number;
  productViews: number;
  cartAdds: number;
  orders: number;
  revenue: number;
  activeCarts: number;
  conversionRate: number;
}

interface TrendingProduct {
  id: string;
  name: string;
  views: number;
  price: number;
  image: string | null;
}

interface Activity {
  type: string;
  description: string;
  time: string;
}

interface InventoryData {
  overview: {
    total: number;
    available: number;
    reserved: number;
    sold: number;
  };
  value: {
    totalValue: number;
    totalOriginalValue: number;
    potentialSavings: number;
  };
  categories: Array<{ name: string; count: number; value: number }>;
  lowStock: Array<{ id: string; name: string; stock: number; price: number; category: string; image: string | null }>;
  topViewed: Array<{ id: string; name: string; views: number; price: number; stock: number; image: string | null }>;
}

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [liveStats, setLiveStats] = useState<LiveStats | null>(null);
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [inventory, setInventory] = useState<InventoryData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [historicalOrders, setHistoricalOrders] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const fetchData = useCallback(async () => {
    try {
      // Fetch live stats
      const liveResponse = await fetch("/api/analytics/live");
      const liveData = await liveResponse.json();
      
      if (liveData.success) {
        setLiveStats(liveData.data.today);
        setTrendingProducts(liveData.data.trendingProducts);
        setRecentActivity(liveData.data.recentActivity);
        setLastUpdated(new Date(liveData.data.lastUpdated));
      }
      
      // Fetch inventory
      const inventoryResponse = await fetch("/api/analytics/inventory?lowStock=true");
      const inventoryData = await inventoryResponse.json();
      
      if (inventoryData.success) {
        setInventory(inventoryData.data);
      }
      
      // Fetch historical data for charts
      const reportsResponse = await fetch("/api/admin/reports?range=7d");
      const reportsData = await reportsResponse.json();
      
      if (reportsData.success && reportsData.data.length > 0) {
        const orders = reportsData.data
          .slice(0, 7)
          .reverse()
          .map((r: any) => r.orders);
        setHistoricalOrders(orders.length > 0 ? orders : [0, 0, 0, 0, 0, 0, 0]);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;
  
  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-stone-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">Live Analytics</h1>
          <p className="text-stone-500 mt-1">
            Real-time store performance
            {lastUpdated && (
              <span className="text-stone-400 text-sm ml-2">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="btn-secondary flex items-center gap-2 px-4 py-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Revenue Today</p>
              <p className="text-2xl font-bold text-stone-900 mt-1">
                {formatCurrency(liveStats?.revenue || 0)}
              </p>
            </div>
            <div className="icon-wrapper bg-emerald-100">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
            <ArrowUpRight className="h-3 w-3" />
            <span>Live</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Orders Today</p>
              <p className="text-2xl font-bold text-stone-900 mt-1">{liveStats?.orders || 0}</p>
            </div>
            <div className="icon-wrapper bg-blue-100">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-stone-500">
            <span>{liveStats?.activeCarts || 0} active carts</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Visitors</p>
              <p className="text-2xl font-bold text-stone-900 mt-1">{liveStats?.uniqueVisitors || 0}</p>
            </div>
            <div className="icon-wrapper bg-amber-100">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-stone-500">
            <span>{liveStats?.pageViews || 0} page views</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Conversion</p>
              <p className="text-2xl font-bold text-stone-900 mt-1">
                {liveStats?.conversionRate?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="icon-wrapper bg-purple-100">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-stone-500">
            <span>{liveStats?.cartAdds || 0} cart adds</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Chart */}
        <div className="lg:col-span-2 premium-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-900">Orders (Last 7 Days)</h3>
            <Link 
              href="/admin/reports"
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              View Reports →
            </Link>
          </div>
          
          <div className="h-40 mb-4">
            <SimpleBarChart 
              data={historicalOrders} 
              maxValue={Math.max(...historicalOrders, 1)} 
            />
          </div>
          
          <div className="flex justify-between text-sm text-stone-500">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>

        {/* Trending Products */}
        <div className="premium-card p-5">
          <h3 className="font-semibold text-stone-900 mb-4">Trending Now</h3>
          
          <div className="space-y-3">
            {trendingProducts.length > 0 ? (
              trendingProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-stone-300 m-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{product.name}</p>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Eye className="h-3 w-3" />
                      <span>{product.views} views</span>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-stone-900">
                    {formatCurrency(product.price)}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-stone-500 text-sm text-center py-4">No trending products yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="premium-card p-5">
          <h3 className="font-semibold text-stone-900 mb-4">Recent Activity</h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type.includes("order") ? "bg-emerald-500" :
                    activity.type.includes("cart") ? "bg-amber-500" :
                    "bg-blue-500"
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm text-stone-700">{activity.description}</p>
                    <p className="text-xs text-stone-400">{formatTime(activity.time)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-stone-500 text-sm text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* Inventory Overview */}
        <div className="premium-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-stone-900">Inventory Overview</h3>
            <Link 
              href="/admin/inventory"
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              Manage →
            </Link>
          </div>
          
          {inventory ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <p className="text-2xl font-bold text-emerald-700">{inventory.overview.available}</p>
                  <p className="text-xs text-emerald-600">Available</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <p className="text-2xl font-bold text-amber-700">{inventory.overview.reserved}</p>
                  <p className="text-xs text-amber-600">Reserved</p>
                </div>
                <div className="text-center p-3 bg-stone-100 rounded-xl">
                  <p className="text-2xl font-bold text-stone-700">{inventory.overview.sold}</p>
                  <p className="text-xs text-stone-600">Sold</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-stone-100">
                <p className="text-sm text-stone-600">
                  Total Value: <span className="font-semibold text-stone-900">{formatCurrency(inventory.value.totalValue)}</span>
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Potential savings for buyers: {formatCurrency(inventory.value.potentialSavings)}
                </p>
              </div>
              
              {/* Low Stock Alerts */}
              {inventory.lowStock.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-stone-900 mb-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Low Stock ({inventory.lowStock.length})
                  </h4>
                  <div className="space-y-1">
                    {inventory.lowStock.slice(0, 3).map((product) => (
                      <Link
                        key={product.id}
                        href={`/admin/products/${product.id}`}
                        className="flex items-center justify-between p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <span className="text-sm text-red-800 truncate max-w-[150px]">{product.name}</span>
                        <span className={`text-sm font-bold ${product.stock <= 1 ? 'text-red-600' : 'text-red-500'}`}>
                          {product.stock} left
                        </span>
                      </Link>
                    ))}
                    {inventory.lowStock.length > 3 && (
                      <Link 
                        href="/admin/inventory"
                        className="text-xs text-red-600 hover:text-red-700 block text-center py-1"
                      >
                        +{inventory.lowStock.length - 3} more →
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-stone-500 text-sm">Loading inventory data...</p>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/products/new" className="premium-card p-4 hover:border-amber-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-stone-900">Add Product</p>
              <p className="text-xs text-stone-500">List new item</p>
            </div>
          </div>
        </Link>
        
        <Link href="/admin/reports" className="premium-card p-4 hover:border-amber-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-stone-900">Daily Reports</p>
              <p className="text-xs text-stone-500">View history</p>
            </div>
          </div>
        </Link>
        
        <Link href="/admin/inventory" className="premium-card p-4 hover:border-amber-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-stone-900">Inventory</p>
              <p className="text-xs text-stone-500">Manage stock</p>
            </div>
          </div>
        </Link>
        
        <Link href="/admin/stories" className="premium-card p-4 hover:border-amber-300 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-stone-900">Stories</p>
              <p className="text-xs text-stone-500">Customer reviews</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
