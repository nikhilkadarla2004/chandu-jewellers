# Chandu Jewellers, Karimnagar

The website for Chandu Jewellers. It's a plain static site (HTML, CSS and JS) with no build step, so it can be hosted free on Netlify, Cloudflare Pages or GitHub Pages.

## Everyday edits: all in `js/data.js`

| What | Where in `js/data.js` |
|---|---|
| Phone, address, shop timings, Google reviews link | `STORE` |
| Today's gold/silver rate | `RATES` (or a Google Sheet, see below) |
| Add / remove jewellery | `JEWELERY_DATA`: copy a block and change it |
| Show a piece in "Trending Now" | add `featured: true` |
| Categories & their order | `CATEGORIES` |

### Updating the gold rate from a phone (recommended)
1. Create a Google Sheet with two columns: `gold24 | 7650`, `gold22 | 7015`, `gold18 | 5740`, `silver | 95`, `updated | 29 Sep, 10 AM`.
2. File → Share → **Publish to web** → choose **CSV** → copy the link.
3. Paste it into `RATES.sheetCsvUrl` once and redeploy.
After that, just edit the sheet. The website picks up the new rate on the next visit.

### Adding a new piece
1. Put a square photo (about 900×900 px, `.webp` or `.jpg`) in `images/catalog/`.
2. Copy a block in `JEWELERY_DATA`, give it a new `id`, and set `image: 'images/catalog/your-photo.webp'`.

## Features
- Cinematic hero: images load lazily, with smaller files on phones
- Catalogue with search, category chips and sorting. Every piece has a quick-view popup with zoom, share and "Ask price on WhatsApp"
- Wishlist saved on the visitor's phone, sent to the store as one WhatsApp message
- Today's rate board, a price estimator (gold + making + GST) and an old-gold value estimator
- Store-visit booking (bridal, custom, exchange, video call) sent via WhatsApp
- Gold guide (hallmark/HUID, karats, how pricing works, care), FAQ, store map and directions
- Mobile quick-action bar (Call · WhatsApp · Book · Rate · Saved)
- SEO: JewelryStore structured data, Open Graph share image, sitemap, robots.txt
- Installable app (PWA) with offline support, accessible keyboard/focus handling, respects "reduce motion"

## Run locally
`python -m http.server 8000` in this folder, then open http://localhost:8000
(Double-clicking `index.html` also works. Offline mode only runs when the site is on https.)

## Before going live: checklist
- [ ] Replace stock photos with real photos of the store's pieces
- [ ] Full address + shop timings in `STORE`
- [ ] Buy the domain and replace `https://chandujewellers.in` in `index.html`, `robots.txt` and `sitemap.xml`
- [ ] Create/claim the **Google Business Profile** and paste the review link in `STORE.googleReviews`
