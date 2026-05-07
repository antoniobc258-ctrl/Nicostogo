// src/components/MyOrders.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../context/AuthProvider";
import { useCart } from "../hooks/useCart";

// Formato precio
const fmt = (n = 0) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function MyOrders() {
  const { user } = useAuth();
  const { addItem, clearCart } = useCart();

  const [orders, setOrders] = useState([]); // pedidos Firebase
  const [localOrders, setLocalOrders] = useState([]); // pedidos locales (no logueado)
  const [loading, setLoading] = useState(true);

  // 🟢 Cargar pedidos locales si NO está logueado
  useEffect(() => {
    if (!user) {
      const data = JSON.parse(localStorage.getItem("nicos_orders") || "[]");
      setLocalOrders(data);
      setLoading(false);
      return;
    }
  }, [user]);

  // 🟢 Cargar pedidos desde Firestore si está logueado
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = [];
        snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
        setOrders(list);
        setLoading(false);
      },
      (err) => {
        console.error("Error leyendo pedidos del usuario:", err);
        setOrders([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  // 🔁 Función para REORDENAR
  const onReorder = (pedido) => {
    clearCart();

    pedido.items?.forEach((item) => {
      addItem({
        ...item,
        qty: item.qty || 1,
      });
    });

    // Redirigimos al menú
    window.location.href = "/";
  };

  // 🔁 Reordenar pedidos locales
  const onReorderLocal = (pedido) => onReorder(pedido);

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-3 text-gray-900">Mis pedidos</h1>

      {loading && <p className="text-sm text-gray-500">Cargando...</p>}

      {/* 🟡 Si el usuario NO está logueado */}
      {!user && (
        <>
          <p className="text-sm text-gray-600 mb-4">
            No has iniciado sesión. Tus pedidos se guardan en este dispositivo.
          </p>

          {localOrders.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aún no tienes pedidos guardados.
            </p>
          ) : (
            <div className="space-y-3 mt-4">
              {localOrders.map((order, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                >
                  <p className="text-xs text-gray-500 mb-1">
                    Pedido guardado localmente
                  </p>

                  <p className="text-xs text-gray-600 mb-2">
                    {order.items.length} producto(s)
                  </p>

                  <p className="font-bold text-red-600 text-lg mb-2">
                    {fmt(order.total)}
                  </p>

                  <button
                    onClick={() => onReorderLocal(order)}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    🔁 Repetir pedido
                  </button>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/"
            className="inline-block mt-4 text-sm text-blue-600 hover:underline"
          >
            ← Volver al menú
          </Link>
          <br />
          <Link
            to="/login"
            className="inline-block mt-2 text-sm text-red-600 hover:underline"
          >
            Iniciar sesión
          </Link>

        </>
      )}

      {/* 🟢 Si está logueado, mostrar pedidos desde Firebase */}
      {user && (
        <>
          <p className="text-sm text-gray-600 mb-4">
            Aquí verás tus pedidos realizados con tu cuenta.
          </p>

          {orders.length === 0 ? (
            <p className="text-sm text-gray-500">
              Aún no has hecho pedidos con esta cuenta.
            </p>
          ) : (
            <div className="space-y-3 mt-4">
              {orders.map((order) => {
                const createdAt =
                  order.createdAt && order.createdAt.toDate
                    ? order.createdAt.toDate()
                    : null;

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                  >
                    <div className="flex justify-between">
                      <p className="font-mono text-xs">{order.id}</p>
                      <p className="text-sm font-bold text-red-600">
                        {order.status || "Recibido"}
                      </p>
                    </div>

                    {createdAt && (
                      <p className="text-xs text-gray-500 mb-2">
                        {createdAt.toLocaleDateString("es-MX")} ·{" "}
                        {createdAt.toLocaleTimeString("es-MX")}
                      </p>
                    )}

                    <p className="text-xs text-gray-600 mb-2">
                      {order.items.length} producto(s)
                    </p>

                    <p className="font-bold text-red-600 text-lg mb-2">
                      {fmt(order.total)}
                    </p>

                    <div className="flex justify-between">
                      <button
                        onClick={() => onReorder(order)}
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        🔁 Repetir pedido
                      </button>

                      <Link
                        to={`/track?o=${order.id}`}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Ver seguimiento
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
