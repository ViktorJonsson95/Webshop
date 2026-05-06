import { useEffect } from "react"

export default function Modal({ open, onClose, children }) {
  // ESC stänger
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose()
    if (open) window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="absolute right-0 top-0 h-full w-full max-w-sm bg-blue-100 text-slate-900 p-4 shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="mb-4 text-lg">
          ✕
        </button>

        {children}
      </div>
    </div>
  )
}