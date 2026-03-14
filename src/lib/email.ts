import { Resend } from 'resend'

// Lazy initialization - only create Resend instance when needed
let resend: Resend | null = null

function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key-for-build')
  }
  return resend
}

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

  // Don't send emails if no API key is set
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email] Would send email:', { to, subject })
    return { id: 'mock-email-id', success: true }
  }

  try {
    const { data, error } = await getResend().emails.send({
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
