// ---------------------------------------------
//  CONFIG
// ---------------------------------------------
const NINJA_KEY = import.meta.env.VITE_NINJA_KEY;

async function fetchCars(query) {
  const url = `https://api.api-ninjas.com/v1/cars?${query}`;

  const res = await fetch(url, {
    headers: { "X-Api-Key": NINJA_KEY }
  });

  if (!res.ok) return [];
  return res.json();
}

// ---------------------------------------------
//  SANITIZAR DATOS (eliminar campos premium)
// ---------------------------------------------
function sanitizeCar(car) {
  const clean = { ...car };

  const blocked = [
    "city_mpg",
    "highway_mpg",
    "combination_mpg",
  ];

  blocked.forEach(f => {
    if (clean[f] && typeof clean[f] === "string" &&
        clean[f].includes("premium subscribers only")) {
      delete clean[f];
    }
  });

  return clean;
}

// ---------------------------------------------
//  LIMPIAR MODELOS
// ---------------------------------------------
function cleanModelName(name = "") {
  return name
    .replace(/\(subscription required\)/gi, "")
    .replace(/\*/g, "")
    .trim();
}

// ---------------------------------------------
//  NORMALIZAR NOMBRE PARA WIKIPEDIA
// ---------------------------------------------
function normalizeName(str = "") {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, "_")
    .trim();
}

// ---------------------------------------------
//  BUSCAR AUTOS (marca o modelo — inteligente)
// ---------------------------------------------
export async function searchCars(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  // 1️⃣ Buscar por modelo exacto
  let cars = await fetchCars(`model=${q}`);

  // 2️⃣ Si está vacío, buscar por marca
  if (!cars || cars.length === 0) {
    cars = await fetchCars(`make=${q}`);
  }

  // 3️⃣ Si aún es vacío, retornar []
  if (!cars || cars.length === 0) {
    return [];
  }

  // 4️⃣ Limpiar datos premium
  return cars.map(c => sanitizeCar(c));
}

// ---------------------------------------------
//  OBTENER IMAGEN DESDE WIKIPEDIA
// ---------------------------------------------
export async function getCarImage(make, model) {
  try {
    const cleanModel = cleanModelName(model);

    const attempts = [
      `${make}_${cleanModel}`,
      `${make}_${cleanModel.split(" ")[0]}`,
      `${make}`
    ];

    for (const term of attempts) {
      const title = normalizeName(term);

      const url = `https://en.wikipedia.org/w/api.php?action=query&origin=*&titles=${title}&prop=pageimages&pithumbsize=600&format=json`;
      const res = await fetch(url);
      const data = await res.json();

      const pages = data.query?.pages || {};
      const page = Object.values(pages)[0];

      if (page?.thumbnail?.source) {
        return page.thumbnail.source;
      }
    }

    // 2️⃣ Último intento: búsqueda global
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&list=search&srsearch=${encodeURIComponent(make + ' ' + cleanModel)}&format=json&srlimit=1`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (searchData.query?.search?.[0]) {
      const title = searchData.query.search[0].title;

      const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&titles=${encodeURIComponent(title)}&prop=pageimages&pithumbsize=600&format=json`;
      const imgRes = await fetch(imgUrl);
      const imgData = await imgRes.json();

      const pages = imgData.query?.pages || {};
      const page = Object.values(pages)[0];

      return page?.thumbnail?.source || null;
    }

    return null;
  } catch (err) {
    console.error("getCarImage error:", err);
    return null;
  }
}

// ---------------------------------------------
//  OBTENER DATOS COMPLETOS DE UN AUTO
// ---------------------------------------------
export async function getCarFullData(car) {
  if (!car) return null;

  const { make, model, year } = car;

  const image = await getCarImage(make, model);

  return {
    make,
    model,
    year,
    image,
    specs: {
      class: car.class,
      cylinders: car.cylinders,
      displacement: car.displacement,
      drive: car.drive,
      fuel_type: car.fuel_type,
      transmission: car.transmission
    }
  };
}
