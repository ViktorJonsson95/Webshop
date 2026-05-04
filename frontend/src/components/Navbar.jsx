import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaShoppingCart } from "react-icons/fa"
import Modal from "./Modal"
import ShoppingCart from "./ShoppingCart"
import { useEffect } from "react"

export default function Navbar() {
  const location = useLocation()
  const [cartOpen, setCartOpen] = useState(false)
  const isCheckout = location.pathname === "/checkout"

  useEffect(() => {
    setCartOpen(false)
  }, [location.pathname])

  return (
    <header className="bg-blue-100 text-black border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/">
          <h1 className="text-2xl font-bold tracking-wider">
            Runova
          </h1>
        </Link>

        {!isCheckout && (<button onClick={() => setCartOpen(true)}>
          <FaShoppingCart />
        </button>)}


        <Modal open={cartOpen} onClose={() => setCartOpen(false)}>
          <ShoppingCart />
        </Modal>
      </div>
    </header>
  )
}
