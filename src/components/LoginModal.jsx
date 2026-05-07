// src/components/LoginModal.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";

export default function LoginModal({ open, onClose }) {
  const { loginGoogle, loginEmail, registerEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-4 w-full max-w-sm">
        <h3 className="text-lg font-bold mb-3">Inicia sesión</h3>

        <button
          onClick={async () => { await loginGoogle(); onClose(); }}
          className="w-full bg-red-600 text-white py-2 rounded mb-3"
        >
          Continuar con Google
        </button>

        <div className="space-y-2">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Correo"
            value={email} onChange={(e)=>setEmail(e.target.value)}
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Contraseña"
            value={pass} onChange={(e)=>setPass(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={async () => { await loginEmail(email, pass); onClose(); }}
              className="flex-1 border rounded py-2"
            >
              Entrar
            </button>
            <button
              onClick={async () => { await registerEmail(email, pass); onClose(); }}
              className="flex-1 border rounded py-2"
            >
              Crear cuenta
            </button>
          </div>
        </div>

        <button onClick={onClose} className="mt-4 text-sm text-gray-600 w-full">Cerrar</button>
      </div>
    </div>
  );
}
