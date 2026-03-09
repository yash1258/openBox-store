import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import { formatPrice } from '@/lib/email'

interface OrderItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface OrderConfirmationEmailProps {
  customerName: string
  orderId: string
  orderDate: string
  items: OrderItem[]
  totalAmount: number
  shippingAddress: string
  shopName?: string
  shopWhatsapp?: string
}

export const OrderConfirmationEmail: React.FC<OrderConfirmationEmailProps> = ({
  customerName,
  orderId,
  orderDate,
  items,
  totalAmount,
  shippingAddress,
  shopName = 'OpenBox Store',
  shopWhatsapp,
}) => {
  const previewText = `Your order ${orderId} has been confirmed!`

  return (
    <html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Order Confirmed! 🎉</Heading>
          
          <Text style={text}>
            Hi {customerName},<br />
            Thank you for your order from {shopName}. We're preparing your items for shipment.
          </Text>

          <Section style={orderInfo}>
            <Text style={orderInfoLabel}>Order ID: </Text>
            <Text style={orderInfoValue}>{orderId}</Text>
            <Text style={orderInfoLabel}>Order Date: </Text>
            <Text style={orderInfoValue}>{orderDate}</Text>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>Order Summary</Heading>

          <Section style={itemsTable}>
            {items.map((item) => (
              <Row key={item.id} style={itemRow}>
                <Column style={itemName}>
                  {item.productName}
                  <Text style={itemQuantity}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={itemPrice}>{formatPrice(item.totalPrice)}</Column>
              </Row>
            ))}
          </Section>

          <Hr style={hr} />

          <Section style={totalSection}>
            <Row>
              <Column style={totalLabel}>Total Amount:</Column>
              <Column style={totalValue}>{formatPrice(totalAmount)}</Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>Shipping Address</Heading>
          <Text style={address}>{shippingAddress}</Text>

          <Section style={ctaSection}>
            <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}`}>
              Track Your Order
            </Button>
          </Section>

          {shopWhatsapp && (
            <Section style={whatsappSection}>
              <Text style={text}>
                Have questions?{' '}
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
            If you didn't place this order, please ignore this email.
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
  padding: '40px 20px',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: '600',
  margin: '30px 0 15px',
}

const text = {
  color: '#4a4a4a',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 20px',
}

const orderInfo = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '6px',
  margin: '20px 0',
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
  margin: '30px 0',
}

const itemsTable = {
  margin: '20px 0',
}

const itemRow = {
  borderBottom: '1px solid #e6e6e6',
  padding: '15px 0',
}

const itemName = {
  width: '70%',
}

const itemQuantity = {
  color: '#666666',
  fontSize: '14px',
  margin: '4px 0 0',
}

const itemPrice = {
  width: '30%',
  textAlign: 'right' as const,
  fontWeight: '600',
}

const totalSection = {
  backgroundColor: '#f8f9fa',
  padding: '20px',
  borderRadius: '6px',
  margin: '20px 0',
}

const totalLabel = {
  fontSize: '18px',
  fontWeight: '600',
}

const totalValue = {
  fontSize: '18px',
  fontWeight: 'bold',
  textAlign: 'right' as const,
  color: '#1a1a1a',
}

const address = {
  color: '#4a4a4a',
  fontSize: '14px',
  lineHeight: '22px',
  whiteSpace: 'pre-wrap' as const,
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '40px 0',
}

const button = {
  backgroundColor: '#0ea5e9',
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
  margin: '30px 0',
}

const link = {
  color: '#0ea5e9',
  textDecoration: 'underline',
}

const footer = {
  color: '#888888',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '30px 0 0',
}

export default OrderConfirmationEmail
