// src/components/MenuSections.jsx
import { memo, useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";

function MenuSections({ categorias = [], activeIndex = 0, onView, onOpenOptions }) {
  const wrapRef = useRef(null);
  const [q, setQ] = useState("");

  const safeIndex = useMemo(() => {
    if (!categorias.length) return 0;
    if (activeIndex < 0) return 0;
    if (activeIndex >= categorias.length) return categorias.length - 1;
    return activeIndex;
  }, [categorias, activeIndex]);

  const activeCat = categorias.length ? categorias[safeIndex] : null;

  const productosFiltrados = useMemo(() => {
    if (!activeCat) return [];
    const term = q.trim().toLowerCase();
    if (!term) return activeCat.productos || [];
    return (activeCat.productos || []).filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        (p.desc && p.desc.toLowerCase().includes(term))
    );
  }, [q, activeCat]);

  useEffect(() => {
    setQ("");
    if (wrapRef.current) {
      window.scrollTo({ top: wrapRef.current.offsetTop - 12, behavior: "smooth" });
    }
  }, [safeIndex]);

  if (!categorias.length) {
    return (
      <main className="max-w-6xl mx-auto px-3 py-6">
        <div className="text-sm text-gray-500 bg-white border border-black/5 rounded-xl p-4">
          No hay categorías para mostrar. Revisa que estés pasando <code>categorias</code> desde <b>App.jsx</b>.
        </div>
      </main>
    );
  }

  return (
  <main ref={wrapRef} className="min-w-0 px-0 py-1 max-[400px]:py-2">
      {/* Header de categoría */}
      <div className="flex flex-col gap-2 max-[400px]:gap-1.5 mb-4 max-[400px]:mb-3">
        <div className="flex items-center gap-2 max-[400px]:gap-1.5">
          <span className="inline-flex items-center justify-center rounded-full bg-white border border-black/10 w-7 h-7 max-[400px]:w-6 max-[400px]:h-6 max-[400px]:text-sm">
            {activeCat?.icon || "🍕"}
          </span>
          <h2 className="text-xl max-[400px]:text-lg max-[360px]:text-base font-semibold text-nicos-dark">
            {activeCat?.nombre}
          </h2>
          <span className="text-xs max-[400px]:text-[10px] px-2 max-[400px]:px-1.5 py-0.5 rounded-full bg-black/5 ml-1">
            {(activeCat?.productos?.length ?? 0)} items
          </span>
        </div>
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Buscar en ${activeCat?.nombre ?? "categoría"}…`}
            className="w-full rounded-xl max-[400px]:rounded-lg border border-black/10 bg-white px-3 py-2 max-[400px]:px-2 max-[400px]:py-1.5 pr-9 max-[400px]:pr-8 max-[400px]:text-sm outline-none focus:ring-2 focus:ring-nicos-accent/40"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50">🔍</span>
        </div>
      </div>

      {/* Productos */}
      {productosFiltrados.length === 0 ? (
        <div className="text-sm text-gray-500 bg-white/70 border border-black/5 rounded-xl p-4">
          {q ? <>No encontramos resultados para <b>{q}</b>.</> : "Sin productos en esta categoría."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-[400px]:gap-1.5">
          {productosFiltrados.map((prod, index) => (
            <ProductCard
              key={prod.nombre}
              prod={{
                ...prod,
                eager: index === 0, // 👈 el primero visible se carga eager
              }}
              onView={onView}
              onAddClick={() => onOpenOptions(prod)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default memo(MenuSections);
