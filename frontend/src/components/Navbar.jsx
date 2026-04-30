import { useState } from "react"
import { Link } from "react-router-dom"
import { FaShoppingCart } from "react-icons/fa"
import Modal from "./Modal"
import ShoppingCart from "./ShoppingCart"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/">
          <h1 className="text-2xl font-bold tracking-wider text-cyan-400 bg-blue-400">
            Runova
          </h1>
        </Link>

        <button onClick={() => setCartOpen(true)}>
          <FaShoppingCart />
        </button>

        <Modal open={cartOpen} onClose={() => setCartOpen(false)}>
          <ShoppingCart />
        </Modal>
      </div>
    </header>
  )
}
