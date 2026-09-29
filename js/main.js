(function () {
  'use strict';

  var store = window.STORE || {};
  var rates = window.RATES || {};
  var CATS = window.CATEGORIES || {};
  var data = (typeof JEWELERY_DATA !== 'undefined') ? JEWELERY_DATA : [];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function waLink(text) {
    return 'https://wa.me/' + (store.phone || '917981233951') + '?text=' + encodeURIComponent(text);
  }

  function catLabel(key) { return CATS[key] || (key ? key.charAt(0).toUpperCase() + key.slice(1) : ''); }

  function inr(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  var toastEl = $('#toast'), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }

  // ===== Page loader =====
  var pageLoader = $('#pageLoader');
  function hideLoader() { if (pageLoader) pageLoader.classList.add('hidden'); }
  if (document.readyState === 'complete') setTimeout(hideLoader, 300);
  else window.addEventListener('load', function () { setTimeout(hideLoader, 300); });
  setTimeout(hideLoader, 2000);

  // ===== Store details from data.js =====
  $$('[data-wa]').forEach(function (a) { a.href = waLink(a.getAttribute('data-wa')); a.target = '_blank'; a.rel = 'noopener'; });
  if (store.phone) {
    $$('[data-tel]').forEach(function (a) { a.href = 'tel:+' + store.phone; });
  }
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  $$('[data-count-from]').forEach(function (el) {
    el.textContent = new Date().getFullYear() - Number(el.getAttribute('data-count-from'));
  });

  // ===== Hero carousel =====
  (function hero() {
    var heroEl = $('.hero-cinema');
    var slides = $$('.hero-slide');
    var dotsWrap = $('.hero-dots');
    var progress = $('.hero-progress span');
    if (!slides.length) return;

    var small = window.matchMedia('(max-width: 960px)').matches;
    function loadBg(slide) {
      var base = slide.getAttribute('data-bg');
      if (!base || slide.dataset.loaded) return;
      slide.style.backgroundImage = "url('" + base + (small ? '-sm' : '') + ".webp')";
      slide.dataset.loaded = '1';
    }

    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.className = 'hero-dot' + (i === 0 ? ' active' : '');
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', 'Slide ' + (i + 1));
      b.addEventListener('click', function () { go(i); start(); });
      dotsWrap.appendChild(b);
      return b;
    });

    var current = 0, timer = null, ms = 6500;
    loadBg(slides[0]);
    loadBg(slides[1]);

    function go(index) {
      var next = (index + slides.length) % slides.length;
      if (next === current) return;
      loadBg(slides[next]);
      loadBg(slides[(next + 1) % slides.length]);
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      slides[next].classList.add('active');
      dots[next].classList.add('active');
      current = next;
      restartProgress();
    }
    function restartProgress() {
      if (!progress) return;
      progress.style.animation = 'none';
      void progress.offsetWidth;
      progress.style.animation = timer ? 'heroProgress ' + ms + 'ms linear forwards' : 'none';
    }
    function start() {
      stop();
      if (reduceMotion) return;
      timer = setInterval(function () { go(current + 1); }, ms);
      restartProgress();
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
      restartProgress();
    }

    $('.hero-arrow-prev').addEventListener('click', function () { go(current - 1); start(); });
    $('.hero-arrow-next').addEventListener('click', function () { go(current + 1); start(); });
    heroEl.addEventListener('mouseenter', stop);
    heroEl.addEventListener('mouseleave', start);
    heroEl.addEventListener('focusin', stop);

    var touchX = 0;
    heroEl.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
    heroEl.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) { go(current + (dx < 0 ? 1 : -1)); start(); }
    });
    document.addEventListener('keydown', function (e) {
      if (document.activeElement && heroEl.contains(document.activeElement)) {
        if (e.key === 'ArrowRight') go(current + 1);
        if (e.key === 'ArrowLeft') go(current - 1);
      }
    });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

    // Only animate while the hero is on screen
    new IntersectionObserver(function (entries) {
      entries[0].isIntersecting ? start() : stop();
    }).observe(heroEl);
  })();

  // ===== Nav: mobile toggle, shrink on scroll, active link =====
  var navToggle = $('.nav-toggle');
  var navLinks = $('.nav-links');
  var mainNav = $('.main-nav');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', open);
      navToggle.setAttribute('aria-expanded', open);
    });
    $$('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var sections = $$('section[id], footer[id]');
  var navAnchors = $$('.nav-links a');
  var backToTop = $('#backToTop');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (mainNav) mainNav.classList.toggle('scrolled', y > 80);
    if (backToTop) backToTop.classList.toggle('visible', y > 600);
    var pos = y + 140;
    sections.forEach(function (s) {
      if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
        navAnchors.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + s.id); });
      }
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();
  if (backToTop) backToTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // ===== Scroll reveal =====
  var revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;
  function observeReveal(root) {
    $$('[data-reveal]:not(.revealed)', root).forEach(function (el) {
      revealObserver ? revealObserver.observe(el) : el.classList.add('revealed');
    });
  }

  // ===== Wishlist (saved in this browser) =====
  var WISH_KEY = 'cj-wishlist';
  var wish = [];
  try { wish = JSON.parse(localStorage.getItem(WISH_KEY)) || []; } catch (e) { wish = []; }
  wish = wish.filter(function (id) { return data.some(function (d) { return d.id === id; }); });

  function saveWish() {
    try { localStorage.setItem(WISH_KEY, JSON.stringify(wish)); } catch (e) { /* private mode */ }
    updateWishUi();
  }
  function isWished(id) { return wish.indexOf(id) !== -1; }
  function toggleWish(id) {
    var item = byId(id);
    if (isWished(id)) { wish.splice(wish.indexOf(id), 1); toast('Removed from wishlist'); }
    else { wish.push(id); toast('♥ Saved “' + item.name + '”'); }
    saveWish();
  }
  function updateWishUi() {
    $$('#wishCount, .mobile-bar .badge').forEach(function (b) {
      b.textContent = wish.length;
      b.hidden = wish.length === 0;
    });
    $$('[data-wish]').forEach(function (btn) {
      var on = isWished(Number(btn.getAttribute('data-wish')));
      btn.classList.toggle('on', on);
      btn.setAttribute('aria-pressed', on);
      btn.setAttribute('aria-label', on ? 'Remove from wishlist' : 'Save to wishlist');
    });
    if (qvItem) $('#qvWish').textContent = isWished(qvItem.id) ? '♥ Saved' : '♡ Save';
    renderWishList();
  }
  function renderWishList() {
    var list = $('#wishList');
    if (!list) return;
    if (!wish.length) {
      list.innerHTML = '<li class="wish-empty">Nothing saved yet.<br>Tap ♡ on any piece to add it here.</li>';
      $('#wishSend').hidden = true;
      return;
    }
    $('#wishSend').hidden = false;
    list.innerHTML = wish.map(function (id) {
      var it = byId(id);
      return '<li><img src="' + escapeHtml(it.image) + '" alt="" loading="lazy">' +
        '<div><strong>' + escapeHtml(it.name) + '</strong><span>' + escapeHtml(catLabel(it.category)) + '</span></div>' +
        '<button data-remove="' + it.id + '" aria-label="Remove ' + escapeHtml(it.name) + '">&times;</button></li>';
    }).join('');
    var msg = 'Hi, I shortlisted these on your website:\n' + wish.map(function (id, i) {
      var it = byId(id);
      return (i + 1) + '. ' + it.name + ' (#' + it.id + ')';
    }).join('\n') + '\n\nCould you share today\'s prices?';
    $('#wishSend').href = waLink(msg);
  }

  // ===== Catalogue =====
  function byId(id) { for (var i = 0; i < data.length; i++) if (data[i].id === id) return data[i]; return null; }

  var heartSvg = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 20s-7-4.4-9.2-8.6C1.2 8.2 3 4.5 6.6 4.5c2.1 0 3.5 1.2 4.4 2.6.9-1.4 2.3-2.6 4.4-2.6 3.6 0 5.4 3.7 3.8 6.9C19 15.6 12 20 12 20z"/></svg>';

  function cardHtml(item, i) {
    return '<article class="jewelery-card" data-id="' + item.id + '" data-reveal data-reveal-delay="' + (i % 4) + '">' +
      '<div class="jewelery-card-image">' +
        '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '" loading="lazy" decoding="async">' +
        '<button class="wish-btn" data-wish="' + item.id + '" aria-label="Save to wishlist">' + heartSvg + '</button>' +
        '<span class="quick-view-hint">Quick view</span>' +
      '</div>' +
      '<div class="jewelery-card-body">' +
        '<span class="category-tag">' + escapeHtml(catLabel(item.category)) + '</span>' +
        '<h3><button class="card-link" data-open="' + item.id + '">' + escapeHtml(item.name) + '</button></h3>' +
        '<p>' + escapeHtml(item.metal || item.desc) + '</p>' +
        '<p class="price">Price on request</p>' +
      '</div>' +
    '</article>';
  }

  var grid = $('#jeweleryGrid');
  var heading = $('#categoryViewHeading');
  var searchInput = $('#catalogSearch');
  var sortSelect = $('#catalogSort');
  var state = { filter: 'all', query: '', sort: 'featured' };
  var visible = data.slice();

  var catKeys = Object.keys(CATS);
  data.forEach(function (d) { if (catKeys.indexOf(d.category) === -1) catKeys.push(d.category); });
  function countIn(cat) { return data.filter(function (d) { return d.category === cat; }).length; }

  // Filter chips
  var filterTabs = $('#filterTabs');
  if (filterTabs) {
    filterTabs.innerHTML = '<button class="filter-btn active" data-filter="all">All <small>' + data.length + '</small></button>' +
      catKeys.filter(countIn).map(function (k) {
        return '<button class="filter-btn" data-filter="' + k + '">' + escapeHtml(catLabel(k)) + ' <small>' + countIn(k) + '</small></button>';
      }).join('');
    filterTabs.addEventListener('click', function (e) {
      var b = e.target.closest('.filter-btn');
      if (b) { state.filter = b.getAttribute('data-filter'); renderCatalog(); }
    });
  }

  function matches(item, q) {
    if (!q) return true;
    var hay = [item.name, item.category, catLabel(item.category), item.metal, item.desc].concat(item.tags || []).join(' ').toLowerCase();
    return q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function renderCatalog() {
    var q = state.query.trim().toLowerCase();
    visible = data.filter(function (d) {
      return (state.filter === 'all' || d.category === state.filter) && matches(d, q);
    });
    if (state.sort === 'name') visible.sort(function (a, b) { return a.name.localeCompare(b.name); });
    else if (state.sort === 'category') visible.sort(function (a, b) { return catKeys.indexOf(a.category) - catKeys.indexOf(b.category); });
    else visible.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });

    grid.innerHTML = visible.map(cardHtml).join('');
    observeReveal(grid);
    updateWishUi();

    $$('.filter-btn', filterTabs).forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-filter') === state.filter);
    });
    var label = state.filter === 'all' ? 'All pieces' : catLabel(state.filter);
    heading.textContent = label + (q ? ' matching “' + state.query.trim() + '”' : '') + ' · ' + visible.length;

    var empty = $('#emptyState');
    empty.hidden = visible.length > 0;
    $('#emptyAsk').href = waLink('Hi, I\'m looking for ' + (q || label.toLowerCase()) + '. What do you have in store?');
  }

  function showCategory(cat) {
    state.filter = cat;
    state.query = '';
    if (searchInput) searchInput.value = '';
    renderCatalog();
    $('#explore').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  var searchTimer;
  if (searchInput) searchInput.addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { state.query = searchInput.value; renderCatalog(); }, 120);
  });
  if (sortSelect) sortSelect.addEventListener('change', function () { state.sort = sortSelect.value; renderCatalog(); });

  $('#openSearch').addEventListener('click', function () {
    $('#explore').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    setTimeout(function () { searchInput.focus({ preventScroll: true }); }, reduceMotion ? 0 : 500);
  });

  // Category showcase
  var showcase = $('#categoryShowcase');
  if (showcase) {
    showcase.innerHTML = catKeys.map(function (k, i) {
      var first = data.filter(function (d) { return d.category === k; })[0];
      var inner = first
        ? '<img src="' + escapeHtml(first.image) + '" alt="" loading="lazy">'
        : '<span class="cat-card-empty"><em>' + escapeHtml(catLabel(k)) + '</em><small>See in store</small></span>';
      return '<a href="#explore" class="cat-card' + (first ? '' : ' is-empty') + '" data-category="' + k + '" data-reveal data-reveal-delay="' + Math.min(i, 6) + '">' +
        '<div class="cat-card-img">' + inner + '</div>' +
        '<div class="cat-card-label"><strong>' + escapeHtml(catLabel(k)) + '</strong></div></a>';
    }).join('');
    showcase.addEventListener('click', function (e) {
      var card = e.target.closest('.cat-card');
      if (!card) return;
      e.preventDefault();
      var cat = card.getAttribute('data-category');
      if (countIn(cat)) showCategory(cat);
      else window.open(waLink('Hi, could you show me your ' + catLabel(cat).toLowerCase() + ' collection?'), '_blank', 'noopener');
    });
  }

  // Featured carousel
  var featured = data.filter(function (d) { return d.featured; });
  var carousel = $('#featuredCarousel');
  if (carousel) {
    carousel.innerHTML = featured.map(function (item) {
      return '<button class="item-card" data-open="' + item.id + '">' +
        '<div class="item-card-img"><img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '" loading="lazy"></div>' +
        '<div class="item-card-label">' + escapeHtml(item.name) + '</div>' +
        '<div class="item-card-price">' + escapeHtml(catLabel(item.category)) + ' · On request</div>' +
      '</button>';
    }).join('');
    $('.scroll-left').addEventListener('click', function () { carousel.scrollBy({ left: -carousel.clientWidth * 0.8, behavior: 'smooth' }); });
    $('.scroll-right').addEventListener('click', function () { carousel.scrollBy({ left: carousel.clientWidth * 0.8, behavior: 'smooth' }); });
  }

  // ===== Modals & drawer (shared open/close with focus handling) =====
  var lastFocus = null;
  function openLayer(el) {
    lastFocus = document.activeElement;
    el.classList.add('open');
    el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    var f = el.querySelector('button, a[href], input, select, textarea');
    if (f) setTimeout(function () { f.focus(); }, 50);
  }
  function closeLayer(el) {
    if (!el.classList.contains('open')) return;
    el.classList.remove('open');
    el.setAttribute('aria-hidden', 'true');
    if (!$('.modal-overlay.open, .drawer-overlay.open')) document.body.classList.remove('no-scroll');
    if (el.id === 'quickView') setHash('');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('.modal-overlay, .drawer-overlay').forEach(function (layer) {
    layer.addEventListener('click', function (e) {
      if (e.target === layer || e.target.closest('[data-close]')) closeLayer(layer);
    });
  });
  document.addEventListener('keydown', function (e) {
    var open = $$('.modal-overlay.open, .drawer-overlay.open');
    if (!open.length) return;
    var top = open[open.length - 1];
    if (e.key === 'Escape') closeLayer(top);
    if (top.id === 'quickView' && e.key === 'ArrowRight') stepQv(1);
    if (top.id === 'quickView' && e.key === 'ArrowLeft') stepQv(-1);
    if (e.key === 'Tab') { // keep focus inside the dialog
      var f = $$('button, a[href], input, select, textarea', top).filter(function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  // ===== Quick view =====
  var qv = $('#quickView');
  var qvItem = null;
  var qvList = data;

  function setHash(h) {
    if (history.replaceState) history.replaceState(null, '', h ? '#' + h : location.pathname + location.search);
  }

  function openQuickView(id, list) {
    var item = byId(id);
    if (!item) return;
    qvItem = item;
    if (list) qvList = list;
    $('#qvImg').src = item.image;
    $('#qvImg').alt = item.name;
    $('#qvCat').textContent = catLabel(item.category);
    $('#qvTitle').textContent = item.name;
    $('#qvMetal').textContent = item.metal || '';
    $('#qvDesc').textContent = item.desc || '';
    $('#qvEnquire').href = waLink('Hi, I\'m interested in the ' + item.name + ' (#' + item.id + ') from your website. Could you share today\'s price and weight options?');
    $('#qvWish').textContent = isWished(item.id) ? '♥ Saved' : '♡ Save';
    var multi = qvList.length > 1;
    $('#qvPrev').hidden = $('#qvNext').hidden = !multi;
    setHash('piece-' + item.id);
    if (!qv.classList.contains('open')) openLayer(qv);
  }
  function stepQv(dir) {
    if (!qvItem) return;
    var idx = qvList.indexOf(qvItem);
    if (idx === -1) idx = 0;
    openQuickView(qvList[(idx + dir + qvList.length) % qvList.length].id);
  }

  document.addEventListener('click', function (e) {
    var w = e.target.closest('[data-wish]');
    if (w) { e.preventDefault(); e.stopPropagation(); toggleWish(Number(w.getAttribute('data-wish'))); return; }
    var r = e.target.closest('[data-remove]');
    if (r) { toggleWish(Number(r.getAttribute('data-remove'))); return; }
    var o = e.target.closest('[data-open]');
    if (o) { openQuickView(Number(o.getAttribute('data-open')), o.closest('#featuredCarousel') ? featured : visible); return; }
    var card = e.target.closest('.jewelery-card');
    if (card) openQuickView(Number(card.getAttribute('data-id')), visible);
    if (e.target.closest('[data-open-wishlist]')) openLayer($('#wishlistDrawer'));
  });

  $('#qvPrev').addEventListener('click', function () { stepQv(-1); });
  $('#qvNext').addEventListener('click', function () { stepQv(1); });
  $('#qvWish').addEventListener('click', function () { if (qvItem) toggleWish(qvItem.id); });
  $('#qvShare').addEventListener('click', function () {
    if (!qvItem) return;
    var url = location.href.split('#')[0] + '#piece-' + qvItem.id;
    var payload = { title: qvItem.name + ' · Chandu Jewellers', text: 'Look at this ' + qvItem.name + ' from Chandu Jewellers, Karimnagar', url: url };
    if (navigator.share) navigator.share(payload).catch(function () {});
    else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { toast('Link copied'); });
    else window.prompt('Copy this link', url);
  });

  // Hover / tap zoom
  var zoom = $('#qvZoom');
  zoom.addEventListener('mousemove', function (e) {
    var r = zoom.getBoundingClientRect();
    zoom.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100) + '%');
    zoom.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100) + '%');
    zoom.classList.add('zooming');
  });
  zoom.addEventListener('mouseleave', function () { zoom.classList.remove('zooming'); });
  zoom.addEventListener('click', function (e) {
    if (e.pointerType === 'mouse') return;
    var r = zoom.getBoundingClientRect();
    zoom.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100) + '%');
    zoom.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100) + '%');
    zoom.classList.toggle('zooming');
  });

  $('#openWishlist').addEventListener('click', function () { openLayer($('#wishlistDrawer')); });

  // ===== Rates & calculators =====
  var rateBoard = $('#rateBoard');
  var calcForm = $('#calcForm');
  var calcMode = 'buy';

  function rateFor(purity) {
    return { 24: rates.gold24, 22: rates.gold22, 18: rates.gold18 }[purity] || null;
  }

  function renderRates() {
    var have = rates.gold22 || rates.gold24 || rates.gold18;
    var cells = [
      ['24K', '999 fine', rates.gold24],
      ['22K', '916 jewellery', rates.gold22],
      ['18K', '750 diamond', rates.gold18],
      ['Silver', '999 fine', rates.silver]
    ].filter(function (c) { return c[2]; });
    if (have) {
      rateBoard.innerHTML = cells.map(function (c) {
        return '<div class="rate-cell"><span class="rate-k">' + c[0] + '</span><span class="rate-v">' + inr(c[2]) + '<small>/g</small></span><span class="rate-s">' + c[1] + '</span></div>';
      }).join('') + '<p class="rate-updated">Updated ' + escapeHtml(rates.updated || 'today') + ' · Karimnagar store rate</p>';
      var mini = $('#rateMini');
      if (mini && rates.gold22) mini.classList.add('has-rate');
      if (mini && rates.gold22) mini.innerHTML ='Today · 22K <strong>' + inr(rates.gold22) + '/g</strong>' + (rates.gold24 ? ' · 24K <strong>' + inr(rates.gold24) + '/g</strong>' : '');
    } else {
      rateBoard.innerHTML = '<div class="rate-ask"><span class="rate-ask-icon">✦</span><div><strong>Gold rates change every day.</strong>' +
        '<p>Message us for today\'s exact rate — we reply fast.</p></div>' +
        '<a class="btn btn-primary btn-wa" href="' + waLink('Hi, what is today\'s gold rate (22K and 24K)?') + '" target="_blank" rel="noopener">Get today\'s rate</a></div>';
    }
    fillRate();
  }

  function fillRate() {
    var r = rateFor(calcForm.purity.value);
    if (r) calcForm.rate.value = r;
    calc();
  }

  function calc() {
    var w = parseFloat(calcForm.weight.value) || 0;
    var rate = parseFloat(calcForm.rate.value) || 0;
    var out = $('#calcResult');
    if (!rate || !w) {
      out.innerHTML = '<p class="calc-empty">Enter the weight and today\'s rate to see the breakdown.</p>';
      return;
    }
    var gst = (rates.gstPercent || 3) / 100;
    if (calcMode === 'buy') {
      var metal = w * rate;
      var making = metal * (parseFloat(calcForm.making.value) || 0) / 100;
      var tax = (metal + making) * gst;
      out.innerHTML =
        row('Gold value', w + ' g × ' + inr(rate), metal) +
        row('Making charges', calcForm.making.value + '%', making) +
        row('GST', (gst * 100) + '%', tax) +
        '<div class="calc-total"><span>Estimated price</span><strong>' + inr(metal + making + tax) + '</strong></div>' +
        '<a class="text-link" target="_blank" rel="noopener" href="' + waLink('Hi, I\'m looking for a ' + calcForm.purity.value + 'K piece around ' + w + ' g. My estimate is ' + inr(metal + making + tax) + '. Can you help?') + '">Send this estimate to us →</a>';
    } else {
      // Old gold: value = weight × tested purity × 24K-equivalent rate.
      var r24 = rates.gold24 || (rate / (Number(calcForm.purity.value) / 24));
      var pure = w * (parseFloat(calcForm.tested.value) || 0) / 100;
      var value = pure * r24;
      out.innerHTML =
        row('Pure gold content', w + ' g × ' + calcForm.tested.value + '%', null, pure.toFixed(2) + ' g') +
        row('24K rate', rates.gold24 ? 'today' : 'derived from your rate', r24) +
        '<div class="calc-total"><span>Approx. value</span><strong>' + inr(value) + '</strong></div>' +
        '<a class="text-link" target="_blank" rel="noopener" href="' + waLink('Hi, I have about ' + w + ' g of old gold to exchange. When can I bring it in for testing?') + '">Book an exchange visit →</a>';
    }
  }
  function row(label, sub, amount, text) {
    return '<div class="calc-row"><span>' + label + '<small>' + sub + '</small></span><b>' + (text || inr(amount)) + '</b></div>';
  }

  $$('.calc-tab').forEach(function (t) {
    t.addEventListener('click', function () {
      calcMode = t.getAttribute('data-calc');
      $$('.calc-tab').forEach(function (x) {
        x.classList.toggle('active', x === t);
        x.setAttribute('aria-selected', x === t);
      });
      $$('.calc-buy-only').forEach(function (el) { el.hidden = calcMode !== 'buy'; });
      $$('.calc-ex-only').forEach(function (el) { el.hidden = calcMode !== 'exchange'; });
      calc();
    });
  });
  calcForm.addEventListener('input', function (e) { if (e.target.name === 'purity') fillRate(); else calc(); });
  calcForm.making.value = rates.defaultMakingPercent || 12;

  function loadSheetRates() {
    if (!rates.sheetCsvUrl) return renderRates();
    fetch(rates.sheetCsvUrl, { cache: 'no-store' })
      .then(function (r) { return r.text(); })
      .then(function (csv) {
        csv.split(/\r?\n/).forEach(function (line) {
          var parts = line.split(',');
          var key = (parts[0] || '').trim().toLowerCase();
          var val = parts.slice(1).join(',').trim().replace(/^"|"$/g, '');
          if (!key || !val) return;
          if (key === 'updated') rates.updated = val;
          else if (['gold24', 'gold22', 'gold18', 'silver'].indexOf(key) !== -1) rates[key] = parseFloat(val.replace(/[^\d.]/g, '')) || null;
        });
      })
      .catch(function () { /* fall back to data.js values */ })
      .then(renderRates);
  }
  loadSheetRates();

  // ===== Appointment =====
  var appt = $('#appointmentForm');
  if (appt) {
    var today = new Date();
    appt.date.min = today.toISOString().slice(0, 10);
    appt.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = $$('[required]', appt).filter(function (f) { return !f.value.trim(); });
      $$('.invalid', appt).forEach(function (f) { f.classList.remove('invalid'); });
      if (bad.length) { bad.forEach(function (f) { f.classList.add('invalid'); }); bad[0].focus(); toast('Please fill in the highlighted fields'); return; }
      var d = new Date(appt.date.value + 'T00:00');
      var dateTxt = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      var text = 'Hi Chandu Jewellers, I\'d like to book a visit.\n\n' +
        'Name: ' + appt.name.value.trim() + '\n' +
        'Phone: ' + appt.phone.value.trim() + '\n' +
        'When: ' + dateTxt + ', ' + appt.time.value + '\n' +
        'For: ' + appt.purpose.value +
        (appt.notes.value.trim() ? '\nNotes: ' + appt.notes.value.trim() : '') +
        (wish.length ? '\nSaved pieces: ' + wish.map(function (id) { return byId(id).name; }).join(', ') : '');
      window.open(waLink(text), '_blank', 'noopener');
      toast('Opening WhatsApp…');
    });
  }

  // ===== Contact modal =====
  var contactModal = $('#contactModal');
  $('#openContactForm').addEventListener('click', function () { openLayer(contactModal); });
  var contactForm = $('#contactForm');
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = contactForm.elements.name.value.trim();
    var phone = contactForm.elements.phone.value.trim();
    var message = contactForm.elements.message.value.trim();
    if (!name || !phone) return;
    var text = 'Hi, I am ' + name + '.\nPhone: ' + phone + (message ? '\n\n' + message : '');
    window.open(waLink(text), '_blank', 'noopener');
    contactForm.reset();
    closeLayer(contactModal);
    toast('Opening WhatsApp…');
  });

  // ===== Visit: address, hours, map =====
  if (store.address) $('#visitAddress').textContent = store.address;
  var hoursEl = $('#visitHours');
  hoursEl.innerHTML = (store.hours && store.hours.length ? store.hours : ['Call us to confirm today\'s timings'])
    .map(function (h) { return '<li>' + escapeHtml(h) + '</li>'; }).join('');
  var q = encodeURIComponent(store.mapsQuery || 'Chandu Jewellers Karimnagar');
  $('#directionsBtn').href = 'https://www.google.com/maps/dir/?api=1&destination=' + q;
  if (store.googleReviews) { $('#reviewsBtn').href = store.googleReviews; $('#reviewsBtn').hidden = false; }
  var mapFrame = $('#mapFrame');
  // Load the map only when it scrolls near view (saves ~1 MB on first load)
  new IntersectionObserver(function (entries, obs) {
    if (entries[0].isIntersecting) {
      mapFrame.src = 'https://maps.google.com/maps?q=' + q + '&z=15&output=embed';
      obs.disconnect();
    }
  }, { rootMargin: '400px' }).observe(mapFrame);

  // ===== Start =====
  renderCatalog();
  observeReveal(document);
  updateWishUi();

  // Deep link: #piece-7 opens that piece
  var m = location.hash.match(/^#piece-(\d+)$/);
  if (m) setTimeout(function () { openQuickView(Number(m[1]), data); }, 400);

  // Offline support / installable app
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });
  }
})();
