// ================== CONSTANTES GLOBALES ==================
export const SABORES_DOBLES = ["Hawaiana", "Mexicana"];
export const PRECIO_MITAD_POLLO = { Personal: 30, Mediana: 40, Familiar: 45, Cuadrada: 40 };
export const PRECIO_ORILLA_RELLENA = { Personal: 30, Mediana: 40, Familiar: 60, Cuadrada: 100 };

export const MENU = [
  // ================== ENTRADAS ==================
  
  {
    nombre: "Entradas",
    icon: "🍟",
    productos: [
      {
        nombre: "Alitas (12 piezas)",
        precio: 150,
        desc: "12 alitas jugosas en tu salsa favorita. Puedes combinar hasta 2 salsas. Perfectas para compartir o disfrutar solo.",
        opciones: {
          salsa: ["BBQ", "Buffalo", "Mango", "Mango Habanero", "Combinadas"],
          combinadas: { enabled: true, max: 2 }
        },
        extras: [ { nombre: "Aderezo Extra", precio: 10, opciones: ["Ranch", "Chipotle", "BBQ", "Blue Cheese"] } ]
      },
      {
        nombre: "Boneless (400g)",
        precio: 150,
        desc: "400g de boneless crujientes por fuera, suaves por dentro. Elige tu salsa o combina 2 para una explosión de sabor.",
        opciones: {
          salsa: ["BBQ", "Buffalo", "Mango", "Mango Habanero", "Combinadas"],
          combinadas: { enabled: true, max: 2 }
        },
        extras: [ { nombre: "Aderezo Extra", precio: 10, opciones: ["Ranch", "Chipotle", "BBQ", "Blue Cheese"] } ]
      },
      {
        nombre: "Mini alitas (6 piezas)",
        precio: 80,
        desc: "6 alitas perfectas para un antojo rápido. Ideales como entrada o complemento de tu pedido.",
        opciones: {
          salsa: ["BBQ", "Buffalo", "Mango", "Mango Habanero", "Combinadas"],
          combinadas: { enabled: true, max: 2 }
        },
        extras: [ { nombre: "Aderezo Extra", precio: 10, opciones: ["Ranch", "Chipotle", "BBQ", "Blue Cheese"] } ]
      },
      {
        nombre: "Mini boneless (200g)",
        precio: 80,
        desc: "200g de boneless para ese antojo de media tarde. Porción individual perfecta.",
        opciones: {
          salsa: ["BBQ", "Buffalo", "Mango", "Mango Habanero", "Combinadas"],
          combinadas: { enabled: true, max: 2 }
        },
        extras: [ { nombre: "Aderezo Extra", precio: 10, opciones: ["Ranch", "Chipotle", "BBQ", "Blue Cheese"] } ]
      },
      { 
        nombre: "Cubo de queso con papas, verdura y ranch", 
        precio: 90,
        desc: "Queso fundido servido con papas crujientes, verduras frescas y salsa ranch. ¡El favorito para compartir!"
      },
      { 
        nombre: "Papas sazonadas", 
        precio: 80,
        desc: "Papas con nuestra mezcla especial de especias. Crujientes por fuera, suaves por dentro. El acompañamiento perfecto."
      },
      { 
        nombre: "Papas adobadas gajo", 
        precio: 90,
        desc: "Gajos de papa con un toque de adobo casero. Rústicas y llenas de sabor. Te van a encantar."
      },
      { 
        nombre: "Papa a la francesa", 
        precio: 80,
        desc: "Las clásicas papas francesas, doradas y crujientes. Nunca fallan."
      },
      { 
        nombre: "Papa gratinada", 
        precio: 100,
        desc: "Papa horneada con queso gratinado. Cremosa y deliciosa."
      },
      {
        nombre: "Guacamole",
        precio: 90,
        desc: "Guacamole fresco preparado al momento. Elige banderita (con pico de gallo) o con queso fundido encima.",
        opciones: { tipo: ["Banderita", "Queso"] }
      },
      {
        nombre: "Queso fundido",
        precio: 250,
        desc: "Queso fundido con tu proteína favorita. Servido con tortillas recién hechas.",
        opciones: { 
          tipo: ["Camarón", "Arrachera"],
          tortillas: ["Harina", "Maíz"]
        }
      },
      {
        nombre: "Queso fundido mixto",
        precio: 325,
        desc: "Queso fundido con camarón Y arrachera. Lo mejor de ambos mundos. Acompañado de tortillas.",
        opciones: { tortillas: ["Harina", "Maíz"] }
      }
    ]
  },
   {
    nombre: "Sushi Entradas",
    icon: "🥢",
    productos: [
      {
        nombre: "Suchiles",
        precio: 100,
        desc: "Chile caribe, philadelphia, tampico, ingrediente a elegir (camarón, res o pollo), coronado con gratinado y cebollín."
      },
      {
        nombre: "Rollitos",
        precio: 90,
        desc: "Rellenos de philadelphia, camarón, res o pollo."
      }
    ]
  },
  {
    nombre: "Sushi Arroces",
    icon: "🍚",
    productos: [
      {
        nombre: "Yakimeshi",
        precio: 125,
        desc: "Arroz frito con verdura, res, pollo y tocino, coronado con tampico, anguila y ajonjoli­."
      },
      {
        nombre: "Yakimeshi especial",
        precio: 145,
        desc: "Arroz frito con verdura, res, pollo y tocino, coronado con tampico spicy, aguacate, camarón empanizado, ajonjolí y anguila."
      },
      {
        nombre: "Gohan to",
        precio: 120,
        desc: "Arroz blanco, coronado con tampico, philadelphia, aguacate, pollo empanizado, anguila y ajonjolí."
      },
      {
        nombre: "Bomba",
        precio: 125,
        desc: "Bola de arroz empanizada, rellena de tampico, philadelphia, aguacate, pepino, pollo y camarón, bañada en salsa anguila."
      },
      {
        nombre: "Bomba especial",
        precio: 140,
        desc: "Bola de arroz empanizada, rellena de philadelphia, pepino, tampico, tocino y camarón, coronada con gratinado spicy, aguacate y salsa anguila."
      }
    ]
  },
  {
    nombre: "Sushi Empanizados",
    icon: "🍤",
    productos: [
      {
        nombre: "Mar y tierra",
        precio: 105,
        desc: "Philadelphia, pepino, aguacate, alga, camarón y res."
      },
      {
        nombre: "Cielo, mar y tierra",
        precio: 115,
        desc: "Philadelphia, pepino, aguacate, alga, pollo, res y camarón."
      },
      {
        nombre: "Tres quesos",
        precio: 115,
        desc: "Philadelphia, pepino, aguacate, alga, res y pollo, coronado con un gratinado de tres quesos."
      },
      {
        nombre: "Guamuchilito",
        precio: 130,
        desc: "Philadelphia, pepino, aguacate, alga, surimi y camarón, coronado con tampico, rodajas de aguacate, anguila y ajonjolí."
      },
      {
        nombre: "Greñas roll",
        precio: 135,
        desc: "Philadelphia, pepino, aguacate, alga, camarón empanizado, coronado con tiras de surimi mezcladas con aderezo de mostaza."
      },
      {
        nombre: "Camaron blue",
        precio: 130,
        desc: "Philadelphia, pepino, aguacate, alga, camarón, coronado con tampico y salsa de anguila."
      },
      {
        nombre: "Spicy roll",
        precio: 140,
        desc: "Philadelphia, pepino, aguacate, alga, res y tocino, coronado con gratinado spicy, camarón, rodajas de serrano y un toque de sriracha."
      },
      {
        nombre: "California roll",
        precio: 135,
        desc: "Philadelphia, pepino, aguacate, alga, pollo o res, coronado con gratinado y tampico."
      },
      {
        nombre: "Bonneles roll",
        precio: 140,
        desc: "Philadelphia, pepino, aguacate, alga, pollo, coronado con bonneles (BBQ, búfalo o mango habanero)."
      },
    
    ]
  },
  {
    nombre: "Sushi Naturales",
    icon: "🥑",
    productos: [
      {
        nombre: "Pulpo roll",
        precio: 140,
        desc: "Philadelphia, pepino, aguacate, alga, camarón, coronado con pulpo empanizado, bañado en aderezo de mostaza."
      },
      {
        nombre: "Avocado",
        precio: 135,
        desc: "Philadelphia, pepino, aguacate, alga, pollo, forrado de aguacate, coronado con tampico y trozos de camarón empanizado."
      },
      {
        nombre: "Manguito roll",
        precio: 130,
        desc: "Philadelphia, pepino, aguacate, alga, camarón, forrado de mango y anguila."
      },
      {
        nombre: "Cevichito roll",
        precio: 165,
        desc: "Philadelphia, pepino, aguacate, alga, camarón, coronado con ceviche especial del chef (crudo, cocido o mixto)."
      },
      {
        nombre: "Aguachile roll",
        precio: 165,
        desc: "Philadelphia, pepino, aguacate, alga, camarón, coronado con aguachile especial del chef (crudo, cocido o mixto)."
      }
    ]
  },
  {
    nombre: "Sushi Especiales",
    icon: "🔥",
    productos: [
      {
        nombre: "Nico's roll",
        precio: 140,
        desc: "Philadelphia, pepino, aguacate, alga, surimi, res y camarón, coronado con gratinado spicy, tocino y anguila."
      },
      {
        nombre: "Picocito roll",
        precio: 130,
        desc: "Philadelphia, pepino, aguacate, alga y res, coronado de gratinado con serrano y tocino."
      },
      {
        nombre: "Monchochito roll",
        precio: 160,
        desc: "Philadelphia, pepino, aguacate, alga, pollo empanizado y chile güero, forrado de aguacate, tampico y gratinado spicy con camarón, tocino y anguila."
      },
      {
        nombre: "Especial de la casa",
        precio: 150,
        desc: "Philadelphia, pepino, aguacate, alga, res, pollo y camarón, forrado con una cama de surimi, gratinado con serrano, res, bañado de aderezo de mostaza y anguila."
      },
         {
        nombre: "Campo roll",
        precio: 140,
        desc: "Philadelphia, pepino, aguacate, alga, chiles serranos, res y pollo, coronado con gratinado spicy, res, cebollita asada y aderezo de cilantro."
      }
    ]
  },
  {
    nombre: "Sushi Kids",
    icon: "🧒",
    productos: [
      {
        nombre: "Nikito roll",
        precio: 90,
        desc: "Philadelphia, pepino, aguacate, pollo, acompañado de papas francesas."
      }
    ]
  },
  // ================== DESAYUNOS ==================
  {
    nombre: "Desayunos",
    icon: "🍳",
    productos: [
      {
        nombre: "Huevos al gusto",
        desc: "Huevos preparados como más te gusten, acompañados de frijoles, chilaquiles o papa horneada. Incluye tortillas.",
        precio: 110,
        opciones: { 
          preparación: ["Revueltos", "Estrellados", "Divorciados", "Rancheros", "A la mexicana"],
          acompañamiento: ["Frijol", "Chilaquiles", "Papa horneada"] 
        },
        extras: [ 
          { nombre: "Extra Huevo", precio: 15, opciones: ["Revuelto", "Estrellado", "Cocido"] },
          { nombre: "Aguacate", precio: 15 }
        ]
      },
      {
        nombre: "Omelet",
        desc: "Omelet esponjoso con 2 ingredientes a tu elección. Acompañado de frijoles y tortillas.",
        precio: 130,
        opciones: {
          ingredientes: [
            "Pimiento",
            "Cebolla",
            "Tocino",
            "Chorizo",
            "Jamón",
            "Espinacas",
            "Champiñón",
            "Queso"
          ],
          maxIngredientes: 2
        },
        extras: [ 
          { nombre: "Extra Huevo", precio: 15, opciones: ["Revuelto", "Estrellado", "Cocido"] },
          { nombre: "Aguacate", precio: 15 }
        ]
      },
         {
      nombre: "Machaca",
      desc: "Machaca tradicional acompañada de frijoles o chilaquiles. Incluye tortillas recién hechas.",
      precio: 150,
      opciones: {
          acompañamiento: ["Frijol", "Chilaquiles"]
      },
      extras: [
        { nombre: "Extra Huevo", precio: 15, opciones: ["Revuelto", "Estrellado", "Cocido"] },
        { nombre: "Aguacate", precio: 15 },
        { nombre: "Queso extra", precio: 20 },
        { nombre: "Tocino extra", precio: 25 }
      ]
    },
      {
        nombre: "Chilaquiles",
        precio: 100,
        desc: "Totopos bañados en salsa verde o roja con queso, crema y cebolla. Acompañados de frijoles.",
        opciones: { salsa: ["Verdes", "Rojos"] },
        extras: [ 
          { nombre: "Extra Huevo", precio: 10, opciones: ["Revuelto", "Estrellado", "Cocido"] },
          { nombre: "Aguacate", precio: 15 }
        ]
      },
     
      {
        nombre: "Chilaquiles con pollo",
        precio: 130,
        desc: "Chilaquiles con pollo deshebrado en salsa a tu elección. Acompañados de frijol.",
        opciones: { salsa: ["Verdes", "Rojos"] },
        extras: [ 
          { nombre: "Extra Huevo", precio: 10, opciones: ["Revuelto", "Estrellado", "Cocido"] },
          { nombre: "Aguacate", precio: 15 }
        ]
      },
      { 
        nombre: "Pan francés (2 pzas)", 
        precio: 100, 
        desc: "2 piezas de pan francés dorado y esponjoso. Acompañado de fruta fresca y papa.",
        extras: [ 
          { nombre: "Extra Huevo", precio: 15, opciones: ["Revuelto", "Estrellado", "Cocido"] },
          { nombre: "Aguacate", precio: 15 }
        ]
      },
      { 
        nombre: "Combinación pan francés", 
        precio: 130, 
        desc: "2 piezas de pan francés con un huevo preparado a tu gusto y fruta de temporada. Desayuno completo.",
        opciones: { 
          preparaciónHuevo: ["Revuelto", "Estrellado", "Cocido"]
        },
        extras: [ 
          { nombre: "Extra Huevo", precio: 15, opciones: ["Revuelto", "Estrellado", "Cocido"] },
          { nombre: "Aguacate", precio: 15 }
        ]
      },
      { 
        nombre: "Hotcakes (3 pzas)", 
        precio: 95, 
        desc: "3 hotcakes esponjosos y dorados. Servidos con miel de maple, mantequilla y fruta de temporada.",
        extras: [ 
          { nombre: "Extra Huevo", precio: 15, opciones: ["Revuelto", "Estrellado", "Cocido"] },
          { nombre: "Aguacate", precio: 15 }
        ]
      },
      { 
        nombre: "Combinación hotcakes", 
        precio: 130, 
        desc: "3 hotcakes con 2 huevos preparados a tu gusto, fruta fresca y yoghurt. El desayuno perfecto.",
        opciones: { 
          preparaciónHuevo: ["Revueltos", "Estrellados", "Cocidos"]
        },
        extras: [ 
          { nombre: "Extra Huevo", precio: 10, opciones: ["Revuelto", "Estrellado", "Cocido"] },
          { nombre: "Aguacate", precio: 15 }
        ]
      },
      {
        nombre: "Toast de aguacate (2 pzas)",
        precio: 120,
        desc: "2 tostadas con aguacate fresco, huevo a tu elección, fruta y cubo de papa horneada. Saludable y delicioso.",
        opciones: { huevo: ["Cocido", "Estrellado"] },
        extras: [ 
          { nombre: "Extra Huevo", precio: 10, opciones: ["Revuelto", "Estrellado", "Cocido"] },
          { nombre: "Aguacate", precio: 15 }
        ]
     },
{ 
  nombre: "Sandwich Tradicional", 
  desc: "Pan integral con jamón, queso chihuahua, lechuga, tomate y aguacate. Servido con papas francesas.", 
  precio: 60 
},
{ 
  nombre: "Sandwich Especial Pollo", 
  desc: "Pan integral con pollo a la plancha, jamón, queso chihuahua, lechuga, tomate y aguacate. Con papas.", 
  precio: 70
},
{ 
  nombre: "Sandwich Panela", 
  precio: 70,
  desc: "Pan integral con queso panela asado, lechuga, tomate, aguacate y un toque de chipotle. Con papas."
},
{ 
  nombre: "Sandwich Triple", 
  precio: 75,
  desc: "Sandwich triple con jamón, queso amarillo, lechuga, tomate, aguacate y vegetales frescos. Servido con papas francesas."
},
      { 
        nombre: "Papas", 
        precio: 25,
        desc: "Porción de papas francesas para acompañar tu desayuno favorito."
      }
    ]
  },

  {
  nombre: "Pizzas",
  icon: "🍕",
  productos: [
    {
      nombre: "Pizza Tradicional",
      desc: "Arma tu pizza ideal. Elige tus ingredientes favoritos, tamaño y orilla normal o rellena de queso.",
      precio: [140, 170, 195, 300],
      precioOrillaRellena: [165, 205, 249, 390],
      opciones: {
        tamaño: ["Personal", "Mediana", "Familiar", "Cuadrada"],
        orilla: ["Normal", "Rellena"],
        ingredientes: [
          "Salchicha",
          "Jamón",
          "Pepperoni",
          "Tocino",
          "Mexicana",
          "Hawaiana"
        ],
        maxIngredientes: {
          Personal: 2,
          Mediana: 3,
          Familiar: 3,
          Cuadrada: 3
        }
      }
    },

    {
      nombre: "Pizza Pollo",
      desc: "Pechuga de pollo a la plancha con salsa a elegir: BBQ, Búfalo, Mango Habanero, Ciruela o Tamarindo.",
      precio: [180, 245, 275, 380],
      opciones: {
        tamaño: ["Personal", "Mediana", "Familiar", "Cuadrada"],
        salsa: ["BBQ", "Búfalo", "Mango Habanero", "Ciruela", "Tamarindo"]
      }
    },

    {
      nombre: "Pizza Boneless",
      desc: "Boneless crujientes preparados con la salsa de tu preferencia.",
      precio: [215, 245, 325, 420],
      opciones: {
        tamaño: ["Personal", "Mediana", "Familiar", "Cuadrada"],
        salsa: ["BBQ", "Búfalo", "Mango Habanero", "Ciruela", "Tamarindo"]
      }
    },

    {
      nombre: "Pizza Camarones",
      desc: "Camarón al mojo de ajo con cebolla y pimiento.",
      precio: [210, 255, 295, 420],
      opciones: {
        tamaño: ["Personal", "Mediana", "Familiar", "Cuadrada"]
      }
    },

    {
      nombre: "Pizza Italiana",
      desc: "Pepperoni, champiñón, aceituna negra, pimiento, cebolla y queso parmesano.",
      precio: [155, 190, 220, 330],
      opciones: {
        tamaño: ["Personal", "Mediana", "Familiar", "Cuadrada"]
      }
    },

    {
      nombre: "Pizza Badiraguato",
      desc: "Combinación especial de la casa con ingredientes selectos y balanceados.",
      precio: [160, 210, 250, 390],
      opciones: {
        tamaño: ["Personal", "Mediana", "Familiar", "Cuadrada"]
      }
    },

    {
      nombre: "Pizza Sinaloense",
      desc: "Chilorio con cebolla y cilantro.",
      precio: [150, 190, 220, 330],
      opciones: {
        tamaño: ["Personal", "Mediana", "Familiar", "Cuadrada"]
      }
    },

    {
      nombre: "Pizza Vegetariana",
      desc: "Champiñón, cebolla, pimiento y aceituna negra.",
      precio: [150, 190, 220, 330],
      opciones: {
        tamaño: ["Personal", "Mediana", "Familiar", "Cuadrada"]
      }
    },

    {
      nombre: "Pizza Estrella",
      desc: "8 rebanadas, al centro orden de alitas o boneless, papas sazonadas, crudité y toque de Philadelphia.",
      precio: 355,
      opciones: {
        centro: ["Alitas", "Boneless"]
      }
    }
  ]
},
  // ================== ENSALADAS Y SOPAS ==================
  {
    nombre: "Ensaladas y Sopas",
    icon: "🥗",
    productos: [
      {
        nombre: "Ensalada Nico's",
        desc: "La clásica ensalada Nico's con lechuga, zanahoria, pepino, crutones, pasta, pollo a la plancha y queso parmesano.",
        precio: [120, 150],
        opciones: { 
          tamaño: ["Chica", "Grande"]
        },
        extras: [ 
          { nombre: "Aderezo Extra", precio: 10, opciones: ["Ranch", "Cilantro", "Miel Mostaza"] }
        ]
      },
      {
        nombre: "Ensalada Arrachera",
        desc: "Lechuga fresca, tomate, aguacate, queso chihuahua, fritura de maíz y pimiento morrón. Con arrachera jugosa a la plancha.",
        precio: 150,
        extras: [ 
          { nombre: "Aderezo Extra", precio: 10, opciones: ["Ranch", "Cilantro", "Miel Mostaza"] }
        ]
      },
      { 
        nombre: "Ensalada Vegetales", 
        desc: "Mezcla fresca de lechugas, pepino, zanahoria rallada y pimiento morrón. Ligera y refrescante.", 
        precio: 100,
        extras: [ 
          { nombre: "Aderezo Extra", precio: 10, opciones: ["Ranch", "César", "Vinagreta", "Miel Mostaza"] }
        ]
      },
      {
        nombre: "Sopa de tortilla",
        desc: "Caldillo de tomate con pollo a la plancha, tortilla crujiente, aguacate, queso, crema y chile chipotle. Reconfortante y deliciosa.",
        precio: 110
      },
      { 
        nombre: "Fusilli", 
        desc: "Pasta fusilli en salsa de tomate casera con queso. Acompañada de pan de ajo.", 
        precio: 140,
        opciones: { proteína: ["Sin pollo", "Con pollo +$30"] }
      },
      {
        nombre: "Fusilli Alfredo",
        desc: "Pasta fettuccini en nuestra cremosa salsa Alfredo casera. Acompañada de pan de ajo.",
        precio: 180
      }
    ]
  },

  // ================== COMBOS ==================
  {
    nombre: "Combos",
    icon: "🍽️",
    productos: [
      { 
        nombre: "Combo Pizza", 
        desc: "Ensalada chica + 2 rebanadas de pizza tradicional + bebida. ¡El combo perfecto para una persona!", 
        precio: 170, 
        opciones: { bebida: ["Jamaica", "Té de la Casa"] } 
      },
      { 
        nombre: "Combo Baguette", 
        desc: "Ensalada chica + 1/4 de baguette de tu elección + bebida. Combo completo y delicioso.", 
        precio: 170, 
        opciones: { bebida: ["Jamaica", "Té de la Casa"] } 
      },
      { 
        nombre: "Nikito Pizza", 
        desc: "2 rebanadas de pizza con porción de ensalada + bebida. Ideal para niños o antojo rápido.", 
        precio: 95, 
        opciones: { bebida: ["Jamaica", "Té de la Casa"] } 
      },
      { 
        nombre: "Nikito Baguette", 
        desc: "1/4 de baguette con papas + bebida. Perfecto para los pequeños.", 
        precio: 95, 
        opciones: { bebida: ["Jamaica", "Té de la Casa"] } 
      },
      { 
        nombre: "VIP Nico's", 
        desc: "1/4 de baguette + 1/2 orden de boneless con salsa a elegir + bebida. ¡El combo VIP más completo!", 
        precio: 130, 
        opciones: { 
          bebida: ["Jamaica", "Té de la Casa"],
          salsa: ["BBQ", "Buffalo", "Mango", "Mango Habanero"]
        } 
      }
    ]
  },

  // ================== Baguettes y burger ==================
  {
    nombre: "Baguettes y burger",
    icon: "🍔",
    productos: [
      { 
        nombre: "Hamburguesa Tradicional", 
        precio: 110,
        desc: "Jugosa hamburguesa de res con lechuga fresca, tomate, cebolla, pepinillos y nuestra salsa especial. En pan artesanal con papas.",
        opciones: {
          punto: ["Término medio", "Bien cocida"],
          extras: ["Queso (+$10)", "Tocino (+$15)", "Doble carne (+$30)"]
        }
      },
      { 
        nombre: "Hamburguesa Guacamole", 
        precio: 130,
        desc: "La clásica hamburguesa de res con guacamole fresco, queso cheddar fundido, lechuga y tomate. Con papas. Una delicia mexicana."
      },
      { 
        nombre: "Hamburguesa Camarón", 
        precio: 160,
        desc: "Hamburguesa de camarón empanizado crujiente con lechuga, tomate y salsa especial de la casa. Con papas."
      },
      { 
        nombre: "Hamburguesa Pollo", 
        precio: 110,
        desc: "Pechuga de pollo jugosa a la plancha con lechuga, tomate, cebolla y aderezo. Ligera pero llena de sabor. Con papas."
      },
      { 
        nombre: "Baguette Pollo a la Plancha", 
        desc: "Baguette crujiente con pechuga de pollo a la plancha, jamón, queso philadelphia, chihuahua, lechuga, aguacate y tomate. Incluye papas.", 
        precio: 125 
      },
      { 
        nombre: "Baguette Pollo BBQ o Buffalo", 
        desc: "Baguette con pollo bañado en tu salsa favorita, lechuga fresca y queso fundido. Con papas.", 
        precio: 135, 
        opciones: { salsa: ["BBQ", "Buffalo"] } 
      },
      { 
        nombre: "Baguette Arrachera", 
        desc: "Baguette con carne arrachera suave, queso chihuahua, lechuga y salsa mexicana con aguacate. Con papas.", 
        precio: 170 
      },
      { 
        nombre: "Hamburguesa PRO", 
        desc: "Hamburguesa de res + 150g de boneless con salsa a elegir + papas. ¡El combo más completo para los que tienen hambre!", 
        precio: 175, 
        opciones: { salsa: ["BBQ", "Buffalo", "Mango Habanero"] } 
      }
    ]
  },

  // ================== MARISCOS ==================
  {
    nombre: "Mariscos",
    icon: "🦐",
    productos: [
      { 
        nombre: "Aguachile", 
        precio: 200,
        desc: "Camarón fresco marinado en limón con chile verde, pepino y cebolla morada. Picante al gusto. Refrescante y explosivo."
      },
      { 
        nombre: "Aguachile Mixto (Cocido y crudo)", 
        precio: 225,
        desc: "Mezcla de camarón crudo y cocido marinado en limón con chile verde, pepino y cebolla morada. Lo mejor de ambos mundos."
      },
      { 
        nombre: "Tostada de ceviche", 
        desc: "Tostada crujiente con ceviche fresco. Elige pescado, camarón o mixto. Preparado con jitomate, cebolla, cilantro, limón y pepino. ¡Sabor del mar!",
        precio: 120, 
        opciones: { 
          tipo: ["Mixto", "Crudo", "Cocido"] 
        } 
      },
      { 
        nombre: "Camarones Rancheros", 
        precio: 180,
        desc: "Camarones salteados con salsa ranchera casera: tomate, cebolla, chile y especias. Servidos con arroz o guarnición."
      },
      { 
        nombre: "Camarones al Mojo de Ajo", 
        precio: 180,
        desc: "Camarones dorados en mantequilla con ajo fresco y especias. Sabor intenso y aromático. Servidos con arroz."
      },
      { 
        nombre: "Brocheta de camarón", 
        precio: 220,
        desc: "Brocheta de camarones marinados y asados a la parrilla con pimientos y cebolla. Con arroz o papas."
      },
      { 
        nombre: "Brocheta de pollo", 
        precio: 220,
        desc: "Brocheta de pollo marinado a la parrilla con verduras frescas. Suave, jugosa y llena de sabor. Con arroz o papas."
      },
      { 
        nombre: "Brocheta mixta", 
        precio: 250,
        desc: "Brocheta combinada de camarón y pollo con pimientos y cebolla asada. Ideal para quien quiere probar de todo. Con arroz o papas."
      }
    ]
  },

  // ================== POSTRES ==================
  {
    nombre: "Postres",
    icon: "🍰",
    productos: [
      { 
        nombre: "Crepa Sencilla", 
        desc: "Crepa suave rellena de 2 ingredientes a tu elección. Deliciosa y versátil.", 
        precio: 60, 
        opciones: { 
          ingredientes: ["Queso Philadelphia", "Cajeta", "Mermelada", "Nutella", "Lechera", "Fresa", "Miel con Philadelphia"], 
          maxIngredientes: 2 
        } 
      },
      { 
        nombre: "Crepa Especial", 
        desc: "Crepa con 2 ingredientes a elegir + nieve de vainilla y fruta fresca. La crepa premium.", 
        precio: 85, 
        opciones: { 
          ingredientes: ["Queso Philadelphia", "Cajeta", "Mermelada", "Nutella", "Lechera", "Fresa", "Miel con Philadelphia"], 
          maxIngredientes: 2 
        } 
      },
      { 
        nombre: "Waffle", 
        desc: "Waffle dorado y esponjoso con fruta fresca, miel de maple y mantequilla. ¡Delicioso!", 
        precio: 95,
        opciones: {
          extras: ["Nutella (+$15)", "Helado (+$20)", "Cajeta (+$10)"]
        }
      },
      { 
        nombre: "Coctel de Fruta", 
        desc: "Fruta fresca de temporada con yoghurt, lechera y granola crujiente. Refrescante, saludable y delicioso.", 
        precio: 100 
      }
    ]
  },

   {
    nombre: "Frappes y Malteadas",
    icon: "🥤",
    productos: [
      {
        nombre: "Frappuccino",
        desc: "Bebida helada cremosa en 7 deliciosos sabores: Cajeta, Oreo, Moka, Nutella, Choco Chip, M&M o Caramelo. ¡Tu capricho favorito!",
        precio: [50, 80],
        opciones: {
          tamaño: ["Chica", "Grande"],
          sabor: ["Cajeta", "Oreo", "Moka", "Nutella", "Choco Chip", "M&M", "Caramelo"]
        },
        extras: [{ nombre: "Topping Extra", precio: 10 }]
      },
      {
        nombre: "Malteada de Fresa",
        precio: [55, 95],
        desc: "Malteada cremosa de fresa natural. Espesa, fría y deliciosa.",
        opciones: { tamaño: ["Chica", "Grande"] }
      },
      {
        nombre: "Malteada de Nutella (Con fresa)",
        precio: [60, 95],
        desc: "Malteada de nutella con trozos de fresa fresca. Una combinación perfecta.",
        opciones: { tamaño: ["Chica", "Grande"] }
      }
    ]
  },
  {
    nombre: "Jugos y Licuados",
    icon: "🍊",
    productos: [
      {
        nombre: "Licuado",
        desc: "Licuado natural con 2 frutas a elegir. Puedes agregar granola, miel o avena por solo $10 extra.",
        precio: [48, 75],
        opciones: {
          tamaño: ["1/2 Litro", "1 Litro"],
          frutas: ["Plátano", "Manzana", "Papaya", "Fresa", "Chocomilk"],
          maxFrutas: 2
        }
      },
      {
        nombre: "Jugo de Naranja Natural",
        precio: [45, 80],
        desc: "Jugo de naranja recién exprimido. 100% natural y lleno de vitamina C.",
        opciones: { tamaño: ["1/2 Litro", "1 Litro"] }
      },
      {
        nombre: "Jugo Verde",
        precio: [55, 85],
        desc: "Jugo verde con apio, pepino, piña y limón. Detox, refrescante y saludable.",
        opciones: { tamaño: ["1/2 Litro", "1 Litro"] }
      },
      {
        nombre: "Jugo Betabel",
        precio: [55, 85],
        desc: "Jugo de betabel con naranja y zanahoria. Energizante, saludable y delicioso.",
        opciones: { tamaño: ["1/2 Litro", "1 Litro"] }
      }
    ]
  },
  {
    nombre: "Aguas y Refrescos",
    icon: "🧊",
    productos: [
      { nombre: "Té de la Casa", precio: 25, desc: "Té helado de la casa. Refrescante y ligero." },
      { nombre: "Jaztea", precio: 25, desc: "Agua de jamaica con té. Dulce, refrescante y natural." },
      { nombre: "Refresco (Coca Cola)", precio: 30, desc: "Refresco en lata bien fría. Clásico y refrescante." },
      { nombre: "Jamaica", precio: 25, desc: "Agua de jamaica natural. Sin azúcar añadida." },
      {
        nombre: "Naranjada",
        precio: [30, 45],
        desc: "Agua fresca de naranja. Dulce, natural y refrescante.",
        opciones: { tamaño: ["1/2 Litro", "1 Litro"] }
      },
      {
        nombre: "Limonada",
        precio: [30, 45],
        desc: "Limonada natural con azúcar. Clásica, refrescante y perfecta para el calor.",
        opciones: { tamaño: ["1/2 Litro", "1 Litro"] }
      },
      {
        nombre: "Fresa-Limón",
        precio: [40, 80],
        desc: "Agua fresca de fresa con limón. Dulce, ácida y muy refrescante.",
        opciones: { tamaño: ["1/2 Litro", "1 Litro"] }
      },
      {
        nombre: "Kiwi-Limón",
        precio: [40, 80],
        desc: "Agua fresca de kiwi con limón. Exótica, diferente y refrescante.",
        opciones: { tamaño: ["1/2 Litro", "1 Litro"] }
      }
    ]
  },
  {
    nombre: "Cafés",
    icon: "☕",
    productos: [
      { nombre: "Café Americano", precio: 38, desc: "Café americano recién preparado. Caliente y aromático." },
      { nombre: "Capuchino", precio: 75, desc: "Capuchino cremoso con espuma de leche. Suave y reconfortante." },
      { nombre: "Café a las Rocas", precio: 70, desc: "Café frío servido con hielo. Refrescante y energizante." }
    ]
  },

  // ================== EXTRAS ==================
  {
    nombre: "Extras",
    icon: "➕",
    productos: [
      { 
        nombre: "Aderezo Pizza, Ranch, Cilantro", 
        precio: 10,
        desc: "Porción extra de aderezo para acompañar tu platillo favorito."
      },
      { 
        nombre: "Papas Extra", 
        precio: 25,
        desc: "Porción adicional de papas francesas crujientes."
      },
      { 
        nombre: "Fruta Extra", 
        precio: 10,
        desc: "Porción extra de fruta fresca de temporada."
      },
      { 
        nombre: "Aguacate", 
        precio: 15,
        desc: "Porción de aguacate fresco rebanado para agregar a tu platillo."
      }
    ]
  }
];

