// UneedIndia , app shell: header, cart, lightbox, reveal, product card renderer
(function(){
 const STORAGE_KEY = "uneed_cart_v1";
 const fmt = n => "₹" + Number(n).toLocaleString("en-IN");

 // ---------- CART ----------
 const Cart = {
 items: [],
 load(){
 try { this.items = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
 catch { this.items = []; }
 },
 save(){
 localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
 this.emit();
 },
 add(id, qty=1){
 const f = this.items.find(i=>i.id===id);
 if (f) f.qty += qty; else this.items.push({id, qty});
 this.save();
 },
 setQty(id, qty){
 if (qty <= 0) this.items = this.items.filter(i=>i.id!==id);
 else { const f=this.items.find(i=>i.id===id); if(f) f.qty=qty; }
 this.save();
 },
 remove(id){ this.items = this.items.filter(i=>i.id!==id); this.save(); },
 clear(){ this.items = []; this.save(); },
 detailed(){
 return this.items.map(i => {
 const p = window.getProduct(i.id);
 if (!p) return null;
 return { product:p, qty:i.qty, line:p.price*i.qty };
 }).filter(Boolean);
 },
 count(){ return this.items.reduce((s,i)=>s+i.qty,0); },
 subtotal(){ return this.detailed().reduce((s,d)=>s+d.line,0); },
 _listeners: [],
 on(fn){ this._listeners.push(fn); fn(); },
 emit(){ this._listeners.forEach(fn=>fn()); }
 };
 Cart.load();
 window.Cart = Cart;

 // ---------- WHATSAPP ----------

 window.waLink = (text) => `https://wa.me/${window.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
 window.buildOrderMessage = () => {
 const d = Cart.detailed();
 if (!d.length) return "Hello Uneed India,\n\nI would like to place an order.\n\nThank you.";
 const lines = d.map(x => `${x.product.name} x ${x.qty}`);
 return [
 "Hello Uneed India,","","I would like to place an order.","",
 "Items:", ...lines, "",
 `Total Amount: ${fmt(Cart.subtotal())}`, "",
 "I have completed the payment.","","UPI ID used:", window.UPI_ID, "",
 "Payment screenshot attached.","","Please confirm my order.","","Thank you."
 ].join("\n");
 };
 window.buildProductMessage = (p, qty=1) => [
 "Hello Uneed India,","","I would like to order:","", p.name, "",
 `Price: ${fmt(p.price*qty)}${qty>1?` (× ${qty})`:""}`, "",
 "I have completed payment.","", `UPI ID:\n${window.UPI_ID}`,"",
 "Payment screenshot attached.","","Please confirm my order.","","Thank you."
 ].join("\n");
 window.customOrderWA = () => window.waLink("Hello Uneed India,\n\nI would like to place a crochet order. I'd love to discuss colours, design and size.\n\nThank you.");

 // ---------- HEADER ----------
 function renderHeader(){
 const headerEl = document.querySelector(".site-header");
 if (!headerEl) return;
 headerEl.innerHTML = `
 <div class="inner">
 <a href="index.html" class="brand">Uneed<span class="india-mark">india</span></a>
 <nav class="nav-desktop">
 <a href="index.html">Home</a>
 <a href="shop.html">Shop</a>
 <a href="story.html">Story</a>
 <a href="custom.html">Custom</a>
 <a href="reviews.html">Reviews</a>
 <a href="contact.html">Contact</a>
 </nav>
 <div style="display:flex;align-items:center;gap:.5rem">
 <button class="icon-btn" id="open-cart" aria-label="Cart">
 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
 <span class="cart-badge" id="cart-badge" style="display:none">0</span>
 </button>
 <button class="icon-btn menu-toggle" id="menu-toggle" aria-label="Menu">
 <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
 </button>
 </div>
 </div>
 <div class="mobile-menu" id="mobile-menu">
 <a href="index.html">Home</a>
 <a href="shop.html">Shop</a>
 <a href="story.html">Story</a>
 <a href="custom.html">Custom</a>
 <a href="reviews.html">Reviews</a>
 <a href="contact.html">Contact</a>
 </div>`;
 const onScroll = () => headerEl.classList.toggle("scrolled", window.scrollY > 24);
 window.addEventListener("scroll", onScroll, { passive:true }); onScroll();
 document.getElementById("menu-toggle").onclick = () =>
 document.getElementById("mobile-menu").classList.toggle("open");
 document.getElementById("open-cart").onclick = () => openDrawer();
 Cart.on(() => {
 const b = document.getElementById("cart-badge");
 const c = Cart.count();
 if (!b) return;
 b.textContent = c;
 b.style.display = c > 0 ? "flex" : "none";
 });
 }

 // ---------- FOOTER ----------
 function renderFooter(){
 const f = document.querySelector(".site-footer");
 if (!f) return;
 f.innerHTML = `
 <div class="container">
 <div class="cols">
 <div>
 <a href="index.html" class="brand" style="color:var(--cream)">Uneed<span class="india-mark" style="color:var(--peach)">india</span></a>
 <p style="margin-top:1rem;max-width:24rem">A crochet home based in Udaipur, Rajasthan.</p>
 </div>
 <div>
 <h4>Shop</h4>
 <ul>
 <li><a href="shop.html">All pieces</a></li>
 <li><a href="category.html?slug=bouquets">Bouquets</a></li>
 <li><a href="category.html?slug=bags">Bags</a></li>
 <li><a href="category.html?slug=keychains">Keychains</a></li>
 </ul>
 </div>
 <div>
 <h4>About us</h4>
 <ul>
 <li><a href="story.html">Our story</a></li>
 <li><a href="custom.html">Custom orders</a></li>
 <li><a href="reviews.html">Reviews</a></li>
 <li><a href="contact.html">Contact</a></li>
 </ul>
 </div>
 <div>
 <h4>Stay close</h4>
 <ul>
 <li><a href="https://wa.me/919588836494" target="_blank" rel="noreferrer">WhatsApp</a></li>
 <li><a href="https://www.instagram.com/uneedindia?igsh=MWF4b3lwZmp3dmExMg==" target="_blank" rel="noreferrer">Instagram</a></li>
 <li><a href="mailto:uneedindia3@gmail.com">uneedindia3@gmail.com</a></li>
 </ul>
 </div>
 </div>
 <div class="bottom">
 <span>© ${new Date().getFullYear()} Uneed India - Udaipur.</span>
 
 </div>
 </div>`;
 }

 // ---------- STICKY CTA ----------
 function renderStickyCTA(){
 const el = document.querySelector(".sticky-cta");
 if (!el) return;
 el.innerHTML = `
 <a href="${window.customOrderWA()}" target="_blank" rel="noreferrer" class="wa">
 <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163A11.867 11.867 0 0 1 .002 11.945C0 5.354 5.36.001 11.946.001a11.86 11.86 0 0 1 8.413 3.488 11.83 11.83 0 0 1 3.48 8.42c-.003 6.59-5.366 11.944-11.95 11.944a11.95 11.95 0 0 1-5.71-1.452L.057 24zM6.6 20.04c1.69.99 3.302 1.586 5.34 1.587 5.474 0 9.926-4.45 9.928-9.916.002-5.475-4.43-9.92-9.916-9.922-5.48 0-9.927 4.45-9.93 9.918-.001 2.225.651 3.891 1.746 5.634L2.92 21.158l3.68-.965z"/></svg>
 WhatsApp
 </a>`;
 }

 // ---------- CART DRAWER ----------
 function renderDrawer(){
 if (document.getElementById("cart-drawer")) return;
 const wrap = document.createElement("div");
 wrap.innerHTML = `
 <div class="drawer-backdrop" id="drawer-backdrop"></div>
 <aside class="drawer" id="cart-drawer" aria-label="Cart">
 <header>
 <div>
 <p class="eyebrow">Your basket</p>
 <h2 id="drawer-title">Still empty</h2>
 </div>
 <button class="icon-btn" id="close-drawer" aria-label="Close">✕</button>
 </header>
 <div class="items" id="drawer-items"></div>
 <footer id="drawer-foot" style="display:none"></footer>
 </aside>`;
 document.body.appendChild(wrap);
 document.getElementById("drawer-backdrop").onclick = closeDrawer;
 document.getElementById("close-drawer").onclick = closeDrawer;
 Cart.on(updateDrawer);
 }
 function openDrawer(){ renderDrawer(); updateDrawer();
 document.getElementById("cart-drawer").classList.add("open");
 document.getElementById("drawer-backdrop").classList.add("open");
 document.body.style.overflow = "hidden"; }
 function closeDrawer(){
 document.getElementById("cart-drawer")?.classList.remove("open");
 document.getElementById("drawer-backdrop")?.classList.remove("open");
 document.body.style.overflow = ""; }
 window.openCart = openDrawer;

 function updateDrawer(){
 const items = document.getElementById("drawer-items");
 const foot = document.getElementById("drawer-foot");
 const title = document.getElementById("drawer-title");
 if (!items) return;
 const d = Cart.detailed();
 title.textContent = d.length === 0 ? "Still empty" : `${d.length} piece${d.length>1?"s":""}`;
 if (d.length === 0){
 items.innerHTML = `<div class="empty">
 <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color:var(--rose);opacity:.6;margin:0 auto"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
 <h3>Nothing here yet.</h3>
 <p style="margin-top:.5rem;font-size:.9rem">Wander the shelves , every piece is hand-stitched in our Delhi studio.</p>
 <a href="shop.html" class="btn btn-primary btn-sm" style="margin-top:2rem">Browse the collection</a>
 </div>`;
 foot.style.display = "none";
 return;
 }
 items.innerHTML = `<ul>${d.map(({product:p, qty, line}) => `
 <li>
 <a href="product.html?id=${p.id}"><img src="${window.IMG(p.image)}" alt="${p.name}"></a>
 <div class="info" style="flex:1">
 <div style="display:flex;justify-content:space-between;gap:.5rem">
 <a href="product.html?id=${p.id}" class="name">${p.name}</a>
 <button class="remove" data-rem="${p.id}" aria-label="Remove">✕</button>
 </div>
 <p class="cat">${p.category}</p>
 <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.75rem">
 <div class="qty-pill">
 <button data-dec="${p.id}">−</button><span>${qty}</span><button data-inc="${p.id}">+</button>
 </div>
 <span>${fmt(line)}</span>
 </div>
 </div>
 </li>`).join("")}</ul>`;
 items.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>{const id=b.dataset.inc;const it=Cart.items.find(i=>i.id===id);Cart.setQty(id,(it?.qty||0)+1);});
 items.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>{const id=b.dataset.dec;const it=Cart.items.find(i=>i.id===id);Cart.setQty(id,(it?.qty||0)-1);});
 items.querySelectorAll("[data-rem]").forEach(b=>b.onclick=()=>Cart.remove(b.dataset.rem));
 foot.style.display = "block";
 foot.innerHTML = `
 <div style="display:flex;justify-content:space-between;align-items:baseline">
 <span class="eyebrow">Subtotal</span>
 <span style="font-family:var(--font-display);font-size:1.5rem">${fmt(Cart.subtotal())}</span>
 </div>
 <p style="font-size:11px;color:rgba(107,74,74,.7);margin-top:.25rem">Shipping & payment confirmed on WhatsApp.</p>
 <a href="cart.html" class="btn btn-primary" style="width:100%;margin-top:1rem;justify-content:center">View basket →</a>
 <button class="btn btn-sm" style="width:100%;margin-top:.5rem;color:rgba(107,74,74,.6)" id="clear-cart">Clear basket</button>`;
 document.getElementById("clear-cart").onclick = () => Cart.clear();
 }

 // ---------- LIGHTBOX ----------
 function ensureLightbox(){
 let lb = document.getElementById("lightbox");
 if (lb) return lb;
 lb = document.createElement("div");
 lb.id = "lightbox"; lb.className = "lightbox";
 lb.innerHTML = `<button class="close" aria-label="Close">✕</button><img alt=""><p class="hint">Tap anywhere to close</p>`;
 document.body.appendChild(lb);
 const close = () => { lb.classList.remove("open"); document.body.style.overflow=""; };
 lb.addEventListener("click", e => { if (e.target.tagName !== "IMG") close(); });
 document.addEventListener("keydown", e => { if (e.key==="Escape") close(); });
 return lb;
 }
 window.openLightbox = (src, alt) => {
 const lb = ensureLightbox();
 lb.querySelector("img").src = src;
 lb.querySelector("img").alt = alt || "";
 lb.classList.add("open");
 document.body.style.overflow = "hidden";
 };

 // ---------- PRODUCT CARD ----------
 window.renderProductCard = (p) => {
 const wrap = document.createElement("article");
 wrap.className = "prod-card reveal";
 wrap.innerHTML = `
 <button class="imgwrap" data-zoom="${p.image}" data-alt="${p.name}">
 <img src="${window.IMG(p.image)}" alt="${p.name}" loading="lazy">
 <span class="view-pill">View piece</span>
 </button>
 <div class="body">
 <a href="product.html?id=${p.id}"><h3>${p.name}</h3></a>
 <p class="cat">${p.category}</p>
 <div class="meta">
 <a href="product.html?id=${p.id}" class="price">${fmt(p.price)}</a>
 <button class="add-btn" data-add="${p.id}" aria-label="Add to cart">
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
 </button>
 </div>
 </div>`;
 wrap.querySelector("[data-zoom]").onclick = () =>
 window.openLightbox(window.IMG(p.image), p.name);
 const addBtn = wrap.querySelector("[data-add]");
 addBtn.onclick = () => {
 Cart.add(p.id, 1);
 addBtn.classList.add("added");
 addBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
 setTimeout(() => {
 addBtn.classList.remove("added");
 addBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
 }, 1500);
 };
 return wrap;
 };

 // ---------- REVEAL ON SCROLL ----------
 function setupReveal(){
 const io = new IntersectionObserver(entries => {
 entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target);} });
 }, { rootMargin: "-60px" });
 document.querySelectorAll(".reveal").forEach(el => io.observe(el));
 }
 window.setupReveal = setupReveal;

 // ---------- INIT ----------
 document.addEventListener("DOMContentLoaded", () => {
 renderHeader();
 renderFooter();
 renderStickyCTA();
 setupReveal();
 });
})();
