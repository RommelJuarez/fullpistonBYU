import{g as i,r as y}from"./main-DnQXkxaQ.js";import{c as b}from"./ExternalServices-BQ9PCoV8.js";document.addEventListener("DOMContentLoaded",()=>{const t=document.querySelector(".btn-ai-compare"),l=document.getElementById("ai-result"),n=document.getElementById("ai-result-text");t.addEventListener("click",async()=>{const s=i();if(s.length!==2){l.classList.remove("hidden"),n.textContent="You need exactly 2 cars in comparison to use AI.";return}l.classList.remove("hidden"),n.textContent="Analyzing cars with AI...";try{const e=await b(s);n.textContent=e}catch(e){n.textContent=`Error: ${e.message}`}})});document.addEventListener("DOMContentLoaded",()=>{u()});function u(){const t=i(),l=document.getElementById("compare-table-body"),n=document.getElementById("carA-title"),s=document.getElementById("carB-title"),e=t[0]||null,r=t[1]||null;if(n.innerHTML=e?`${a(e.make)} ${a(e.model)}
       <button data-make="${c(e.make)}"
               data-model="${c(e.model)}"
               class="remove-compare ml-2 text-red-400 hover:text-red-600 text-sm"
               title="Remove">✖</button>`:"Car A",s.innerHTML=r?`${a(r.make)} ${a(r.model)}
       <button data-make="${c(r.make)}"
               data-model="${c(r.model)}"
               class="remove-compare ml-2 text-red-400 hover:text-red-600 text-sm"
               title="Remove">✖</button>`:"Car B",!e&&!r){l.innerHTML=`
      <tr>
        <td class="p-6 text-center text-gray-300" colspan="3">
          No cars added to comparison. Add cars from the search page.
        </td>
      </tr>
    `;return}const p=[{label:"Make",key:"make"},{label:"Model",key:"model"},{label:"Year",key:"year"},{label:"Price (BRL)",key:"priceBRL"},{label:"Price (USD)",key:"priceUSD"},{label:"Fuel",key:"fuel"},{label:"FIPE Code",key:"codeFipe"},{label:"Reference",key:"referenceMonth"}].map(o=>{const d=e?.[o.key]??"—",m=r?.[o.key]??"—";return`
      <tr class="border-b border-gray-700">
        <td class="p-4 font-medium text-gray-300">${a(o.label)}</td>
        <td class="p-4 text-center text-white">${a(String(d))}</td>
        <td class="p-4 text-center text-white">${a(String(m))}</td>
      </tr>
    `}).join(""),g=`
    <tr class="border-b border-gray-700">
      <td class="p-4 font-medium text-gray-300">Image</td>
      <td class="p-4 text-center">
        ${e?.image?`<img src="${c(e.image)}" class="mx-auto w-48 h-28 object-cover rounded-lg">`:"—"}
      </td>
      <td class="p-4 text-center">
        ${r?.image?`<img src="${c(r.image)}" class="mx-auto w-48 h-28 object-cover rounded-lg">`:"—"}
      </td>
    </tr>
  `;l.innerHTML=g+p,document.querySelectorAll(".remove-compare").forEach(o=>{o.addEventListener("click",()=>{const d=o.getAttribute("data-make"),m=o.getAttribute("data-model");!d||!m||!confirm(`Remove ${d} ${m} from comparison?`)||(y(d,m),u())})})}function a(t){return t?String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;"):""}function c(t){return t?a(String(t)):""}
