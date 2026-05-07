// src/utils/pricing.js
import { PRECIO_MITAD_POLLO } from "../data/menu";

// Calcula precio segÃƒÆ’Ã‚Âºn opciones elegidas en `data`
export function getPrecioProd(prod, data = {}) {
  // ÃƒÂ°Ã…Â¸Ã…Â½Ã¢â‚¬Â° PROMO: Si el producto tiene la bandera promoPizza250, precio fijo
  if (prod.promoPizza250 === true) {
    return 125; // Cada pizza de la promo cuesta $125
  }

  // Pizzas con tamaÃƒÆ’Ã‚Â±o + orilla (precio es matriz [[normal,rellena], ...])
  if (
    Array.isArray(prod.precio) &&
    prod.precio.length &&
    Array.isArray(prod.precio[0]) &&
    prod.opciones?.tamano &&
    prod.opciones?.orilla
  ) {
    const tam = data.tamano || prod.opciones.tamano[0];
    const idx = Math.max(0, prod.opciones.tamano.indexOf(tam));
    const orilla = data.orilla || "Normal";
    let base = orilla === "Rellena" ? prod.precio[idx][1] : prod.precio[idx][0];

    // Extra por "Pollo" si la segunda mitad lo incluye
    if (Array.isArray(data.mitad2) && data.mitad2.includes("Pollo")) {
      base += PRECIO_MITAD_POLLO?.[tam] || 0;
    }
    return base;
  }

  // Pizzas con tamaÃƒÆ’Ã‚Â±o + orilla usando arreglos separados:
  // `precio` = normal por tamaÃƒÆ’Ã‚Â±o, `precioOrillaRellena` = rellena por tamaÃƒÆ’Ã‚Â±o
  if (
    Array.isArray(prod.precio) &&
    prod.opciones?.tamano &&
    prod.opciones?.orilla &&
    !Array.isArray(prod.precio[0])
  ) {
    const tam = data.tamano || prod.opciones.tamano[0];
    const idx = Math.max(0, prod.opciones.tamano.indexOf(tam));
    const orilla = data.orilla || "Normal";

    let base =
      orilla === "Rellena" && Array.isArray(prod.precioOrillaRellena)
        ? (prod.precioOrillaRellena[idx] ?? prod.precio[idx] ?? prod.precio[0])
        : (prod.precio[idx] ?? prod.precio[0]);

    if (Array.isArray(data.mitad2) && data.mitad2.includes("Pollo")) {
      base += PRECIO_MITAD_POLLO?.[tam] || 0;
    }

    return base;
  }

  // Productos con tamaÃƒÆ’Ã‚Â±o pero sin orilla (precio es array plano)
  if (Array.isArray(prod.precio) && prod.opciones?.tamano && !Array.isArray(prod.precio[0])) {
    const tam = data.tamano || prod.opciones.tamano[0];
    const idx = Math.max(0, prod.opciones.tamano.indexOf(tam));
    return prod.precio[idx] ?? prod.precio[0];
  }

  // Si precio es array plano sin opciones, usa el primero
  if (Array.isArray(prod.precio)) return prod.precio[0];

  // Precio simple con posibles extras en opciones (+$XX)
  let precioBase = prod.precio || 0;
  
  // Buscar en las opciones seleccionadas si hay incrementos de precio (+$30, etc.)
  if (data && typeof data === 'object') {
    Object.values(data).forEach(valor => {
      if (typeof valor === 'string' && valor.includes('+$')) {
        // Extraer el nÃƒÆ’Ã‚Âºmero despuÃƒÆ’Ã‚Â©s de +$
        const match = valor.match(/\+\$(\d+)/);
        if (match && match[1]) {
          precioBase += parseInt(match[1], 10);
        }
      }
    });
  }
  
  return precioBase;
}
