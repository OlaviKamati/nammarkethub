import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Sell from './pages/Sell'
import ProductDetail from './pages/ProductDetail'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  )
}

export default App
