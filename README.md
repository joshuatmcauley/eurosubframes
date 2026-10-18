# Euro Subframes — Website Redesign

Static, mobile-first redesign of eurosubframes.com. Dark graphite/black palette with signal-red accents.

## Files
- `index.html` — home (hero, categories, part finder, best sellers, reviews)
- `about.html` — about / mission / why choose us
- `contact.html` — contact details, enquiry form, map
- `css/style.css` — all styles (colour tokens at the top under `:root`)
- `js/main.js` — loader, mobile menu, scroll reveals, part finder, contact form

## Notes
- Product images load from the existing Shopify CDN (`eurosubframes.com/cdn/shop/...`). To self-host, download them into `/images` and update the `src` paths.
- Shop, cart, collection and policy links point to the live Shopify store, so checkout keeps working.
- The part finder sends searches to the Shopify store's `/search` page.
- The contact form opens the visitor's email app (mailto). Swap for Formspree / Netlify Forms for direct submissions.
- Deploy: push to GitHub and enable GitHub Pages (Settings → Pages → main branch / root).
