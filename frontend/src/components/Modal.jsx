// importerar useEffect för att kunna lyssna på events (t.ex. ESC-tangent)
import { useEffect } from "react"

// Modal-komponent som visar en drawer från höger
// open = om modalen ska visas
// onClose = funktion för att stänga modalen
// children = innehållet (t.ex. ShoppingCart)
export default function Modal({ open, onClose, children }) {

  // Lyssnar efter ESC för att stänga modalen
  useEffect(() => {
    // Om användaren trycker ESC → stäng modalen
    const handleEsc = (e) => e.key === "Escape" && onClose()

    // Lägg bara till event listener när modalen är öppen
    if (open) window.addEventListener("keydown", handleEsc)

    // Cleanup: ta bort event listener när komponenten uppdateras/avmonteras
    return () => window.removeEventListener("keydown", handleEsc)
  }, [open, onClose])

  // Om modalen inte ska visas → rendera inget
  if (!open) return null

  return (
    // Wrapper som täcker hela skärmen
    <div className="fixed inset-0 z-50">

      {/* Overlay (bakgrund) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        // Klick på overlay → stäng modalen
        onClick={onClose}
      />

      {/* Drawer (själva kundvagnen) */}
      <div
        className="
          absolute right-0 top-0 
          h-full w-full max-w-sm   // full bredd på mobil, begränsad på större skärmar
          bg-blue-100             // samma färg som navbar
          text-slate-900 
          p-4 
          shadow-xl 
          overflow-y-auto         // gör att man kan scrolla om innehållet är långt
        "
        // Stoppar klick inuti drawern från att stänga modalen
        onClick={(e) => e.stopPropagation()}
      >

        {/* Stäng-knapp */}
        <button
          onClick={onClose}
          className="mb-4 text-lg"
        >
          ✕
        </button>

        {/* Här renderas innehållet (t.ex. ShoppingCart) */}
        {children}

      </div>
    </div>
  )
}