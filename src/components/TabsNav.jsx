import { memo, useMemo } from "react";

const ORDER = [
  "Combos",
  "Pizzas",
  "Entradas",
  "Sushi Empanizados",
  "Sushi Naturales",
  "Sushi Arroces",
  "Sushi Entradas",
  "Sushi Especiales",
  "Sushi Kids",
  "Burger y Baguettes",
  "Mariscos",
  "Desayunos",
  "Ensaladas y Sopas",
  "Frappes y Malteadas",
  "Jugos y Licuados",
  "Aguas y Refrescos",
  "Cafés",
  "Postres",
  "Extras"
];

const CATEGORY_INFO = {
  "Combos": "Ahorra más",
  "Pizzas": "Arma tu pizza ideal",
  "Entradas": "Para compartir",
  "Sushi Empanizados": "Los más pedidos",
  "Sushi Naturales": "Más frescos",
  "Sushi Arroces": "Llenadores",
  "Sushi Entradas": "Para empezar",
  "Sushi Especiales": "Especialidad de la casa",
  "Sushi Kids": "Para peques",
  "Desayunos": "Hasta 2pm",
  "Frappes y Malteadas": "Frías y cremosas",
  "Jugos y Licuados": "Naturales",
  "Aguas y Refrescos": "Para acompañar",
  "Cafés": "Calientes y fríos",
  "Postres": "Algo dulce",
  "Extras": "Complementos"
};

function TabsNav({ categorias = [], activeIndex = 0, onChange }) {
  const ordered = useMemo(() => {
    const ranked = [...categorias].sort((a, b) => {
      const ia = ORDER.indexOf(a.nombre);
      const ib = ORDER.indexOf(b.nombre);

      const ra = ia === -1 ? 999 : ia;
      const rb = ib === -1 ? 999 : ib;

      return ra - rb;
    });

    return ranked;
  }, [categorias]);

  return (
    <aside className="w-full md:sticky md:top-3 self-start">
      {/* MÓVIL: grid visible, sin scroll lateral */}
      <div className="md:hidden">
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-2">
          <div className="grid grid-cols-2 gap-2">
            {ordered.map((c) => {
              const realIndex = categorias.findIndex((x) => x.nombre === c.nombre);
              const isActive = realIndex === activeIndex;
              const productCount = c.productos?.length || 0;
              const info = CATEGORY_INFO[c.nombre];

              return (
                <button
                  key={c.nombre}
                  type="button"
                  onClick={() => onChange(realIndex)}
                  className={[
                    "text-left rounded-2xl border px-3 py-3 transition-all min-h-[84px]",
                    isActive
                      ? "bg-red-600 text-white border-red-600 shadow-md"
                      : "bg-white text-gray-800 border-gray-200 hover:border-red-300 hover:bg-red-50"
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg leading-none mt-0.5">
                      {c.icon || "🍽️"}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold leading-tight">
                        {c.nombre}
                      </div>

                      {info && (
                        <div
                          className={[
                            "text-[11px] mt-1 leading-tight",
                            isActive ? "text-white/85" : "text-gray-500"
                          ].join(" ")}
                        >
                          {info}
                        </div>
                      )}

                      <div
                        className={[
                          "text-[11px] mt-2 inline-flex rounded-full px-2 py-0.5",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        ].join(" ")}
                      >
                        {productCount} items
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* DESKTOP: vertical sidebar */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl border border-black/5 shadow-sm p-3">
          <div className="mb-2 px-2">
            <h3 className="text-sm font-bold text-nicos-dark">Categorías</h3>
            <p className="text-xs text-gray-500">Explora el menú por sección</p>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
            {ordered.map((c) => {
              const realIndex = categorias.findIndex((x) => x.nombre === c.nombre);
              const isActive = realIndex === activeIndex;
              const productCount = c.productos?.length || 0;
              const info = CATEGORY_INFO[c.nombre];

              return (
                <button
                  key={c.nombre}
                  type="button"
                  onClick={() => onChange(realIndex)}
                  className={[
                    "w-full text-left rounded-2xl border px-3 py-3 transition-all",
                    "flex items-start gap-3",
                    isActive
                      ? "bg-red-600 text-white border-red-600 shadow-md"
                      : "bg-white text-gray-800 border-gray-200 hover:border-red-300 hover:bg-red-50"
                  ].join(" ")}
                >
                  <span className="text-xl leading-none mt-0.5">
                    {c.icon || "🍽️"}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm leading-tight">
                        {c.nombre}
                      </span>

                      <span
                        className={[
                          "text-[11px] rounded-full px-2 py-0.5 shrink-0",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        ].join(" ")}
                      >
                        {productCount}
                      </span>
                    </span>

                    {info && (
                      <span
                        className={[
                          "block text-xs mt-1 leading-tight",
                          isActive ? "text-white/85" : "text-gray-500"
                        ].join(" ")}
                      >
                        {info}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default memo(TabsNav);