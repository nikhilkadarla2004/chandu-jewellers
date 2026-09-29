/* =====================================================================
   CHANDU JEWELLERS — everything you normally need to edit lives here.
   ===================================================================== */

/* ---------- Store details ---------- */
var STORE = {
  name: 'Chandu Jewellers',
  since: 1996,
  phone: '917981233951',            // with country code, digits only (used for WhatsApp + call links)
  phoneDisplay: '79812 33951',
  city: 'Karimnagar',
  state: 'Telangana',
  address: 'Karimnagar, Telangana', // TODO: put the full shop address here (street, landmark, PIN)
  mapsQuery: 'Chandu Jewellers Karimnagar', // what Google Maps searches for; exact address works best
  hours: [],                        // e.g. ['Mon–Sat · 10:00 AM – 9:00 PM', 'Sunday · 10:00 AM – 2:00 PM']
  instagram: 'https://instagram.com/chandujewellers1996',
  facebook: 'https://www.facebook.com/profile.php?id=chandujewellery',
  googleReviews: ''                 // paste your Google Business review link to show a "Read our reviews" button
};

/* ---------- Today's rates (₹ per gram) ----------
   Option A: type the numbers here and set `updated`.
   Option B (easiest daily): make a Google Sheet with two columns  key | value
     gold24 | 7650
     gold22 | 7015
     gold18 | 5740
     silver | 95
     updated | 29 Sep 2026, 10 AM
   then File → Share → Publish to web → CSV, and paste that link in `sheetCsvUrl`.
   The site reads the sheet on every visit, so rates can be changed from a phone.
   Leave everything empty and the site simply says "WhatsApp us for today's rate". */
var RATES = {
  sheetCsvUrl: '',
  updated: '',
  gold24: null,
  gold22: null,
  gold18: null,
  silver: null,
  gstPercent: 3,          // GST on jewellery in India
  defaultMakingPercent: 12
};

/* ---------- Categories (order = order of filter chips) ---------- */
var CATEGORIES = {
  rings: 'Rings',
  earrings: 'Earrings',
  necklaces: 'Necklaces',
  pendants: 'Pendants',
  chains: 'Chains',
  bracelets: 'Bracelets',
  bangles: 'Bangles',
  harams: 'Harams',
  mangalsutras: 'Mangalsutras'
};

/* ---------- Jewellery ----------
   Copy one block, change the values, save. That's it.
   featured: true  → also shows in "Trending Now"
   tags            → words people might search for (bridal, daily wear, gift…)
   NOTE: the current photos are stock images used as placeholders —
   replace them with real photos of the store's pieces (square, ~900px). */
var JEWELERY_DATA = [
  {
    id: 1, name: 'Diamond Halo Ring', category: 'rings', featured: true,
    image: 'images/featured/item-1.webp', metal: 'Gold with diamonds',
    desc: 'A centre stone framed by a halo of pavé diamonds on a split shank.',
    tags: ['engagement', 'diamond', 'gift']
  },
  {
    id: 2, name: 'Classic Gold Bands', category: 'rings', featured: true,
    image: 'images/categories/chains.webp', metal: 'Yellow gold',
    desc: 'Smooth, comfort-fit wedding bands — made as a matching pair.',
    tags: ['wedding', 'couple', 'daily wear']
  },
  {
    id: 3, name: 'Gemstone Flower Cocktail Ring', category: 'rings',
    image: 'images/catalog/gemstone-flower-ring.webp', metal: 'White gold, amethyst & citrine',
    desc: 'Pear-cut amethyst and citrine petals around a diamond centre.',
    tags: ['statement', 'party', 'gemstone']
  },
  {
    id: 4, name: 'Sapphire Drop Earrings', category: 'earrings', featured: true,
    image: 'images/categories/harams.webp', metal: 'White gold, sapphire & diamonds',
    desc: 'Pear sapphires set in a baguette-diamond frame. Made for evenings.',
    tags: ['party', 'gemstone', 'diamond']
  },
  {
    id: 5, name: 'Blue Heart Drop Earrings', category: 'earrings',
    image: 'images/featured/item-4.webp', metal: 'Gold with blue crystal',
    desc: 'Light heart drops on gold hooks — an easy everyday pair.',
    tags: ['daily wear', 'gift', 'light weight']
  },
  {
    id: 6, name: 'Gold Knot Earrings', category: 'earrings',
    image: 'images/catalog/gold-knot-earrings.webp', metal: 'Yellow gold',
    desc: 'Polished love-knot studs with a modern, minimal shape.',
    tags: ['daily wear', 'office', 'light weight']
  },
  {
    id: 7, name: 'Antique Gold Necklace Set', category: 'necklaces', featured: true,
    image: 'images/featured/item-9.webp', metal: 'Antique-finish gold with rubies',
    desc: 'Temple-style necklace with ruby drops and matching earrings.',
    tags: ['bridal', 'wedding', 'traditional', 'temple']
  },
  {
    id: 8, name: 'Pearl Strand Necklace', category: 'necklaces', featured: true,
    image: 'images/featured/item-7.webp', metal: 'Pearls with a gold clasp',
    desc: 'A single strand of lustrous pearls with a diamond-set clasp.',
    tags: ['gift', 'classic', 'pearl']
  },
  {
    id: 9, name: 'Diamond Heart Pendant', category: 'pendants', featured: true,
    image: 'images/featured/item-3.webp', metal: 'White gold with diamonds',
    desc: 'An open heart lined with diamonds on a fine chain.',
    tags: ['gift', 'diamond', 'anniversary']
  },
  {
    id: 10, name: 'Layered Pendant Chain', category: 'chains', featured: true,
    image: 'images/featured/item-5.webp', metal: 'Yellow gold with blue topaz',
    desc: 'Two layered chains — a gemstone drop above a crescent moon.',
    tags: ['daily wear', 'layering', 'gemstone']
  },
  {
    id: 11, name: 'Delicate Layered Necklace', category: 'chains',
    image: 'images/catalog/layered-pendant-necklace.webp', metal: 'Rose gold',
    desc: 'Fine layered chains with small charm drops.',
    tags: ['daily wear', 'light weight', 'office']
  },
  {
    id: 12, name: 'Gold Link Bracelet', category: 'bracelets', featured: true,
    image: 'images/featured/item-2.webp', metal: 'Yellow gold',
    desc: 'Bold, polished links with a secure clasp.',
    tags: ['daily wear', 'gift', 'men']
  },
  {
    id: 13, name: 'Diamond Link Bracelet', category: 'bracelets',
    image: 'images/featured/item-8.webp', metal: 'White gold with diamonds',
    desc: 'Oval links pavé-set with diamonds and a solitaire in each.',
    tags: ['diamond', 'party', 'anniversary']
  },
  {
    id: 14, name: 'Rose-Gold Diamond Bangle', category: 'bangles', featured: true,
    image: 'images/catalog/rose-gold-diamond-bangle.webp', metal: 'Rose gold with diamonds',
    desc: 'A paisley-pattern bangle with a band of diamonds.',
    tags: ['diamond', 'bridal', 'gift']
  }
];
