export const products = [
  {
    id: "gulab",
    name: "Gulab silk saree",
    category: "Sarees",
    occasion: ["Festive", "Partywear"],
    price: 6490,
    fabric: "Silk blend · woven border",
    tone: "Teal",
    image: "saree-real",
  },
  {
    id: "noor",
    name: "Noor cotton kurta set",
    category: "Indian wear",
    occasion: ["Everyday"],
    price: 1890,
    fabric: "Cotton · relaxed fit",
    tone: "Peach",
    image: "indian-real",
  },
  {
    id: "tara",
    name: "Tara draped dress",
    category: "Indo-Western",
    occasion: ["Partywear", "Festive"],
    price: 4990,
    fabric: "Crepe · fluid drape",
    tone: "Olive",
    image: "fusion-real",
  },
  {
    id: "rekha",
    name: "Rekha everyday saree",
    category: "Sarees",
    occasion: ["Everyday"],
    price: 1490,
    fabric: "Cotton blend · light weave",
    tone: "Teal",
    image: "saree-real",
  },
  {
    id: "isha",
    name: "Isha everyday printed kurta",
    category: "Indian wear",
    occasion: ["Everyday"],
    price: 2490,
    fabric: "Cotton blend · easy fit",
    tone: "Blue",
    image: "everyday-real",
  },
  {
    id: "saanjh",
    name: "Saanjh occasion drape",
    category: "Indo-Western",
    occasion: ["Festive", "Partywear"],
    price: 8990,
    fabric: "Silk blend · sculptural pleats",
    tone: "Olive",
    image: "fusion-real",
  },
  {
    id: "aabha",
    name: "Aabha zari silk saree",
    category: "Sarees",
    occasion: ["Festive"],
    price: 12990,
    fabric: "Silk · statement woven border",
    tone: "Emerald",
    image: "green-real",
  },
  {
    id: "meher",
    name: "Meher festive lehenga",
    category: "Indian wear",
    occasion: ["Festive"],
    price: 5990,
    fabric: "Silk blend · embroidered detail",
    tone: "Saffron",
    image: "festive-real",
  },
  {
    id: "rooh",
    name: "Rooh evening dress",
    category: "Indo-Western",
    occasion: ["Partywear"],
    price: 7490,
    fabric: "Satin blend · graceful movement",
    tone: "Blush",
    image: "party-real",
  },
];
export const sizes = {
  XS: [81, 66, 89],
  S: [86, 71, 94],
  M: [91, 76, 99],
  L: [97, 82, 105],
  XL: [103, 88, 111],
  XXL: [109, 94, 117],
};
export const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
export function filterProducts({
  category = "All",
  query = "",
  max = 15000,
  sort = "featured",
} = {}) {
  const q = query.toLowerCase();
  const found = products.filter(
    (p) =>
      (category === "All" ||
        p.category === category ||
        p.occasion.includes(category)) &&
      p.price <= Number(max) &&
      `${p.name} ${p.category} ${p.fabric} ${p.tone}`.toLowerCase().includes(q),
  );
  return sort === "low"
    ? found.sort((a, b) => a.price - b.price)
    : sort === "high"
      ? found.sort((a, b) => b.price - a.price)
      : found;
}
export function estimateFabric({ length, width, chest, hip, silhouette }) {
  const vals = [length, width, chest, hip].map(Number);
  if (vals.some((v) => !Number.isFinite(v) || v <= 0))
    return { error: "Enter positive fabric and fit values." };
  if (
    width < 60 ||
    width > 180 ||
    length > 30 ||
    chest < 60 ||
    chest > 160 ||
    hip < 60 ||
    hip > 180
  )
    return {
      error:
        "Use fabric width 60–180 cm, length up to 30 m, chest 60–160 cm and hip 60–180 cm.",
    };
  const base =
    { dress: 3.8, coord: 4.2, jacket: 2.4, saree: 5.5 }[silhouette] || 3.8;
  const required =
    Math.ceil(
      (base * Math.max(1, chest / 91, hip / 99) * Math.max(1, 140 / width) +
        0.4) *
        10,
    ) / 10;
  return {
    required,
    enough: length >= required,
    buffer: Math.round((length - required) * 10) / 10,
  };
}
export const escapeHTML = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
