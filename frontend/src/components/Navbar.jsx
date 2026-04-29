import { useState } from "react"
import { Link } from "react-router-dom"
import { FaShoppingCart } from "react-icons/fa"
import Modal from "./Modal"
import ShoppingCart from "../pages/ShoppingCart"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/">
          <h1 className="text-2xl font-bold tracking-wider text-cyan-400 bg-blue-400">
            Nexora
          </h1>
        </Link>

        <button onClick={() => setCartOpen(true)}>🛒</button>

        <Modal open={cartOpen} onClose={() => setCartOpen(false)}>
          <ShoppingCart />
        </Modal>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-slate-900 px-6 pb-6 pt-2">
          <p className="text-slate-300">Meny</p>
          <Link
            to="/kundvagn"
            className="flex items-center text-slate-300 mt-2"
          >
            <FaShoppingCart className="mr-2" />
            Kundvagn
          </Link>
          <FaShoppingCart />
        </div>
      )}
    </header>
  )
}
