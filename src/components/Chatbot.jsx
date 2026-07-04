import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const SYSTEM_PROMPT = `You are NamBot, the friendly AI assistant for NamMarketHub — Namibia's premier online marketplace. You help both buyers and shop owners.

Your personality: helpful, energetic, knowledgeable about Namibia, and concise. You speak like a friendly Namibian — warm but professional. Never use excessive filler words.

You can help with:
BUYERS:
- Finding products based on what they describe ("I need a laptop under N$8000")
- Answering questions about shops, products, prices, and availability
- Explaining how to place an order (click a product, fill in name + contact, shop reaches out)
- Suggesting products based on their needs

SHOP OWNERS:
- Explaining how to list a shop (go to "List your shop", sign up, fill in details)
- How to add/edit/delete products from the dashboard
- How orders work (buyer submits request, shop owner gets notified, arranges payment + pickup)
- Troubleshooting common issues

CONTEXT YOU HAVE ACCESS TO:
You will receive live data about current products and shops in the marketplace. Use this data to give specific, accurate answers. When recommending products, mention their name, price in Namibian Dollars (N$), and which shop sells them.

IMPORTANT RULES:
- Always respond in the same language the user writes in
- Keep responses concise (2-4 sentences max unless explaining something complex)
- When you mention a product, format it as: **Product Name** - N$Price (Shop Name)
- If asked about something you don't know, say so honestly
- Never make up products or prices — only reference real data provided to you
- If a user seems ready to buy, encourage them to click on the product page
- NamMarketHub currently supports: Electronics, Fashion, Food, Furniture, and General shops`

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '12px 16px', alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%', background: '#C9A84C',
          animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
        }} />
      ))}
      <style>{`@keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }`}</style>
    </div>
  )
}

function Message({ msg }) {
  const isBot = msg.role === 'assistant'
  return (
    <div style={{
      display: 'flex', gap: 8, marginBottom: 12,
      flexDirection: isBot ? 'row' : 'row-reverse',
      alignItems: 'flex-end'
    }}>
      {isBot && (
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #9A7A2E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
          🤖
        </div>
      )}
      <div style={{
        maxWidth: '78%', padding: '10px 14px', borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
        background: isBot ? '#1A1A1A' : 'linear-gradient(135deg, #C9A84C, #9A7A2E)',
        color: isBot ? '#FAFAF8' : '#0A0A0A',
        fontSize: 13, lineHeight: 1.5, border: isBot ? '1px solid #2A2A2A' : 'none',
        whiteSpace: 'pre-wrap', wordBreak: 'break-word'
      }}>
        {msg.content}
      </div>
    </div>
  )
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! 👋 I'm NamBot, your NamMarketHub assistant.\n\nI can help you find products, answer questions about shops, or guide you through listing your own shop. What can I do for you?"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [unread, setUnread] = useState(0)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  async function fetchMarketContext() {
    const [{ data: products }, { data: shops }] = await Promise.all([
      supabase
        .from('products')
        .select('id, name, price, category_id, stock_count, shops(name, location, shop_type)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50),
      supabase
        .from('shops')
        .select('name, location, shop_type, description')
        .order('created_at', { ascending: false })
        .limit(20)
    ])

    const productList = (products ?? []).map(p =>
      `- ${p.name} | N$${Number(p.price).toLocaleString()} | Category: ${p.category_id} | Stock: ${p.stock_count} | Shop: ${p.shops?.name} (${p.shops?.location})`
    ).join('\n')

    const shopList = (shops ?? []).map(s =>
      `- ${s.name} | ${s.location} | Type: ${s.shop_type}${s.description ? ` | "${s.description}"` : ''}`
    ).join('\n')

    return `\n\n--- LIVE MARKETPLACE DATA ---\nSHOPS (${shops?.length ?? 0} total):\n${shopList || 'No shops yet'}\n\nPRODUCTS (${products?.length ?? 0} total):\n${productList || 'No products yet'}\n--- END DATA ---`
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const context = await fetchMarketContext()
      const systemWithContext = SYSTEM_PROMPT + context

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            system: systemWithContext,
            messages: newMessages.map(m => ({ role: m.role, content: m.content }))
          })
        }
      )

      const data = await response.json()
      const reply = data.content?.[0]?.text ?? "Sorry, I couldn't process that. Try again!"

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (!open) setUnread(u => u + 1)
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops, something went wrong on my end. Please try again in a moment! 🙏"
      }])
    }

    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const suggestions = [
    "What phones do you have?",
    "How do I list my shop?",
    "Show me products under N$5000",
    "Which shops are in Windhoek?",
  ]

  return (
    <>
      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 20, width: 360, height: 520,
          background: '#0A0A0A', border: '1px solid #2A2A2A', borderRadius: 20,
          display: 'flex', flexDirection: 'column', zIndex: 1000,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.1)',
          animation: 'slideUpChat 0.3s cubic-bezier(0.16,1,0.3,1) both'
        }}>
          <style>{`
            @keyframes slideUpChat {
              from { opacity: 0; transform: translateY(20px) scale(0.95); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          {/* Header */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #9A7A2E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                🤖
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#FAFAF8', margin: 0 }}>NamBot</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} className="pulse-dot" />
                  <span style={{ fontSize: 11, color: '#A0A09A' }}>Online · Powered by AI</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#A0A09A', cursor: 'pointer', fontSize: 18, padding: 4 }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
            {loading && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #9A7A2E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
                <div style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '4px 16px 16px 16px' }}>
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only show at start) */}
          {messages.length === 1 && (
            <div style={{ padding: '0 12px 8px', display: 'flex', gap: 6, flexWrap: 'wrap', flexShrink: 0 }}>
              {suggestions.map((s) => (
                <button key={s} onClick={() => { setInput(s); setTimeout(() => sendMessage(), 50) }}
                  style={{ fontSize: 11, padding: '5px 10px', borderRadius: 99, border: '1px solid #2A2A2A', background: '#161616', color: '#A0A09A', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #2A2A2A', display: 'flex', gap: 8, flexShrink: 0 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything…"
              rows={1}
              style={{
                flex: 1, background: '#161616', border: '1px solid #2A2A2A', borderRadius: 12,
                color: '#FAFAF8', fontSize: 13, padding: '10px 12px', resize: 'none',
                outline: 'none', fontFamily: 'inherit', lineHeight: 1.4,
                maxHeight: 80, overflowY: 'auto'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: input.trim() && !loading ? 'linear-gradient(135deg, #C9A84C, #9A7A2E)' : '#2A2A2A',
                color: input.trim() && !loading ? '#0A0A0A' : '#555',
                fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s', flexShrink: 0, alignSelf: 'flex-end'
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Floating bubble */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 20, right: 20, width: 56, height: 56,
          borderRadius: '50%', border: 'none', cursor: 'pointer', zIndex: 1000,
          background: open ? '#2A2A2A' : 'linear-gradient(135deg, #C9A84C, #9A7A2E)',
          boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          transform: open ? 'scale(0.9)' : 'scale(1)',
        }}
      >
        {open ? '✕' : '🤖'}
        {unread > 0 && !open && (
          <span style={{
            position: 'absolute', top: -4, right: -4, background: '#ef4444',
            color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18,
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {unread}
          </span>
        )}
      </button>
    </>
  )
}
