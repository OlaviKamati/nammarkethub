import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Sell from './pages/Sell'
import ProductDetail from './pages/ProductDetail'
import ShopDetail from './pages/ShopDetail'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/shop/:id" element={<ShopDetail />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  )
}

export default App
