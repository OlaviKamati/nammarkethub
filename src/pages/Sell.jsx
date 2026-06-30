import { useAuth } from '../hooks/useAuth'
import { useMyShop } from '../hooks/useMyShop'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import AuthForm from '../components/AuthForm'
import ShopForm from '../components/ShopForm'
import ShopDashboard from '../components/ShopDashboard'
import { getShopType } from '../lib/shopTypes'

export default function Sell() {
  const { user, loading: authLoading } = useAuth()
  const { shop, loading: shopLoading, refetch } = useMyShop(user?.id)

  if (authLoading || shopLoading) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center text-sm text-stone-400">Loading…</div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-stone-900 mb-1">List your shop</h1>
            <p className="text-sm text-stone-500">Reach buyers across Namibia</p>
          </div>
          <AuthForm />
        </div>
      </>
    )
  }

  if (!shop) {
    return (
      <>
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-10">
          <ShopForm userId={user.id} onCreated={refetch} />
        </div>
      </>
    )
  }

  const type = getShopType(shop.shop_type)

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Shop header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${type.color}`}>
              {type.emoji}
            </div>
            <div>
              <h1 className="text-lg font-semibold text-stone-900">{shop.name}</h1>
              <p className="text-xs text-stone-400">{shop.location} · {type.label}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="text-sm text-stone-500 hover:text-stone-700 transition-colors">
              ← Marketplace
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm border border-stone-200 rounded-full px-4 py-1.5 hover:border-stone-300 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        <ShopDashboard shop={shop} />
      </div>
    </>
  )
}
