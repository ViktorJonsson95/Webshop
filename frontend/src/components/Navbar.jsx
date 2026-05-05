import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { FaShoppingCart } from "react-icons/fa"
import Modal from "./Modal"
import ShoppingCart from "./ShoppingCart"
import { useEffect } from "react"
import useCart from "../hooks/useCart"

export default function Navbar() {
  const location = useLocation()
  const [cartOpen, setCartOpen] = useState(false)
  const isCheckout = location.pathname === "/checkout"
  const { data: cartItems = [] } = useCart()

  //Räkna antalet produkter i cart
  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + (item.quantity ?? 1),
    0
  )
  //Om vi är i checkout så stängs navbar
  useEffect(() => {
    setCartOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-50 bg-blue-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/">
          <h1 className="text-2xl font-bold tracking-wider">
            Runova
          </h1>
        </Link>

        {!isCheckout && (
          <button onClick={() => setCartOpen(true)} className="relative">
            <FaShoppingCart />

            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                {totalQuantity}
              </span>
            )}
          </button>
        )}


        <Modal open={cartOpen} onClose={() => setCartOpen(false)}>
          <ShoppingCart />
        </Modal>
      </div>
    </header>
  )
}
