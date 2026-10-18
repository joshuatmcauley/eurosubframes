# Euro Subframes — Website Redesign

Static, mobile-first redesign of eurosubframes.com. Dark graphite/black palette with signal-red accents.

## Files
- `index.html` — home (hero, categories, part finder, best sellers, reviews)
- `about.html` — about / mission / why choose us
- `contact.html` — contact details, enquiry form, map
- `shop.html` — full catalogue with category filters, search and sort
- `products/*.html` — one page per product (133), built from the live Shopify catalogue
- `css/style.css` — all styles (colour tokens at the top under `:root`)
- `js/main.js` — loader, mobile menu, scroll reveals, part finder, contact form

## Notes
- Product images load from the existing Shopify CDN (`eurosubframes.com/cdn/shop/...`). To self-host, download them into `/images` and update the `src` paths.
- Buy Now goes straight to Shopify checkout (`/cart/VARIANT:QTY`); Add to Cart uses `/cart/add`. Cart and policy links point to the live Shopify store.
- Product pages are a snapshot of the store. When products/prices change, ask for a rebuild.
- The part finder filters shop.html.
- The contact form opens the visitor's email app (mailto). Swap for Formspree / Netlify Forms for direct submissions.
- Deploy: push to GitHub and enable GitHub Pages (Settings → Pages → main branch / root).
