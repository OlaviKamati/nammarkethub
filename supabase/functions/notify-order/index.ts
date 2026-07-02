import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    const payload = await req.json()
    const order = payload.record

    if (!order) {
      return new Response('No order data', { status: 400 })
    }

    // Create Supabase client with service role to bypass RLS
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Fetch product + shop + owner details
    const { data: product } = await supabase
      .from('products')
      .select('name, price, shops(name, owner_id, whatsapp_number)')
      .eq('id', order.product_id)
      .maybeSingle()

    if (!product || !product.shops) {
      return new Response('Product or shop not found', { status: 404 })
    }

    const shop = product.shops

    // Get shop owner's email from auth.users
    const { data: userData } = await supabase.auth.admin.getUserById(shop.owner_id)
    const ownerEmail = userData?.user?.email

    if (!ownerEmail) {
      return new Response('Owner email not found', { status: 404 })
    }

    const priceFormatted = Number(product.price).toLocaleString('en-NA', { minimumFractionDigits: 0 })

    // Send email via Resend
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NamMarketHub <orders@nammarkethub.vercel.app>',
        to: ownerEmail,
        subject: `🛍️ New order request — ${product.name}`,
        html: `
          <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; background: #0A0A0A; color: #FAFAF8; border-radius: 16px; overflow: hidden;">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1A1200, #0A0A0A); padding: 32px 32px 24px; border-bottom: 1px solid #2A2A2A;">
              <p style="font-size: 11px; color: #C9A84C; font-family: monospace; letter-spacing: 0.1em; margin: 0 0 8px;">NAMMARKETHUB</p>
              <h1 style="font-size: 22px; font-weight: 700; color: #FAFAF8; margin: 0;">New order request 🎉</h1>
            </div>

            <!-- Body -->
            <div style="padding: 28px 32px;">

              <!-- Product -->
              <div style="background: #161616; border: 1px solid #2A2A2A; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
                <p style="font-size: 11px; color: #C9A84C; font-family: monospace; letter-spacing: 0.08em; margin: 0 0 8px;">PRODUCT</p>
                <p style="font-size: 16px; font-weight: 600; color: #FAFAF8; margin: 0 0 4px;">${product.name}</p>
                <p style="font-size: 14px; color: #C9A84C; margin: 0;">N$${priceFormatted} × ${order.quantity}</p>
              </div>

              <!-- Buyer -->
              <div style="background: #161616; border: 1px solid #2A2A2A; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
                <p style="font-size: 11px; color: #C9A84C; font-family: monospace; letter-spacing: 0.08em; margin: 0 0 12px;">BUYER DETAILS</p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="font-size: 12px; color: #A0A09A; padding: 4px 0; width: 80px;">Name</td>
                    <td style="font-size: 13px; color: #FAFAF8; font-weight: 600;">${order.buyer_name}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #A0A09A; padding: 4px 0;">Contact</td>
                    <td style="font-size: 13px; color: #FAFAF8; font-weight: 600;">${order.buyer_contact}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 12px; color: #A0A09A; padding: 4px 0;">Quantity</td>
                    <td style="font-size: 13px; color: #FAFAF8; font-weight: 600;">${order.quantity}</td>
                  </tr>
                </table>
              </div>

              <!-- CTA -->
              <p style="font-size: 14px; color: #A0A09A; margin-bottom: 20px;">
                Contact the buyer as soon as possible to arrange payment and pickup.
              </p>

              ${shop.whatsapp_number ? `
              <a href="https://wa.me/${shop.whatsapp_number.replace(/\D/g, '')}?text=Hi ${encodeURIComponent(order.buyer_name)}, I'm reaching out about your order request for ${encodeURIComponent(product.name)} on NamMarketHub."
                style="display: inline-block; background: linear-gradient(135deg, #C9A84C, #9A7A2E); color: #0A0A0A; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 99px; text-decoration: none;">
                Reply via WhatsApp →
              </a>
              ` : ''}
            </div>

            <!-- Footer -->
            <div style="padding: 20px 32px; border-top: 1px solid #2A2A2A;">
              <p style="font-size: 11px; color: #555; margin: 0; font-family: monospace;">
                © ${new Date().getFullYear()} NAMMARKETHUB · MADE IN NAMIBIA 🇳🇦
              </p>
            </div>
          </div>
        `,
      }),
    })

    if (!emailRes.ok) {
      const err = await emailRes.text()
      console.error('Resend error:', err)
      return new Response(`Email failed: ${err}`, { status: 500 })
    }

    return new Response('Email sent', { status: 200 })
  } catch (err) {
    console.error('Function error:', err)
    return new Response(`Error: ${err.message}`, { status: 500 })
  }
})
