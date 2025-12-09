import { searchCars, getCarImage, getYearsByModel } from "./ExternalServices.mjs";

const searchInput = document.getElementById("searchInput");
const searchError = document.getElementById("searchError");
const resultsContainer = document.getElementById("resultsContainer");

// -------------------------------------------------------
// DEBOUNCE HANDLER
// -------------------------------------------------------
let debounceTimer = null;

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const query = searchInput.value.trim();

    if (query.length < 2) {
      searchError.classList.remove("hidden");
      resultsContainer.innerHTML = "";
      return;
    }

    searchError.classList.add("hidden");
    performSearch(query);
  }, 400);
});

// -------------------------------------------------------
// MAIN SEARCH FUNCTION
// -------------------------------------------------------
async function performSearch(query) {
  resultsContainer.innerHTML = `
    <p class="text-white text-center col-span-full animate-pulse">Searching...</p>
  `;

  const cars = await searchCars(query);

  if (!cars.length) {
    resultsContainer.innerHTML = `
      <p class="text-red-300 col-span-full text-center">
        No cars found. Try another search.
      </p>
    `;
    return;
  }

  const cards = await Promise.all(
    cars.map(async (car) => {
      const img = await getCarImage(car.make, car.model);

      const years = await getYearsByModel(car.makeId, car.modelId);
      const yearObj = years.length ? years[0] : null;

      const yearDisplay = yearObj ? yearObj.nome.replace(/[^0-9]/g, "") : "?";
      const anoCodigo = yearObj ? yearObj.codigo : "";

      const params = new URLSearchParams({
        makeId: car.makeId,
        modelId: car.modelId,
        ano: anoCodigo,
      });

      const detailURL = `/search/car-details.html?${params.toString()}`;

      return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition border">

          <a href="${detailURL}">
            <img 
              src="${img || 'https://via.placeholder.com/400x250?text=No+Image'}" 
              alt="${car.make} ${car.model}"
              class="w-full h-40 object-cover"
            />
          </a>

          <div class="p-4">
            <a href="${detailURL}">
              <h3 class="text-lg font-semibold text-gray-800 hover:underline">
                ${car.make} ${car.model}
              </h3>
            </a>

            <p class="text-sm text-gray-600">
              <strong>Year:</strong> ${yearDisplay}
            </p>

            <a 
              href="${detailURL}"
              class="mt-3 block text-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded w-full"
            >
              View details
            </a>
          </div>
        </div>
      `;
    })
  );

  resultsContainer.innerHTML = cards.join("");
}
