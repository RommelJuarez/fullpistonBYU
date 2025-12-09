// car-details.js
import { getParam } from "./utils.mjs";
import { loadCarDetails, carDetailsTemplate } from "./car-details.mjs";
import { addCarToCompare } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("car-details");

  const makeId = getParam("makeId");
  const modelId = getParam("modelId");
  const ano = getParam("ano");

  if (!makeId || !modelId || !ano) {
    container.innerHTML = `
      <p class="text-red-600 text-center">Missing car parameters.</p>
    `;
    return;
  }

  container.innerHTML = `
    <p class="text-white text-center animate-pulse">Loading car details...</p>
  `;

  try {
    const car = await loadCarDetails({ makeId, modelId, ano });

    if (!car) {
      container.innerHTML = `
        <p class="text-red-600 text-center">Car details not available.</p>
      `;
      return;
    }

    // Render content
    container.innerHTML = carDetailsTemplate(car);

    // Add event listener to compare button
    const compareBtn = document.getElementById("addToCompareBtn");

    compareBtn.addEventListener("click", () => {
      const msg = addCarToCompare(car);
      alert(msg);
    });

  } catch (error) {
    console.error("car-details.js error:", error);
    container.innerHTML = `
      <p class="text-red-600 text-center">Error loading car details.</p>
    `;
  }
});
