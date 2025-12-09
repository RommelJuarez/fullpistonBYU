export function renderWithTemplate(template, parentElement, data, callback) {
  if (callback) {
    callback(data);
  }
  parentElement.insertAdjacentHTML("afterbegin", template);
}
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.getElementById("main-header");
  const footerElement = document.getElementById("main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

  // Enganchar listeners DESPUÉS de renderizar el header
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (!btn || !menu) {
    console.warn("Mobile menu elements not found. Ensure IDs exist in /partials/header.html");
    return;
  }

  btn.addEventListener("click", () => {
    // Toggle de visibilidad usando Tailwind
    const isHidden = menu.classList.contains("hidden");
    if (isHidden) {
      menu.classList.remove("hidden");
      menu.classList.add("block");
    } else {
      menu.classList.add("hidden");
      menu.classList.remove("block");
    }
  });
}


export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}
export function convertBRLtoUSD(brlString, rate = 0.20) {
  if (!brlString) return "N/A";

  // Extraer solo números y coma/punto
  const numeric = brlString.replace(/[^\d,]/g, "").replace(".", "").replace(",", ".");
  const brlValue = parseFloat(numeric);

  if (isNaN(brlValue)) return "N/A";

  const usdValue = brlValue * rate;
  return `$${usdValue.toFixed(2)}`;
}


/**
 * Agrega un auto al listado de comparación en localStorage.
 * Solo permite hasta 2 autos.
 * @param {Object} car - Objeto completo del auto
 * @returns {string} - Mensaje de estado
 */
export function addCarToCompare(car) {
  let list = JSON.parse(localStorage.getItem("compareList")) || [];

  if (list.length >= 2) {
    return "You can only compare up to 2 cars.";
  }

  if (list.some(c => c.make === car.make && c.model === car.model)) {
    return "This car is already added.";
  }

  list.push(car);
  localStorage.setItem("compareList", JSON.stringify(list));

  return `${car.make} ${car.model} added to comparison.`;
}

/**
 * Devuelve los autos guardados en comparación desde localStorage.
 * @returns {Array<Object>} - Lista de autos
 */
export function getCompareCars() {
  return JSON.parse(localStorage.getItem("compareList")) || [];
}

/**
 * Remove a car from the compare list stored in localStorage.
 * Matches by make + model to be safe.
 * @param {string} make
 * @param {string} model
 * @returns {string} message
 */
export function removeCarFromCompare(make, model) {
  const key = "compareList";
  const list = JSON.parse(localStorage.getItem(key)) || [];
  const newList = list.filter(car => !(car.make === make && car.model === model));
  localStorage.setItem(key, JSON.stringify(newList));
  return `${make} ${model} removed from comparison.`;
}