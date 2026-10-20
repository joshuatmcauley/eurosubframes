# Euro Subframes — website

Static, mobile-first storefront for eurosubframes.com. Dark graphite palette with signal
red, built around an **engineering-drawing** visual language: hairline rules, corner
registration marks, chamfered panels, monospaced data, no decorative rounding.

Hosted on **Cloudflare Pages**, deployed from this repo on every push to `main`.
Pages build settings: framework preset **None**, build command **blank**, output dir `/`.

## Architecture

This site is the **customer storefront**. **Shopify is the backend** — stock, orders,
payment and checkout all still run through it, on its own hostname.

| Hostname | Serves |
|---|---|
| `eurosubframes.com` | this site, via Cloudflare Pages |
| `shop.eurosubframes.com` | Shopify — cart, checkout, account, policies |

- **Buy Now** → `https://shop.eurosubframes.com/cart/{variantId}:{qty}` (straight to checkout)
- **Add to Cart** → `https://shop.eurosubframes.com/cart/add?id={variantId}&quantity={qty}`

Both hostnames are set once, at the top of the build script (`SITE` and `SHOP`).

## Files

| Path | What it is |
|---|---|
| `index.html` | Home — makes ticker, hero, categories, part finder, best sellers, reviews |
| `shop.html` | Full catalogue: category filter, live search, sort |
| `products/*.html` | One page per product (133), generated from the Shopify catalogue |
| `about.html`, `contact.html` | About and contact |
| `404.html` | Shown for anything unmatched — offers search and the phone number |
| `css/style.css` | Whole design system. Tokens in `:root` at the top |
| `js/main.js` | Loader, nav, scroll reveals, shop filtering, product gallery |
| `images/logo.svg` | Logo traced to vector (white text, for dark backgrounds) |
| `images/logo-on-white.svg` | Same logo with black text, for light backgrounds |
| `_redirects` | Cloudflare Pages redirect rules (see Migration) |
| `sitemap.xml`, `robots.txt` | 137 canonical, extension-less URLs |

## Design tokens

```css
--red: #e30613;        /* signal red */
--black / --graphite   /* surfaces */
--display: Michroma    /* headings */
--body: Barlow         /* copy */
--mono: JetBrains Mono /* all data: prices, counts, part numbers, specs */
```

Rule of thumb: **anything that is a measurement, a count or a code is set in mono.** That
is what gives the site its technical character — keep it if you extend the design.

## Loading screen

Home page only. A plan-view car schematic draws itself: body outline, greenhouse
(windscreen taper, roof, rear screen), door shut lines, mirrors and lights, then the four
wheels. Then the parts the business sells are picked out in red — a front subframe cradle
with control arms reaching the front hubs, and a torsion-beam rear axle spanning the rear
wheels — with target rings pulsing over each wheel.

~2.4s, then it removes itself from the DOM. Skipped on repeat visits in the same tab
(`sessionStorage`) and for anyone with "reduce motion" on. A hard timeout guarantees it
never traps a visitor.

## Migration — taking over the old Shopify URLs

`/products/<handle>` needs no redirect: Pages serves `products/<handle>.html` at that
exact path, so the 133 product URLs Google already has indexed keep working and land on
the matching new page.

`_redirects` covers the rest — `/cart`, `/checkout`, `/account` and `/policies/*` go to
Shopify; old `/collections/*` and `/pages/*` map onto the new shop and content pages.
Every page carries a `<link rel="canonical">`.

**Cutover order** (full detail was worked through in chat):
1. Add `shop.eurosubframes.com` in Shopify, CNAME it to `shops.myshopify.com`, **set it as the primary
   domain** — Shopify redirects every non-primary domain to the primary, so this is not optional.
2. Export all DNS from IONOS (MX and TXT above all — that is the business email), then move
   nameservers to Cloudflare.
3. Add `eurosubframes.com` and `www.eurosubframes.com` as custom domains on the Pages project.
4. Afterwards, remove `eurosubframes.com` from Shopify's domain list.

On Cloudflare, the `shop` CNAME must be **DNS-only (grey cloud)** — proxying it breaks
Shopify's SSL.

## Catalogue data

Product pages are a **snapshot** of the Shopify catalogue. They do not update themselves.
When products or prices change, the pages need regenerating.

Derived fields, parsed from the Shopify titles and descriptions:

- **Year range** — from the title (`2006-2016`, `05-11`, `05-2010`), shown as a chip
- **Part numbers** — from the description, shown in the spec table
- **Display name** — the listing title with the year range, trailing part numbers and the
  `NEW ` prefix stripped, and SHOUTY CAPS normalised, so the grid stays scannable. The full
  original title is kept in `<title>`, the meta description, `alt` text and the search index.

## ⚠️ eBay link — needs the real URL

The footer links to `https://www.ebay.co.uk/usr/eurosubframes`. **This was not verified** — no public eBay store was found.
Get the real URL from the client and change the one `EBAY = '...'` line in the build script.
If there is no eBay store, delete the "Our eBay Store" item from the footer.

## Known data issues (worth fixing in Shopify)

- Five listings look like accidental duplicates — handles ending `-1` / `-copy` or starting
  `copy-of-`: the Mazda MX5 brace bar pair, a Dodge Caliber rear subframe, a Mazda MX5 rear
  subframe, a Freelander 2 rear subframe and a Hyundai Tucson rear subframe.
- One title reads "FIOR TOYOTA RAV4" (should be "FOR"). The site corrects it on display,
  but the Shopify listing still has the typo.
- 36 of 133 products are marked sold out. Their pages swap the buy buttons for a
  "call to check availability" prompt.

## Images

Hot-linked, not self-hosted:

- **Products** → the Shopify CDN (`cdn.shopify.com`)
- **Categories / hero / about** → Unsplash

To self-host, download them into `images/` and update the `src` paths.

## Contact form

Opens the visitor's mail app (`mailto:`). Swap for Formspree or Netlify Forms to receive
submissions directly.
