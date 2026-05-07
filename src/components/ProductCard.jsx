// src/components/ProductCard.jsx - MEJORADO + MEMO
import { memo } from "react";
import { imagenesProductos } from "../data/images";

const fmt = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

// Badges especiales para productos destacados
const getBadges = (prod) => {
  const badges = [];
  
  // Badge de más vendido (puedes personalizar esto)
  const topSellers = [
    "Pizza Tradicional",
    "Boneless (400g)",
    "Alitas (12 piezas)",
    "Frappuccino",
    "Combo 1"
  ];
  
  if (topSellers.includes(prod?.nombre)) {
    badges.push({ text: "🔥 Más vendido", color: "bg-orange-500" });
  }
  
  // Badge de promo (si tiene promo especial)
  if (prod?.enPromo) {
    badges.push({ text: "🎉 En Promo", color: "bg-green-500" });
  }
  
  // Badge de nuevo
  if (prod?.nuevo) {
    badges.push({ text: "✨ Nuevo", color: "bg-blue-500" });
  }
  
  return badges;
};

function ProductCard({
  prod,
  onView,
  onAddClick,
  compact = false,
  didi = true,
}) {
  const precioPreview = (() => {
    const p = prod?.precio;
    if (Array.isArray(p)) return Array.isArray(p[0]) ? p[0][0] : p[0];
    return p ?? 0;
  })();

  const imgSrc =
    imagenesProductos?.[prod?.nombre] ||
    prod?.img ||
    "/assets/fondo.webp";

  const priceLabel = Array.isArray(prod?.precio)
    ? `Desde ${fmt.format(precioPreview)}`
    : fmt.format(precioPreview);

  const badges = getBadges(prod);

  if (didi) {
    // ===== Estilo tipo DiDi (horizontal) MEJORADO =====
    return (
      <article
        className="group bg-white rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-lg hover:border-red-200 transition-all duration-200 p-3 max-[400px]:p-2 max-[400px]:rounded-xl flex items-center justify-between gap-3 max-[400px]:gap-2"
      >
        {/* Texto izquierdo */}
        <div className="min-w-0 flex-1">
          {/* Badges arriba */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {badges.map((badge, i) => (
                <span
                  key={i}
                  className={`${badge.color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}
                >
                  {badge.text}
                </span>
              ))}
            </div>
          )}

          <h3 className="font-bold text-gray-900 leading-tight mb-1 text-base max-[400px]:text-sm max-[360px]:text-xs">
            {prod?.nombre}
          </h3>

          {prod?.desc ? (
            <p className="text-gray-600 text-sm max-[400px]:text-xs leading-snug line-clamp-2 mb-2 max-[400px]:mb-1">
              {prod.desc}
            </p>
          ) : null}

          {/* Info adicional si tiene opciones */}
          {prod?.opciones?.ingredientes && (
            <div className="text-xs text-gray-500 mb-1">
              {prod.opciones.ingredientes.length} ingredientes disponibles
            </div>
          )}
          
          {prod?.opciones?.sabor && (
            <div className="text-xs text-gray-500 mb-1">
              {prod.opciones.sabor.length} sabores disponibles
            </div>
          )}

          <div className="mt-2 max-[400px]:mt-1 flex items-baseline gap-2">
            <span className="font-bold text-lg max-[400px]:text-base max-[360px]:text-sm text-red-600">
              {priceLabel}
            </span>
            {prod?.precioAnterior && (
              <span className="text-sm text-gray-400 line-through">
                {fmt.format(prod.precioAnterior)}
              </span>
            )}
          </div>
        </div>

        {/* Imagen derecha dentro de "caja naranja" */}
        <button
          type="button"
          onClick={() => onView?.(imgSrc, prod?.nombre)}
          title={`Ver ${prod?.nombre}`}
          aria-label={`Ver ${prod?.nombre}`}
          className="relative shrink-0 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-2 hover:from-orange-600 hover:to-orange-700 transition-all"
        >
          {/* Contenedor cuadrado 1:1 */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 max-[400px]:w-20 max-[400px]:h-20 max-[360px]:w-[70px] max-[360px]:h-[70px] rounded-xl overflow-hidden">
            <img
              src={imgSrc}
              alt={prod?.nombre || "Producto"}
              loading={prod.eager ? "eager" : "lazy"}
              fetchpriority={prod.eager ? "high" : "auto"}
              decoding="async"
              className="absolute inset-0 w-full h-full object-contain drop-shadow-lg"
            />
          </div>

          {/* Botón + flotante (abajo-derecha) */}
          <span
            onClick={(e) => { e.stopPropagation(); onAddClick?.(); }}
            className="absolute -bottom-1 -right-1 inline-flex items-center justify-center w-10 h-10 max-[400px]:w-8 max-[400px]:h-8 max-[360px]:w-7 max-[360px]:h-7 rounded-full bg-red-600 shadow-lg text-white font-bold text-xl max-[400px]:text-lg max-[360px]:text-base leading-none hover:bg-red-700 hover:scale-110 transition-all active:scale-95"
            title="Agregar"
            aria-label="Agregar"
          >
            +
          </span>
        </button>
      </article>
    );
  }

  // ===== Card vertical MEJORADA (grid) =====
  return (
    <article
      className={[
        "group bg-white rounded-2xl border-2 border-gray-100 shadow-sm",
        "overflow-hidden flex flex-col hover:shadow-xl hover:border-red-200 transition-all duration-200",
        compact ? "text-xs sm:text-sm" : "text-sm sm:text-base",
      ].join(" ")}
    >
      {/* Contenedor de imagen con badges */}
      <div className="relative">
        <button
          type="button"
          onClick={() => onView?.(imgSrc, prod?.nombre)}
          title={`Ver ${prod?.nombre}`}
          aria-label={`Ver ${prod?.nombre}`}
          className="relative w-full overflow-hidden bg-gray-100 aspect-[4/3]"
        >
          <img
            src={imgSrc}
            alt={prod?.nombre || "Producto"}
            loading={prod.eager ? "eager" : "lazy"}
              fetchpriority={prod.eager ? "high" : "auto"}
            decoding="async"
            width="600" 
            height="450"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Overlay en hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
              👁️ Ver detalles
            </span>
          </div>
        </button>

        {/* Badges sobre la imagen */}
        {badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {badges.map((badge, i) => (
              <span
                key={i}
                className={`${badge.color} text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md`}
              >
                {badge.text}
              </span>
            ))}
          </div>
        )}

        {/* Badge de precio en esquina superior derecha */}
        <div className="absolute top-2 right-2 bg-red-600 text-white font-bold px-3 py-1 rounded-full shadow-lg">
          {priceLabel}
        </div>
      </div>

      {/* Contenido */}
      <div className={["flex-1 p-4", compact ? "space-y-1" : "space-y-2"].join(" ")}>
        <h3 className="font-bold text-lg leading-tight text-gray-900">
          {prod?.nombre}
        </h3>
        
        {!compact && prod?.desc ? (
          <p className="text-gray-600 text-sm leading-snug line-clamp-2">
            {prod.desc}
          </p>
        ) : null}

        {/* Info adicional */}
        {!compact && (
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {prod?.opciones?.tamaño && (
              <span className="flex items-center gap-1">
                📏 {prod.opciones.tamaño.length} tamaños
              </span>
            )}
            {prod?.opciones?.ingredientes && (
              <span className="flex items-center gap-1">
                🍖 {prod.opciones.ingredientes.length} ingredientes
              </span>
            )}
            {prod?.opciones?.sabor && (
              <span className="flex items-center gap-1">
                🍫 {prod.opciones.sabor.length} sabores
              </span>
            )}
          </div>
        )}

        {!compact && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onAddClick}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white py-3 text-sm font-bold hover:from-red-700 hover:to-red-600 active:scale-[0.98] transition-all shadow-md hover:shadow-lg"
            >
              🛒 Agregar al carrito
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default memo(ProductCard);
