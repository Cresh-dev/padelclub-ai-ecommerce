require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./server/models/Product");
const connectDB = require("./server/config/mongodb");

const generateMockupImage = (name, category) => {
  let icon = "📦";

  if (category === "Racchette") icon = "🏸";
  if (category === "Calzature") icon = "👟";
  if (category === "Accessori") icon = "🎾";
  if (category === "Abbigliamento") icon = "👕";
  if (category === "Borse") icon = "🎒";

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
      <rect width="100%" height="100%" fill="#0f172a"/>
      <text x="50%" y="40%" font-size="100" text-anchor="middle" dominant-baseline="middle">${icon}</text>
      <text x="50%" y="60%" font-family="system-ui, sans-serif" font-weight="bold" font-size="28" fill="#f97316" text-anchor="middle" dominant-baseline="middle">${name}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const seedProducts = async () => {
  try {
    await connectDB();

    const rawProducts = [
      {
        name: "Racchetta Head Graphene 360+",
        category: "Racchette",
        price: 199.99,
        description:
          "Racchetta professionale con tecnologia Graphene 360+, perfetta per giocatori intermedi e avanzati. Grande dolce spot e stabilità eccezionale.",
        tags: ["racchetta", "professionista", "power"],
        style: ["Professionista", "Potenza"],
        inStock: true,
        trending: true,
      },
      {
        name: "Scarpe Adidas Padel Elite",
        category: "Calzature",
        price: 120.99,
        description:
          "Scarpe da padel specifiche con grip ottimale e ammortizzazione laterale. Design ergonomico per massima performance.",
        tags: ["scarpe", "padel", "grip"],
        style: ["Sportivo"],
        inStock: true,
        trending: true,
      },
      {
        name: "Pallini Babolat Padel Tour",
        category: "Accessori",
        price: 24.99,
        description:
          "Confezione da 3 pallini di qualità professionale, omologati FFT. Ideali per competizioni ufficiali.",
        tags: ["pallini", "professionale", "gara"],
        style: ["Sportivo"],
        inStock: true,
        trending: true,
      },
      {
        name: "Racchetta Dunlop Srixon",
        category: "Racchette",
        price: 149.99,
        description:
          "Racchetta equilibrata per giocatori intermedi, ottima versatilità in tutti i colpi. Control e potenza bilanciati.",
        tags: ["racchetta", "intermedio", "versatile"],
        style: ["Intermedio", "Equilibrato"],
        inStock: true,
        trending: true,
      },
      {
        name: "T-Shirt Tecnica Padel",
        category: "Abbigliamento",
        price: 39.99,
        description:
          "Maglietta tecnica in materiale ventilato e traspirante. Mantiene fresco durante lunghe partite.",
        tags: ["maglietta", "tecnica", "ventilata"],
        style: ["Sportivo"],
        inStock: true,
        trending: true,
      },
      {
        name: "Pantaloni Corti Padel Pro",
        category: "Abbigliamento",
        price: 59.99,
        description:
          "Pantaloni corti tecnici con tasche intelligenti per pallini. Movimento libero e comodo.",
        tags: ["pantaloni", "corti", "padel"],
        style: ["Sportivo"],
        inStock: true,
        trending: true,
      },
      {
        name: "Zaino Padel Premium",
        category: "Borse",
        price: 79.99,
        description:
          "Zaino con scomparto dedicato per racchetta e accessori padel. Resistente e impermeabile.",
        tags: ["zaino", "borsa", "padel"],
        style: ["Sportivo"],
        inStock: true,
        trending: true,
      },
      {
        name: "Racchetta Wilson Ultra Lite",
        category: "Racchette",
        price: 129.99,
        description:
          "Racchetta leggera per giocatori principianti, facile da controllare. Perfetta per iniziare.",
        tags: ["racchetta", "principiante", "leggera"],
        style: ["Principiante", "Controllo"],
        inStock: true,
        trending: false,
      },
      {
        name: "Overgrip Babolat Tour",
        category: "Accessori",
        price: 14.99,
        description:
          "Confezione da 3 overgrip per migliore presa sulla racchetta. Assorbente e durevole.",
        tags: ["overgrip", "grip", "accessorio"],
        style: ["Sportivo"],
        inStock: true,
        trending: false,
      },
      {
        name: "Calzini Padel Performance",
        category: "Calzature",
        price: 19.99,
        description:
          "Calzini tecnici con ammortizzazione e supporto dell'arco plantare. Comfort prolungato.",
        tags: ["calzini", "tecnici", "padel"],
        style: ["Sportivo"],
        inStock: true,
        trending: false,
      },
      {
        name: "Racchetta Tecnifibre Bullfrog",
        category: "Racchette",
        price: 179.99,
        description:
          "Racchetta con grande dolce spot e ottima rotazione. Perfetta per spin e control.",
        tags: ["racchetta", "control", "spin"],
        style: ["Intermedio", "Controllo"],
        inStock: true,
        trending: false,
      },
      {
        name: "Polsiere Padel Anti-Transpirante",
        category: "Accessori",
        price: 12.99,
        description:
          "Polsiere assorbenti per mantenere il grip durante lo sforzo. Traspiranti e comodi.",
        tags: ["polsiere", "grip", "sudore"],
        style: ["Sportivo"],
        inStock: true,
        trending: false,
      },
      {
        name: "Racchetta NOX Neranjero",
        category: "Racchette",
        price: 189.99,
        description:
          "Racchetta da potenza con design innovativo. Ideale per giocatori che cercano potenza d'impatto.",
        tags: ["racchetta", "potenza", "design"],
        style: ["Professionista", "Potenza"],
        inStock: true,
        trending: false,
      },
      {
        name: "Scarpe Wilson Padel Blade",
        category: "Calzature",
        price: 115.99,
        description:
          "Scarpe professionali con grip laterale. Perfette per movimenti laterali rapidi.",
        tags: ["scarpe", "grip", "professionista"],
        style: ["Sportivo"],
        inStock: true,
        trending: false,
      },
      {
        name: "Borsa Padel Tour 3R",
        category: "Borse",
        price: 89.99,
        description:
          "Borsa termica per 3 racchette. Mantiene i pallini freschi durante la partita.",
        tags: ["borsa", "termica", "3racchette"],
        style: ["Sportivo"],
        inStock: true,
        trending: false,
      },
      {
        name: "Fascia Anti-Traspirazione Premium",
        category: "Accessori",
        price: 16.99,
        description:
          "Fascia anti-traspirazione con materiale traspirante. Ideale per fronte e polsi.",
        tags: ["fascia", "traspirazione", "comfort"],
        style: ["Sportivo"],
        inStock: true,
        trending: false,
      },
      {
        name: "Racchetta Pala Padel Soft",
        category: "Racchette",
        price: 139.99,
        description:
          "Racchetta soft per difesa e controllo. Perfetta per giocatori che amano il gioco dai fondocampo.",
        tags: ["racchetta", "difesa", "control"],
        style: ["Intermedio", "Controllo", "Difesa"],
        inStock: true,
        trending: false,
      },
      {
        name: "Maglietta Perf Dry 2024",
        category: "Abbigliamento",
        price: 44.99,
        description:
          "Maglietta performance con tecnologia dry-fit. Colori moderni e design contemporaneo.",
        tags: ["maglietta", "dryfit", "moderno"],
        style: ["Sportivo"],
        inStock: true,
        trending: false,
      },
      {
        name: "Pallini Star Padel Pro",
        category: "Accessori",
        price: 29.99,
        description:
          "Confezione premium da 3 pallini. Pressione controllata e durabilità estesa.",
        tags: ["pallini", "premium", "durabilità"],
        style: ["Sportivo"],
        inStock: true,
        trending: false,
      },
      {
        name: "Racchetta Beginner Control",
        category: "Racchette",
        price: 99.99,
        description:
          "Racchetta economica per principianti. Ottimo rapporto qualità-prezzo.",
        tags: ["racchetta", "principiante", "economica"],
        style: ["Principiante", "Controllo"],
        inStock: true,
        trending: false,
      },
      {
        name: "Cintura Stabilizzatore Padel",
        category: "Accessori",
        price: 34.99,
        description:
          "Cintura di supporto per la schiena. Previene dolori durante lunghe sessioni.",
        tags: ["cintura", "supporto", "schiena"],
        style: ["Sportivo"],
        inStock: true,
        trending: false,
      },
      {
        name: "Occhiali Padel UV Protection",
        category: "Accessori",
        price: 59.99,
        description:
          "Occhiali sportivi con protezione UV. Design aerodinamico e lenti polarizzate.",
        tags: ["occhiali", "uv", "protezione"],
        style: ["Sportivo"],
        inStock: true,
        trending: false,
      },
      {
        name: "Shorts Performance Extended",
        category: "Abbigliamento",
        price: 69.99,
        description:
          "Pantaloncini lunghi tecnici con protezione UV. Perfetti per sole intenso.",
        tags: ["shorts", "tecnici", "uv"],
        style: ["Sportivo"],
        inStock: false,
        trending: false,
      },
      {
        name: "Racchetta Balance Expert",
        category: "Racchette",
        price: 159.99,
        description:
          "Racchetta equilibrata con sweet spot allargato. Versione intermedia-avanzata.",
        tags: ["racchetta", "equilibrata", "expert"],
        style: ["Intermedio", "Equilibrato"],
        inStock: true,
        trending: false,
      },
      {
        name: "Scarpe Speed Attack Pro",
        category: "Calzature",
        price: 135.99,
        description:
          "Scarpe per attacco veloce. Suola especial per reattività massima.",
        tags: ["scarpe", "attacco", "veloce"],
        style: ["Sportivo"],
        inStock: true,
        trending: false,
      },
    ];

    const products = rawProducts.map((p) => ({
      ...p,
      image: generateMockupImage(p.name, p.category),
    }));

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log("✓ Database seeded con mockup e EMOJI funzionanti!");
    process.exit(0);
  } catch (error) {
    console.error("Errore nel seeding:", error);
    process.exit(1);
  }
};

seedProducts();
