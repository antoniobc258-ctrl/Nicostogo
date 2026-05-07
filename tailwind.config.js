// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nicos: {
          green:  "#1b8a6b", // toldo
          green2: "#127a5f", // hover
          cream:  "#efe2b5", // pared / fondo cálido
          cream2: "#f7eed1", // más claro para secciones
          accent: "#c5523c", // rojo/terracota del logo
          dark:   "#4a2e2b", // café texto/contraste
        },
      },
      boxShadow: {
        soft: "0 8px 28px rgba(0,0,0,.08)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
};
