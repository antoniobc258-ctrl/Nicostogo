// src/pages/MenuDigital.jsx
import { useState, useEffect } from "react";
import { MENU } from "../data/menu";
import { imagenesProductos } from "../data/images";

export default function MenuDigital() {
  const [active, setActive] = useState(MENU[0].nombre);
  const [selected, setSelected] = useState(null);

  const categoria = MENU.find((c) => c.nombre === active);

  // --- FIX PRECIOS (FUNCIONA PARA PIZZAS Y TODOS LOS PRODUCTOS) ---
  const getPrice = (p) => {
    if (typeof p.precio === "number") return `$${p.precio}`;

    if (Array.isArray(p.precio)) {
      const first = Array.isArray(p.precio[0]) ? p.precio[0][0] : p.precio[0];
      return `Desde $${first}`;
    }

    return "";
  };

  // --- FUNCIÓN LISTA DE PRECIOS ---
  const getPriceList = (p) => {
    const precios = p.precio;
    const tamaños = p.opciones?.tamaño;

    // Si NO hay tallas (producto normal)
    if (!Array.isArray(precios) || !tamaños) {
      if (typeof precios === "number") {
        return [{ label: "", price: precios }];
      }
      return [];
    }

    // Si es matriz como pizzas [[135,165,205,230]]
    if (Array.isArray(precios[0])) {
      return tamaños.map((t, i) => ({
        label: t,
        price: precios[0][i], // precio base
      }));
    }

    // Si es array plano [135,165,205]
    return tamaños.map((t, i) => ({
      label: t,
      price: precios[i] || precios[0],
    }));
  };

  // --- BADGES PROFESIONALES ---
  const BADGE_TOP = ["Pizza Pepperoni", "Pizza Hawaiana", "Boneless (400g)"];

  const getBadges = (p) => {
    const list = [];

    if (BADGE_TOP.includes(p.nombre)) {
      list.push({ text: "🔥 Más vendido", color: "bg-orange-500" });
    }
    if (p.nuevo) {
      list.push({ text: "✨ Nuevo", color: "bg-blue-500" });
    }
    if (p.enPromo) {
      list.push({ text: "🎉 Promo", color: "bg-green-600" });
    }

    return list;
  };

  // --- ANIMACIÓN AL SCROLL (G) ---
  useEffect(() => {
    const items = document.querySelectorAll(".fade-item");

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("opacity-100", "translate-y-0");
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((i) => obs.observe(i));

    return () => obs.disconnect();
  }, [active]);

  return (
    <div className="min-h-screen bg-white pb-20">

      {/* HEADER (D) MÁS PEQUEÑO Y MODERNO */}
      <header className="text-center py-4 border-b bg-white sticky top-0 z-30 shadow-sm">
        <img src="/assets/logo-nicos.webp" className="h-14 mx-auto" />
        <h1 className="text-lg font-bold text-red-600 mt-1">Menú Digital</h1>
      </header>

      {/* TABS CATEGORÍAS */}
      <div className="flex gap-2 overflow-x-auto px-3 py-2 border-b no-scrollbar bg-white sticky top-[72px] z-20">
        {MENU.map((c) => (
          <button
            key={c.nombre}
            onClick={() => setActive(c.nombre)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              active === c.nombre
                ? "bg-red-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {c.icon} {c.nombre}
          </button>
        ))}
      </div>

      {/* LISTA MODERNA */}
      <div className="px-4 pt-4 space-y-3">
        {categoria.productos.map((p, index) => {
          const badges = getBadges(p);

          return (
            <div
              key={p.nombre}
              onClick={() => setSelected(p)}
              className="fade-item opacity-0 translate-y-3 transition-all duration-500
                         flex items-center p-3 gap-3 rounded-2xl border shadow-sm bg-white hover:shadow-md cursor-pointer"
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {/* TEXTO */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap mb-1">
                  {badges.map((b, i) => (
                    <span
                      key={i}
                      className={`${b.color} text-white text-[10px] px-2 py-0.5 rounded-full`}
                    >
                      {b.text}
                    </span>
                  ))}
                </div>

                <h3 className="font-semibold text-gray-900 text-base leading-tight">
                  {p.nombre}
                </h3>

                {p.desc && (
                  <p className="text-gray-500 text-sm line-clamp-2 mt-1 leading-snug">
                    {p.desc}
                  </p>
                )}

                <div className="mt-2 space-y-1">
                  {getPriceList(p).map((item) => (
                    <p key={item.label || 'price'} className="text-sm text-gray-700 flex justify-between">
                      <span className="font-medium">{item.label}</span>
                      <span className="font-bold text-red-600">${item.price}</span>
                    </p>
                  ))}

                  {/* Orilla rellena adicional (si existe) */}
                  {p.opciones?.orilla && (
                    <p className="text-xs text-amber-700 mt-1">
                      🧀 Orilla rellena disponible (+ costo adicional)
                    </p>
                  )}
                </div>
              </div>

              {/* IMAGEN */}
              <img
                src={imagenesProductos[p.nombre] || "/assets/placeholder.png"}
                className="h-24 w-28 rounded-xl object-cover shadow-sm"
              />
            </div>
          );
        })}
      </div>

      {/* MODAL PREMIUM */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[90%] max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl animate-zoomIn relative"
          >
            {/* Imagen grande */}
            <img
              src={imagenesProductos[selected.nombre] || "/assets/placeholder.png"}
              className="w-full h-64 object-cover"
            />

            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-900">
                {selected.nombre}
              </h2>

              <p className="text-red-600 font-semibold text-lg mt-1">
                {getPrice(selected)}
              </p>

              {selected.desc && (
                <p className="text-gray-600 mt-2 text-sm">{selected.desc}</p>
              )}
            </div>

            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 text-white text-3xl font-light"
            >
              ×
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
