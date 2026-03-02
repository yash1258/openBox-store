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
"[project]/src/lib/ai/openrouter.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "callOpenRouter",
    ()=>callOpenRouter,
    "chatWithAI",
    ()=>chatWithAI
]);
// OpenRouter client configuration
// OpenRouter provides access to multiple LLMs (Claude, GPT-4, etc.)
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "stepfun/step-3.5-flash:free";
// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are an AI assistant for OpenBox Store, an e-commerce platform for selling open-box and pre-owned tech products.

Your job is to help sellers manage their store by answering questions about:
- Sales and revenue data
- Inventory and stock levels
- Product performance
- Customer behavior and trends
- Daily reports and analytics

You have access to tools that can:
- Get live store statistics (today's sales, visitors, etc.)
- Fetch inventory information (stock levels, low stock alerts)
- Retrieve daily reports (revenue, orders, conversion rates)
- Search products in the catalog
- Get trending products

Guidelines:
1. Be helpful, concise, and professional
2. Use the available tools to get accurate data
3. Provide actionable insights when possible
4. If you don't have access to certain data, say so clearly
5. Format currency in INR (₹)
6. Keep responses brief but informative
7. For complex queries, break down the answer into bullet points

Current date: ${new Date().toDateString()}
`;
async function callOpenRouter(messages, tools, temperature = 0.7) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error("OPENROUTER_API_KEY not configured");
    }
    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.VERCEL_URL || "http://localhost:3000",
            "X-Title": "OpenBox Store AI Assistant"
        },
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT
                },
                ...messages
            ],
            tools: tools || [],
            temperature,
            max_tokens: 1000
        })
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenRouter API error: ${error}`);
    }
    return response.json();
}
async function chatWithAI(userMessage, history = []) {
    const messages = [
        ...history,
        {
            role: "user",
            content: userMessage
        }
    ];
    const response = await callOpenRouter(messages);
    return response.choices[0]?.message?.content || "I apologize, but I couldn't process your request.";
}
}),
"[project]/src/lib/ai/tools.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AI_TOOLS",
    ()=>AI_TOOLS,
    "getDailyReport",
    ()=>getDailyReport,
    "getInventorySummary",
    ()=>getInventorySummary,
    "getLiveStats",
    ()=>getLiveStats,
    "getRecentOrders",
    ()=>getRecentOrders,
    "getSalesComparison",
    ()=>getSalesComparison,
    "getTrendingProducts",
    ()=>getTrendingProducts,
    "searchProducts",
    ()=>searchProducts
]);
// AI Tools - Define available functions for the AI assistant
// These tools allow the AI to fetch real data from the database
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
const AI_TOOLS = [
    {
        type: "function",
        function: {
            name: "get_live_stats",
            description: "Get real-time store statistics for today (page views, orders, revenue, etc.)",
            parameters: {
                type: "object",
                properties: {},
                required: []
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_inventory_summary",
            description: "Get current inventory summary including total products, available stock, and low stock alerts",
            parameters: {
                type: "object",
                properties: {
                    includeLowStock: {
                        type: "boolean",
                        description: "Whether to include low stock products in the response",
                        default: true
                    }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_daily_report",
            description: "Get the daily report for a specific date (revenue, orders, conversion rates, top products)",
            parameters: {
                type: "object",
                properties: {
                    date: {
                        type: "string",
                        description: "Date in YYYY-MM-DD format. Use 'yesterday' for yesterday's report.",
                        default: "today"
                    }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "search_products",
            description: "Search for products in the inventory by name, category, or status",
            parameters: {
                type: "object",
                properties: {
                    query: {
                        type: "string",
                        description: "Search term (product name, category, etc.)"
                    },
                    status: {
                        type: "string",
                        enum: [
                            "available",
                            "sold",
                            "reserved",
                            "all"
                        ],
                        description: "Filter by product status",
                        default: "all"
                    },
                    limit: {
                        type: "number",
                        description: "Maximum number of results",
                        default: 10
                    }
                },
                required: [
                    "query"
                ]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_trending_products",
            description: "Get the most viewed products in the last 6 hours (trending items)",
            parameters: {
                type: "object",
                properties: {
                    limit: {
                        type: "number",
                        description: "Number of trending products to return",
                        default: 5
                    }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_recent_orders",
            description: "Get recent orders from today or the last few days",
            parameters: {
                type: "object",
                properties: {
                    days: {
                        type: "number",
                        description: "Number of days to look back",
                        default: 1
                    },
                    limit: {
                        type: "number",
                        description: "Maximum number of orders to return",
                        default: 10
                    }
                }
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_sales_comparison",
            description: "Compare sales between two time periods (e.g., this week vs last week)",
            parameters: {
                type: "object",
                properties: {
                    period1: {
                        type: "string",
                        enum: [
                            "today",
                            "yesterday",
                            "week",
                            "last_week",
                            "month",
                            "last_month"
                        ],
                        description: "First period to compare"
                    },
                    period2: {
                        type: "string",
                        enum: [
                            "today",
                            "yesterday",
                            "week",
                            "last_week",
                            "month",
                            "last_month"
                        ],
                        description: "Second period to compare"
                    }
                },
                required: [
                    "period1",
                    "period2"
                ]
            }
        }
    }
];
async function getLiveStats() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const [pageViews, uniqueVisitors, productViews, cartAdds, orders] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.count({
            where: {
                type: "page_view",
                createdAt: {
                    gte: startOfDay
                }
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.groupBy({
            by: [
                "sessionId"
            ],
            where: {
                createdAt: {
                    gte: startOfDay
                }
            }
        }).then((sessions)=>sessions.length),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.count({
            where: {
                type: "product_view",
                createdAt: {
                    gte: startOfDay
                }
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.count({
            where: {
                type: "cart_add",
                createdAt: {
                    gte: startOfDay
                }
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.count({
            where: {
                createdAt: {
                    gte: startOfDay
                },
                status: {
                    not: "CANCELLED"
                }
            }
        })
    ]);
    const ordersData = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
        where: {
            createdAt: {
                gte: startOfDay
            },
            status: {
                not: "CANCELLED"
            }
        },
        select: {
            totalAmount: true
        }
    });
    const revenue = ordersData.reduce((sum, o)=>sum + o.totalAmount, 0);
    return {
        pageViews,
        uniqueVisitors,
        productViews,
        cartAdds,
        orders,
        revenue,
        conversionRate: pageViews > 0 ? (orders / pageViews * 100).toFixed(2) : 0
    };
}
async function getInventorySummary(includeLowStock = true) {
    const [totalProducts, availableProducts, lowStockProducts] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.count(),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.count({
            where: {
                status: "available"
            }
        }),
        includeLowStock ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
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
            orderBy: {
                stockQuantity: "asc"
            },
            take: 10
        }) : Promise.resolve([])
    ]);
    const available = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where: {
            status: "available"
        },
        select: {
            sellingPrice: true,
            stockQuantity: true
        }
    });
    const totalValue = available.reduce((sum, p)=>sum + p.sellingPrice * p.stockQuantity, 0);
    return {
        totalProducts,
        availableProducts,
        totalValue,
        lowStockCount: lowStockProducts.length,
        lowStockProducts: lowStockProducts.map((p)=>({
                id: p.id,
                name: p.name,
                stock: p.stockQuantity
            }))
    };
}
async function getDailyReport(date = "today") {
    let targetDate;
    if (date === "today") {
        targetDate = new Date();
    } else if (date === "yesterday") {
        targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - 1);
    } else {
        targetDate = new Date(date);
    }
    targetDate.setHours(0, 0, 0, 0);
    const report = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].dailyReport.findUnique({
        where: {
            date: targetDate
        }
    });
    if (!report) {
        return null;
    }
    return {
        date: report.date.toDateString(),
        orders: report.orders,
        revenue: report.revenue,
        visitors: report.uniqueVisitors,
        pageViews: report.pageViews,
        conversionRate: report.overallConversionRate,
        topProducts: JSON.parse(report.topViewedProducts || "[]"),
        lowStockAlerts: JSON.parse(report.lowStockAlerts || "[]")
    };
}
async function searchProducts(query, status = "all", limit = 10) {
    const where = {
        OR: [
            {
                name: {
                    contains: query,
                    mode: "insensitive"
                }
            },
            {
                category: {
                    contains: query,
                    mode: "insensitive"
                }
            }
        ]
    };
    if (status !== "all") {
        where.status = status;
    }
    const products = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findMany({
        where,
        select: {
            id: true,
            name: true,
            category: true,
            status: true,
            sellingPrice: true,
            stockQuantity: true
        },
        take: limit
    });
    return products;
}
async function getTrendingProducts(limit = 5) {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    const popularProducts = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.groupBy({
        by: [
            "productId"
        ],
        where: {
            type: "product_view",
            createdAt: {
                gte: sixHoursAgo
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
        take: limit
    });
    const products = await Promise.all(popularProducts.map(async (item)=>{
        const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
            where: {
                id: item.productId
            },
            select: {
                id: true,
                name: true,
                sellingPrice: true
            }
        });
        return {
            id: product?.id || item.productId,
            name: product?.name || "Unknown Product",
            views: item._count.productId,
            price: product?.sellingPrice || 0
        };
    }));
    return products;
}
async function getRecentOrders(days = 1, limit = 10) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    const orders = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
        where: {
            createdAt: {
                gte: startDate
            },
            status: {
                not: "CANCELLED"
            }
        },
        select: {
            id: true,
            customerName: true,
            totalAmount: true,
            status: true,
            createdAt: true
        },
        orderBy: {
            createdAt: "desc"
        },
        take: limit
    });
    return orders;
}
async function getSalesComparison(period1, period2) {
    // Helper to get date range
    const getDateRange = (period)=>{
        const end = new Date();
        const start = new Date();
        switch(period){
            case "today":
                start.setHours(0, 0, 0, 0);
                break;
            case "yesterday":
                start.setDate(start.getDate() - 1);
                start.setHours(0, 0, 0, 0);
                end.setDate(end.getDate() - 1);
                end.setHours(23, 59, 59, 999);
                break;
            case "week":
                start.setDate(start.getDate() - 7);
                break;
            case "last_week":
                start.setDate(start.getDate() - 14);
                end.setDate(end.getDate() - 7);
                break;
            case "month":
                start.setDate(start.getDate() - 30);
                break;
            case "last_month":
                start.setDate(start.getDate() - 60);
                end.setDate(end.getDate() - 30);
                break;
        }
        return {
            start,
            end
        };
    };
    const range1 = getDateRange(period1);
    const range2 = getDateRange(period2);
    const [data1, data2] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
            where: {
                createdAt: {
                    gte: range1.start,
                    lte: range1.end
                },
                status: {
                    not: "CANCELLED"
                }
            },
            select: {
                totalAmount: true
            }
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].order.findMany({
            where: {
                createdAt: {
                    gte: range2.start,
                    lte: range2.end
                },
                status: {
                    not: "CANCELLED"
                }
            },
            select: {
                totalAmount: true
            }
        })
    ]);
    const stats1 = {
        orders: data1.length,
        revenue: data1.reduce((sum, o)=>sum + o.totalAmount, 0)
    };
    const stats2 = {
        orders: data2.length,
        revenue: data2.reduce((sum, o)=>sum + o.totalAmount, 0)
    };
    const revenueChange = stats2.revenue > 0 ? ((stats1.revenue - stats2.revenue) / stats2.revenue * 100).toFixed(1) : 0;
    return {
        period1: {
            ...stats1,
            period: period1
        },
        period2: {
            ...stats2,
            period: period2
        },
        revenueChange: parseFloat(revenueChange)
    };
}
}),
"[project]/src/app/api/ai/chat/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$openrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai/openrouter.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai/tools.ts [app-route] (ecmascript)");
;
;
;
;
;
async function POST(request) {
    console.log("[AI CHAT] Received request");
    try {
        // Check authentication
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
        console.log("[AI CHAT] Session check:", session ? "Authenticated" : "Not authenticated");
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const body = await request.json();
        const { message, history = [] } = body;
        if (!message) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Message is required"
            }, {
                status: 400
            });
        }
        // Prepare messages
        const messages = [
            ...history,
            {
                role: "user",
                content: message
            }
        ];
        // Call OpenRouter with tools
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$openrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["callOpenRouter"])(messages, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AI_TOOLS"]);
        const assistantMessage = response.choices[0]?.message;
        // Check if AI wants to use tools
        if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
            const toolResults = [];
            // Execute each tool call
            for (const toolCall of assistantMessage.tool_calls){
                const functionName = toolCall.function.name;
                const args = JSON.parse(toolCall.function.arguments);
                let result;
                try {
                    switch(functionName){
                        case "get_live_stats":
                            result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLiveStats"])();
                            break;
                        case "get_inventory_summary":
                            result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getInventorySummary"])(args.includeLowStock);
                            break;
                        case "get_daily_report":
                            result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getDailyReport"])(args.date);
                            break;
                        case "search_products":
                            result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchProducts"])(args.query, args.status, args.limit);
                            break;
                        case "get_trending_products":
                            result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTrendingProducts"])(args.limit);
                            break;
                        case "get_recent_orders":
                            result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRecentOrders"])(args.days, args.limit);
                            break;
                        case "get_sales_comparison":
                            result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSalesComparison"])(args.period1, args.period2);
                            break;
                        default:
                            result = {
                                error: "Unknown tool"
                            };
                    }
                } catch (error) {
                    console.error(`Tool ${functionName} error:`, error);
                    result = {
                        error: "Failed to execute tool"
                    };
                }
                toolResults.push({
                    tool_call_id: toolCall.id,
                    role: "tool",
                    name: functionName,
                    content: JSON.stringify(result)
                });
            }
            // Add tool results to messages and get final response
            const toolMessages = [
                {
                    role: "assistant",
                    content: assistantMessage.content || "",
                    tool_calls: assistantMessage.tool_calls
                },
                ...toolResults.map((r)=>({
                        role: "tool",
                        content: r.content,
                        tool_call_id: r.tool_call_id
                    }))
            ];
            const finalResponse = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$openrouter$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["callOpenRouter"])([
                ...messages,
                ...toolMessages
            ], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$tools$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AI_TOOLS"]);
            const finalMessage = finalResponse.choices[0]?.message;
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                data: {
                    message: finalMessage?.content || "I apologize, but I couldn't process that request.",
                    toolsUsed: toolResults.map((t)=>t.name)
                },
                meta: {
                    tokensUsed: finalResponse.usage?.total_tokens
                }
            });
        }
        // No tools used, return direct response
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                message: assistantMessage?.content || "I apologize, but I couldn't process that request.",
                toolsUsed: []
            },
            meta: {
                tokensUsed: response.usage?.total_tokens
            }
        });
    } catch (error) {
        console.error("AI chat error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to process chat message",
            details: error instanceof Error ? error.message : String(error)
        }, {
            status: 500
        });
    }
}
async function GET(request) {
    console.log("[AI SUGGESTIONS] Received request");
    try {
        // Check authentication
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSession"])();
        console.log("[AI SUGGESTIONS] Session check:", session ? "Authenticated" : "Not authenticated");
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const suggestions = [
            {
                category: "Sales",
                queries: [
                    "How many orders today?",
                    "What was yesterday's revenue?",
                    "Compare this week vs last week",
                    "Show me recent orders"
                ]
            },
            {
                category: "Inventory",
                queries: [
                    "What's low in stock?",
                    "How many products available?",
                    "What's the total inventory value?",
                    "Search for iPhone products"
                ]
            },
            {
                category: "Insights",
                queries: [
                    "What products are trending?",
                    "How's my conversion rate?",
                    "Show today's stats",
                    "What's my best selling product?"
                ]
            }
        ];
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: suggestions
        });
    } catch (error) {
        console.error("Get suggestions error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to get suggestions"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__25f23912._.js.map