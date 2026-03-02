module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createSession",
    ()=>createSession,
    "destroySession",
    ()=>destroySession,
    "getSession",
    ()=>getSession,
    "hashPassword",
    ()=>hashPassword,
    "isAuthenticated",
    ()=>isAuthenticated,
    "requireSeller",
    ()=>requireSeller,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$bcrypt$29$__ = __turbopack_context__.i("[externals]/bcrypt [external] (bcrypt, cjs, [project]/node_modules/bcrypt)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
;
;
const SESSION_COOKIE = "seller_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const SALT_ROUNDS = 12;
async function hashPassword(password) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$bcrypt$29$__["default"].hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$bcrypt__$5b$external$5d$__$28$bcrypt$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$bcrypt$29$__["default"].compare(password, hash);
}
async function createSession(sellerId) {
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_DURATION);
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].seller.update({
        where: {
            id: sellerId
        },
        data: {
            updatedAt: new Date()
        }
    });
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set(SESSION_COOKIE, JSON.stringify({
        token: sessionToken,
        sellerId,
        expiresAt: expiresAt.toISOString()
    }), {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === "production",
        sameSite: "lax",
        expires: expiresAt,
        path: "/"
    });
    return sessionToken;
}
async function getSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const sessionCookie = cookieStore.get(SESSION_COOKIE);
    if (!sessionCookie) {
        return null;
    }
    try {
        const session = JSON.parse(sessionCookie.value);
        if (new Date(session.expiresAt) < new Date()) {
            await destroySession();
            return null;
        }
        const seller = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].seller.findUnique({
            where: {
                id: session.sellerId
            },
            select: {
                id: true,
                email: true,
                name: true,
                shopName: true,
                isActive: true
            }
        });
        if (!seller || !seller.isActive) {
            await destroySession();
            return null;
        }
        return {
            sellerId: seller.id,
            email: seller.email,
            name: seller.name,
            shopName: seller.shopName
        };
    } catch  {
        return null;
    }
}
async function destroySession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete(SESSION_COOKIE);
}
async function requireSeller() {
    const session = await getSession();
    if (!session) {
        throw new Error("UNAUTHORIZED");
    }
    return session;
}
async function isAuthenticated() {
    const session = await getSession();
    return session !== null;
}
}),
"[project]/src/lib/jobs/dailyReport.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateDailyReport",
    ()=>generateDailyReport,
    "generateReportSummary",
    ()=>generateReportSummary,
    "getDailyReport",
    ()=>getDailyReport,
    "getLatestReport",
    ()=>getLatestReport,
    "getReportsInRange",
    ()=>getReportsInRange
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
async function generateDailyReport(date = new Date()) {
    // Set to start and end of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    console.log(`Generating report for ${startOfDay.toDateString()}...`);
    // Gather all metrics
    const metrics = await gatherMetrics(startOfDay, endOfDay);
    // Calculate conversion rates
    const conversionRates = calculateConversionRates(metrics);
    // Check if report already exists for this date
    const existingReport = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyReport.findUnique({
        where: {
            date: startOfDay
        }
    });
    // Prepare data with JSON stringification
    const reportData = {
        pageViews: metrics.pageViews,
        uniqueVisitors: metrics.uniqueVisitors,
        productViews: metrics.productViews,
        avgSessionDuration: metrics.avgSessionDuration,
        cartAdds: metrics.cartAdds,
        checkoutsStarted: metrics.checkoutsStarted,
        orders: metrics.orders,
        revenue: metrics.revenue,
        abandonedCarts: metrics.abandonedCarts,
        abandonedCartValue: metrics.abandonedCartValue,
        avgOrderValue: metrics.avgOrderValue,
        viewToCartRate: conversionRates.viewToCartRate,
        cartToCheckoutRate: conversionRates.cartToCheckoutRate,
        checkoutToOrderRate: conversionRates.checkoutToOrderRate,
        overallConversionRate: conversionRates.overallConversionRate,
        topViewedProducts: JSON.stringify(metrics.topViewedProducts),
        topSoldProducts: JSON.stringify(metrics.topSoldProducts),
        lowStockAlerts: JSON.stringify(metrics.lowStockAlerts),
        isAutoGenerated: true
    };
    if (existingReport) {
        // Update existing report
        const updated = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyReport.update({
            where: {
                id: existingReport.id
            },
            data: reportData
        });
        console.log(`Updated report for ${startOfDay.toDateString()}`);
        return updated;
    }
    // Create new report
    const report = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyReport.create({
        data: {
            date: startOfDay,
            ...reportData
        }
    });
    console.log(`Created report for ${startOfDay.toDateString()}`);
    return report;
}
// Gather all metrics for the day
async function gatherMetrics(startOfDay, endOfDay) {
    // Traffic metrics from AnalyticsEvent
    const [pageViews, uniqueVisitors, productViews, cartAdds, checkoutsStarted] = await Promise.all([
        // Page views
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.count({
            where: {
                type: "page_view",
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        }),
        // Unique visitors
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.groupBy({
            by: [
                "sessionId"
            ],
            where: {
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        }).then((sessions)=>sessions.length),
        // Product views
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.count({
            where: {
                type: "product_view",
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        }),
        // Cart adds
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.count({
            where: {
                type: "cart_add",
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        }),
        // Checkouts started
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.count({
            where: {
                type: "checkout_start",
                createdAt: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        })
    ]);
    // Orders and revenue
    const ordersToday = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
        where: {
            createdAt: {
                gte: startOfDay,
                lte: endOfDay
            },
            status: {
                not: "CANCELLED"
            }
        },
        select: {
            id: true,
            totalAmount: true,
            items: {
                select: {
                    productId: true,
                    productName: true,
                    quantity: true
                }
            }
        }
    });
    const orders = ordersToday.length;
    const revenue = ordersToday.reduce((sum, o)=>sum + o.totalAmount, 0);
    const avgOrderValue = orders > 0 ? revenue / orders : 0;
    // Abandoned carts (sessions with cart_add but no order)
    const abandonedCartSessions = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cartEvent.findMany({
        where: {
            eventType: "add",
            createdAt: {
                gte: startOfDay,
                lte: endOfDay
            }
        },
        distinct: [
            "sessionId"
        ],
        select: {
            sessionId: true
        }
    });
    // Calculate abandoned carts (simplified)
    const completedSessionIds = new Set(ordersToday.map(()=>`order_${Math.random()}`) // Placeholder
    );
    const abandonedCarts = Math.max(0, abandonedCartSessions.length - orders);
    const abandonedCartValue = abandonedCarts * avgOrderValue; // Estimate
    // Top viewed products
    const topViewed = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.groupBy({
        by: [
            "productId"
        ],
        where: {
            type: "product_view",
            createdAt: {
                gte: startOfDay,
                lte: endOfDay
            },
            productId: {
                not: null
            }
        },
        _count: {
            productId: true
        },
        orderBy: {
            _count: {
                productId: "desc"
            }
        },
        take: 5
    });
    const topViewedProducts = await Promise.all(topViewed.map(async (item)=>{
        const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
            where: {
                id: item.productId
            },
            select: {
                id: true,
                name: true
            }
        });
        return {
            id: product?.id || item.productId,
            name: product?.name || "Unknown Product",
            views: item._count.productId
        };
    }));
    // Top sold products
    const productSales = {};
    ordersToday.forEach((order)=>{
        order.items.forEach((item)=>{
            if (!productSales[item.productId]) {
                productSales[item.productId] = {
                    id: item.productId,
                    name: item.productName,
                    sales: 0
                };
            }
            productSales[item.productId].sales += item.quantity;
        });
    });
    const topSoldProducts = Object.values(productSales).sort((a, b)=>b.sales - a.sales).slice(0, 5);
    // Low stock alerts
    const lowStockProducts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            status: "available",
            stockQuantity: {
                lte: 3
            }
        },
        select: {
            id: true,
            name: true,
            stockQuantity: true
        },
        take: 10
    });
    const lowStockAlerts = lowStockProducts.map((p)=>({
            id: p.id,
            name: p.name,
            stock: p.stockQuantity
        }));
    // Estimate average session duration (simplified)
    const avgSessionDuration = pageViews > 0 ? Math.round(uniqueVisitors / pageViews * 120) : 0;
    return {
        pageViews,
        uniqueVisitors,
        productViews,
        avgSessionDuration,
        cartAdds,
        checkoutsStarted,
        orders,
        revenue,
        abandonedCarts,
        abandonedCartValue,
        avgOrderValue,
        topViewedProducts,
        topSoldProducts,
        lowStockAlerts
    };
}
// Calculate conversion rates
function calculateConversionRates(metrics) {
    const viewToCartRate = metrics.productViews > 0 ? metrics.cartAdds / metrics.productViews * 100 : 0;
    const cartToCheckoutRate = metrics.cartAdds > 0 ? metrics.checkoutsStarted / metrics.cartAdds * 100 : 0;
    const checkoutToOrderRate = metrics.checkoutsStarted > 0 ? metrics.orders / metrics.checkoutsStarted * 100 : 0;
    const overallConversionRate = metrics.pageViews > 0 ? metrics.orders / metrics.pageViews * 100 : 0;
    return {
        viewToCartRate: Math.round(viewToCartRate * 100) / 100,
        cartToCheckoutRate: Math.round(cartToCheckoutRate * 100) / 100,
        checkoutToOrderRate: Math.round(checkoutToOrderRate * 100) / 100,
        overallConversionRate: Math.round(overallConversionRate * 100) / 100
    };
}
async function generateReportSummary(report) {
    const parts = [];
    // Parse JSON fields
    const topViewed = JSON.parse(report.topViewedProducts || "[]");
    const lowStock = JSON.parse(report.lowStockAlerts || "[]");
    // Sales summary
    if (report.orders > 0) {
        parts.push(`Today you had ${report.orders} order${report.orders !== 1 ? 's' : ''} totaling ₹${report.revenue.toLocaleString()}.`);
    } else {
        parts.push("No orders today.");
    }
    // Traffic
    parts.push(`${report.uniqueVisitors} unique visitors browsed your store.`);
    // Top product
    if (topViewed.length > 0) {
        parts.push(`Most viewed: ${topViewed[0].name} (${topViewed[0].views} views).`);
    }
    // Low stock warning
    if (lowStock.length > 0) {
        parts.push(`⚠️ ${lowStock.length} product${lowStock.length !== 1 ? 's are' : ' is'} running low on stock.`);
    }
    return parts.join(" ");
}
async function getDailyReport(date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyReport.findUnique({
        where: {
            date: startOfDay
        }
    });
}
async function getReportsInRange(startDate, endDate) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyReport.findMany({
        where: {
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        orderBy: {
            date: "desc"
        }
    });
}
async function getLatestReport() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyReport.findFirst({
        orderBy: {
            date: "desc"
        }
    });
}
}),
"[project]/src/app/api/admin/reports/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jobs$2f$dailyReport$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/jobs/dailyReport.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        console.log("POST /api/admin/reports - Starting...");
        // Check authentication
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
        if (!session) {
            console.log("POST /api/admin/reports - Unauthorized");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        console.log("POST /api/admin/reports - Session OK, parsing body...");
        const body = await request.json();
        const date = body.date ? new Date(body.date) : new Date();
        console.log("POST /api/admin/reports - Generating report for:", date);
        // Generate report
        const report = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jobs$2f$dailyReport$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateDailyReport"])(date);
        console.log("POST /api/admin/reports - Report generated successfully");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: report,
            meta: {
                message: `Report generated for ${date.toDateString()}`
            }
        });
    } catch (error) {
        console.error("Generate report error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to generate report",
            details: String(error)
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    try {
        // Check authentication
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");
        const range = searchParams.get("range"); // "7d", "30d", "all"
        if (date) {
            // Get specific date report
            const report = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jobs$2f$dailyReport$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDailyReport"])(new Date(date));
            if (!report) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    success: false,
                    error: "Report not found"
                }, {
                    status: 404
                });
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: report
            });
        }
        // Get range of reports
        const endDate = new Date();
        const startDate = new Date();
        switch(range){
            case "7d":
                startDate.setDate(startDate.getDate() - 7);
                break;
            case "30d":
                startDate.setDate(startDate.getDate() - 30);
                break;
            default:
                startDate.setDate(startDate.getDate() - 30); // Default to last 30 days
        }
        const reports = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$jobs$2f$dailyReport$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getReportsInRange"])(startDate, endDate);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: reports,
            meta: {
                count: reports.length,
                range: `${startDate.toDateString()} - ${endDate.toDateString()}`
            }
        });
    } catch (error) {
        console.error("Get reports error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to get reports"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__36b354f1._.js.map