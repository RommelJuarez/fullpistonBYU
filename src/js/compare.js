// compare.js
// Renders the comparison table from localStorage (key: "compareList")
// and allows removing each car. Uses Tailwind classes already in HTML.
import { compareCarsAI } from "./ExternalServices.mjs";

import { getCompareCars, removeCarFromCompare } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn-ai-compare");
  const resultBox = document.getElementById("ai-result");
  const resultText = document.getElementById("ai-result-text");

  btn.addEventListener("click", async () => {
    const cars = getCompareCars();

    if (cars.length !== 2) {
      resultBox.classList.remove("hidden");
      resultText.textContent =
        "You need exactly 2 cars in comparison to use AI.";
      return;
    }

    // Mostrar estado de carga
    resultBox.classList.remove("hidden");
    resultText.textContent = "Analyzing cars with AI...";

    try {
      const recommendation = await compareCarsAI(cars);
      resultText.textContent = recommendation;
    } catch (error) {
      resultText.textContent = `Error: ${error.message}`;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  renderComparison();
});

function renderComparison() {
  const cars = getCompareCars();
  const tableBody = document.getElementById("compare-table-body");
  const carATitle = document.getElementById("carA-title");
  const carBTitle = document.getElementById("carB-title");

  const carA = cars[0] || null;
  const carB = cars[1] || null;

  // ---- Update column titles ----
  carATitle.innerHTML = carA
    ? `${escapeHtml(carA.make)} ${escapeHtml(carA.model)}
       <button data-make="${escapeHtmlAttr(carA.make)}"
               data-model="${escapeHtmlAttr(carA.model)}"
               class="remove-compare ml-2 text-red-400 hover:text-red-600 text-sm"
               title="Remove">✖</button>`
    : "Car A";

  carBTitle.innerHTML = carB
    ? `${escapeHtml(carB.make)} ${escapeHtml(carB.model)}
       <button data-make="${escapeHtmlAttr(carB.make)}"
               data-model="${escapeHtmlAttr(carB.model)}"
               class="remove-compare ml-2 text-red-400 hover:text-red-600 text-sm"
               title="Remove">✖</button>`
    : "Car B";

  // ---- No cars case ----
  if (!carA && !carB) {
    tableBody.innerHTML = `
      <tr>
        <td class="p-6 text-center text-gray-300" colspan="3">
          No cars added to comparison. Add cars from the search page.
        </td>
      </tr>
    `;
    return;
  }

  // ---- Fields to display ----
  const fields = [
    { label: "Make", key: "make" },
    { label: "Model", key: "model" },
    { label: "Year", key: "year" },
    { label: "Price (BRL)", key: "priceBRL" },
    { label: "Price (USD)", key: "priceUSD" },
    { label: "Fuel", key: "fuel" },
    { label: "FIPE Code", key: "codeFipe" },
    { label: "Reference", key: "referenceMonth" },
  ];

  // ---- Generate all rows (store in rowsHtml) ----
  const rowsHtml = fields
    .map((f) => {
      const a = carA?.[f.key] ?? "—";
      const b = carB?.[f.key] ?? "—";

      return `
      <tr class="border-b border-gray-700">
        <td class="p-4 font-medium text-gray-300">${escapeHtml(f.label)}</td>
        <td class="p-4 text-center text-white">${escapeHtml(String(a))}</td>
        <td class="p-4 text-center text-white">${escapeHtml(String(b))}</td>
      </tr>
    `;
    })
    .join("");

  // ---- Images row (above all) ----
  const imagesRow = `
    <tr class="border-b border-gray-700">
      <td class="p-4 font-medium text-gray-300">Image</td>
      <td class="p-4 text-center">
        ${carA?.image ? `<img src="${escapeHtmlAttr(carA.image)}" class="mx-auto w-48 h-28 object-cover rounded-lg">` : "—"}
      </td>
      <td class="p-4 text-center">
        ${carB?.image ? `<img src="${escapeHtmlAttr(carB.image)}" class="mx-auto w-48 h-28 object-cover rounded-lg">` : "—"}
      </td>
    </tr>
  `;

  // ---- Inject final HTML ----
  tableBody.innerHTML = imagesRow + rowsHtml;

  // ---- Activate delete buttons ----
  document.querySelectorAll(".remove-compare").forEach((btn) => {
    btn.addEventListener("click", () => {
      const make = btn.getAttribute("data-make");
      const model = btn.getAttribute("data-model");
      if (!make || !model) return;

      const confirmed = confirm(`Remove ${make} ${model} from comparison?`);
      if (!confirmed) return;

      removeCarFromCompare(make, model);
      renderComparison();
    });
  });
}

// ---------------------------------------------------------
// Sanitizers
// ---------------------------------------------------------
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeHtmlAttr(str) {
  if (!str) return "";
  return escapeHtml(String(str));
}
