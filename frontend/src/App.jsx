import "./App.css"
import Startpage from "./components/Startpage"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import TestShop from "./dev/TestShop"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import ProductPage from './components/ProductPage';
import CheckoutPage from "./components/CheckoutPage"

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <nav>
          <Link to="/">Start</Link>
          <Link to="/kundvagn">Kundvagn</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Startpage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
