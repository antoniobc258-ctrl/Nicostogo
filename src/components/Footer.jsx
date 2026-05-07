// src/components/Footer.jsx
export default function Footer() {
  const year = new Date().getFullYear();

  const BRAND = "Nico's Pizza";
  const ADDRESS = "Badiraguato, Sinaloa";
  const MAPS_URL =
    "https://www.google.com/maps/search/?api=1&query=Nico%27s+Pizza+Badiraguato";
  const IG_URL = "https://www.instagram.com/nicospizza_/";
  const FB_URL = "https://www.facebook.com/nicospizzabadiraguato";
  const WA_URL = "https://wa.me/526971029287";

  return (
    <footer className="mt-10 border-t bg-white/70">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {/* Marca y redes */}
          <div>
            <div className="flex items-center gap-2">
              <img
                src="/assets/logo-nicos.webp"
                alt="Logo Nico's"
                className="h-9 w-auto object-contain"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                width="100"
                height="100"
              />
              <h3 className="text-lg font-semibold">{BRAND}</h3>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              Haz tu pedido fácil y rápido por WhatsApp.
            </p>

            <div className="mt-3 flex items-center gap-3">
              {/* Redes */}
              <a
                href={IG_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm0 2h10c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3zm9.5 1.8a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
                </svg>
                Instagram
              </a>
              <a
                href={FB_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.7V12h2.7V9.8c0-2.7 1.6-4.3 4-4.3 1.2 0 2.5.2 2.5.2v2.7H15c-1.4 0-1.8.9-1.8 1.8V12h3.1l-.5 2.9h-2.6v7A10 10 0 0022 12z" />
                </svg>
                Facebook
              </a>
              <a
                href={WA_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm text-green-700 hover:bg-green-50"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M20.5 3.5A11 11 0 107 20.8l-2.5.8.8-2.5A11 11 0 1020.5 3.5zM6.7 18l.2.2c1.5.9 3.1 1.3 4.8 1.3A9 9 0 1012 3a9 9 0 00-7.6 13.7l.2.2-.5 1.6 1.6-.5zM16.7 14c-.2-.1-1.4-.7-1.6-.8-.2-.1-.3-.1-.5.1-.1.2-.6.8-.7.9-.1.1-.3.2-.5.1-1-.4-1.9-1.1-2.6-2-.2-.3.2-.4.4-.6.2-.2.3-.3.4-.5.1-.2 0-.3 0-.5 0-.1-.5-1.3-.7-1.7-.2-.4-.3-.4-.6-.4h-.5c-.2 0-.5.2-.6.4-.2.2-.8.8-.8 2s.8 2.3 1 2.6c.2.3 1.6 2.4 3.9 3.3.5.2.9.3 1.2.4.5.1 1 .1 1.4.1.4 0 1.4-.3 1.6-1 .2-.7.2-1.2.2-1.3 0-.1-.1-.2-.3-.3z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Dirección */}
          <div>
            <h4 className="text-sm font-semibold">Ubicación</h4>
            <p className="mt-1 text-sm text-gray-600">{ADDRESS}</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              Ver mapa
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M14 3l7 7-1.4 1.4-4.6-4.6V21h-2V6.8L8.4 11.4 7 10l7-7z" />
              </svg>
            </a>

            <p className="mt-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
              ⚠️ El <b>domicilio</b> se confirma según la zona.  
              El total final = <b>productos/promos + envío</b>.
            </p>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="text-sm font-semibold">Horarios</h4>
            <ul className="mt-1 space-y-1 text-sm text-gray-600">
              <li>Lunes a Domingo · 8:30 AM – 9:00 PM</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              * Horarios sujetos a cambios en días festivos.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-6 border-t">
          <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-500">
              © {year} {BRAND}. Todos los derechos reservados.
            </p>
            <div className="text-xs text-gray-500">Hecho con ❤️ · Menú en línea</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
