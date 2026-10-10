import {
  products,
  sizes,
  money,
  filterProducts,
  estimateFabric,
  escapeHTML as esc,
} from "./domain.js";
const main = document.querySelector("main"),
  dialog = document.querySelector("#dialog"),
  dc = document.querySelector("#dialog-content");
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};
let bag = read("loom-bag", []),
  saved = read("loom-saved", []),
  versions = read("loom-versions", []),
  savedFit = read("loom-fit", null),
  studioDraft = {
    idea: "A modern draped dress with a soft neckline and a treasured saree border.",
    style: "dress",
    fabric: "Silk blend",
    sleeve: "Sleeveless",
    border: "Keep the original border",
  },
  uploadURL = "",
  studioVersion = null,
  selectedSize = "",
  shopState = { category: "All", query: "", max: 15000, sort: "featured" };
const categories = [
  "All",
  "Sarees",
  "Indian wear",
  "Indo-Western",
  "Everyday",
  "Festive",
  "Partywear",
];
const imageFor = (p) => p.image;
const img = (p, extra = "") =>
  `<img src="assets/${imageFor(p)}.jpg" alt="Illustrative ${p.tone.toLowerCase()} ${p.category.toLowerCase()} campaign look" ${extra || 'loading="lazy"'}>`;
function persist() {
  try {
    localStorage.setItem("loom-bag", JSON.stringify(bag));
    localStorage.setItem("loom-saved", JSON.stringify(saved));
    localStorage.setItem("loom-versions", JSON.stringify(versions));
  } catch {
    toast("Browser storage is unavailable. Changes last for this visit.");
  }
  counts();
}
function counts() {
  document.querySelector("#bag-count").textContent = bag.reduce(
    (a, b) => a + b.qty,
    0,
  );
  document.querySelector("#saved-count").textContent =
    saved.length + versions.length;
}
let toastTimer;
function toast(text) {
  const el = document.querySelector("#toast");
  el.textContent = text;
  el.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("visible"), 3500);
}
let focusBeforeDialog;
function modal(html) {
  focusBeforeDialog = document.activeElement;
  dc.innerHTML = html;
  dialog.showModal();
}
dialog.querySelector(".close").onclick = () => dialog.close();
dialog.addEventListener(
  "close",
  () => focusBeforeDialog?.isConnected && focusBeforeDialog.focus(),
);
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
function productCard(p) {
  return `<article class="product-card"><div class="product-image"><a href="#product/${p.id}">${img(p)}</a><button class="heart" data-save="${p.id}" aria-label="${saved.includes(p.id) ? "Unsave" : "Save"} ${p.name}" aria-pressed="${saved.includes(p.id)}">${saved.includes(p.id) ? "♥" : "♡"}</button><span class="tag">${p.occasion[0].toUpperCase()}</span></div><a href="#product/${p.id}"><h3>${p.name}</h3><p class="meta">${p.fabric}</p><p class="price">${money(p.price)} <span>Illustrative price</span></p></a></article>`;
}
function intro(eyebrow, title, copy) {
  return `<div class="page-intro"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${copy}</p></div>`;
}
function home() {
  return `<section class="hero"><div class="hero-copy"><div class="eyebrow">Indian roots. Your expression.</div><h1>Woven into<br>your story.</h1><p>For slow mornings, big celebrations and everything in between. Discover Indian fashion that feels like you.</p><a class="button" href="#shop">Explore the collection <span>↗</span></a><div class="hero-meta"><span>EVERYDAY FROM ₹1,490</span><span>OCCASION TO PREMIUM</span></div></div><div class="hero-photo"><img src="assets/green-real.jpg" alt="Fashion reference of a woman in a black embellished saree" fetchpriority="high"><div class="photo-label">THE NEW SEASON · ROOTED & REIMAGINED</div></div></section><div class="ticker"><span>SAREES & STORIES</span><span>EVERYDAY EASE</span><span>MODERN INDIAN EXPRESSION</span><span>YOUR NEXT CELEBRATION</span></div><section class="section"><div class="section-head"><div><div class="eyebrow">A wardrobe, many worlds</div><h2>Find your kind of beautiful.</h2></div><a class="text-link" href="#shop">Shop all pieces ↗</a></div><div class="world-grid">${categories
    .slice(1)
    .map(
      (c, i) =>
        `<a class="world-card" href="#shop/${encodeURIComponent(c)}"><div class="image"><img src="assets/${["saree-real", "indian-real", "fusion-real", "everyday-real", "festive-real", "party-real"][i]}.jpg" alt="${c} editorial inspiration" loading="lazy"></div><h3>${c}</h3><span>${["Tradition, endlessly reimagined", "A familiar feeling, a fresh form", "Between worlds, entirely you", "Easy pieces. Full days.", "For moments that matter", "A little after-dark magic"][i]} ↗</span></a>`,
    )
    .join(
      "",
    )}</div></section><section class="section" style="padding-top:15px"><div class="section-head"><div><div class="eyebrow">The considered edit</div><h2>Pieces to come back to.</h2></div><p>From accessible essentials to keepsake pieces. Choose by feeling, occasion or budget.</p></div><div class="product-grid">${[products[1], products[0], products[2], products[6]].map(productCard).join("")}</div></section><section class="editorial"><div class="editorial-img"><img src="assets/green-real.jpg" alt="Black evening saree styling reference" loading="lazy"></div><div class="editorial-copy"><div class="eyebrow">The Loom Journal · Styling notes</div><h2>One piece.<br>More possibilities.</h2><p>A treasured saree. A different drape. Jewellery that changes the mood. Discover little ways to make a look your own.</p><a class="text-link" href="#article/one-piece">Read the story ↗</a><a class="button outline" style="margin-top:25px" href="#curate">Curate Your Look ↗</a></div></section><section class="atelier-promo"><div><div class="concept">AI ATELIER · INTERACTIVE CONCEPT</div><div class="eyebrow">Create with Loom</div><h2>Every style begins<br>with an idea.</h2><p>A fabric you love. A sketch on your mind. A saree with a story. Explore what it could become, with space to make it yours.</p><a class="button light" href="#atelier">Step inside the Atelier ↗</a></div><div><div class="swatches" aria-hidden="true"><span></span><span></span><span></span></div><div class="steps"><div><span>01</span><section><h3>Start wherever inspiration finds you.</h3><p>Describe an idea, explore a style or upload a fabric.</p></section></div><div><span>02</span><section><h3>Explore. Refine. Save a possibility.</h3><p>Try different silhouettes and keep your favourite directions.</p></section></div><div><span>03</span><section><h3>Make room for the practical details.</h3><p>Check an illustrative fabric estimate. Invite a designer by choice.</p></section></div></div></div></section>`;
}
function shop(category) {
  if (category && categories.includes(category)) shopState.category = category;
  return (
    intro(
      "The collection",
      "A little everyday. A little extraordinary.",
      "Sarees, Indian essentials and contemporary expressions — from easy favourites to special-occasion pieces.",
    ) +
    `<section class="section shop-section"><div class="chips" aria-label="Shopping category">${categories.map((c) => `<button data-category="${c}" class="chip ${shopState.category === c ? "active" : ""}" aria-pressed="${shopState.category === c}">${c}</button>`).join("")}</div><div class="filters"><label class="search-field">Find a piece<input id="shop-query" type="search" value="${esc(shopState.query)}" placeholder="Try saree, cotton or rose"></label><label>Budget up to <span id="budget-value">${money(shopState.max)}</span><input id="shop-budget" type="range" min="1500" max="15000" step="500" value="${shopState.max}"></label><label>Sort by<select id="shop-sort"><option value="featured">The considered edit</option><option value="low" ${shopState.sort === "low" ? "selected" : ""}>Price: low to high</option><option value="high" ${shopState.sort === "high" ? "selected" : ""}>Price: high to low</option></select></label></div><div class="results-line"><span id="results-count" aria-live="polite"></span><span>Sample catalog · imagery illustrates style, not exact SKUs</span></div><div class="product-grid" id="shop-results"></div></section>`
  );
}
function updateResults() {
  const results = filterProducts(shopState);
  document.querySelector("#results-count").textContent =
    `${results.length} pieces`;
  document.querySelector("#shop-results").innerHTML = results.length
    ? results.map(productCard).join("")
    : `<div class="empty"><h2>A different direction?</h2><p>No pieces match this combination. Try a broader category or budget.</p><button class="button" id="reset-filters">Reset filters</button></div>`;
}
function sizeChart() {
  modal(
    `<h2>A starting point for your fit.</h2><p>Concept standard body measurements in centimetres. Production sizing and garment ease would require validation.</p><table class="size-table"><caption class="fine">Body measurements, not garment dimensions</caption><thead><tr><th>Size</th><th>Chest</th><th>Waist</th><th>Hip</th></tr></thead><tbody>${Object.entries(
      sizes,
    )
      .map(
        ([s, v]) =>
          `<tr><th>${s}</th>${v.map((n) => `<td>${n}</td>`).join("")}</tr>`,
      )
      .join(
        "",
      )}</tbody></table><p class="fine">Measure comfortably over light clothing. A designer would confirm final fit for a custom garment.</p>`,
  );
}
function detail(id) {
  const p = products.find((p) => p.id === id);
  if (!p) return missing();
  selectedSize = p.category === "Sarees" ? "Unstitched" : "";
  return `<section class="detail"><div><div class="breadcrumb"><a href="#shop">Collection</a> / ${p.category} / ${p.name}</div><div class="large-image">${img(p, 'loading="eager"')}</div><p class="fine" style="margin-top:12px">Sourced fashion reference photography for inspiration. Product specification, stock and prices are illustrative; images are not exact product photos.</p></div><div class="detail-copy"><div class="eyebrow">${p.category} · ${p.tone}</div><h1>${p.name}</h1><div class="price">${money(p.price)} <span class="fine">Illustrative price</span></div><p>${p.category === "Sarees" ? "A beautiful drape with a considered border. Make it a quiet statement or dress it up for a celebration." : p.category === "Indian wear" ? "Soft structure and effortless proportions, for days that move between the everyday and the extraordinary." : "Fluid lines with a contemporary point of view. A piece that finds its own balance between tradition and expression."}</p><div class="eyebrow" style="margin-bottom:12px">${p.fabric}</div><label>${p.category === "Sarees" ? "Drape" : "Select a size"}</label><div class="size-row">${(p.category === "Sarees" ? ["Unstitched"] : Object.keys(sizes)).map((s) => `<button data-size="${s}" class="${selectedSize === s ? "active" : ""}" aria-pressed="${selectedSize === s}">${s}</button>`).join("")}</div><button class="text-link" data-size-chart>View size chart</button><div id="size-error" role="alert" class="fine"></div><button class="button" data-add="${p.id}">Add to bag <span>↗</span></button><button class="text-link" data-save="${p.id}">${saved.includes(p.id) ? "Remove from" : "Add to"} saved pieces ♡</button><details open><summary>Details & care</summary><p>${p.fabric}. Dry-clean silk blends; wash cotton gently in cold water. These are sample care notes; actual supplier instructions would govern.</p></details><details><summary>Delivery & returns</summary><p>This is a concept store: delivery, stock and returns are not connected. No real order can be placed.</p></details><a class="text-link" href="#curate">Find a new way to wear it ↗</a></div></section>`;
}
function curate() {
  return (
    intro(
      "Style what exists",
      "Your look. Your way.",
      "Choose a moment and a mood. Bring existing pieces together with a little guidance — no new garment design required.",
    ) +
    `<section class="curate"><div class="curate-visual"><img src="assets/green-real.jpg" alt="Fashion styling reference in a black saree"><div class="photo-label">CURATE YOUR LOOK · STYLING CONCEPT</div></div><div class="panel"><h2>What are we dressing for?</h2><form id="curate-form"><div class="form-grid"><label>Occasion<select name="occasion"><option>Everyday</option><option>Festive</option><option>Partywear</option></select></label><label>Your mood<select name="mood"><option>Quiet & considered</option><option>Playful & expressive</option><option>Statement & celebratory</option></select></label><label class="wide">Budget for the main piece<select name="budget"><option value="3000">Under ₹3,000</option><option value="7000" selected>Under ₹7,000</option><option value="15000">Up to ₹15,000</option></select></label></div><button class="button">Find my edit ↗</button></form><div id="curate-results" aria-live="polite"><div class="notice">Style an existing look here. To explore making a new design, visit Create with Loom.</div></div></div></section>`
  );
}
const styleNames = {
  dress: "Modern draped dress",
  coord: "Contemporary co-ord",
  jacket: "Statement jacket",
  saree: "Reimagined saree",
};
function atelier() {
  return (
    intro(
      "Create with Loom · AI Atelier concept",
      "Begin with a possibility.",
      "Explore freely. Refine the details. Bring in fabric and fit information when you want to understand what it might take.",
    ) +
    `<section class="studio"><aside class="panel"><div class="concept">SIMULATED AI · NO MODEL CONNECTED</div><h2>Your starting point</h2><form id="studio-form"><label for="idea">Describe your idea</label><textarea id="idea" name="idea" maxlength="1200">${esc(studioDraft.idea)}</textarea><label for="style">Explore a design family</label><select id="style" name="style">${Object.entries(
      styleNames,
    )
      .map(
        ([k, n]) =>
          `<option value="${k}" ${studioDraft.style === k ? "selected" : ""}>${n}</option>`,
      )
      .join(
        "",
      )}</select><label for="fabric">Fabric direction</label><select id="fabric" name="fabric">${["Silk blend", "Cotton / linen", "Crepe", "My uploaded fabric"].map((n) => `<option ${studioDraft.fabric === n ? "selected" : ""}>${n}</option>`).join("")}</select><label for="sleeve">Sleeves</label><select id="sleeve" name="sleeve">${["Sleeveless", "Short sleeves", "Full sleeves", "Cape overlay"].map((n) => `<option ${studioDraft.sleeve === n ? "selected" : ""}>${n}</option>`).join("")}</select><label for="border">Border / detail</label><select id="border" name="border">${["Keep the original border", "Understated finish", "Statement trim"].map((n) => `<option ${studioDraft.border === n ? "selected" : ""}>${n}</option>`).join("")}</select><label for="upload">Upload fabric, saree or inspiration</label><input id="upload" type="file" accept="image/jpeg,image/png,image/webp"><p class="storage-note">JPG, PNG or WebP, up to 8 MB. Preview stays on this device for this visit. It is never sent to an AI service.</p><div id="upload-preview">${uploadURL ? `<img class="upload-preview" src="${uploadURL}" alt="Your uploaded inspiration"><button class="text-link" id="remove-upload" type="button">Remove image</button>` : ""}</div><button class="button">Explore a design direction ↗</button></form></aside><div><div class="canvas"><div class="canvas-image" id="design-canvas"><img src="assets/fusion-real.jpg" alt="Illustrative editorial design direction, not a generated custom garment"><div class="photo-label">ILLUSTRATIVE CANVAS · NOT A CUSTOM RENDER</div></div><div class="canvas-notes" id="design-notes"><div class="eyebrow">A space to experiment</div><h2>Your idea has<br>room to grow.</h2><p>Start with any inspiration. Explore a drape, a co-ord, a jacket or a saree — these are starting points, not limits on your imagination.</p><div class="fine">The demo creates a design brief from your choices. It does not generate a new garment image.</div></div></div><div class="workspace-bottom"><section class="panel"><h2>Keep a possibility</h2><p>Saved versions keep your brief and chosen details. Compare two directions before taking the next step.</p><div class="versions" id="versions"></div><button class="text-link" id="compare">Compare saved versions</button><p class="storage-note">Saved locally in this browser. No account or cloud sync. Uploaded images are not retained.</p></section><section class="panel"><h2>When you're ready to make it.</h2><p>Fabric quantity and fit matter once a direction feels right. Use an illustrative estimate to explore the next questions.</p><button class="button outline" id="feasibility">Explore fabric & fit ↗</button><button class="text-link" id="consult" style="margin-top:14px">Invite a designer, by choice ↗</button><p class="fine">No booking or garment production is connected.</p></section></div></div></section>`
  );
}
function renderVersions() {
  const el = document.querySelector("#versions");
  if (el)
    el.innerHTML = versions.length
      ? versions
          .map(
            (v, i) =>
              `<button class="version" data-version="${v.id}"><strong>Version ${i + 1}</strong>${esc(styleNames[v.style] || v.style)}<br>${esc(v.fabric)} · ${esc(v.sleeve)}</button>`,
          )
          .join("")
      : `<p class="fine">Explore a direction, then save your first version.</p>`;
}
function showDirection(v) {
  studioVersion = v;
  document.querySelector("#design-notes").innerHTML =
    `<div class="eyebrow">${v.custom ? "Your saved direction" : "Demo design brief"}</div><h2>${esc(styleNames[v.style] || v.style)}</h2><p>${esc(v.idea)}</p><p class="fine">${esc(v.fabric)} · ${esc(v.sleeve)}<br>${esc(v.border)}</p><div class="notice">${v.style === "jacket" ? "Consider the fabric’s structure and how a border could frame the opening." : v.style === "coord" ? "Consider a relaxed top and bottom; separate pieces need their own cutting allowance." : v.style === "saree" ? "Explore draping and border placement before deciding whether cutting is needed." : "Explore a fluid silhouette; drape and stretch need a hands-on fabric review."} This is a scripted suggestion, not AI analysis of your image or prompt.</div><button class="button" id="save-version">Save this version ♡</button>`;
  document.querySelector("#design-canvas img").src =
    `assets/${v.style === "coord" ? "everyday-real" : v.style === "saree" ? "saree-real" : v.style === "jacket" ? "indian-real" : "party-real"}.jpg`;
}
function feasibility() {
  modal(
    `<div class="eyebrow">Illustrative planning tool</div><h2>Fabric meets fit.</h2><p>This rough rule-based estimate is not a cutting plan or production approval. Fabric defects, motifs, stretch, seam allowance and pattern placement need a designer's review.</p><form id="fit-form"><div class="form-grid"><label>Available length (metres)<input name="length" type="number" min="0.1" max="30" step="0.1" value="5.5" required></label><label>Usable width (cm)<input name="width" type="number" min="60" max="180" value="110" required></label><label class="wide">Fit method<select id="fit-method" name="method"><option value="standard">Standard size</option><option value="measure">My measurements</option><option value="reuse" ${savedFit ? "" : "disabled"}>Reuse locally saved fit${savedFit ? "" : " — none saved"}</option></select></label><label id="standard-fit" class="wide">Size<select name="size">${Object.keys(
      sizes,
    )
      .map((s) => `<option ${s === "M" ? "selected" : ""}>${s}</option>`)
      .join(
        "",
      )}</select></label><div id="custom-fit" class="form-grid wide" hidden><label>Chest (cm)<input name="chest" type="number" min="60" max="160" value="91"></label><label>Hip (cm)<input name="hip" type="number" min="60" max="180" value="99"></label><label class="wide"><input name="remember" type="checkbox"> Remember this fit on this device</label><p class="storage-note wide">Optional, unencrypted browser storage. Avoid saving on a shared device. You can delete it below.</p></div><label class="wide">Design direction<select name="silhouette">${Object.entries(
      styleNames,
    )
      .map(
        ([k, v]) =>
          `<option value="${k}" ${(studioVersion?.style || studioDraft.style) === k ? "selected" : ""}>${v}</option>`,
      )
      .join(
        "",
      )}</select></label></div><button class="text-link" type="button" data-size-chart>View standard size chart</button><button class="button" style="width:100%;margin-top:20px">Check illustrative estimate</button></form><div id="fit-result" aria-live="polite"></div>${savedFit ? '<button class="text-link" id="delete-fit">Delete saved fit</button>' : ""}`,
  );
}
function savedPage() {
  return (
    intro(
      "Your little collection",
      "Keep what speaks to you.",
      "Saved pieces and design briefs are stored in this browser, ready for another look.",
    ) +
    `<section class="section" style="padding-top:10px"><div class="section-head"><h2>Saved pieces</h2></div><div class="product-grid">${
      saved.length
        ? products
            .filter((p) => saved.includes(p.id))
            .map(productCard)
            .join("")
        : '<div class="empty"><p>Your collection starts with a little heart.</p><a class="button" href="#shop">Explore pieces ↗</a></div>'
    }</div><div class="section-head" style="margin-top:50px"><h2>Saved design directions</h2><a class="text-link" href="#atelier">Back to the Atelier ↗</a></div><div class="form-grid">${versions.length ? versions.map((v, i) => `<article class="panel"><div class="eyebrow">Version ${i + 1}</div><h2>${esc(styleNames[v.style] || v.style)}</h2><p>${esc(v.idea)}</p><p>${esc(v.fabric)} · ${esc(v.sleeve)} · ${esc(v.border)}</p><button class="text-link" data-delete-version="${v.id}">Delete version</button></article>`).join("") : '<p class="fine">No designs saved yet. Your ideas have a home in the Atelier.</p>'}</div><p class="storage-note" style="margin-top:25px">Device-only storage. Saved designs do not contain uploaded images or account data.</p></section>`
  );
}
function bagPage() {
  const subtotal = bag.reduce(
    (n, b) => n + products.find((p) => p.id === b.id).price * b.qty,
    0,
  );
  return (
    intro(
      "Your bag",
      "A considered choice.",
      "Review your pieces and sizes. Checkout is a simulation; no payments or orders are accepted.",
    ) +
    `<section class="section" style="padding-top:0">${
      bag.length
        ? `<div class="bag-layout"><div>${bag
            .map((b, i) => {
              const p = products.find((p) => p.id === b.id);
              return `<article class="bag-item">${img(p)}<div><a href="#product/${p.id}"><h3>${p.name}</h3></a><p class="fine">${p.tone} · ${b.size}</p><p>${money(p.price)}</p><label>Quantity<select data-qty="${i}" aria-label="Quantity for ${p.name}">${[1, 2, 3, 4, 5].map((n) => `<option ${n === b.qty ? "selected" : ""}>${n}</option>`).join("")}</select></label><button class="text-link" data-remove="${i}">Remove</button></div></article>`;
            })
            .join(
              "",
            )}</div><aside class="panel"><h2>Your edit</h2><div class="summary-row"><span>Subtotal</span><span>${money(subtotal)}</span></div><div class="summary-row"><span>Delivery</span><span>Not calculated</span></div><div class="summary-row divider"><strong>Illustrative total</strong><strong>${money(subtotal)}</strong></div><button class="button" id="checkout">Preview checkout ↗</button><p class="fine">Demo only. No real inventory, shipping, taxes or payment provider.</p><a class="text-link" href="#shop">Keep exploring</a></aside></div>`
        : '<div class="empty"><h2>Room for something beautiful.</h2><p>Your bag is empty.</p><a class="button" href="#shop">Explore the collection ↗</a></div>'
    }</section>`
  );
}
function journal() {
  return (
    intro(
      "The Loom Journal",
      "A wardrobe with a point of view.",
      "Stories of styling, care and creative possibilities. Editorial ideas, thoughtfully considered.",
    ) +
    `<section class="section" style="padding-top:10px"><div class="journal-grid"><article class="journal-card"><img src="assets/green-real.jpg" alt="Indian fashion editorial"><div class="eyebrow" style="margin-top:20px">Styling · 3 minute read</div><h2>One piece. More possibilities.</h2><p>Small styling choices can move a familiar piece between everyday plans and an evening invitation.</p><a class="text-link" href="#article/one-piece">Read the story ↗</a></article><article class="journal-card"><img src="assets/saree-real.jpg" alt="Teal saree style inspiration"><div class="eyebrow" style="margin-top:20px">Atelier · 3 minute read</div><h2>The next chapter of a treasured saree.</h2><p>Before imagining a new silhouette, give the fabric's condition, history and possibilities a closer look.</p><a class="text-link" href="#article/heritage">Read the story ↗</a></article></div></section>`
  );
}
function article(id) {
  const heritage = id === "heritage";
  return `<article class="article"><div class="breadcrumb"><a href="#journal">The Loom Journal</a> / ${heritage ? "Atelier" : "Styling"}</div><div class="eyebrow">${heritage ? "Reimagined heritage" : "Ways of wearing"} · Editorial inspiration</div><h1>${heritage ? "The next chapter of a treasured saree." : "One piece. More possibilities."}</h1><img src="assets/${heritage ? "saree-real" : "festive-real"}.jpg" alt="${heritage ? "Teal saree inspiration" : "Indian fashion styling inspiration"}"><p>${heritage ? "A saree can carry more than beautiful fabric. It may hold memories, a distinctive woven border or a textile that deserves to be worn again. Reimagining it begins with looking closely, before making the first cut." : "A wardrobe becomes personal through the way you wear it. A familiar kurta, a favourite saree or a fluid dress can take on a new mood through proportion, texture and a few deliberate details."}</p><h2>${heritage ? "Look before you cut." : "Start with the moment."}</h2><p>${heritage ? "Check for thinning, stains and fragile areas. Note the usable length and width, the direction of the weave, and where motifs or borders fall. A photograph can inspire possibilities; it cannot confirm the fabric’s condition or suitability." : "For a full day, begin with breathable textures and comfortable movement. For a celebration, try a more defined drape or a statement accessory. The same main piece can feel different without replacing an entire outfit."}</p><h2>${heritage ? "Let the textile guide the idea." : "Change one detail."}</h2><p>${heritage ? "A border could frame a jacket opening, finish a sleeve or remain the focal point of a drape. Explore several ideas freely, then bring fit and construction into the conversation. A qualified designer should confirm the pattern, quantity and price before production." : "A softer drape, a structured layer or a warmer metallic accent can change the balance of a look. Choose one focal point and let the other elements support it. These are styling suggestions, not rules about how you should dress."}</p><a class="button" href="#${heritage ? "atelier" : "curate"}">${heritage ? "Explore Create with Loom" : "Curate Your Look"} ↗</a></article>`;
}
function missing() {
  return '<section class="section empty"><h1>This page slipped a thread.</h1><p>Return to the collection to keep exploring.</p><a class="button" href="#shop">Explore the collection</a></section>';
}
function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
function route() {
  if (location.hash === "#main") {
    main.focus();
    return;
  }
  const draftForm = document.querySelector("#studio-form");
  if (draftForm) studioDraft = Object.fromEntries(new FormData(draftForm));
  const [page, param] = location.hash.slice(1).split("/");
  document.querySelector("nav").classList.remove("open");
  document.querySelector("#menu").setAttribute("aria-expanded", "false");
  main.innerHTML =
    page === "shop"
      ? shop(param ? safeDecode(param) : null)
      : page === "product"
        ? detail(param)
        : page === "curate"
          ? curate()
          : page === "atelier"
            ? atelier()
            : page === "saved"
              ? savedPage()
              : page === "bag"
                ? bagPage()
                : page === "journal"
                  ? journal()
                  : page === "article"
                    ? article(param)
                    : !page || page === "home"
                      ? home()
                      : missing();
  document.title = `${{ shop: "The collection", product: "Product details", curate: "Curate Your Look", atelier: "Create with Loom", saved: "Saved", bag: "Your bag", journal: "The Loom Journal", article: "The Loom Journal" }[page] || "Woven into your story"} — Loom India`;
  if (page === "shop") updateResults();
  if (page === "atelier") renderVersions();
  counts();
  window.scrollTo(0, 0);
  main.focus({ preventScroll: true });
}
window.addEventListener("hashchange", route);
document.querySelector("#menu").onclick = () => {
  const open = document.querySelector("nav").classList.toggle("open");
  document.querySelector("#menu").setAttribute("aria-expanded", open);
};
document.querySelector(".skip").onclick = (e) => {
  e.preventDefault();
  main.focus();
};
document.querySelector("#search-open").onclick = () =>
  modal(
    `<h2>Find your next favourite.</h2><form id="global-search"><label>Search the collection<input name="query" type="search" placeholder="Saree, cotton, rose…" required></label><button class="button" style="margin-top:20px">Search pieces ↗</button></form>`,
  );
document.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.save) {
    const id = b.dataset.save;
    saved = saved.includes(id) ? saved.filter((x) => x !== id) : [...saved, id];
    persist();
    b.setAttribute("aria-pressed", saved.includes(id));
    b.setAttribute(
      "aria-label",
      `${saved.includes(id) ? "Unsave" : "Save"} ${products.find((p) => p.id === id).name}`,
    );
    if (b.classList.contains("heart"))
      b.textContent = saved.includes(id) ? "♥" : "♡";
    else
      b.textContent = saved.includes(id)
        ? "Remove from saved pieces"
        : "Add to saved pieces ♡";
    toast(
      saved.includes(id)
        ? "Piece saved to this browser."
        : "Piece removed from saved.",
    );
    if (location.hash === "#saved") main.innerHTML = savedPage();
  }
  if (b.dataset.category) {
    shopState.category = b.dataset.category;
    document.querySelectorAll("[data-category]").forEach((x) => {
      x.classList.toggle("active", x === b);
      x.setAttribute("aria-pressed", x === b);
    });
    updateResults();
  }
  if (b.id === "reset-filters") {
    shopState = { category: "All", query: "", max: 15000, sort: "featured" };
    main.innerHTML = shop();
    updateResults();
  }
  if (b.dataset.size) {
    selectedSize = b.dataset.size;
    document.querySelectorAll("[data-size]").forEach((x) => {
      x.classList.toggle("active", x === b);
      x.setAttribute("aria-pressed", x === b);
    });
    document.querySelector("#size-error").textContent = "";
  }
  if (b.hasAttribute("data-size-chart")) {
    if (b.closest("#fit-form")) {
      const old = document.querySelector("#inline-chart");
      if (old) {
        old.remove();
      } else {
        b.insertAdjacentHTML(
          "afterend",
          `<table id="inline-chart" class="size-table"><caption>Body measurements in cm · concept sizing</caption><thead><tr><th>Size</th><th>Chest</th><th>Waist</th><th>Hip</th></tr></thead><tbody>${Object.entries(
            sizes,
          )
            .map(
              ([s, v]) =>
                `<tr><th>${s}</th>${v.map((n) => `<td>${n}</td>`).join("")}</tr>`,
            )
            .join("")}</tbody></table>`,
        );
      }
    } else sizeChart();
  }
  if (b.dataset.add) {
    if (!selectedSize) {
      document.querySelector("#size-error").textContent =
        "Please choose a size before adding this piece.";
      return;
    }
    const old = bag.find(
      (x) => x.id === b.dataset.add && x.size === selectedSize,
    );
    if (old) old.qty = Math.min(5, old.qty + 1);
    else bag.push({ id: b.dataset.add, size: selectedSize, qty: 1 });
    persist();
    toast("Added to your demo bag.");
  }
  if (b.dataset.remove !== undefined) {
    bag.splice(Number(b.dataset.remove), 1);
    persist();
    main.innerHTML = bagPage();
  }
  if (b.id === "checkout")
    modal(
      `<div class="concept">SIMULATED CHECKOUT</div><h2>Your edit is ready to review.</h2><p>${bag.reduce((n, b) => n + b.qty, 0)} pieces · ${money(bag.reduce((n, b) => n + products.find((p) => p.id === b.id).price * b.qty, 0))}</p><div class="notice">This preview ends here. No order has been created and no payment or address is collected.</div><p>A production checkout would confirm stock, shipping, taxes, returns and payment with a secure provider.</p><button class="button" id="end-checkout">Back to my bag</button>`,
    );
  if (b.id === "end-checkout") dialog.close();
  if (b.id === "save-version" && studioVersion) {
    versions.push({ ...studioVersion, id: crypto.randomUUID(), custom: true });
    persist();
    renderVersions();
    toast("Design brief saved on this device.");
  }
  if (b.dataset.version) {
    const v = versions.find((v) => v.id === b.dataset.version);
    studioDraft = { ...v };
    for (const key of ["idea", "style", "fabric", "sleeve", "border"])
      document.querySelector(`#studio-form [name="${key}"]`).value = v[key];
    showDirection(v);
    document
      .querySelector("#design-notes")
      .scrollIntoView({ behavior: "auto", block: "center" });
  }
  if (b.dataset.deleteVersion) {
    versions = versions.filter((v) => v.id !== b.dataset.deleteVersion);
    persist();
    main.innerHTML = savedPage();
  }
  if (b.id === "compare") {
    if (versions.length < 2) {
      toast("Save at least two directions to compare.");
      return;
    }
    modal(
      `<h2>Two possibilities, side by side.</h2><div class="form-grid">${versions
        .slice(-2)
        .map(
          (v, i) =>
            `<div class="panel"><div class="eyebrow">${i ? "Latest" : "Previous"} version</div><h3>${esc(styleNames[v.style] || v.style)}</h3><p>${esc(v.idea)}</p><p>${esc(v.fabric)}<br>${esc(v.sleeve)}<br>${esc(v.border)}</p></div>`,
        )
        .join(
          "",
        )}</div><p class="fine">Comparison uses your two most recently saved briefs, not generated garment renders.</p>`,
    );
  }
  if (b.id === "feasibility") feasibility();
  if (b.id === "delete-fit") {
    savedFit = null;
    try {
      localStorage.removeItem("loom-fit");
    } catch {}
    toast("Saved fit deleted.");
    dialog.close();
  }
  if (b.id === "consult")
    modal(
      `<div class="concept">CONSULTATION CONCEPT · NO BOOKING</div><h2>A designer, when you need one.</h2><p>Bring your favourite direction, fabric dimensions and questions. A designer would review textile suitability, construction, fit and pricing with you.</p><ul><li>Fabric condition and usable areas</li><li>Motif and border placement</li><li>Fit, pattern and final fabric quantity</li><li>Price, lead time and production approval</li></ul><div class="notice">This is an optional consultation preview. No request is sent and no appointment is booked.</div>`,
    );
  if (b.id === "remove-upload") {
    URL.revokeObjectURL(uploadURL);
    uploadURL = "";
    document.querySelector("#upload").value = "";
    document.querySelector("#upload-preview").innerHTML = "";
  }
  if (b.dataset.info)
    modal(
      b.dataset.info === "care"
        ? '<h2>Care starts with the textile.</h2><p>Store silk in breathable covers, keep folds relaxed and avoid prolonged sunlight. Follow the final garment’s supplier care label.</p><p class="fine">Concept care guidance. Textile composition and care instructions are illustrative.</p>'
        : "<h2>Here to make things clearer.</h2><p>Loom India is a concept storefront. Orders, delivery tracking, returns and customer service are not connected.</p><p>Explore the bag and checkout preview without submitting payment or personal details.</p>",
    );
});
document.addEventListener("input", (e) => {
  if (e.target.id === "shop-query") {
    shopState.query = e.target.value;
    updateResults();
  }
  if (e.target.id === "shop-budget") {
    shopState.max = Number(e.target.value);
    document.querySelector("#budget-value").textContent = money(shopState.max);
    updateResults();
  }
});
document.addEventListener("change", (e) => {
  if (e.target.id === "shop-sort") {
    shopState.sort = e.target.value;
    updateResults();
  }
  if (e.target.dataset.qty !== undefined) {
    bag[Number(e.target.dataset.qty)].qty = Number(e.target.value);
    persist();
    main.innerHTML = bagPage();
  }
  if (e.target.id === "fit-method") {
    document.querySelector("#standard-fit").hidden =
      e.target.value !== "standard";
    document.querySelector("#custom-fit").hidden = e.target.value !== "measure";
    document.querySelector("#fit-result").innerHTML = "";
  }
  if (e.target.id === "upload") {
    const file = e.target.files[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      e.target.value = "";
      toast("Choose JPG, PNG or WebP up to 8 MB.");
      return;
    }
    if (uploadURL) URL.revokeObjectURL(uploadURL);
    uploadURL = URL.createObjectURL(file);
    document.querySelector("#upload-preview").innerHTML =
      `<img class="upload-preview" src="${uploadURL}" alt="Your uploaded inspiration"><button id="remove-upload" type="button" class="text-link">Remove image</button>`;
    toast("Local preview added. Your image is not analysed.");
  }
});
document.addEventListener("submit", (e) => {
  if (
    !["studio-form", "curate-form", "fit-form", "global-search"].includes(
      e.target.id,
    )
  )
    return;
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  if (e.target.id === "global-search") {
    shopState.query = data.query;
    dialog.close();
    if (location.hash === "#shop") {
      main.innerHTML = shop();
      updateResults();
    } else location.hash = "shop";
  }
  if (e.target.id === "studio-form") {
    studioDraft = data;
    showDirection(data);
    toast("Demo direction explored. No AI request was sent.");
  }
  if (e.target.id === "curate-form") {
    const matches = filterProducts({
      category: data.occasion,
      max: data.budget,
    }).slice(0, 2);
    const mood = data.mood.startsWith("Quiet")
      ? "Keep accessories minimal and let the textile lead. Try comfortable flats and a soft drape."
      : data.mood.startsWith("Playful")
        ? "Try a contrasting accent and an unexpected layer. Keep one element playful and the rest easy."
        : "Choose one statement accessory and a defined drape. Let the main piece set the mood.";
    document.querySelector("#curate-results").innerHTML =
      `<h3>Your ${esc(data.occasion.toLowerCase())} edit</h3><p>${mood}</p><p class="fine">Scripted styling suggestions, not AI. Accessories are ideas, not products included in the price.</p><div class="look-grid">${matches.length ? matches.map(productCard).join("") : "<p>No matching pieces under this budget. Try a higher budget or Everyday.</p>"}</div>`;
  }
  if (e.target.id === "fit-form") {
    let chest, hip;
    if (data.method === "reuse" && savedFit) {
      ({ chest, hip } = savedFit);
    } else if (data.method === "measure") {
      chest = Number(data.chest);
      hip = Number(data.hip);
    } else {
      const size = sizes[data.size];
      chest = size[0];
      hip = size[2];
    }
    const result = estimateFabric({ ...data, chest, hip });
    const out = document.querySelector("#fit-result");
    out.innerHTML = result.error
      ? `<div role="alert" class="notice">${result.error}</div>`
      : `<div class="fit-result"><strong>${result.enough ? "Potentially enough — review required" : "This direction may need more fabric"}</strong><p>Illustrative allowance: ${result.required} m at ${esc(data.width)} cm usable width. Available: ${esc(data.length)} m.</p><p>${result.enough ? "A positive estimate does not guarantee feasibility." : "Explore a simpler silhouette, reduced fullness or a complementary fabric."} Motif placement, lining, fabric condition and final pattern remain unverified.</p><p class="fine">Rule-based estimate includes a 0.4 m planning allowance. A designer must confirm all quantities and fit.</p></div>`;
    if (!result.error && data.method === "measure" && data.remember) {
      savedFit = { chest, hip };
      try {
        localStorage.setItem("loom-fit", JSON.stringify(savedFit));
        toast("Fit saved locally. You can delete it in Fabric & fit.");
      } catch {
        toast("Storage unavailable. Fit is retained for this visit only.");
      }
    }
  }
});
route();
