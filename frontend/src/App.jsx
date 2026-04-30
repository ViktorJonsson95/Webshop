import "./App.css"
import Startpage from "./pages/Startpage"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Navbar from "./components/Navbar"
import ProductPage from "./pages/ProductPage"
import AdminPage from "./pages/AdminPage"
import CheckoutPage from "./pages/CheckoutPage"
import ShoppingCart from "./components/ShoppingCart"

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Startpage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/kundvagn" element={<ShoppingCart />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
