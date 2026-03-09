import { sendEmail } from '@/lib/email'
import { OrderConfirmationEmail, OrderStatusUpdateEmail } from '@/lib/email/templates'
import { prisma } from '@/lib/prisma'

interface SendOrderConfirmationParams {
  orderId: string
  customerEmail: string
  customerName: string
}

export async function sendOrderConfirmationEmail({
  orderId,
  customerEmail,
  customerName,
}: SendOrderConfirmationParams) {
  try {
    // Fetch order details with items
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        seller: {
          select: {
            shopName: true,
            whatsapp: true,
          },
        },
      },
    })

    if (!order) {
      throw new Error('Order not found')
    }

    const orderItems = order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }))

    await sendEmail({
      to: customerEmail,
      subject: `Order Confirmed - ${orderId}`,
      react: OrderConfirmationEmail({
        customerName,
        orderId,
        orderDate: order.createdAt.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        items: orderItems,
        totalAmount: order.totalAmount,
        shippingAddress: order.address,
        shopName: order.seller.shopName || 'OpenBox Store',
        shopWhatsapp: order.seller.whatsapp || undefined,
      }) as React.ReactNode,
    })

    console.log(`[Email] Order confirmation sent to ${customerEmail}`)
  } catch (error) {
    console.error('[Email] Failed to send order confirmation:', error)
    // Don't throw - email failures shouldn't break order flow
  }
}

interface SendOrderStatusUpdateParams {
  orderId: string
  customerEmail: string
  customerName: string
  previousStatus: string
}

export async function sendOrderStatusUpdateEmail({
  orderId,
  customerEmail,
  customerName,
  previousStatus,
}: SendOrderStatusUpdateParams) {
  try {
    // Fetch order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        seller: {
          select: {
            shopName: true,
            whatsapp: true,
          },
        },
      },
    })

    if (!order) {
      throw new Error('Order not found')
    }

    await sendEmail({
      to: customerEmail,
      subject: `Order ${order.status} - ${orderId}`,
      react: OrderStatusUpdateEmail({
        customerName,
        orderId,
        orderDate: order.createdAt.toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        status: order.status as 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
        previousStatus,
        totalAmount: order.totalAmount,
        shopName: order.seller.shopName || 'OpenBox Store',
        shopWhatsapp: order.seller.whatsapp || undefined,
      }) as React.ReactNode,
    })

    console.log(`[Email] Status update sent to ${customerEmail}`)
  } catch (error) {
    console.error('[Email] Failed to send status update:', error)
    // Don't throw - email failures shouldn't break order flow
  }
}
