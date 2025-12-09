// compare.mjs
import { getCompareCars, removeCarFromCompare } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("compare-table-body");
  const compareContainer = document.getElementById("compare-container");

  function renderCompareTable() {
    const cars = getCompareCars();

    if (!cars || cars.length === 0) {
      compareContainer.innerHTML = `
        <p class="text-center text-white text-xl py-10">
          No cars added to comparison.
        </p>`;
      return;
    }

    // Solo aceptamos máximo 2 autos
    const carA = cars[0] || null;
    const carB = cars[1] || null;

    tableBody.innerHTML = `
      <tr>
        <th class="text-gray-300 p-3 border border-gray-600 text-left">Make</th>
        <td class="text-white p-3 border border-gray-600">${carA?.make || "-"}</td>
        <td class="text-white p-3 border border-gray-600">${carB?.make || "-"}</td>
      </tr>

      <tr>
        <th class="text-gray-300 p-3 border border-gray-600 text-left">Model</th>
        <td class="text-white p-3 border border-gray-600">${carA?.model || "-"}</td>
        <td class="text-white p-3 border border-gray-600">${carB?.model || "-"}</td>
      </tr>

      <tr>
        <th class="text-gray-300 p-3 border border-gray-600 text-left">Make ID</th>
        <td class="text-white p-3 border border-gray-600">${carA?.makeId || "-"}</td>
        <td class="text-white p-3 border border-gray-600">${carB?.makeId || "-"}</td>
      </tr>

      <tr>
        <th class="text-gray-300 p-3 border border-gray-600 text-left">Model ID</th>
        <td class="text-white p-3 border border-gray-600">${carA?.modelId || "-"}</td>
        <td class="text-white p-3 border border-gray-600">${carB?.modelId || "-"}</td>
      </tr>

      <tr>
        <th class="text-gray-300 p-3 border border-gray-600 text-left">Actions</th>
        <td class="p-3 border border-gray-600">
          ${carA ? `<button data-id="${carA.modelId}" class="remove-btn bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm">Remove</button>` : ""}
        </td>
        <td class="p-3 border border-gray-600">
          ${carB ? `<button data-id="${carB.modelId}" class="remove-btn bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm">Remove</button>` : ""}
        </td>
      </tr>
    `;

    // Activar botones de eliminar
    document.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        removeCarFromCompare(id);
        renderCompareTable(); // Actualizar UI
      });
    });
  }

  renderCompareTable();
});
