// src/components/AdminPanel.jsx

import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

const getStatusColors = (status) => {
  switch (status) {
    case "Recibido":
      return "bg-yellow-50 border-yellow-400";
    case "Preparando":
      return "bg-blue-50 border-blue-400";
    case "Listo":
      return "bg-green-50 border-green-400";
    case "En camino":
      return "bg-orange-50 border-orange-400";
    case "Entregado":
      return "bg-gray-100 border-gray-400";
    default:
      return "bg-white border-gray-200";
  }
};

const estados = ["Recibido", "Preparando", "Listo", "En camino", "Entregado"];

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [lastOrders, setLastOrders] = useState([]);
  const [audio] = useState(() => new Audio("/sounds/new-order.mp3"));

  useEffect(() => {
    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));

      // Detectar pedidos nuevos
      if (lastOrders.length > 0) {
        const nuevos = arr.filter(
          (ord) => !lastOrders.some((old) => old.id === ord.id)
        );

        if (nuevos.length > 0) {
          // Sonido
          audio.play().catch(() => {});

          // Animación visual
          nuevos.forEach((n) => {
            n.__new = true; // marca interna para animar
          });

          setTimeout(() => {
            // quitar marca después de la animación
            nuevos.forEach((n) => (n.__new = false));
          }, 2000);
        }
      }

      setLastOrders(arr);
      setOrders(arr);
    });

    return () => unsub();
  }, [lastOrders, audio]);

  const cambiarEstado = async (id, estado) => {
    try {
      await updateDoc(doc(db, "orders", id), {
        status: estado,
      });
      console.log("Estado actualizado");
    } catch (e) {
      console.error("Error:", e);
      alert("Error cambiando estado");
    }
  };

  const pedidosFiltrados = filtro === "Todos"
    ? orders
    : orders.filter((ord) => ord.status === filtro);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Panel de administración</h1>
      <p className="text-gray-600 mb-4">
        Pedidos en tiempo real
      </p>

      <div className="flex gap-2 flex-wrap mb-4">
        {[
          "Todos",
          "Recibido",
          "Preparando",
          "Listo",
          "En camino",
          "Entregado",
        ].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltro(estado)}
            className={`px-3 py-1 rounded-full border text-sm font-semibold transition ${
              filtro === estado
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {estado}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pedidosFiltrados.map((ord) => {
          const createdAt =
            ord.createdAt?.toDate
              ? ord.createdAt.toDate().toLocaleString("es-MX")
              : "—";

          return (
            <div
              key={ord.id}
              className={`p-4 rounded-xl shadow transition-all duration-700 border-2 ${getStatusColors(
                ord.status
              )} ${ord.__new ? "ring-4 ring-green-400 scale-[1.02]" : ""}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500">Código:</p>
                  <p className="font-mono font-bold">{ord.id}</p>

                  <p className="text-xs text-gray-500 mt-2">Cliente:</p>
                  <p className="text-sm font-semibold">{ord.contact}</p>

                  <p className="text-xs text-gray-500 mt-2">Creado:</p>
                  <p className="text-sm">{createdAt}</p>
                </div>

                {/* Cambiar estado */}
                <select
                  className="border rounded-lg px-2 py-1 text-sm font-semibold"
                  value={ord.status}
                  onChange={(e) => cambiarEstado(ord.id, e.target.value)}
                  style={{ background: "white" }}
                >
                  {estados.map((e) => (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lista de productos */}
              <div className="mt-4">
                <p className="text-xs text-gray-500 font-semibold mb-1">
                  Productos:
                </p>

                <div className="space-y-1">
                  {ord.items?.map((it, i) => (
                    <div key={i} className="text-sm">
                      • {it.qty} × {it.nombre} — ${it.precio}
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mt-3 font-bold text-red-600 text-lg">
                Total: ${ord.total}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
