import{c as l,a,b as s}from"./main-DnQXkxaQ.js";import{b as d,g as c}from"./ExternalServices-BQ9PCoV8.js";async function m({makeId:e,modelId:r,ano:n}){try{const t=await d(e,r,n);if(!t)return null;const o=await c(t.Marca,t.Modelo);return{make:t.Marca,model:t.Modelo,year:t.AnoModelo,priceBRL:t.Valor,priceUSD:l(t.Valor),fuel:t.Combustivel,codeFipe:t.CodigoFipe,referenceMonth:t.MesReferencia,image:o||"https://via.placeholder.com/600x400?text=No+Image",description:`FIPE reference: ${t.MesReferencia}`}}catch(t){throw console.error("Error fetching car details:",t),t}}function g(e){return`
    <div class="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg ">
      <h1 class="text-2xl font-bold mb-4 text-center">${e.make} ${e.model}</h1>

      <img 
        src="${e.image}" 
        alt="${e.make} ${e.model}" 
        class="w-full rounded-lg shadow-md mb-6"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 class="text-xl font-semibold mb-2">General Info</h2>
          <ul class="space-y-1 text-gray-700">
            ${e.year?`<li><strong>Year:</strong> ${e.year}</li>`:""}
            ${e.priceBRL?`<li><strong>Price (BRL):</strong> ${e.priceBRL}</li>`:""}
            ${e.priceUSD!=="N/A"?`<li><strong>Price (USD):</strong> ${e.priceUSD}</li>`:""}
            ${e.fuel?`<li><strong>Fuel:</strong> ${e.fuel}</li>`:""}
            ${e.codeFipe?`<li><strong>FIPE Code:</strong> ${e.codeFipe}</li>`:""}
            ${e.referenceMonth?`<li><strong>Reference:</strong> ${e.referenceMonth}</li>`:""}
          </ul>
        </div>
      </div>

      <div class="mt-6">
        <h2 class="text-xl font-semibold mb-2">Description</h2>
        <p class="text-gray-700">${e.description??"No description available."}</p>
      </div>

      <!-- Botón sin onclick -->
      <button
        id="addToCompareBtn"
        class="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded w-full"
      >
        Add to compare
      </button>
    </div>
  `}document.addEventListener("DOMContentLoaded",async()=>{const e=document.getElementById("car-details"),r=a("makeId"),n=a("modelId"),t=a("ano");if(!r||!n||!t){e.innerHTML=`
      <p class="text-red-600 text-center">Missing car parameters.</p>
    `;return}e.innerHTML=`
    <p class="text-white text-center animate-pulse">Loading car details...</p>
  `;try{const o=await m({makeId:r,modelId:n,ano:t});if(!o){e.innerHTML=`
        <p class="text-red-600 text-center">Car details not available.</p>
      `;return}e.innerHTML=g(o),document.getElementById("addToCompareBtn").addEventListener("click",()=>{const i=s(o);alert(i)})}catch(o){console.error("car-details.js error:",o),e.innerHTML=`
      <p class="text-red-600 text-center">Error loading car details.</p>
    `}});
