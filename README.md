# UneedIndia — Static Site

This is a plain HTML / CSS / JavaScript version of the UneedIndia crochet store. No build tools, no Node, no React. Just open and edit.

## Run it

Open `index.html` directly in your browser, or serve the folder with any static server:

```bash
# Python
python3 -m http.server 8000

# Node (if you have it)
npx serve .

# VS Code: install the "Live Server" extension and click "Go Live"
```

Then open `http://localhost:8000`.

## Edit in VS Code

- **Pages** — top-level `.html` files (`index.html`, `shop.html`, `product.html`, `cart.html`, `checkout.html`, `category.html`, `custom.html`, `story.html`, `contact.html`, `reviews.html`).
- **Styles** — `assets/css/style.css` (all design tokens at the top under `:root`).
- **Products & categories** — `assets/js/data.js`. Edit names, prices, stories, images.
- **Cart, header, footer, lightbox, WhatsApp** — `assets/js/app.js`.
- **Images** — `assets/products/img1.jpeg` … `img40.jpeg`.

## Settings to change

- **WhatsApp number** — `window.WHATSAPP_NUMBER` in `assets/js/data.js`.
- **UPI ID** — `window.UPI_ID` in `assets/js/data.js` (and the visible text on `checkout.html`).
- **Brand name & nav** — `renderHeader()` / `renderFooter()` in `assets/js/app.js`.

## Cart

Persists in `localStorage` under `uneed_cart_v1`. Order flow:

1. Add to cart → **Cart page** (`cart.html`)
2. **Checkout page** (`checkout.html`) shows UPI ID and total
3. Customer pays via UPI, screenshots, then taps "Chat on WhatsApp"
4. WhatsApp opens with a pre-filled order message including items, total and the UPI ID

## Hosting

Drop the whole folder into any static host: Netlify, Vercel, Cloudflare Pages, GitHub Pages, Hostinger, S3 — anywhere that serves static files.
