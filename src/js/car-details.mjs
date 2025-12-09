// car-details.mjs
import { getCarDetails, getCarImage } from "./ExternalServices.mjs";
import { convertBRLtoUSD } from "./utils.mjs";
import { addCarToCompare } from "./utils.mjs";
/**
 * Fetch the full details of a car from the FIPE API
 */
export async function loadCarDetails({ makeId, modelId, ano }) {
  try {
    const data = await getCarDetails(makeId, modelId, ano);
    if (!data) return null;

    const image = await getCarImage(data.Marca, data.Modelo);

    return {
      make: data.Marca,
      model: data.Modelo,
      year: data.AnoModelo,
      priceBRL: data.Valor,
      priceUSD: convertBRLtoUSD(data.Valor),
      fuel: data.Combustivel,
      codeFipe: data.CodigoFipe,
      referenceMonth: data.MesReferencia,
      image: image || "https://via.placeholder.com/600x400?text=No+Image",
      description: `FIPE reference: ${data.MesReferencia}`
    };
  } catch (error) {
    console.error("Error fetching car details:", error);
    throw error;
  }
}

/**
 * Renderiza el template de detalle del auto
 */
// car-details.mjs
export function carDetailsTemplate(car) {
  return `
    <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg ">
      <h1 class="text-2xl font-bold mb-4 text-center">${car.make} ${car.model}</h1>

      <img 
        src="${car.image}" 
        alt="${car.make} ${car.model}" 
        class="w-full rounded-lg shadow-md mb-6"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 class="text-xl font-semibold mb-2">General Info</h2>
          <ul class="space-y-1 text-gray-700">
            ${car.year ? `<li><strong>Year:</strong> ${car.year}</li>` : ""}
            ${car.priceBRL ? `<li><strong>Price (BRL):</strong> ${car.priceBRL}</li>` : ""}
            ${car.priceUSD !== "N/A" ? `<li><strong>Price (USD):</strong> ${car.priceUSD}</li>` : ""}
            ${car.fuel ? `<li><strong>Fuel:</strong> ${car.fuel}</li>` : ""}
            ${car.codeFipe ? `<li><strong>FIPE Code:</strong> ${car.codeFipe}</li>` : ""}
            ${car.referenceMonth ? `<li><strong>Reference:</strong> ${car.referenceMonth}</li>` : ""}
          </ul>
        </div>
      </div>

      <div class="mt-6">
        <h2 class="text-xl font-semibold mb-2">Description</h2>
        <p class="text-gray-700">${car.description ?? "No description available."}</p>
      </div>

      <!-- Botón sin onclick -->
      <button
        id="addToCompareBtn"
        class="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded w-full"
      >
        Add to compare
      </button>
    </div>
  `;
}
