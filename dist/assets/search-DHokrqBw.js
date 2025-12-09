import"./main-DnQXkxaQ.js";import{s as g,g as p,a as y}from"./ExternalServices-BQ9PCoV8.js";const l=document.getElementById("searchInput"),d=document.getElementById("searchError"),s=document.getElementById("resultsContainer");let i=null;l.addEventListener("input",()=>{clearTimeout(i),i=setTimeout(()=>{const t=l.value.trim();if(t.length<2){d.classList.remove("hidden"),s.innerHTML="";return}d.classList.add("hidden"),f(t)},400)});async function f(t){s.innerHTML=`
    <p class="text-white text-center col-span-full animate-pulse">Searching...</p>
  `;const o=await g(t);if(!o.length){s.innerHTML=`
      <p class="text-red-300 col-span-full text-center">
        No cars found. Try another search.
      </p>
    `;return}const c=await Promise.all(o.map(async e=>{const m=await p(e.make,e.model),r=await y(e.makeId,e.modelId),a=r.length?r[0]:null,h=a?a.nome.replace(/[^0-9]/g,""):"?",u=a?a.codigo:"",n=`/search/car-details.html?${new URLSearchParams({makeId:e.makeId,modelId:e.modelId,ano:u}).toString()}`;return`
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition border">

          <a href="${n}">
            <img 
              src="${m||"https://via.placeholder.com/400x250?text=No+Image"}" 
              alt="${e.make} ${e.model}"
              class="w-full h-40 object-cover"
            />
          </a>

          <div class="p-4">
            <a href="${n}">
              <h3 class="text-lg font-semibold text-gray-800 hover:underline">
                ${e.make} ${e.model}
              </h3>
            </a>

            <p class="text-sm text-gray-600">
              <strong>Year:</strong> ${h}
            </p>

            <a 
              href="${n}"
              class="mt-3 block text-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded w-full"
            >
              View details
            </a>
          </div>
        </div>
      `}));s.innerHTML=c.join("")}
