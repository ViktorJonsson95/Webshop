import "./App.css"
import Startpage from "./pages/Startpage"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import TestShop from "./dev/TestShop"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import ProductPage from './pages/ProductPage';
import AdminPage from "./pages/AdminPage";
import ShoppingCart from "./components/ShoppingCart"


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
          // TODO: Diskutera med teamet om vi ska döpa om denna path till '/cart'
          // för att matcha engelska i resten av projektet
          <Route path="/kundvagn" element={<ShoppingCart />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
