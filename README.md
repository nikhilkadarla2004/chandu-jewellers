# Chandu Jewelery – Karimnagar

A luxurious jewellery website for **Chandu Jewelery**, Karimnagar. Design inspired by premium jewellery brands with an elegant gold-and-burgundy theme.

## What’s included

- **Hero** – Tagline and location (Karimnagar)
- **Shop by category** – Rings, Chains, Necklaces, Harams, Bangles, Mangalsutras, and More
- **Explore Jewellery** – Grid of sample pieces with category filters
- **Why us** – Trust points (pure gold, certified diamonds, Karimnagar store, exchange)
- **About** – Short intro and store visit CTA
- **Footer** – Quick links and contact

## How to run

Open `index.html` in your browser (double-click or right-click → Open with browser). No server needed.

## Adding your own jewellery

1. Open **`js/data.js`**.
2. Copy a block like this and edit:

```js
{
  id: 13,
  name: "Your piece name",
  category: "rings",   // rings | chains | necklaces | harams | bangles | mangalsutras | earrings
  price: "On request",
  image: "https://yoursite.com/image.jpg",   // or path like images/ring1.jpg
  desc: "Short description"
}
```

3. Add your image URL (or put images in an `images/` folder and use `images/ring1.jpg`).
4. Save; refresh the page to see new items.

## Updating contact / place

- **Phone:** Edit the number in `index.html` (top bar and footer) and in the README if you use it.
- **Address/place:** All “Karimnagar” text is in `index.html`; search for “Karimnagar” to update.

## Folder structure

```
dad jewelery/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── data.js    ← Add your jewellery here
│   └── main.js
└── images/        ← Optional: add your photos here
```

Enjoy your site.
