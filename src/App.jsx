// src/App.jsx
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Swal from "sweetalert2";

import Header from "./components/Header";
import PromoBanner from "./components/PromoBanner";
import TabsNav from "./components/TabsNav";
import MenuSections from "./components/MenuSections";
import Footer from "./components/Footer";
import Lightbox from "./components/Lightbox";
import TrackOrder from "./components/TrackOrder";
import MyOrders from "./components/MyOrders";
import AdminPanel from "./components/AdminPanel";

import { MENU } from "./data/menu";
import { applyPromos, getDebugDateFromQuery } from "./utils/promos";
import { useAuth } from "./context/AuthProvider";
import MenuDigital from "./pages/MenuDigital";
// Lazy de cosas pesadas
const OptionsModal = lazy(() => import("./components/OptionsModal"));
const CartDrawer = lazy(() => import("./components/CartDrawer"));


export default function App() {
 const { profile } = useAuth();
const isAdmin = profile?.role === "admin";
  const [tab, setTab] = useState(() => {
    try {
      const saved = localStorage.getItem("ntg_tab");
      const n = saved != null ? parseInt(saved, 10) : 0;
      if (Number.isNaN(n) || n < 0 || n >= MENU.length) return 0;
      return n;
    } catch {
      return 0;
    }
  });

  const [items, setItems] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [modalProd, setModalProd] = useState(null);

  // Lightbox
  const [lb, setLb] = useState({ open: false, src: "", alt: "" });
  const openLightbox = (src, alt) => setLb({ open: true, src, alt });
  const closeLightbox = () => setLb({ open: false, src: "", alt: "" });

  // SweetAlert global
  useEffect(() => {
    if (!window.Swal) window.Swal = Swal;
  }, []);

  // Restaurar carrito
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ntg_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Guardar carrito
  useEffect(() => {
    try {
      localStorage.setItem("ntg_cart", JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Guardar pestaña activa
  useEffect(() => {
    try {
      localStorage.setItem("ntg_tab", String(tab));
    } catch {
      // ignore
    }
  }, [tab]);

  // Totales y promos
  const summary = useMemo(
    () => {
      const debugDate = getDebugDateFromQuery() || new Date();
      return applyPromos(items, debugDate);
    },
    [items]
  );
  const { subtotal, discounts, total } = summary;

  // Conteo de ítems
  const count = useMemo(
    () => items.reduce((s, it) => s + it.qty, 0),
    [items]
  );

  // Añadir al carrito
  const addItem = (item) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.key === item.key);
      if (i >= 0) {
        const cp = [...prev];
        cp[i] = { ...cp[i], qty: cp[i].qty + item.qty };
        return cp;
      }
      return [...prev, item];
    });
    setOpenCart(true);
    Swal.fire({
      toast: true,
      icon: "success",
      title: "¡Agregado al carrito!",
      position: "top-end",
      timer: 1000,
      showConfirmButton: false,
    });
  };

  // Cambiar cantidad
const changeQty = (idx, delta) => {
  setItems((prev) => {
    const current = prev[idx];
    if (!current) return prev;

    const newQty = current.qty + delta;

    if (newQty <= 0) {
      return prev.filter((_, i) => i !== idx);
    }

    return prev.map((item, i) =>
      i === idx ? { ...item, qty: newQty } : item
    );
  });
};
  return (
    <Router>
      <div className="min-h-screen bg-nicos-cream2 flex flex-col">
        <Header />
<PromoBanner />
        {/* Navegación superior */}
        <nav className="bg-white shadow-sm border-b border-gray-100 px-3 py-2 flex gap-3 justify-center text-sm">
          <Link
            to="/"
            className="px-3 py-1 rounded-full hover:bg-red-50 text-red-600 font-semibold"
          >
            Menú
          </Link>
          <Link
            to="/menudigital"
            className="px-3 py-1 rounded-full hover:bg-red-50 text-red-600 font-semibold"
          >
            Menú digital (QR)
          </Link>
        </nav>

        {/* Contenido principal */}
        <div className="flex-1">
          <Routes>
            {/* Menú principal */}
            <Route
              path="/"
              element={
                <>
               <div className="max-w-6xl mx-auto w-full px-3 py-3 md:px-4">
  <div className="grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] gap-4 items-start">
    <TabsNav
      categorias={MENU}
      activeIndex={tab}
      onChange={setTab}
    />

    <MenuSections
      categorias={MENU}
      activeIndex={tab}
      onView={openLightbox}
      onOpenOptions={(prod) => setModalProd(prod)}
    />
  </div>
</div>

                  <Suspense fallback={null}>
                    <OptionsModal
                      open={!!modalProd}
                      prod={modalProd}
                      onClose={() => setModalProd(null)}
                      onAdd={addItem}
                      onView={openLightbox}
                    />
                  </Suspense>

                  {(openCart || count > 0) && (
                    <Suspense fallback={null}>
                      <CartDrawer
                        open={openCart}
                        onClose={setOpenCart}
                        items={items}
                        subtotal={subtotal}
                        discounts={discounts}
                        total={total}
                        count={count}
                        onQty={changeQty}
                        onRemove={(idx) =>
                          setItems((p) => p.filter((_, i) => i !== idx))
                        }
                        onClear={() => setItems([])}
                      />
                    </Suspense>
                  )}

                  {/* Botón flotante carrito */}
                  {count > 0 && !openCart && (
                    <button
                      type="button"
                      onClick={() => setOpenCart(true)}
                      className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 active:scale-95 transition-all"
                    >
                      <span className="text-lg">🛒</span>
                      <span>
                        {count} {count === 1 ? "producto" : "productos"}
                      </span>
                      <span className="font-bold border-l border-white/30 pl-2">
                        ${total}
                      </span>
                    </button>
                  )}

                  {/* Lightbox global */}
                  <Lightbox
                    open={lb.open}
                    src={lb.src}
                    alt={lb.alt}
                    onClose={closeLightbox}
                  />
                </>
              }
            />

            {/* Menú digital (QR) */}
            <Route path="/menudigital" element={<MenuDigital />} />

            {/* Rastrear pedido */}
            <Route path="/track" element={<TrackOrder />} />

            {/* Mis pedidos (solo para usuarios logueados) */}
            <Route path="/mis-pedidos" element={<MyOrders />} />

            {/* Panel de administrador (solo para admin) */}
            <Route
              path="/admin"
              element={
                isAdmin ? (
                  <AdminPanel />
                ) : (
                  <div className="p-6 text-center text-red-600 font-bold">
                    Acceso denegado
                  </div>
                )
              }
            />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}
