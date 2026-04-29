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

        <Routes>
          <Route path="/" element={<Startpage />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
