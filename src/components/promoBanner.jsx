// src/components/PromoBanner.jsx
import { WEEKLY_PROMOS } from "../data/weeklyPromos";

export default function PromoBanner() {
  const today = new Date().getDay();

  const promos = WEEKLY_PROMOS.filter(p => {
    if (p.days) return p.days.includes(today);
    return true; // fallback
  });

  if (!promos.length) return null;

  return (
    <div className="bg-red-600 text-white py-3 px-4 text-center text-sm font-semibold">
      {promos.map((p) => (
        <div key={p.id}>
          🔥 {p.title}
        </div>
      ))}
    </div>
  );
}