// -----------------------------------------------------
//  UTILITIES
// -----------------------------------------------------

// Normalize names for searches
function normalizeName(str = "") {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, "_")
    .trim();
}

// Removes parenthesis and artifacts from model names
function cleanModelName(name) {
  if (!name) return name;

  return name
    .replace(/\(.*?\)/g, "") // Remove (...)
    .replace(/\s+/g, " ")
    .trim();
}

// -----------------------------------------------------
//  FIPE API (FREE)
// -----------------------------------------------------

const FIPE_BASE = "https://parallelum.com.br/fipe/api/v1/carros";

let makesCache = null;

// Fetch all FIPE brands
export async function getMakes() {
  if (makesCache) return makesCache;

  try {
    const res = await fetch(`${FIPE_BASE}/marcas`);
    const json = await res.json();

    makesCache = json || [];
    return makesCache;
  } catch (err) {
    console.error("getMakes error:", err);
    return [];
  }
}

// Fetch all models by brand
export async function getModelsByMake(marcaId) {
  try {
    const res = await fetch(`${FIPE_BASE}/marcas/${marcaId}/modelos`);
    const json = await res.json();

    return json?.modelos || [];
  } catch (err) {
    console.error("getModelsByMake error:", err);
    return [];
  }
}

// Fetch available years for a model
export async function getYearsByModel(marcaId, modeloId) {
  try {
    const res = await fetch(`${FIPE_BASE}/marcas/${marcaId}/modelos/${modeloId}/anos`);
    const json = await res.json();

    return json || [];
  } catch (err) {
    console.error("getYearsByModel error:", err);
    return [];
  }
}

// Fetch full FIPE specs for one year
export async function getCarSpecs(marcaId, modeloId, anoCodigo) {
  try {
    const res = await fetch(
      `${FIPE_BASE}/marcas/${marcaId}/modelos/${modeloId}/anos/${anoCodigo}`
    );
    const json = await res.json();

    return json || null;
  } catch (err) {
    console.error("getCarSpecs error:", err);
    return null;
  }
}

// -----------------------------------------------------
//  GLOBAL SEARCH (BRAND + MODEL)
// -----------------------------------------------------
export async function searchCars(query) {
  try {
    const q = query.toLowerCase().trim();

    const makes = await getMakes();
    const results = [];

    // 1. Brand matches
    const matchingMakes = makes.filter(m =>
      m.nome.toLowerCase().includes(q)
    );

    for (const make of matchingMakes.slice(0, 5)) {
      const models = await getModelsByMake(make.codigo);

      for (const model of models.slice(0, 10)) {
        results.push({
          make: make.nome,
          makeId: make.codigo,
          model: cleanModelName(model.nome),
          modelId: model.codigo
        });
      }
    }

    // 2. Search inside all models
    if (results.length < 10) {
      for (const make of makes.slice(0, 15)) {
        const models = await getModelsByMake(make.codigo);

        for (const model of models) {
          const cleanName = cleanModelName(model.nome);

          if (cleanName.toLowerCase().includes(q)) {
            results.push({
              make: make.nome,
              makeId: make.codigo,
              model: cleanName,
              modelId: model.codigo
            });
          }
        }

        if (results.length >= 20) break;
      }
    }

    // Remove duplicates
    const unique = results.filter(
      (car, index, self) =>
        index === self.findIndex(
          c => c.make === car.make && c.model === car.model
        )
    );

    return unique.slice(0, 20);
  } catch (err) {
    console.error("searchCars error:", err);
    return [];
  }
}

// -----------------------------------------------------
//  WIKIPEDIA IMAGE SEARCH
// -----------------------------------------------------
export async function getCarImage(make, model) {
  try {
    const cleanModel = cleanModelName(model);

    const searches = [
      `${make} ${cleanModel}`,
      `${make} ${cleanModel.split(" ")[0]}`,
      `${make} car`
    ];

    for (const terms of searches) {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&list=search&srsearch=${encodeURIComponent(
        terms
      )}&format=json&srlimit=1`;

      const searchRes = await fetch(searchUrl);
      const searchData = await searchRes.json();

      const pageTitle = searchData.query?.search?.[0]?.title;
      if (!pageTitle) continue;

      const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&origin=*&titles=${encodeURIComponent(
        pageTitle
      )}&prop=pageimages&pithumbsize=600&format=json`;

      const imgRes = await fetch(imgUrl);
      const imgData = await imgRes.json();

      const pages = imgData.query?.pages || {};
      const page = Object.values(pages)[0];

      if (page?.thumbnail?.source) {
        return page.thumbnail.source;
      }
    }

    return null;
  } catch (err) {
    console.error("getCarImage error:", err);
    return null;
  }
}

// -----------------------------------------------------
//  FULL FIPE + IMAGE (OPTIONAL)
// -----------------------------------------------------
export async function getCarFullData({ makeId, modelId }) {
  try {
    const years = await getYearsByModel(makeId, modelId);
    if (!years.length) {
      return {
        make: "",
        model: "",
        years: [],
        image: null,
        specs: null
      };
    }

    const firstYear = years[0].codigo;
    const specs = await getCarSpecs(makeId, modelId, firstYear);

    const image = await getCarImage(
      specs?.Marca || "",
      specs?.Modelo || ""
    );

    return {
      make: specs?.Marca || "",
      model: specs?.Modelo || "",
      years: years.map(y => y.nome),
      image,
      specs
    };
  } catch (err) {
    console.error("getCarFullData error:", err);
    return null;
  }
}

// -----------------------------------------------------
//  SIMPLE GET CAR DETAILS (FOR car-details PAGE)
// -----------------------------------------------------

export async function getCarDetails(makeId, modelId, anoCodigo) {
  try {
    if (!makeId || !modelId || !anoCodigo) {
      console.warn("getCarDetails missing params:", { makeId, modelId, anoCodigo });
      return null;
    }

    const url = `${FIPE_BASE}/marcas/${makeId}/modelos/${modelId}/anos/${anoCodigo}`;
    const res = await fetch(url);
    const json = await res.json();

    return json || null;
  } catch (err) {
    console.error("getCarDetails error:", err);
    return null;
  }
}

// -----------------------------------------------------
//  HUGGING FACE – CAR COMPARISON (recibe array de autos)
// -----------------------------------------------------

/**
 * Compara dos autos usando el modelo meta-llama/Llama-3.1-8B-Instruct:cerebras
 * @param {Array<Object>} cars - Array con exactamente 2 objetos de autos
 * @returns {Promise<string>} - Recomendación del modelo
 */
export async function compareCarsAI(cars) {
  try {
    if (!Array.isArray(cars) || cars.length !== 2) {
      return "You must provide an array of exactly 2 car objects.";
    }

    const [carA, carB] = cars;

    const token = import.meta.env.VITE_HUGGINFACE_KEY;
    if (!token) throw new Error("Missing Hugging Face API key in VITE_HUGGINGFACE_KEY");

    // Construir prompt
    const userMessage = `say the reason, Which car is better between these two give me your recommendation only based on these objects? Car A: ${JSON.stringify(carA)} and Car B: ${JSON.stringify(carB)}`;

    const body = {
      model: "meta-llama/Llama-3.1-8B-Instruct:cerebras",
      messages: [
        {
          role: "user",
          content: userMessage
        }
      ],
      stream: false
    };

    const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Hugging Face API error: ${res.status} ${errText}`);
    }

    const data = await res.json();

    
    return data?.choices?.[0]?.message?.content || "No recommendation returned.";

  } catch (error) {
    console.error("compareCarsAI error:", error);
    return `Error: ${error.message}`;
  }
}

export { cleanModelName, normalizeName };
