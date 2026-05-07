// src/hooks/useMenuFS.js
import { useEffect, useMemo, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { imagenesProductos } from "../data/images";
import { MENU as LOCAL_MENU } from "../data/menu";

const CAT_ORDER = [
  "Promos", "Combos", "Pizzas", "Entradas", "Pastas",
  "Boneless", "Frappes", "Bebidas", "Postres"
];

function normalize(fsDocs) {
  // Mapear docs de Firestore al shape que espera tu app
  const items = fsDocs.map((d) => {
    const x = d.data();
    return {
      id: d.id,
      nombre: x.nombre,
      categoria: x.categoria,
      desc: x.desc || "",
      precio: x.precio,                // número o matriz (ya lo soporta tu app)
      img: x.img || imagenesProductos[x.nombre] || "/assets/fondo.webp",
      opciones: x.opciones || {},
      // campo opcional que usas en ProductCard para prioridad de carga
      eager: x.eager || false
    };
  });

  // Agrupar por categoria en el orden visual que quieres
  const byCat = {};
  for (const it of items) {
    if (!byCat[it.categoria]) byCat[it.categoria] = [];
    byCat[it.categoria].push(it);
  }

  // Ensamblar arreglo de secciones como tu `MENU` local
  const categorias = [];
  const cats = Object.keys(byCat).sort(
    (a, b) => CAT_ORDER.indexOf(a) - CAT_ORDER.indexOf(b)
  );
  for (const c of cats) {
    categorias.push({ nombre: c, productos: byCat[c] });
  }
  return categorias;
}

export function useMenuFS() {
  const [cats, setCats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stop = false;

    async function load() {
      try {
        // intenta leer cache
        const cache = localStorage.getItem("ntg_menu_cache_v1");
        if (cache) setCats(JSON.parse(cache));

        // carga fresca
        const qs = await getDocs(query(collection(db, "productos")));
        const arr = [];
        qs.forEach((doc) => arr.push(doc));
        const data = normalize(arr);

        if (!stop) {
          setCats(data);
          localStorage.setItem("ntg_menu_cache_v1", JSON.stringify(data));
        }
      } catch (e) {
        console.error(e);
        setError(e);
      }
    }
    load();
    return () => { stop = true; };
  }, []);

  // Fallback si Firestore aún no trae nada
  const categorias = useMemo(() => cats || LOCAL_MENU, [cats]);

  return { categorias, error, isFS: !!cats };
}
