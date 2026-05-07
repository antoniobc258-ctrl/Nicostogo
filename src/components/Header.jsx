// src/components/Header.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthProvider";
// import LoginModal from "./LoginModal";

export default function Header() {
  // const { user, profile, logout } = useAuth();
  // const [showLogin, setShowLogin] = useState(false);

  return (
    <header className="relative h-64 md:h-80 w-full overflow-hidden">
      {/* Botón de login arriba a la derecha (OCULTO TEMPORALMENTE) */}
      {/*
      <div className="absolute top-3 right-3 z-20">
        {user ? (
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur px-3 py-1 rounded">
            <span className="text-sm">
              Hola, <b>{profile?.displayName || user.email}</b>
            </span>
            <button
              className="text-sm border rounded px-2 py-1"
              onClick={logout}
            >
              Salir
            </button>
          </div>
        ) : (
          <button
            className="text-sm border bg-white/80 backdrop-blur rounded px-3 py-1"
            onClick={() => setShowLogin(true)}
          >
            Entrar / Registrarse
          </button>
        )}
      </div>
      */}

      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/fondo.webp')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <img
          src="/assets/logo-nicos.webp"
          alt="Nico's Pizza"
          className="h-20 md:h-24 w-auto mb-3 drop-shadow-lg"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
          Menú Nico's
        </h1>
        <p className="text-white/90 text-sm md:text-base mt-1">
          Haz tu pedido fácil y rápido
        </p>
      </div>

      {/* LoginModal deshabilitado */}
      {/* <LoginModal open={showLogin} onClose={() => setShowLogin(false)} /> */}
    </header>
  );
}
