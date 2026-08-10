import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Sell from './pages/Sell'
import ProductDetail from './pages/ProductDetail'
import ShopDetail from './pages/ShopDetail'
import Cart from './pages/Cart'
import Account from './pages/Account'
import Chatbot from './components/Chatbot'
import CompareTray from './components/CompareTray'
import { CartProvider } from './context/CartContext'
import { CurrencyProvider } from './context/CurrencyContext'
import { CompareProvider } from './context/CompareContext'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
      <CurrencyProvider>
      <CartProvider>
      <CompareProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sell" element={<Sell />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<Account />} />
        </Routes>
        <Chatbot />
        <CompareTray />
      </CompareProvider>
      </CartProvider>
      </CurrencyProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
