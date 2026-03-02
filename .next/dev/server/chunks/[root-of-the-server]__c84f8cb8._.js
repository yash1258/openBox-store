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
"[project]/src/app/api/analytics/track/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
;
// Valid event types
const VALID_EVENT_TYPES = [
    "page_view",
    "product_view",
    "cart_add",
    "cart_remove",
    "cart_abandon",
    "search",
    "checkout_start",
    "checkout_complete",
    "order_complete",
    "product_click",
    "filter_use"
];
// Generate or get session ID from cookie
function getSessionId(request) {
    const sessionCookie = request.cookies.get("analytics_session");
    if (sessionCookie) {
        return sessionCookie.value;
    }
    // Generate new session ID
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
async function POST(request) {
    try {
        const body = await request.json();
        // Validate event type
        if (!VALID_EVENT_TYPES.includes(body.type)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Invalid event type"
            }, {
                status: 400
            });
        }
        // Get or create session ID
        const sessionId = getSessionId(request);
        // Create event
        const event = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.create({
            data: {
                type: body.type,
                sessionId,
                productId: body.productId || null,
                metadata: JSON.stringify(body.metadata || {})
            }
        });
        // Update product stats if it's a product-related event
        if (body.productId && [
            "product_view",
            "cart_add"
        ].includes(body.type)) {
            await updateProductStats(body.productId, body.type);
        }
        // Create cart event if cart-related
        if ([
            "cart_add",
            "cart_remove",
            "cart_abandon"
        ].includes(body.type)) {
            await createCartEvent(body, sessionId);
        }
        // Set session cookie if new
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: {
                eventId: event.id
            }
        });
        // Set session cookie (30 days)
        response.cookies.set("analytics_session", sessionId, {
            maxAge: 30 * 24 * 60 * 60,
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === "production",
            sameSite: "lax"
        });
        return response;
    } catch (error) {
        console.error("Analytics tracking error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to track event"
        }, {
            status: 500
        });
    }
}
// Update product statistics
async function updateProductStats(productId, eventType) {
    try {
        // Use upsert to handle race conditions (atomic operation)
        const isView = eventType === "product_view";
        const isCartAdd = eventType === "cart_add";
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].productStats.upsert({
            where: {
                productId
            },
            create: {
                productId,
                viewsToday: isView ? 1 : 0,
                viewsWeek: isView ? 1 : 0,
                viewsMonth: isView ? 1 : 0,
                cartAdds: isCartAdd ? 1 : 0,
                lastViewedAt: new Date()
            },
            update: {
                lastViewedAt: new Date(),
                ...isView && {
                    viewsToday: {
                        increment: 1
                    },
                    viewsWeek: {
                        increment: 1
                    },
                    viewsMonth: {
                        increment: 1
                    }
                },
                ...isCartAdd && {
                    cartAdds: {
                        increment: 1
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error updating product stats:", error);
    }
}
// Create cart event
async function createCartEvent(body, sessionId) {
    try {
        const metadata = body.metadata || {};
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cartEvent.create({
            data: {
                sessionId,
                eventType: body.type.replace("cart_", ""),
                productId: body.productId || null,
                productName: metadata.productName || null,
                quantity: metadata.quantity || 1,
                price: metadata.price || 0,
                cartValue: metadata.cartValue || 0
            }
        });
    } catch (error) {
        console.error("Error creating cart event:", error);
    }
}
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
        const type = searchParams.get("type");
        const where = type ? {
            type
        } : {};
        const events = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].analyticsEvent.findMany({
            where,
            orderBy: {
                createdAt: "desc"
            },
            take: limit
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            data: events,
            meta: {
                count: events.length
            }
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Failed to fetch events"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c84f8cb8._.js.map