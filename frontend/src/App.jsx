import "./App.css"
import Startpage from "./components/Startpage"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import TestShop from "./dev/TestShop"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"

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
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
