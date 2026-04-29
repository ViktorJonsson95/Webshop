import { useEffect } from "react"

export default function Modal({ open, onClose, children }) {
  // ESC ska stänga
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose()
    if (open) window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="absolute right-0 top-0 h-full w-80 bg-slate-900 text-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="mb-4">
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
