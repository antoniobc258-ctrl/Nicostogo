export default function Lightbox({ open, src, alt, onClose }) {
  if (!open) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <img src={src} alt={alt || ""} className="max-h-[85vh] max-w-[90vw] rounded-xl shadow-2xl" />
    </div>
  );
}