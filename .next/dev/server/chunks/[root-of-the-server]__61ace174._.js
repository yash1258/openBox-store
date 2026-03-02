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
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/cart.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addToCart",
    ()=>addToCart,
    "clearCart",
    ()=>clearCart,
    "getCart",
    ()=>getCart,
    "removeFromCart",
    ()=>removeFromCart,
    "updateCartItem",
    ()=>updateCartItem
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
const CART_COOKIE = "cart_session";
const CART_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
async function getOrCreateCartSession() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    let sessionId = cookieStore.get(CART_COOKIE)?.value;
    if (!sessionId) {
        sessionId = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomUUID();
        cookieStore.set(CART_COOKIE, sessionId, {
            httpOnly: true,
            secure: ("TURBOPACK compile-time value", "development") === "production",
            sameSite: "lax",
            maxAge: CART_DURATION,
            path: "/"
        });
    }
    return sessionId;
}
async function getCart() {
    const sessionId = await getOrCreateCartSession();
    const cart = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cart.findUnique({
        where: {
            sessionId
        },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            name: true,
                            sellingPrice: true,
                            images: true,
                            status: true
                        }
                    }
                }
            }
        }
    });
    if (!cart) {
        return {
            id: sessionId,
            items: [],
            total: 0,
            itemCount: 0
        };
    }
    const items = cart.items.filter((item)=>item.product.status === "available").map((item)=>({
            id: item.id,
            productId: item.productId,
            name: item.product.name,
            sellingPrice: item.product.sellingPrice,
            quantity: item.quantity,
            images: JSON.parse(item.product.images || "[]")
        }));
    const total = items.reduce((sum, item)=>sum + item.sellingPrice * item.quantity, 0);
    const itemCount = items.reduce((sum, item)=>sum + item.quantity, 0);
    return {
        id: cart.id,
        items,
        total,
        itemCount
    };
}
async function addToCart(productId, quantity = 1) {
    const sessionId = await getOrCreateCartSession();
    // Check product availability
    const product = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].product.findUnique({
        where: {
            id: productId
        }
    });
    if (!product || product.status !== "available") {
        throw new Error("Product not available");
    }
    // Get or create cart
    let cart = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cart.findUnique({
        where: {
            sessionId
        }
    });
    if (!cart) {
        cart = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cart.create({
            data: {
                sessionId
            }
        });
    }
    // Check if item already exists
    const existingItem = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId
        }
    });
    if (existingItem) {
        // Update quantity
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cartItem.update({
            where: {
                id: existingItem.id
            },
            data: {
                quantity: existingItem.quantity + quantity
            }
        });
    } else {
        // Create new item
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity
            }
        });
    }
    return getCart();
}
async function updateCartItem(itemId, quantity) {
    const sessionId = await getOrCreateCartSession();
    const cart = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cart.findUnique({
        where: {
            sessionId
        }
    });
    if (!cart) {
        throw new Error("Cart not found");
    }
    if (quantity <= 0) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cartItem.delete({
            where: {
                id: itemId
            }
        });
    } else {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cartItem.update({
            where: {
                id: itemId
            },
            data: {
                quantity
            }
        });
    }
    return getCart();
}
async function removeFromCart(itemId) {
    const sessionId = await getOrCreateCartSession();
    const cart = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cart.findUnique({
        where: {
            sessionId
        }
    });
    if (!cart) {
        throw new Error("Cart not found");
    }
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cartItem.delete({
        where: {
            id: itemId
        }
    });
    return getCart();
}
async function clearCart() {
    const sessionId = await getOrCreateCartSession();
    const cart = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cart.findUnique({
        where: {
            sessionId
        }
    });
    if (cart) {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].cartItem.deleteMany({
            where: {
                cartId: cart.id
            }
        });
    }
}
}),
"[project]/src/lib/api-auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "errorResponse",
    ()=>errorResponse,
    "requireApiKey",
    ()=>requireApiKey,
    "successResponse",
    ()=>successResponse,
    "verifyApiKey",
    ()=>verifyApiKey
]);
// API Key Authentication Utilities
// Uses X-API-Key header for authentication
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
;
const API_KEY_HEADER = "x-api-key";
const DEV_API_KEY = process.env.DEV_API_KEY || "";
async function verifyApiKey(request) {
    const apiKey = request.headers.get(API_KEY_HEADER);
    // Block dev key in production if not explicitly set
    if ("TURBOPACK compile-time falsy", 0) {
    // Dev key is disabled in production
    } else if (DEV_API_KEY && apiKey === DEV_API_KEY) {
        return {
            valid: true
        };
    }
    // Check against stored API keys in database
    const settings = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].settings.findFirst();
    const apiKeysJson = settings?.apiKeys || "[]";
    const validKeys = typeof apiKeysJson === "string" ? JSON.parse(apiKeysJson) : apiKeysJson;
    if (!apiKey) {
        return {
            valid: false,
            error: "Missing API key. Include 'X-API-Key' header."
        };
    }
    if (!validKeys.includes(apiKey)) {
        return {
            valid: false,
            error: "Invalid API key"
        };
    }
    return {
        valid: true
    };
}
async function requireApiKey(request) {
    const { valid, error } = await verifyApiKey(request);
    if (!valid) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error,
            code: "UNAUTHORIZED"
        }, {
            status: 401
        });
    }
    return null;
}
function successResponse(data, meta) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: true,
        data,
        ...meta && {
            meta
        }
    });
}
function errorResponse(message, code, status = 400) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        error: message,
        code
    }, {
        status
    });
}
}),
"[project]/src/app/api/cart/[itemId]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cart$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/cart.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api-auth.ts [app-route] (ecmascript)");
;
;
async function PUT(request, { params }) {
    try {
        const { itemId } = await params;
        const body = await request.json();
        const { quantity } = body;
        if (typeof quantity !== 'number' || quantity < 0) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])("Invalid quantity", "VALIDATION_ERROR", 400);
        }
        const cart = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cart$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateCartItem"])(itemId, quantity);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])(cart);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to update cart";
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])(message, "CART_ERROR", 400);
    }
}
async function DELETE(request, { params }) {
    try {
        const { itemId } = await params;
        const cart = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$cart$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["removeFromCart"])(itemId);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["successResponse"])(cart);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to remove from cart";
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2d$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["errorResponse"])(message, "CART_ERROR", 400);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__61ace174._.js.map