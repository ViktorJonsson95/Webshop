// importerar useEffect för att kunna hantera events när komponenter renderas
import { useEffect } from "react"

// Modal komponent som tar emot props: open (boolean), onClose (funktion) och children (innehåll att visa i modalen)
export default function Modal({ open, onClose, children }) {
  // lyssna efter tangenttryckningar
  useEffect(() => {
    // trycker på ESC körs onClose funktionen
    const handleEsc = (e) => e.key === "Escape" && onClose()
    // lägg bara till event listener om madal är öppen
    if (open) window.addEventListener("keydown", handleEsc)
    // städa upp event listener när komponenten avmonteras eller när open/onClose ändras
    return () => window.removeEventListener("keydown", handleEsc)
  }, [open, onClose])
  // om modalen inte ska vara öppen visas ingeting
  if (!open) return null

  return (
    // wrapper för hela modalen
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        // klick på bakgrunden stänger modalen
        onClick={onClose}
      />

      {/* själva modal-fönstret */}
      <div
        className="absolute right-0 top-0 h-full w-80 bg-slate-900 text-white p-6 shadow-xl"
        // stoppar klick inuti modalen från att stänga den

      {/* Drawer */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-sm bg-blue-100 text-slate-900 p-4 shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="mb-4 text-lg">
          ✕
        </button>

        {/* här visas innehållet i modalen */}
        {children}
      </div>
    </div>
  )
}