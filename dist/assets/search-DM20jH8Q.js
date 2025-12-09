import"./main-2QZK7Uoy.js";function u(e=""){return e.replace(/[^a-zA-Z0-9 ]/g,"").replace(/\s+/g,"_").trim()}async function h(e){const t=e.toLowerCase(),m=((await(await fetch("https://www.carqueryapi.com/api/0.3/?cmd=getMakes")).json()).Makes||[]).filter(o=>o.make_display.toLowerCase().includes(t));let r=[];for(const o of m)((await(await fetch(`https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${o.make_id}`)).json()).Models||[]).filter(n=>(n.model_name||"").toLowerCase().includes(t)).forEach(n=>{r.push({make:o.make_display,make_id:o.make_id,model:n.model_name,years:{from:n.model_year_start,to:n.model_year_end}})});return r}async function g(e,t){const a=`https://en.wikipedia.org/w/api.php?action=query&origin=*&titles=${u(`${e} ${t}`)}&prop=pageimages&pithumbsize=600&format=json`,r=(await(await fetch(a)).json()).query?.pages||{};return Object.values(r)[0]?.thumbnail?.source||null}const c=document.getElementById("searchInput"),d=document.getElementById("searchError"),l=document.getElementById("resultsContainer");let p=null;c.addEventListener("input",()=>{clearTimeout(p),p=setTimeout(()=>{const e=c.value.trim();if(e.length<2){d.classList.remove("hidden"),l.innerHTML="";return}d.classList.add("hidden"),f(e)},400)});async function f(e){l.innerHTML=`
        <p class="text-white text-center col-span-full animate-pulse">Searching...</p>
    `;const t=await h(e);if(!t.length){l.innerHTML=`
            <p class="text-red-300 col-span-full text-center">No cars found.</p>
        `;return}const s=await Promise.all(t.map(async a=>`
                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition border">

                    <img 
                        src="${await g(a.make,a.model)||"https://via.placeholder.com/400x250?text=No+Image"}" 
                        alt="${a.make} ${a.model}"
                        class="w-full h-40 object-cover"
                    />

                    <div class="p-4">
                        <h3 class="text-lg font-semibold text-gray-800">
                            ${a.make} ${a.model}
                        </h3>

                        <p class="text-sm text-gray-600">
                            Years: ${a.years.from||"?"} - ${a.years.to||"?"}
                        </p>

                        <button
                            class="mt-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded
                                   w-full"
                            onclick='addToCompare(${JSON.stringify(a)})'
                        >
                            Add to compare
                        </button>
                    </div>
                </div>
            `));l.innerHTML=s.join("")}window.addToCompare=function(e){let t=JSON.parse(localStorage.getItem("compareList"))||[];if(t.length>=2){alert("You can only compare up to 2 cars.");return}if(t.some(s=>s.make===e.make&&s.model===e.model)){alert("This car is already added.");return}t.push(e),localStorage.setItem("compareList",JSON.stringify(t)),alert(`${e.make} ${e.model} added to comparison.`)};
