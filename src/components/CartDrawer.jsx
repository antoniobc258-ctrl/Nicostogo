// src/components/CartDrawer.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { imagenesProductos } from "../data/images";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthProvider";

const fmt = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export default function CartDrawer({
  open,
  onClose,
  items = [],
  subtotal = 0,
  discounts = [],
  total = 0,
  count = 0,
  onQty,
  onRemove,
  onClear,
}) {
  const { user } = useAuth();

  const [nombre, setNombre] = useState("");
  const [entrega, setEntrega] = useState("");
  const [zonaRef, setZonaRef] = useState("");
  const [notas, setNotas] = useState("");
  const [enviando, setEnviando] = useState(false);

  const drawerRef = useRef(null);
  const nombreRef = useRef(null);
  const entregaRef = useRef(null);

  const isEmpty = items.length === 0;

  const totalDescuentos = useMemo(
    () => (discounts || []).reduce((acc, d) => acc + (d.amount || 0), 0),
    [discounts]
  );

  const grandTotal = Math.max(0, total);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ntg_checkout");
      if (!raw) return;
      const data = JSON.parse(raw);
      setNombre(data.nombre ?? "");
      setEntrega(data.entrega ?? "");
      setZonaRef(data.zonaRef ?? "");
      setNotas(data.notas ?? "");
    } catch (e) {
      console.error("Error leyendo ntg_checkout", e);
    }
  }, []);

  useEffect(() => {
    try {
      const payload = { nombre, entrega, zonaRef, notas };
      localStorage.setItem("ntg_checkout", JSON.stringify(payload));
    } catch (e) {
      console.error("Error guardando ntg_checkout", e);
    }
  }, [nombre, entrega, zonaRef, notas]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const stop = (e) => e.stopPropagation();

  const mensajeWA = useMemo(() => {
    if (isEmpty) return "";

    const nombreTrim = (nombre || "").trim() || "Cliente";

    let msg = `🍕 *NUEVO PEDIDO NICOS*\n\n`;
    msg += `👤 *Cliente:* ${nombreTrim}\n`;
    msg += `🚚 *Entrega:* ${entrega || "Por definir"}\n`;

    if (entrega === "Entrega en pueblo (domicilio variable)" && (zonaRef || "").trim()) {
      msg += `📍 *Zona / referencia:* ${zonaRef.trim()}\n`;
    }

    if ((notas || "").trim()) {
      msg += `💬 *Nota general:* ${notas.trim()}\n`;
    }

    msg += `\n━━━━━━━━━━━━━━\n`;
    msg += `🛒 *PRODUCTOS*\n\n`;

    items.forEach((it, index) => {
      msg += `${index + 1}) *${it.nombre}* x${it.qty}\n`;

      if (it.opciones?.length) {
        it.opciones.forEach((o) => {
          msg += `   • ${o}\n`;
        });
      }

      if (it.nota) {
        msg += `   📝 Nota: ${it.nota}\n`;
      }

      msg += `   💲 Importe: ${fmt.format((it.precio || 0) * (it.qty || 0))}\n\n`;
    });

    msg += `━━━━━━━━━━━━━━\n`;
    msg += `🧾 *RESUMEN*\n\n`;
    msg += `Subtotal: ${fmt.format(subtotal)}\n`;

    if (discounts?.length) {
      msg += `\n🎉 *Promos / descuentos:*\n`;
      discounts.forEach((d) => {
        msg += `• ${d.label}: -${fmt.format(d.amount || 0)}\n`;
      });
      msg += `Ahorro: -${fmt.format(totalDescuentos)}\n`;
    }

    msg += `\n💰 *Total:* ${fmt.format(grandTotal)}\n`;

    if (entrega === "Entrega en pueblo (domicilio variable)") {
      msg += `⚠️ *Domicilio:* se suma aparte según zona.\n`;
    }

    msg += `\nGracias. Quedamos atentos para confirmar. 🙌`;

    return msg;
  }, [
    isEmpty,
    nombre,
    entrega,
    zonaRef,
    notas,
    items,
    subtotal,
    discounts,
    totalDescuentos,
    grandTotal,
  ]);

  const sendOrder = async () => {
    if (isEmpty) {
      window.Swal?.fire({
        icon: "error",
        title: "Carrito vacío",
        text: "Agrega productos antes de enviar.",
      });
      return;
    }

    if (!nombre.trim()) {
      if (nombreRef.current) nombreRef.current.focus();
      window.Swal?.fire({
        icon: "error",
        title: "Falta el nombre",
        text: "Ingresa a nombre de quién va el pedido.",
      });
      return;
    }

    if (!entrega) {
      if (entregaRef.current) entregaRef.current.focus();
      window.Swal?.fire({
        icon: "error",
        title: "Selecciona entrega",
        text: "Elige recoger o entrega en pueblo.",
      });
      return;
    }

    try {
      setEnviando(true);

      let orderId = null;

      try {
        const docRef = await addDoc(collection(db, "orders"), {
          contact: nombre.trim(),
          deliveryType: entrega,
          deliveryZone: zonaRef.trim() || null,
          notes: notas.trim() || null,
          items: items.map((it) => ({
            nombre: it.nombre,
            qty: it.qty,
            precio: it.precio,
            opciones: it.opciones || [],
            nota: it.nota || "",
          })),
          subtotal,
          discounts,
          total: grandTotal,
          status: "Recibido",
          createdAt: serverTimestamp(),
          userId: user?.uid || null,
          userEmail: user?.email || null,
          source: "web-nicostogo",
        });

        orderId = docRef.id;
        console.log("✅ Pedido guardado en Firestore con ID:", orderId);

        try {
          const url = new URL(window.location.href);
          url.searchParams.set("o", orderId);
          window.history.replaceState({}, "", url.toString());
        } catch {
          // no es grave
        }
      } catch (e) {
        console.error("❌ Error guardando pedido en Firestore:", e);
        window.Swal?.fire({
          icon: "error",
          title: "Error guardando pedido en Firebase",
          text:
            e?.message ||
            "Revisa tu conexión o la configuración de Firestore (colección 'orders').",
        });
        setEnviando(false);
        return;
      }

      const extra = orderId ? `\n\n🔢 *Código de pedido:* ${orderId}` : "";
      const finalMsg = mensajeWA + extra;

      const WAnum = "526971029287";
      const waUrl = `https://wa.me/${WAnum}?text=${encodeURIComponent(finalMsg)}`;

      window.location.href = waUrl;

      onClear?.();
      onClose?.(false);
    } catch (err) {
      console.error("Error enviando pedido:", err);
      window.Swal?.fire({
        icon: "error",
        title: "No se pudo enviar el pedido",
        text: "Revisa tu conexión o inténtalo de nuevo.",
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-40 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => onClose?.(false)}
        aria-hidden={!open}
      />

      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        onClick={stop}
        className={[
          "fixed z-50 bg-white shadow-2xl transition-all duration-300",
          "left-0 right-0 mx-auto bottom-0 h-[90vh] rounded-t-3xl",
          "md:top-0 md:right-0 md:left-auto md:h-full md:w-[440px] md:rounded-none",
          open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full",
        ].join(" ")}
      >
        <div className="sticky top-0 z-10 bg-gradient-to-r from-red-600 to-red-500 text-white p-4 shadow-lg">
          <div className="w-full md:w-auto">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/30 md:hidden" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </div>
                <div>
                  <h2 id="cart-title" className="text-xl font-bold">
                    Tu Pedido
                  </h2>
                  {!isEmpty && (
                    <p className="text-sm text-white/90">
                      {count} {count === 1 ? "producto" : "productos"}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                aria-label="Cerrar"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-2xl leading-none"
                onClick={() => onClose?.(false)}
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4 pb-44 md:pb-48 overflow-y-auto h-full">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Tu carrito está vacío
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Agrega algunos productos deliciosos de nuestro menú
              </p>
              <button
                onClick={() => onClose?.(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-medium hover:from-red-700 hover:to-red-600 transition-all shadow-md"
              >
                Ver Menú
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {items.map((item, idx) => {
                  const imgSrc =
                    imagenesProductos?.[item.nombre] || "/assets/fondo.webp";

                  return (
                    <div
                      key={item.key ?? `${item.nombre}-${idx}`}
                      className="bg-white border-2 border-gray-100 rounded-2xl p-3 hover:border-red-200 transition-all"
                    >
                      <div className="flex gap-3">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={imgSrc}
                            alt={item.nombre}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 leading-tight">
                              {item.nombre}
                            </h4>
                            <button
                              type="button"
                              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                              onClick={() => onRemove?.(idx)}
                              aria-label="Eliminar"
                              title="Eliminar producto"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          {item.opciones?.length ? (
                            <div className="text-xs text-gray-600 mb-2 space-y-0.5">
                              {item.opciones.map((o, i) => (
                                <div key={i} className="flex items-start gap-1">
                                  <span className="text-red-500">•</span>
                                  <span>{o}</span>
                                </div>
                              ))}
                            </div>
                          ) : null}

                          {item.nota ? (
                            <div className="text-xs bg-amber-50 text-amber-800 rounded-lg px-2 py-1 mb-2 flex items-start gap-1">
                              <span>📝</span>
                              <span>{item.nota}</span>
                            </div>
                          ) : null}

                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-red-600">
                              {fmt.format(item.precio * item.qty)}
                            </div>

                            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                              <button
                                type="button"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 shadow-sm transition-all active:scale-95"
                                onClick={() => onQty?.(idx, -1)}
                                aria-label="Disminuir cantidad"
                              >
                                <svg
                                  className="w-4 h-4 text-gray-700"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>

                              <span className="w-8 text-center font-semibold text-gray-900 select-none">
                                {item.qty}
                              </span>

                              <button
                                type="button"
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 shadow-sm transition-all active:scale-95"
                                onClick={() => onQty?.(idx, +1)}
                                aria-label="Aumentar cantidad"
                              >
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mb-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Artículos ({count})</span>
                  <span className="font-medium text-gray-900">
                    {fmt.format(subtotal)}
                  </span>
                </div>

                {discounts?.length ? (
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    {discounts.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-green-700 flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {d.label}
                        </span>
                        <span className="font-medium text-green-700">
                          -{fmt.format(d.amount)}
                        </span>
                      </div>
                    ))}

                    {totalDescuentos > 0 && (
                      <div className="flex items-center justify-between text-xs text-green-700 pt-1">
                        <span>Ahorro por promos</span>
                        <span className="font-semibold">
                          -{fmt.format(totalDescuentos)}
                        </span>
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="flex items-center justify-between pt-3 border-t-2 border-gray-300">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-red-600">
                    {fmt.format(grandTotal)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📱 A nombre de quién (contacto)
                  </label>
                  <input
                    ref={nombreRef}
                    type="text"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🚚 Tipo de entrega
                  </label>
                  <select
                    ref={entregaRef}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all bg-white appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 0.75rem center",
                      backgroundSize: "1.5em 1.5em",
                      paddingRight: "2.5rem",
                    }}
                    value={entrega}
                    onChange={(e) => setEntrega(e.target.value)}
                  >
                    <option value="">Selecciona tipo de entrega</option>
                    <option value="Recoger en restaurante">
                      🏪 Recoger en restaurante
                    </option>
                    <option value="Entrega en pueblo (domicilio variable)">
                      🏠 Entrega en pueblo
                    </option>
                  </select>
                </div>

                {entrega === "Entrega en pueblo (domicilio variable)" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        📍 Zona / referencia (opcional)
                      </label>
                      <input
                        type="text"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all"
                        value={zonaRef}
                        onChange={(e) => setZonaRef(e.target.value)}
                        placeholder='Ej. "Centro", "Colonia Norte", etc.'
                      />
                    </div>

                    <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3">
                      <div className="flex gap-2">
                        <span className="text-amber-600 text-lg flex-shrink-0">
                          ⚠️
                        </span>
                        <div className="text-sm text-amber-800">
                          <p className="font-medium mb-1">Sobre el domicilio:</p>
                          <p>
                            El costo de envío se confirma según la distancia/zona.
                            El total final puede variar.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💬 Notas generales (opcional)
                  </label>
                  <textarea
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all resize-none"
                    rows={3}
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Ej. Sin cebolla, llamar al llegar, etc."
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {!isEmpty && (
          <div className="fixed left-0 right-0 bottom-0 md:left-auto md:w-[440px] bg-white border-t-2 border-gray-100 p-4 z-50 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                onClick={() => onClose?.(false)}
              >
                <span className="hidden sm:inline">Seguir viendo</span>
                <span className="sm:hidden">Volver</span>
              </button>

              <button
                type="button"
                className="px-4 py-3 rounded-xl border-2 border-red-200 text-red-600 font-medium hover:bg-red-50 transition-all"
                onClick={() => {
                  if (window.Swal) {
                    window.Swal.fire({
                      title: "¿Vaciar carrito?",
                      text: "Se eliminarán todos los productos",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#dc2626",
                      cancelButtonColor: "#6b7280",
                      confirmButtonText: "Sí, vaciar",
                      cancelButtonText: "Cancelar",
                    }).then((r) => r.isConfirmed && onClear?.());
                  } else {
                    onClear?.();
                  }
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={sendOrder}
                disabled={enviando}
              >
                {enviando ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span>Enviar por WhatsApp</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}