// src/components/OptionsModal.jsx - MEJORADO CON CARDS VISUALES
import { useEffect, useMemo, useRef, useState } from "react";
import { getPrecioProd } from "../utils/pricing";
import { imagenesProductos } from "../data/images";

// Configuración de tamaños de pizza
const PIZZA_SIZES_INFO = {
  "Personal": {
    emoji: "🍕",
    piezas: "8 rebanadas chicas",
    personas: "1 persona",
    maxIngredientes: 2,
    icon: "👤"
  },
  "Mediana": {
    emoji: "🍕🍕",
    piezas: "8 rebanadas medianas",
    personas: "2-3 personas",
    maxIngredientes: 3,
    icon: "👑",
    popular: true
  },
  "Familiar": {
    emoji: "🍕🍕🍕",
    piezas: "12 rebanadas medianas",
    personas: "4-5 personas",
    maxIngredientes: 3,
    icon: "👨‍👩‍👧‍👦"
  },
  "Cuadrada": {
    emoji: "🍕🍕",
    piezas: "20 rebanadas chicas",
    personas: "6-8 personas",
    maxIngredientes: 3,
    icon: "🎉"
  }
};

export default function OptionsModal({
  open,
  prod,
  onClose,
  onAdd,
  priceOverride = null,
  onView,
}) {
  const isPizzaTrad = prod?.nombre === "Pizza Tradicional";
  const exclusivas = prod?.opciones?.saboresDobles || ["Hawaiana", "Mexicana"];
  const salsasPollo = prod?.opciones?.salsa || ["BBQ", "Buffalo", "Mango Habanero"];

  const [data, setData] = useState({});
  const [qty, setQty] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const notaRef = useRef(null);

  const imgSrc =
    (prod && (imagenesProductos?.[prod.nombre] || prod.img)) ||
    "/assets/fondo.webp";

  useEffect(() => {
    if (!prod) return;
    const d = {};
    
    // Inicializar valores por defecto
    if (prod.opciones?.tamaño) d.tamaño = prod.opciones.tamaño[0];
    if (prod.opciones?.orilla) d.orilla = prod.opciones.orilla[0];
    if (prod.opciones?.salsa) d.salsa = prod.opciones.salsa[0];
    if (prod.opciones?.sabor) d.sabor = prod.opciones.sabor[0];
    if (prod.opciones?.tipo) d.tipo = prod.opciones.tipo[0];
    if (prod.opciones?.proteína) d.proteína = prod.opciones.proteína[0];
    if (prod.opciones?.huevo) d.huevo = prod.opciones.huevo[0];
    if (prod.opciones?.tortillas) d.tortillas = prod.opciones.tortillas[0];
    if (prod.opciones?.acompañamiento) d.acompañamiento = prod.opciones.acompañamiento[0];
    if (prod.opciones?.bebida) d.bebida = prod.opciones.bebida[0];
    if (prod.opciones?.aderezo) d.aderezo = prod.opciones.aderezo[0];
    
    // Para orilla rellena, inicializar tipo de queso
    if (prod.opciones?.orilla && prod.opciones.orilla.includes("Rellena")) {
      d.tipoQueso = "Philadelphia"; // Default
    }
    
    setData(d);
    setQty(1);
    setSelectedExtras([]);
    if (notaRef.current) notaRef.current.value = "";
  }, [prod]);

  const precioUnit = useMemo(() => {
    if (!prod) return 0;
    let p = 0;
    if (priceOverride && data?.tamaño) {
      const ov = priceOverride[data.tamaño];
      if (Array.isArray(ov)) {
        const isRellena = data.orilla === "Rellena";
        p = isRellena ? ov[1] : ov[0];
      } else if (typeof ov === "number") {
        p = ov;
      }
    } else {
      p = getPrecioProd(prod, data);
    }
    
    // Sumar precio de extras
    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.precio, 0);
    return p + extrasTotal;
  }, [prod, data, priceOverride, selectedExtras]);

  const total = useMemo(() => precioUnit * (qty || 1), [precioUnit, qty]);

  if (!open || !prod) return null;

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const setField = (k, v) => setData((p) => ({ ...p, [k]: v }));

  const toggleFromArray = (k, val, max, exclusivasArr = []) => {
    setData((prev) => {
      const curr = new Set(prev[k] || []);
      const isOn = curr.has(val);
      const pickedExclusive = exclusivasArr.includes(val);
      const alreadyExclusiveOn = [...curr].some((x) => exclusivasArr.includes(x));

      if (isOn) curr.delete(val);
      else {
        if (pickedExclusive) return { ...prev, [k]: [val] };
        if (alreadyExclusiveOn) return prev;
        if (max && curr.size >= max) return prev;
        curr.add(val);
      }
      return { ...prev, [k]: [...curr] };
    });
  };

  // Renderizar selector con mejor estilo
  const renderSelect = (label, name, options, helpText = null) => (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1.5 text-gray-700">
        {label}
      </label>
      <select
        className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
        value={data[name] || options[0]}
        onChange={(e) => setField(name, e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    </div>
  );

  const renderChecks = (label, name, options, max, exclusivasArr = [], disabledAll = false) => {
    const sel = new Set(data[name] || []);
    const exclusiveSelected = [...sel].find((x) => exclusivasArr.includes(x));

    return (
      <div className="mb-3">
        <div className="text-sm font-medium mb-1.5 text-gray-700">
          {label} {max ? <span className="text-gray-400 font-normal">(máx {max})</span> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => {
            const on = sel.has(o);
            const disabledByExclusive = exclusiveSelected && !on && !exclusivasArr.includes(o);
            const disabledByMax = !on && max && sel.size >= max;
            const disabled = disabledAll || disabledByExclusive || disabledByMax;

            return (
              <button
                key={o}
                type="button"
                className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                  on 
                    ? "bg-red-600 text-white border-red-600 shadow-md" 
                    : "bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:bg-red-50"
                } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={() => { if (!disabled) toggleFromArray(name, o, max, exclusivasArr); }}
              >
                {on && <span className="mr-1">✓</span>}
                {o}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ====== UI Pizza Tradicional con CARDS ======
  const PizzaTradUI = () => {
    const tamanos = prod.opciones?.tamano || [];
    const maxPorTam = prod.opciones?.maxIngredientes || {};
    const baseIngs = prod.opciones?.ingredientes || [];
    const tam = data.tamano || tamanos[0];
    const tamInfo = PIZZA_SIZES_INFO[tam] || {};
    const esPersonal = tam === "Personal";
    const maxIng = maxPorTam[tam] || tamInfo.maxIngredientes || 2;
    const mitad2TienePollo = !!(data.mitad2 || []).includes("Pollo");

    // Precio extra por mitad de pollo según tamaño
    const PRECIO_MITAD_POLLO = { Personal: 30, Mediana: 40, Familiar: 45, Cuadrada: 40 };
    const precioPolloExtra = PRECIO_MITAD_POLLO[tam] || 30;

    return (
      <>
        {/* PASO 1: Tamaño con cards */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            🍕 PASO 1: Elige tu tamaño
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {tamanos.map((t, idx) => {
              const info = PIZZA_SIZES_INFO[t] || {};
              const isSelected = tam === t;
              const precioBase = Array.isArray(prod.precio?.[idx]) ? prod.precio[idx][0] : prod.precio?.[idx] || 0;
              
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setField("tamano", t)}
                  className={`relative p-3 rounded-2xl border-2 transition-all text-left ${
                    isSelected 
                      ? "border-red-600 bg-red-50 shadow-lg" 
                      : "border-gray-200 bg-white hover:border-red-300"
                  }`}
                >
                  {info.popular && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full">
                      🔥 Popular
                    </div>
                  )}
                  
                  <div className="text-3xl mb-1">{info.emoji || "🍕"}</div>
                  <div className="font-bold text-gray-900 mb-1">{t}</div>
                  
                  <div className="text-xs text-gray-600 space-y-0.5 mb-2">
                    <div className="flex items-center gap-1">
                      <span>{info.icon}</span>
                      <span>{info.personas}</span>
                    </div>
                    <div>{info.piezas}</div>
                    <div>{info.maxIngredientes} ingredientes</div>
                  </div>
                  
                  <div className="text-base font-bold text-red-600">
                    Desde ${precioBase}
                  </div>
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* PASO 2: Orilla */}
        <div className="mb-4 pb-4 border-b">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            🧀 PASO 2: Elige tu orilla
          </h3>
          
          <div className="space-y-2">
            {(prod.opciones?.orilla || ["Normal"]).map((orilla) => {
              const isSelected = (data.orilla || "Normal") === orilla;
              const isRellena = orilla === "Rellena";
              const idx = Math.max(0, tamaños.indexOf(tam));
              const precioBaseNormal = Array.isArray(prod.precio)
                ? (prod.precio[idx] ?? prod.precio[0] ?? 0)
                : 0;
              const precioBaseRellena = Array.isArray(prod.precioOrillaRellena)
                ? (prod.precioOrillaRellena[idx] ?? precioBaseNormal)
                : precioBaseNormal + 30;
              const precioExtra = isRellena
                ? Math.max(0, precioBaseRellena - precioBaseNormal)
                : 0;

              return (
                <div key={orilla}>
                  <button
                    type="button"
                    onClick={() => {
                      setField("orilla", orilla);
                      if (isRellena && !data.tipoQueso) {
                        setField("tipoQueso", "Philadelphia");
                      }
                    }}
                    className={`w-full p-3 rounded-xl border-2 transition-all text-left flex items-center justify-between ${
                      isSelected 
                        ? "border-red-600 bg-red-50" 
                        : "border-gray-200 bg-white hover:border-red-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-red-600 bg-red-600" : "border-gray-300"
                      }`}>
                        {isSelected && <span className="text-white text-xs">✓</span>}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {isRellena ? "🧀 Rellena de queso" : "🍞 Normal"}
                        </div>
                        {isRellena && (
                          <div className="text-xs text-gray-600">
                            Philadelphia o Chihuahua
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="font-bold text-gray-900">
                      {precioExtra > 0 ? `+$${precioExtra}` : "Incluida"}
                    </div>
                  </button>

                  {/* Selector de tipo de queso si eligió Rellena */}
                  {isSelected && isRellena && (
                    <div className="mt-2 ml-8 p-3 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de queso:
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setField("tipoQueso", "Philadelphia")}
                          className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            data.tipoQueso === "Philadelphia"
                              ? "border-red-600 bg-red-600 text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-red-400"
                          }`}
                        >
                          {data.tipoQueso === "Philadelphia" && "✓ "}
                          Philadelphia
                        </button>
                        <button
                          type="button"
                          onClick={() => setField("tipoQueso", "Chihuahua")}
                          className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            data.tipoQueso === "Chihuahua"
                              ? "border-red-600 bg-red-600 text-white"
                              : "border-gray-300 bg-white text-gray-700 hover:border-red-400"
                          }`}
                        >
                          {data.tipoQueso === "Chihuahua" && "✓ "}
                          Chihuahua
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* PASO 3: Combinada o Normal */}
        <div className="mb-4 pb-4 border-b">
          <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 bg-gray-50 cursor-pointer hover:border-red-300 transition">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
              checked={!!data.combinada}
              onChange={(e) =>
                setData((p) => ({
                  ...p,
                  combinada: e.target.checked,
                  ingredientes: [],
                  mitad1: [],
                  mitad2: [],
                  salsaPollo: undefined,
                }))
              }
            />
            <div>
              <div className="font-semibold text-gray-900">¿Pizza combinada (mitad y mitad)?</div>
              <div className="text-xs text-gray-600">Diferentes ingredientes en cada mitad</div>
            </div>
          </label>
        </div>

        {/* PASO 4: Ingredientes */}
        <div className="mb-4 pb-4 border-b">
          <h3 className="text-base font-bold text-gray-900 mb-3">
            🧂 PASO {data.combinada ? "4" : "3"}: Elige tus ingredientes (máx {maxIng})
          </h3>

          {data.combinada ? (
            <>
              {esPersonal ? (
                <>
                  {renderChecks("Mitad 1", "mitad1", baseIngs, 2, exclusivas)}
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-1.5 text-gray-700">Mitad 2 (solo Pollo)</div>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                        mitad2TienePollo 
                          ? "bg-red-600 text-white border-red-600 shadow-md" 
                          : "bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:bg-red-50"
                      }`}
                      onClick={() =>
                        setData((p) => ({ ...p, mitad2: mitad2TienePollo ? [] : ["Pollo"] }))
                      }
                    >
                      {mitad2TienePollo && <span className="mr-1">✓</span>}
                      Pollo (+${precioPolloExtra})
                    </button>
                  </div>
                  {mitad2TienePollo && renderSelect("Salsa del Pollo", "salsaPollo", salsasPollo)}
                </>
              ) : (
                <>
                  {renderChecks("Mitad 1", "mitad1", baseIngs, Math.min(maxIng, 3), exclusivas)}
                  {renderChecks("Mitad 2", "mitad2", [...baseIngs, "Pollo"], Math.min(maxIng, 3), exclusivas)}
                  {mitad2TienePollo && renderSelect("Salsa del Pollo", "salsaPollo", salsasPollo)}
                </>
              )}
              <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                ℹ️ "Hawaiana" y "Mexicana" ocupan toda una mitad. "Pollo" en mitad 2 tiene costo extra de +${precioPolloExtra}.
              </p>
            </>
          ) : (
            <>
              {renderChecks(`Ingredientes`, "ingredientes", baseIngs, maxIng, exclusivas)}
              <p className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-2 mt-2">
                ℹ️ "Hawaiana" y "Mexicana" cuentan como 2 ingredientes.
              </p>
            </>
          )}
        </div>

        {/* PASO 5: Mitad con Pollo (solo si NO es combinada) */}
        {!data.combinada && (
          <div className="mb-4 pb-4 border-b">
            <h3 className="text-base font-bold text-gray-900 mb-3">
              🐔 ¿Quieres mitad con POLLO? (+${precioPolloExtra})
            </h3>
            
            <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-200 bg-white cursor-pointer hover:border-red-300 transition">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                checked={!!(data.mitad2 || []).includes("Pollo")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setData((p) => ({ ...p, mitad2: ["Pollo"] }));
                  } else {
                    setData((p) => ({ ...p, mitad2: [], salsaPollo: undefined }));
                  }
                }}
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Sí, quiero mitad con pollo</div>
                <div className="text-xs text-gray-600">Precio extra: +${precioPolloExtra}</div>
              </div>
            </label>

            {!!(data.mitad2 || []).includes("Pollo") && (
              <div className="mt-3">
                {renderSelect("Elige la salsa del pollo", "salsaPollo", salsasPollo)}
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  // ====== Opciones Genéricas ======
  const noteId = `nota-${prod?.nombre?.replace(/\s+/g, "-")}`;
  
  const GenericOptions = () => {
    if (isPizzaTrad) return null;

    return (
      <>
        {prod.opciones?.tamaño && renderSelect("Tamaño", "tamaño", prod.opciones.tamaño)}
        {prod.opciones?.orilla && renderSelect("Orilla", "orilla", prod.opciones.orilla)}
        {prod.opciones?.sabor && (
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Sabor 🍫
            </label>
            <div className="grid grid-cols-2 gap-2">
              {prod.opciones.sabor.map((sabor) => (
                <button
                  key={sabor}
                  type="button"
                  className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    data.sabor === sabor
                      ? "bg-red-600 text-white border-red-600 shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:bg-red-50"
                  }`}
                  onClick={() => setField("sabor", sabor)}
                >
                  {data.sabor === sabor && <span className="mr-1">✓</span>}
                  {sabor}
                </button>
              ))}
            </div>
          </div>
        )}
        {prod.opciones?.salsa && (
          <>
            {renderSelect("Salsa", "salsa", prod.opciones.salsa)}
            {prod.opciones?.combinadas?.enabled && data.salsa === "Combinadas" && (
              <div className="mt-2">
                {renderChecks(
                  `Salsas combinadas`,
                  "salsacomb",
                  prod.opciones.salsa.filter((s) => s !== "Combinadas"),
                  prod.opciones.combinadas.max
                )}
              </div>
            )}
          </>
        )}
        {["tipo", "proteína", "huevo", "tortillas", "acompañamiento", "bebida", "aderezo"].map((k) =>
          prod.opciones?.[k] ? renderSelect(cap(k), k, prod.opciones[k]) : null
        )}
        {prod.opciones?.ingredientes && !isPizzaTrad &&
          renderChecks(`Ingredientes`, "ingredientes", prod.opciones.ingredientes, prod.opciones.maxIngredientes || 2)}
        {prod.opciones?.frutas &&
          renderChecks(`Frutas`, "frutas", prod.opciones.frutas, prod.opciones.maxFrutas || 2)}

        {/* Extras */}
        {prod.extras && prod.extras.length > 0 && (
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1.5 text-gray-700">
              Extras 🎁
            </label>
            <div className="space-y-2">
              {prod.extras.map((extra) => {
                const isSelected = selectedExtras.some(e => e.nombre === extra.nombre);
                const selectedExtra = selectedExtras.find(e => e.nombre === extra.nombre);
                
                return (
                  <div key={extra.nombre}>
                    <button
                      type="button"
                      className={`w-full px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all text-left flex justify-between items-center ${
                        isSelected
                          ? "bg-red-600 text-white border-red-600 shadow-md"
                          : "bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:bg-red-50"
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedExtras(prev => prev.filter(e => e.nombre !== extra.nombre));
                        } else {
                          const newExtra = { ...extra };
                          if (extra.opciones && extra.opciones.length > 0) {
                            newExtra.opcionSeleccionada = extra.opciones[0];
                          }
                          setSelectedExtras(prev => [...prev, newExtra]);
                        }
                      }}
                    >
                      <span>
                        {isSelected && <span className="mr-1">✓</span>}
                        {extra.nombre}
                      </span>
                      <span className="text-xs">+${extra.precio}</span>
                    </button>
                    
                    {/* Si el extra tiene opciones y está seleccionado, mostrar selector */}
                    {isSelected && extra.opciones && extra.opciones.length > 0 && (
                      <div className="mt-2 ml-4">
                        <select
                          value={selectedExtra?.opcionSeleccionada || extra.opciones[0]}
                          onChange={(e) => {
                            setSelectedExtras(prev => 
                              prev.map(ex => 
                                ex.nombre === extra.nombre 
                                  ? { ...ex, opcionSeleccionada: e.target.value }
                                  : ex
                              )
                            );
                          }}
                          className="w-full px-3 py-2 bg-white border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-red-500"
                        >
                          {extra.opciones.map(opcion => (
                            <option key={opcion} value={opcion}>
                              {opcion}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-4">
          <label htmlFor={noteId} className="block text-sm font-medium mb-1.5 text-gray-700">
            Nota especial (opcional)
          </label>
          <textarea
            id={noteId}
            ref={notaRef}
            className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
            rows={3}
            maxLength={120}
            autoComplete="off"
            inputMode="text"
            placeholder="Ej. Sin cebolla, extra salsa, etc."
            onKeyDown={(e) => {
              if (e.key === "Enter") e.preventDefault();
            }}
          />
          <p className="text-xs text-gray-400 mt-1">Máx. 120 caracteres</p>
        </div>
      </>
    );
  };

  // ====== Validaciones ======
  const validar = () => {
    if (isPizzaTrad) {
      const tam = data.tamaño;
      const esPersonal = tam === "Personal";
      
      // Validar tipo de queso si eligió orilla rellena
      if (data.orilla === "Rellena" && !data.tipoQueso) {
        alert("Elige el tipo de queso para la orilla rellena");
        return false;
      }
      
      if (data.combinada) {
        if (esPersonal) {
          if (!data.mitad1?.length) return alert("Selecciona al menos 1 ingrediente en Mitad 1."), false;
          if (!(data.mitad2 || []).includes("Pollo")) return alert("En Personal combinada, la Mitad 2 debe ser Pollo."), false;
          if (!data.salsaPollo) return alert("Elige la salsa del Pollo."), false;
        } else {
          if (!data.mitad1?.length || !data.mitad2?.length) return alert("Selecciona al menos 1 ingrediente en cada mitad."), false;
          if ((data.mitad1 || []).includes("Pollo")) return alert("Pollo solo se permite en Mitad 2."), false;
          if ((data.mitad2 || []).includes("Pollo") && !data.salsaPollo) return alert("Elige la salsa del Pollo."), false;
        }
      } else {
        if (!data.ingredientes?.length) return alert("Selecciona al menos 1 ingrediente."), false;
        
        // Si eligió mitad con pollo (sin ser combinada)
        if ((data.mitad2 || []).includes("Pollo") && !data.salsaPollo) {
          return alert("Elige la salsa del Pollo."), false;
        }
      }
    }
    
    if (prod.opciones?.combinadas?.enabled && data.salsa === "Combinadas") {
      const n = data.salsacomb?.length || 0;
      if (n < 1 || n > prod.opciones.combinadas.max) {
        alert(`Elige entre 1 y ${prod.opciones.combinadas.max} salsas.`);
        return false;
      }
    }
    
    return true;
  };

  const handleAdd = () => {
    if (!validar()) return;

    const notaFinal = notaRef.current?.value || "";

    const opts = [];
    if (isPizzaTrad) {
      if (data.orilla) {
        if (data.orilla === "Rellena" && data.tipoQueso) {
          opts.push(`Orilla: Rellena (${data.tipoQueso})`);
        } else {
          opts.push(`Orilla: ${data.orilla}`);
        }
      }
      if (data.tamaño) opts.push(`Tamaño: ${data.tamaño}`);
      if (data.combinada) {
        if (data.mitad1?.length) opts.push(`Mitad 1: ${data.mitad1.join(", ")}`);
        if (data.mitad2?.length) {
          const mit2 = [...data.mitad2];
          const tienePollo = mit2.includes("Pollo");
          if (tienePollo && data.salsaPollo) {
            opts.push(`Mitad 2: Pollo (${data.salsaPollo})`);
            const otros = mit2.filter((x) => x !== "Pollo");
            if (otros.length) opts.push(`Mitad 2 extra: ${otros.join(", ")}`);
          } else {
            opts.push(`Mitad 2: ${mit2.join(", ")}`);
          }
        }
      } else {
        if (data.ingredientes?.length) {
          opts.push(`Ingredientes: ${data.ingredientes.join(", ")}`);
        }
        // Si tiene mitad con pollo (pero NO es combinada)
        if ((data.mitad2 || []).includes("Pollo") && data.salsaPollo) {
          opts.push(`Mitad con Pollo (${data.salsaPollo})`);
        }
      }
    } else {
      Object.entries(data).forEach(([k, v]) => {
        if (!v) return;
        if (Array.isArray(v)) opts.push(`${cap(k)}: ${v.join(", ")}`);
        else opts.push(`${cap(k)}: ${v}`);
      });
    }

    // Agregar extras a las opciones
    if (selectedExtras.length > 0) {
      selectedExtras.forEach(extra => {
        const nombreCompleto = extra.opcionSeleccionada 
          ? `${extra.nombre} ${extra.opcionSeleccionada}` 
          : extra.nombre;
        opts.push(`${nombreCompleto} (+$${extra.precio})`);
      });
    }

    onAdd({
      key: prod.nombre + JSON.stringify({ ...data, _n: !!notaFinal, _extras: selectedExtras.map(e => e.nombre) }) + (notaFinal || ""),
      nombre: prod.nombre,
      precio: precioUnit,
      qty,
      nota: notaFinal,
      opciones: opts,
    });
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      />

      <div
        className="fixed inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[680px] z-50 max-h-[95vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[95vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header fijo */}
          <div className="flex-shrink-0 p-5 sm:p-6 pb-3 border-b">
            <button
              type="button"
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 text-2xl leading-none z-10"
              onClick={onClose}
              aria-label="Cerrar"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold text-gray-900 pr-12">{prod.nombre}</h3>
            {prod.desc && <p className="text-sm text-gray-600 mt-1">{prod.desc}</p>}
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 pt-3">
            <div className="space-y-3">
              {isPizzaTrad ? <PizzaTradUI /> : null}
              <GenericOptions />
            </div>
          </div>

          {/* Footer fijo */}
          <div className="flex-shrink-0 p-5 sm:p-6 pt-3 border-t-2 border-gray-200 bg-white rounded-b-3xl sm:rounded-b-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 border-2 border-gray-300 rounded-xl px-3 py-2 bg-white">
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-xl font-bold"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Disminuir cantidad"
                >
                  −
                </button>
                <span className="w-10 text-center font-semibold text-lg">{qty}</span>
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-xl font-bold"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
              
              <div className="flex-1 text-lg font-bold text-gray-900">
                Total: <span className="text-red-600">${total.toLocaleString()}</span>
              </div>
              
              <button 
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold hover:from-red-700 hover:to-red-600 transition-all shadow-md hover:shadow-lg" 
                onClick={handleAdd}
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
