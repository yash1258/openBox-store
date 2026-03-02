"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Loader2, 
  RefreshCw,
  ChevronRight,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  AlertCircle,
  BarChart3
} from "lucide-react";
import Link from "next/link";

interface DailyReport {
  id: string;
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  productViews: number;
  orders: number;
  revenue: number;
  cartAdds: number;
  abandonedCarts: number;
  avgOrderValue: number;
  overallConversionRate: number;
  viewToCartRate: number;
  cartToCheckoutRate: number;
  checkoutToOrderRate: number;
  topViewedProducts: string;
  topSoldProducts: string;
  lowStockAlerts: string;
  aiSummary?: string;
  createdAt: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [runningCron, setRunningCron] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/admin/reports?range=30d");
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error("Server returned non-JSON response");
      }
      
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      } else {
        console.error("API error:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString() }),
      });
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error("Server returned non-JSON response");
      }
      
      const data = await response.json();
      if (data.success) {
        await fetchReports();
        setSelectedReport(data.data);
      } else {
        console.error("API error:", data.error);
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setGenerating(false);
    }
  };

  // Manual trigger for cron job (generates yesterday's report)
  const runCronJob = async () => {
    setRunningCron(true);
    try {
      const response = await fetch("/api/cron/daily-report", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-manual-trigger": "true"
        },
      });
      
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text.substring(0, 200));
        throw new Error("Server returned non-JSON response");
      }
      
      const data = await response.json();
      if (data.success) {
        await fetchReports();
        setSelectedReport(data.data);
        alert(`Yesterday's report generated successfully!\nRevenue: ₹${data.data.revenue.toLocaleString()}\nOrders: ${data.data.orders}`);
      } else {
        console.error("API error:", data.error);
        alert("Failed to generate yesterday's report: " + data.error);
      }
    } catch (error) {
      console.error("Failed to run cron job:", error);
      alert("Failed to run cron job. Check console for details.");
    } finally {
      setRunningCron(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  const parseJSON = (str: string) => {
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  };

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
          <h1 className="text-2xl md:text-3xl font-bold text-stone-900">Daily Reports</h1>
          <p className="text-stone-500 mt-1">Automated analytics and insights</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={runCronJob}
            disabled={runningCron}
            className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
            title="Generate yesterday's report (simulates 9 AM cron job)"
          >
            {runningCron ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4" />
                Run Yesterday&apos;s Report
              </>
            )}
          </button>
          <button
            onClick={generateReport}
            disabled={generating}
            className="btn-primary flex items-center gap-2 px-5 py-2.5"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Generate Today&apos;s Report
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-semibold text-stone-900">Recent Reports</h2>
          
          {reports.length === 0 ? (
            <div className="premium-card p-8 text-center">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-stone-300" />
              </div>
              <p className="text-stone-500">No reports yet. Generate your first report!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedReport?.id === report.id
                      ? "border-amber-500 bg-amber-50"
                      : "border-stone-200 hover:border-amber-300 hover:bg-stone-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-stone-400" />
                      <span className="font-medium text-stone-900">
                        {formatDate(report.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {report.revenue > 0 ? (
                        <span className="text-emerald-600 font-semibold text-sm">
                          {formatCurrency(report.revenue)}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-sm">No sales</span>
                      )}
                      <ChevronRight className="h-4 w-4 text-stone-400" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                    <span>{report.orders} orders</span>
                    <span>{report.uniqueVisitors} visitors</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Report Detail */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="premium-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-stone-900">
                      {formatDate(selectedReport.date)}
                    </h2>
                    <p className="text-stone-500">Daily Performance Report</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-stone-900">
                      {formatCurrency(selectedReport.revenue)}
                    </p>
                    <p className="text-sm text-stone-500">Revenue</p>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingCart className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-medium text-stone-500 uppercase">Orders</span>
                    </div>
                    <p className="text-2xl font-bold text-stone-900">{selectedReport.orders}</p>
                  </div>

                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-medium text-stone-500 uppercase">Avg Order</span>
                    </div>
                    <p className="text-2xl font-bold text-stone-900">
                      {formatCurrency(selectedReport.avgOrderValue)}
                    </p>
                  </div>

                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-amber-600" />
                      <span className="text-xs font-medium text-stone-500 uppercase">Visitors</span>
                    </div>
                    <p className="text-2xl font-bold text-stone-900">{selectedReport.uniqueVisitors}</p>
                  </div>

                  <div className="bg-stone-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <span className="text-xs font-medium text-stone-500 uppercase">Conversion</span>
                    </div>
                    <p className="text-2xl font-bold text-stone-900">
                      {selectedReport.overallConversionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Traffic & Commerce Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Traffic */}
                <div className="premium-card p-5">
                  <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-amber-600" />
                    Traffic
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-stone-100">
                      <span className="text-stone-600">Page Views</span>
                      <span className="font-semibold">{selectedReport.pageViews}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-stone-100">
                      <span className="text-stone-600">Product Views</span>
                      <span className="font-semibold">{selectedReport.productViews}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-stone-100">
                      <span className="text-stone-600">Cart Adds</span>
                      <span className="font-semibold">{selectedReport.cartAdds}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-stone-600">Abandoned Carts</span>
                      <span className="font-semibold text-amber-600">{selectedReport.abandonedCarts}</span>
                    </div>
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div className="premium-card p-5">
                  <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    Conversion Rates
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-stone-100">
                      <span className="text-stone-600">View → Cart</span>
                      <span className="font-semibold">{selectedReport.viewToCartRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-stone-100">
                      <span className="text-stone-600">Cart → Checkout</span>
                      <span className="font-semibold">{selectedReport.cartToCheckoutRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-stone-100">
                      <span className="text-stone-600">Checkout → Order</span>
                      <span className="font-semibold">{selectedReport.checkoutToOrderRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-emerald-50 rounded-lg px-3 -mx-3">
                      <span className="text-emerald-800 font-medium">Overall Conversion</span>
                      <span className="font-bold text-emerald-700">{selectedReport.overallConversionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Most Viewed */}
                <div className="premium-card p-5">
                  <h3 className="font-semibold text-stone-900 mb-4">Most Viewed Products</h3>
                  
                  {parseJSON(selectedReport.topViewedProducts).length > 0 ? (
                    <div className="space-y-2">
                      {parseJSON(selectedReport.topViewedProducts).map((product: any, i: number) => (
                        <div key={product.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-medium text-stone-600">
                              {i + 1}
                            </span>
                            <span className="text-sm text-stone-700 truncate max-w-[150px]">{product.name}</span>
                          </div>
                          <span className="text-sm font-medium text-stone-900">{product.views} views</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-500 text-sm">No product views recorded</p>
                  )}
                </div>

                {/* Low Stock Alerts */}
                <div className="premium-card p-5">
                  <h3 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Low Stock Alerts
                  </h3>
                  
                  {parseJSON(selectedReport.lowStockAlerts).length > 0 ? (
                    <div className="space-y-2">
                      {parseJSON(selectedReport.lowStockAlerts).map((product: any) => (
                        <div key={product.id} className="flex items-center justify-between py-2">
                          <Link 
                            href={`/admin/products/${product.id}`}
                            className="text-sm text-stone-700 hover:text-amber-600 truncate max-w-[200px]"
                          >
                            {product.name}
                          </Link>
                          <span className={`text-sm font-bold ${product.stock <= 1 ? 'text-red-600' : 'text-amber-600'}`}>
                            {product.stock} left
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-emerald-600 text-sm flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      All products well stocked
                    </p>
                  )}
                </div>
              </div>

              {/* AI Summary */}
              {selectedReport.aiSummary && (
                <div className="premium-card p-5 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                  <h3 className="font-semibold text-stone-900 mb-2">AI Summary</h3>
                  <p className="text-stone-700">{selectedReport.aiSummary}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="premium-card p-12 text-center h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-10 w-10 text-stone-300" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Select a Report</h3>
              <p className="text-stone-500 max-w-sm">
                Click on a date from the list to view detailed analytics, or generate a new report for today.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
