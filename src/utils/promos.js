// src/utils/promos.js

/** -------- Debug: dia/fecha por querystring --------
 * ?debugDate=2025-08-13   (YYYY-MM-DD)
 * ?day=mon|tue|wed|thu|fri|sat|sun  (atajo)
 */
export function getDebugDateFromQuery() {
  try {
    const params = new URLSearchParams(window.location.search);
    const byDate = params.get("debugDate");
    if (byDate) {
      const d = new Date(byDate);
      return isNaN(d) ? null : d;
    }

    const byDay = params.get("day");
    if (byDay) {
      const map = {
        sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
        dom: 0, lun: 1, mar: 2, mie: 3, jue: 4, vie: 5, sab: 6,
      };
      const key = byDay.toLowerCase();
      const dow = map[key];

      if (dow != null) {
        const now = new Date();
        const d = new Date(now);
        const diff = dow - now.getDay();
        d.setDate(now.getDate() + diff);
        return d;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/** ---------- Utilidades comunes ---------- */

// Verifica si un item tiene una opcion que empieza con cierto texto
function hasOption(item, startsWith) {
  if (!item.opciones || !Array.isArray(item.opciones)) return false;
  return item.opciones.some((s) => {
    if (typeof s !== "string") return false;
    return s.toLowerCase().startsWith(startsWith.toLowerCase());
  });
}

// Agrupa items expandiendo por cantidad (convierte qty=3 en 3 items de qty=1)
function groupCount(items, predicate) {
  const out = [];
  items.forEach((it) => {
    if (!it || !it.qty) return;
    for (let i = 0; i < it.qty; i++) {
      if (predicate(it)) {
        out.push({ ...it, qty: 1 });
      }
    }
  });
  return out;
}

// Redondear a 2 decimales
function r(n) {
  return Math.round(n * 100) / 100;
}

/** Lee "Ingredientes: ..." del array de opciones y los devuelve como array */
function getIngredientes(item) {
  if (!item.opciones || !Array.isArray(item.opciones)) return [];

  const row = item.opciones.find((s) => {
    if (typeof s !== "string") return false;
    return s.toLowerCase().startsWith("ingredientes:");
  });

  if (!row) return [];

  const parts = row.split(":");
  if (parts.length < 2) return [];

  const txt = parts[1] || "";
  return txt.split(",").map((x) => x.trim()).filter(Boolean);
}

/** Normaliza texto simple (acentos basicos) */
function norm(s = "") {
  if (typeof s !== "string") return "";
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isEligibleTraditionalPizzaPromo(item) {
  if (!item || item.nombre !== "Pizza Tradicional") return false;
  if ((item.nota || "").trim()) return false;
  if (!Array.isArray(item.opciones) || item.opciones.length === 0) return false;

  if (!hasOption(item, "tamano: mediana") && !hasOption(item, "tamaño: mediana")) {
    return false;
  }
  if (!hasOption(item, "orilla: normal")) return false;

  const allowedPrefixes = ["orilla:", "tamano:", "tamaño:", "ingredientes:"];

  const hasSpecialConfig = item.opciones.some((s) => {
    if (typeof s !== "string") return true;
    const txt = s.toLowerCase();

    if (
      txt.startsWith("mitad 1:") ||
      txt.startsWith("mitad 2:") ||
      txt.startsWith("mitad con pollo")
    ) {
      return true;
    }

    if (txt.includes("+$")) return true;

    return !allowedPrefixes.some((prefix) => txt.startsWith(prefix));
  });
  if (hasSpecialConfig) return false;

  const ings = getIngredientes(item).map(norm);
  if (ings.length !== 1) return false;

  return ["jamon", "pepperoni", "salchicha"].includes(ings[0]);
}

/** ---------- Sistema de Promos ---------- */

/**
 * Aplica todas las promociones activas segun el dia de la semana
 * Lunes a viernes:
 * - 2 pizzas medianas x $250
 * - 2 frappes chicos x $60
 * - 2 alitas / 2 boneless / 1 y 1 combinados x $225
 *
 * @param {Array} items - Array de items del carrito
 * @param {Date} now - Fecha actual (o debug date)
 * @returns {Object} { subtotal, discounts, total }
 */
export function applyPromos(items, now = new Date()) {
  if (!Array.isArray(items) || items.length === 0) {
    return { subtotal: 0, discounts: [], total: 0 };
  }

  const weekday = now.getDay(); // 0=Dom, 1=Lun, 2=Mar, 3=Mie, 4=Jue, 5=Vie, 6=Sab
  const isWeekday = weekday >= 1 && weekday <= 5;

  const subtotal = items.reduce(
    (s, it) => s + (it.precio || 0) * (it.qty || 0),
    0
  );

  const discounts = [];

  if (isWeekday) {
    const pizzaDiscount = applyPizzaPromo(items);
    if (pizzaDiscount) discounts.push(pizzaDiscount);

    const frappeDiscount = applyFrappePromo(items);
    if (frappeDiscount) discounts.push(frappeDiscount);

    const alitasBonelessDiscounts = applyAlitasBonelessPromo(items);
    discounts.push(...alitasBonelessDiscounts);
  }

  const totalDiscount = discounts.reduce((s, d) => s + (d.amount || 0), 0);
  const total = Math.max(0, subtotal - totalDiscount);

  return {
    subtotal: r(subtotal),
    discounts: discounts.map((d) => ({ ...d, amount: r(d.amount) })),
    total: r(total),
  };
}

/**
 * ========================================
 * PROMO 1: 2 Pizzas Medianas x $250
 * ========================================
 * Reglas:
 * - Producto: "Pizza Tradicional"
 * - Tamaño: Mediana
 * - Orilla: Normal
 * - NO combinada
 * - EXACTAMENTE 1 ingrediente
 * - Ingrediente: Jaman, Pepperoni o Salchicha
 */
function applyPizzaPromo(items) {
  const eligible = groupCount(items, isEligibleTraditionalPizzaPromo);

  if (eligible.length < 2) return null;

  const pairs = Math.floor(eligible.length / 2);
  let totalDiscount = 0;

  for (let i = 0; i < pairs; i++) {
    const a = eligible[i * 2];
    const b = eligible[i * 2 + 1];
    const realPrice = (a.precio || 0) + (b.precio || 0);
    const comboPrice = 250;
    totalDiscount += Math.max(0, realPrice - comboPrice);
  }

  if (totalDiscount > 0) {
    return {
      label: `🍕 Promo: ${pairs} ${pairs === 1 ? "par" : "pares"} de Pizzas Medianas x $250`,
      amount: totalDiscount,
      detail:
        "2 Pizzas Tradicionales medianas, orilla normal, 1 ingrediente: Jaman, Pepperoni o Salchicha",
    };
  }

  return null;
}

/**
 * ========================================
 * PROMO 2: 2 Frappes Chicos x $60
 * ========================================
 * Reglas:
 * - Producto: "Frappuccino"
 * - Tamaño: Chica
 * - Por cada par, precio fijo de $60
 */
function applyFrappePromo(items) {
  const eligible = groupCount(items, (it) => {
    if (it.nombre !== "Frappuccino") return false;
    if (!hasOption(it, "tamano: chica") && !hasOption(it, "tamaño: chica")) {
      return false;
    }
    return true;
  });

  if (eligible.length < 2) return null;

  const pairs = Math.floor(eligible.length / 2);
  let totalDiscount = 0;

  for (let i = 0; i < pairs; i++) {
    const a = eligible[i * 2];
    const b = eligible[i * 2 + 1];
    const realPrice = (a.precio || 0) + (b.precio || 0);
    const comboPrice = 60;
    totalDiscount += Math.max(0, realPrice - comboPrice);
  }

  if (totalDiscount > 0) {
    return {
      label: `🥤 Promo: ${pairs} ${pairs === 1 ? "par" : "pares"} de Frappes Chicos x $60`,
      amount: totalDiscount,
      detail: "Aplica en Frappuccino tamaño chico",
    };
  }

  return null;
}

/**
 * ========================================
 * PROMO 3: 2 Alitas / 2 Boneless / 1 y 1 x $225
 * ========================================
 * Reglas:
 * - Producto: "Alitas (12 piezas)" o "Boneless (400g)"
 * - Se pueden combinar entre si
 * - Por cada par, precio fijo de $225
 */
function applyAlitasBonelessPromo(items) {
  const discounts = [];

  const eligible = groupCount(items, (it) => {
    return it.nombre === "Alitas (12 piezas)" || it.nombre === "Boneless (400g)";
  });

  if (eligible.length < 2) return discounts;

  const pairs = Math.floor(eligible.length / 2);

  for (let i = 0; i < pairs; i++) {
    const a = eligible[i * 2];
    const b = eligible[i * 2 + 1];
    const realPrice = (a.precio || 0) + (b.precio || 0);
    const comboPrice = 225;
    const discount = Math.max(0, realPrice - comboPrice);

    if (discount > 0) {
      const nombres = [a.nombre, b.nombre];

      let detail = "2 ordenes por $225";
      if (
        nombres.includes("Alitas (12 piezas)") &&
        nombres.includes("Boneless (400g)")
      ) {
        detail = "1 orden de Alitas + 1 orden de Boneless por $225";
      } else if (
        nombres[0] === "Alitas (12 piezas)" &&
        nombres[1] === "Alitas (12 piezas)"
      ) {
        detail = "2 ordenes de Alitas (12 piezas) por $225";
      } else if (
        nombres[0] === "Boneless (400g)" &&
        nombres[1] === "Boneless (400g)"
      ) {
        detail = "2 ordenes de Boneless (400g) por $225";
      }

      discounts.push({
        label: "🍗 Promo: 2 Alitas / Boneless x $225",
        amount: discount,
        detail,
      });
    }
  }

  return discounts;
}

/**
 * ========================================
 * Funcion de utilidad para debug
 * ========================================
 */
export function testPromo(items, dayName) {
  const dayMap = {
    lunes: 1,
    monday: 1,
    martes: 2,
    tuesday: 2,
    miercoles: 3,
    wednesday: 3,
    jueves: 4,
    thursday: 4,
    viernes: 5,
    friday: 5,
  };

  const day = dayMap[dayName.toLowerCase()];
  if (day == null) {
    console.error("Dia invalido. Usa: lunes, martes, miercoles, jueves o viernes");
    return null;
  }

  const testDate = new Date();
  const diff = day - testDate.getDay();
  testDate.setDate(testDate.getDate() + diff);

  return applyPromos(items, testDate);
}
