import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export interface EmailOptions {
  to: string | string[]
  subject: string
  react?: React.ReactNode
  html?: string
  text?: string
  from?: string
}

export async function sendEmail(options: EmailOptions) {
  const { to, subject, react, html, text, from } = options

  // Don't send emails in development if no API key is set
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email] Would send email:', { to, subject })
    return { id: 'mock-email-id', success: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: from || process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: Array.isArray(to) ? to : [to],
      subject,
      react,
      html,
      text,
    })

    if (error) {
      console.error('Email sending error:', error)
      throw error
    }

    return { id: data?.id, success: true }
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

// Helper to format price
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
