import { prisma } from "@/lib/prisma";
import { clearCart, getCart } from "./cart";

export interface OrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: OrderItemInput[];
  paymentMethod: 'cod' | 'upi' | 'card';
  sellerId: string;
}

export async function createOrder(input: CreateOrderInput) {
  const { customerName, customerEmail, customerPhone, address, items, paymentMethod, sellerId } = input;

  // Validate all products exist and are available
  const products = await prisma.product.findMany({
    where: {
      id: { in: items.map(item => item.productId) },
      status: 'available',
    },
  });

  if (products.length !== items.length) {
    throw new Error('Some products are not available');
  }

  // Calculate totals
  let totalAmount = 0;
  const orderItems = items.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    
    const itemTotal = product.sellingPrice * item.quantity;
    totalAmount += itemTotal;

    return {
      productId: item.productId,
      productName: product.name,
      quantity: item.quantity,
      unitPrice: product.sellingPrice,
      totalPrice: itemTotal,
    };
  });

  // Create order in transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const newOrder = await tx.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        address,
        subtotal: totalAmount,
        discountAmount: 0,
        totalAmount,
        paymentMethod,
        sellerId,
        status: 'PENDING',
        paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PENDING',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Update product stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: { decrement: item.quantity },
          status: item.quantity >= 1 ? 'reserved' : undefined,
        },
      });
    }

    return newOrder;
  });

  // Clear cart after successful order
  await clearCart();

  return order;
}

export async function getOrdersBySeller(sellerId: string, filters?: {
  status?: string;
  paymentStatus?: string;
  page?: number;
  limit?: number;
}) {
  const { status, paymentStatus, page = 1, limit = 20 } = filters || {};

  const where: any = { sellerId };
  if (status) where.status = status;
  if (paymentStatus) where.paymentStatus = paymentStatus;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            unitPrice: true,
            totalPrice: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page, limit };
}

export async function getOrderById(orderId: string, sellerId: string) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      sellerId,
    },
    include: {
      items: true,
    },
  });

  return order;
}

export async function updateOrderStatus(
  orderId: string, 
  sellerId: string, 
  status: string
) {
  const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid status');
  }

  const order = await prisma.order.updateMany({
    where: {
      id: orderId,
      sellerId,
    },
    data: { status },
  });

  return order;
}

export async function updatePaymentStatus(
  orderId: string, 
  sellerId: string, 
  paymentStatus: string
) {
  const validStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
  
  if (!validStatuses.includes(paymentStatus)) {
    throw new Error('Invalid payment status');
  }

  const order = await prisma.order.updateMany({
    where: {
      id: orderId,
      sellerId,
    },
    data: { paymentStatus },
  });

  return order;
}

export async function getOrderStats(sellerId: string) {
  const [
    totalOrders,
    pendingOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
  ] = await Promise.all([
    prisma.order.count({ where: { sellerId } }),
    prisma.order.count({ where: { sellerId, status: 'PENDING' } }),
    prisma.order.count({ where: { sellerId, status: 'CONFIRMED' } }),
    prisma.order.count({ where: { sellerId, status: 'SHIPPED' } }),
    prisma.order.count({ where: { sellerId, status: 'DELIVERED' } }),
    prisma.order.count({ where: { sellerId, status: 'CANCELLED' } }),
    prisma.order.aggregate({
      where: { sellerId, paymentStatus: 'PAID' },
      _sum: { totalAmount: true },
    }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue: totalRevenue._sum.totalAmount || 0,
  };
}
