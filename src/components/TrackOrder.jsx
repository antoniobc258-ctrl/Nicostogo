// src/components/TrackOrder.jsx
import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const STEPS = ["Recibido", "Preparando", "Listo", "En camino", "Entregado"];

const fmt = (n) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get("o") || "";

  const [code, setCode] = useState(initialCode);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const unsubRef = useRef(null);

  const subscribe = (id) => {
    const cleanId = (id || "").trim();
    if (!cleanId) return;

    setLoading(true);
    setError("");
    setOrder(null);

    if (unsubRef.current) unsubRef.current();

    const ref = doc(db, "orders", cleanId);
    unsubRef.current = onSnapshot(
      ref,
      (snap) => {
        setLoading(false);
        if (!snap.exists()) {
          setOrder(null);
          setError("No encontramos ningún pedido con ese código.");
          return;
        }
        setOrder({ id: snap.id, ...snap.data() });
        setError("");
      },
      (err) => {
        console.error("Error escuchando pedido:", err);
        setLoading(false);
        setOrder(null);
        setError("Hubo un problema al consultar el pedido.");
      }
    );
  };

  const handleSearch = () => {
    if (!code.trim()) {
      setError("Ingresa tu código de pedido.");
      setOrder(null);
      return;
    }
    subscribe(code);
  };

  // Si viene ?o=ID en la URL, arrancar con ese código
  useEffect(() => {
    if (initialCode) {
      subscribe(initialCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  useEffect(() => {
    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, []);

  const currentStepIndex = (() => {
    if (!order?.status) return 0;
    const idx = STEPS.indexOf(order.status);
    return idx >= 0 ? idx : 0;
  })();

  const createdAtDate =
    order?.createdAt && order.createdAt.toDate
      ? order.createdAt.toDate()
      : null;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">
        Rastrear tu pedido
      </h1>

      <p className="text-sm text-gray-600 mb-3">
        Usa el código que te enviamos por WhatsApp para ver el estado de tu
        pedido en tiempo real.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          placeholder="Pega tu código de pedido aquí"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="rounded-xl bg-red-600 text-white text-sm px-4 py-2 font-semibold hover:bg-red-700 active:scale-95 transition-all"
        >
          Ver
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {loading && (
        <div className="text-sm text-gray-600 mb-4 flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full border-2 border-gray-300 border-t-red-500 animate-spin" />
          Consultando tu pedido...
        </div>
      )}

      {order && (
        <div className="mt-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Código de pedido</p>
              <p className="font-mono text-sm font-semibold">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Estado actual</p>
              <p className="text-sm font-bold text-red-600">
                {order.status || "Recibido"}
              </p>
            </div>
          </div>

          {createdAtDate && (
            <p className="text-xs text-gray-500">
              Creado el{" "}
              {createdAtDate.toLocaleDateString("es-MX", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              a las{" "}
              {createdAtDate.toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

          {/* Steps */}
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-600 mb-2">
              Progreso del pedido
            </p>
            <ol className="flex flex-col gap-2">
              {STEPS.map((step, index) => {
                const reached = index <= currentStepIndex;
                return (
                  <li
                    key={step}
                    className="flex items-center gap-2 text-xs text-gray-700"
                  >
                    <span
                      className={[
                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border",
                        reached
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-gray-300 text-gray-400",
                      ].join(" ")}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={
                        reached ? "font-semibold text-gray-900" : "text-gray-500"
                      }
                    >
                      {step}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Resumen de montos */}
          <div className="mt-3 border-t border-gray-200 pt-3 text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                {fmt(order.subtotal || 0)}
              </span>
            </div>

            {Array.isArray(order.discounts) && order.discounts.length > 0 && (
              <div className="mb-1">
                <p className="text-xs text-gray-600 mb-1">
                  Descuentos y promos:
                </p>
                {order.discounts.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs text-green-700"
                  >
                    <span>{d.label}</span>
                    <span>-{fmt(d.amount || 0)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-red-600">
                {fmt(order.total || 0)}
              </span>
            </div>
          </div>

          {/* Lista de productos */}
          {Array.isArray(order.items) && order.items.length > 0 && (
            <div className="mt-3 border-t border-gray-200 pt-3">
              <p className="text-xs font-medium text-gray-600 mb-2">
                Productos
              </p>
              <ul className="space-y-1 text-xs">
                {order.items.map((it, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="flex-1">
                      {it.qty}× {it.name}
                    </span>
                    <span className="text-gray-700">
                      {fmt((it.price || 0) * (it.qty || 0))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
            >
              ← Volver al menú
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
