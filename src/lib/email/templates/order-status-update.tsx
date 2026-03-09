import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import { formatPrice } from '@/lib/email'

interface OrderStatusUpdateEmailProps {
  customerName: string
  orderId: string
  orderDate: string
  status: 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  previousStatus: string
  totalAmount: number
  trackingNumber?: string
  trackingUrl?: string
  shopName?: string
  shopWhatsapp?: string
}

const statusConfig = {
  CONFIRMED: {
    title: 'Order Confirmed! ✅',
    message: 'Your order has been confirmed and is being prepared for shipment.',
    color: '#0ea5e9',
  },
  SHIPPED: {
    title: 'Order Shipped! 🚚',
    message: 'Great news! Your order has been shipped and is on its way to you.',
    color: '#f59e0b',
  },
  DELIVERED: {
    title: 'Order Delivered! 🎉',
    message: 'Your order has been delivered. We hope you enjoy your purchase!',
    color: '#10b981',
  },
  CANCELLED: {
    title: 'Order Cancelled',
    message: 'Your order has been cancelled. If you have any questions, please contact us.',
    color: '#ef4444',
  },
}

export const OrderStatusUpdateEmail: React.FC<OrderStatusUpdateEmailProps> = ({
  customerName,
  orderId,
  orderDate,
  status,
  previousStatus,
  totalAmount,
  trackingNumber,
  trackingUrl,
  shopName = 'OpenBox Store',
  shopWhatsapp,
}) => {
  const config = statusConfig[status]
  const previewText = `Your order ${orderId} is now ${status.toLowerCase()}`

  return (
    <html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{ ...statusBanner, backgroundColor: config.color }}>
            <Heading style={statusTitle}>{config.title}</Heading>
          </Section>

          <Text style={text}>
            Hi {customerName},<br />
            {config.message}
          </Text>

          <Section style={orderInfo}>
            <Text style={orderInfoLabel}>Order ID: </Text>
            <Text style={orderInfoValue}>{orderId}</Text>
            
            <Text style={orderInfoLabel}>Order Date: </Text>
            <Text style={orderInfoValue}>{orderDate}</Text>
            
            <Text style={orderInfoLabel}>Total Amount: </Text>
            <Text style={orderInfoValue}>{formatPrice(totalAmount)}</Text>
            
            <Text style={orderInfoLabel}>Status: </Text>
            <Text style={{ ...orderInfoValue, color: config.color }}>{status}</Text>
          </Section>

          {trackingNumber && (
            <>
              <Hr style={hr} />
              <Heading as="h2" style={h2}>Tracking Information</Heading>
              <Section style={trackingInfo}>
                <Text style={trackingLabel}>Tracking Number: </Text>
                <Text style={trackingValue}>{trackingNumber}</Text>
                
                {trackingUrl && (
                  <Button style={button} href={trackingUrl}>
                    Track Package
                  </Button>
                )}
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Section style={ctaSection}>
            <Button
              style={{ ...button, backgroundColor: config.color }}
              href={`${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`}
            >
              View Order Details
            </Button>
          </Section>

          {shopWhatsapp && (
            <Section style={whatsappSection}>
              <Text style={text}>
                Have questions about your order?{' '}
                <Link
                  href={`https://wa.me/${shopWhatsapp.replace(/\+/g, '')}`}
                  style={link}
                >
                  Contact us on WhatsApp
                </Link>
              </Text>
            </Section>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            This email was sent by {shopName}.<br />
            Thank you for shopping with us!
          </Text>
        </Container>
      </Body>
    </html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0 0 40px',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
}

const statusBanner = {
  padding: '30px 20px',
  textAlign: 'center' as const,
}

const statusTitle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const h2 = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: '600',
  margin: '30px 20px 15px',
}

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '20px',
}

const orderInfo = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '6px',
  margin: '20px',
}

const orderInfoLabel = {
  color: '#666666',
  fontSize: '14px',
  margin: '0 0 4px',
}

const orderInfoValue = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 16px',
}

const hr = {
  borderColor: '#e6e6e6',
  margin: '30px 20px',
}

const trackingInfo = {
  backgroundColor: '#f0f9ff',
  padding: '20px',
  borderRadius: '6px',
  margin: '0 20px 20px',
  textAlign: 'center' as const,
}

const trackingLabel = {
  color: '#666666',
  fontSize: '14px',
  margin: '0 0 8px',
}

const trackingValue = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '600',
  fontFamily: 'monospace',
  margin: '0 0 16px',
  letterSpacing: '1px',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '30px 20px',
}

const button = {
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
}

const whatsappSection = {
  textAlign: 'center' as const,
  margin: '30px 20px',
}

const link = {
  color: '#0ea5e9',
  textDecoration: 'underline',
}

const footer = {
  color: '#888888',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '30px 20px 0',
}

export default OrderStatusUpdateEmail
