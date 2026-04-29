import "./App.css"
import Startpage from "./components/Startpage"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import ProductPage from "./components/ProductPage"
import Navbar from "./components/Navbar"

const queryClient = new QueryClient()

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />

        <nav>
          <Link to="/">Start</Link>
          <Link to="/kundvagn">Kundvagn</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Startpage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/kundvagn" element={<h2>Kundvagn</h2>} />
          <Route path="*" element={<h2>Sidan kunde inte hittas</h2>} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
