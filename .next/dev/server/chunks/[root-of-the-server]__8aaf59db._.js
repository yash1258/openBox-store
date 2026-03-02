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
"[project]/src/app/api/analytics/live/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        // Get today's date range
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const now = new Date();
        // Get today's stats
        const [pageViews, uniqueVisitors, productViews, cartAdds, orders] = await Promise.all([
            // Page views today
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.count({
                where: {
                    type: "page_view",
                    createdAt: {
                        gte: startOfDay
                    }
                }
            }),
            // Unique visitors today
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
            // Product views today
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.count({
                where: {
                    type: "product_view",
                    createdAt: {
                        gte: startOfDay
                    }
                }
            }),
            // Cart adds today
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.count({
                where: {
                    type: "cart_add",
                    createdAt: {
                        gte: startOfDay
                    }
                }
            }),
            // Orders today
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
        // Get revenue
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
        // Get active carts (sessions with cart_add in last hour)
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const activeCartSessions = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.groupBy({
            by: [
                "sessionId"
            ],
            where: {
                type: "cart_add",
                createdAt: {
                    gte: oneHourAgo
                }
            }
        });
        const activeCarts = activeCartSessions.length;
        // Calculate conversion rate
        const conversionRate = pageViews > 0 ? orders / pageViews * 100 : 0;
        // Get currently popular products (last 6 hours)
        const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
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
            take: 5
        });
        const trendingProducts = await Promise.all(popularProducts.map(async (item)=>{
            const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
                where: {
                    id: item.productId
                },
                select: {
                    id: true,
                    name: true,
                    sellingPrice: true,
                    images: true
                }
            });
            return {
                id: product?.id || item.productId,
                name: product?.name || "Unknown Product",
                views: item._count.productId,
                price: product?.sellingPrice || 0,
                image: product?.images ? JSON.parse(product.images)[0] : null
            };
        }));
        // Get recent activity (last 10 events)
        const recentActivity = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.findMany({
            where: {
                createdAt: {
                    gte: oneHourAgo
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 10,
            select: {
                type: true,
                productId: true,
                createdAt: true
            }
        });
        // Format recent activity
        const formattedActivity = await Promise.all(recentActivity.map(async (event)=>{
            let description = "";
            switch(event.type){
                case "page_view":
                    description = "Page viewed";
                    break;
                case "product_view":
                    const product = event.productId ? await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
                        where: {
                            id: event.productId
                        },
                        select: {
                            name: true
                        }
                    }) : null;
                    description = product ? `Viewed ${product.name}` : "Product viewed";
                    break;
                case "cart_add":
                    description = "Added to cart";
                    break;
                case "checkout_start":
                    description = "Started checkout";
                    break;
                case "order_complete":
                    description = "Order completed";
                    break;
                default:
                    description = event.type.replace("_", " ");
            }
            return {
                type: event.type,
                description,
                time: event.createdAt
            };
        }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                today: {
                    pageViews,
                    uniqueVisitors,
                    productViews,
                    cartAdds,
                    orders,
                    revenue,
                    activeCarts,
                    conversionRate: Math.round(conversionRate * 100) / 100
                },
                trendingProducts,
                recentActivity: formattedActivity,
                lastUpdated: now.toISOString()
            }
        });
    } catch (error) {
        console.error("Live analytics error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to get live analytics"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8aaf59db._.js.map