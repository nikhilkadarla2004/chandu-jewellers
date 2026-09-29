(function () {
  'use strict';

  var CATEGORY_LABELS = {
    all: 'All pieces',
    rings: 'Rings',
    chains: 'Chains',
    necklaces: 'Necklaces',
    harams: 'Harams',
    bangles: 'Bangles',
    mangalsutras: 'Mangalsutras',
    earrings: 'Earrings',
    more: 'All pieces'
  };

  // Page Loader
  var pageLoader = document.getElementById('pageLoader');
  function hideLoader() {
    if (pageLoader && !pageLoader.classList.contains('hidden')) {
      pageLoader.classList.add('hidden');
    }
  }
  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 800);
  } else {
    window.addEventListener('load', function () {
      setTimeout(hideLoader, 800);
    });
  }
  setTimeout(hideLoader, 3000);

  // ===== Cinematic Hero Carousel =====
  (function setupHeroCarousel() {
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.hero-dot');
    var prevBtn = document.querySelector('.hero-arrow-prev');
    var nextBtn = document.querySelector('.hero-arrow-next');
    if (!slides.length) return;

    var current = 0;
    var autoplayMs = 6000;
    var timer = null;

    function go(index) {
      var next = (index + slides.length) % slides.length;
      if (next === current) return;
      slides[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      slides[next].classList.add('active');
      dots[next] && dots[next].classList.add('active');
      current = next;
    }

    function start() {
      stop();
      timer = setInterval(function () { go(current + 1); }, autoplayMs);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        go(i);
        start();
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { go(current - 1); start(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(current + 1); start(); });

    // Pause on hover (desktop)
    var heroEl = document.querySelector('.hero-cinema');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', stop);
      heroEl.addEventListener('mouseleave', start);
    }

    // Swipe support (mobile)
    var touchStartX = 0;
    if (heroEl) {
      heroEl.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });
      heroEl.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) {
          go(current + (dx < 0 ? 1 : -1));
          start();
        }
      });
    }

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    start();
  })();

  // Mobile Nav Toggle
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // Active Nav Highlighting
  var sections = document.querySelectorAll('section[id], footer[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < bottom) {
        navAnchors.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // Scroll Reveal
  var revealElements = document.querySelectorAll('[data-reveal]');
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // Back to Top
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Jewelry Grid
  var grid = document.getElementById('jeweleryGrid');
  var categoryViewHeading = document.getElementById('categoryViewHeading');
  var data = (typeof JEWELERY_DATA !== 'undefined') ? JEWELERY_DATA : [];

  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function getCountForFilter(filter) {
    if (filter === 'all' || filter === 'more') return data.length;
    return data.filter(function (item) { return item.category === filter; }).length;
  }

  function setCategoryHeading(filter) {
    if (!categoryViewHeading) return;
    var label = CATEGORY_LABELS[filter] || filter;
    var count = getCountForFilter(filter);
    categoryViewHeading.textContent = label + ' (' + count + ')';
  }

  function applyFilter(filter) {
    var allBtns = document.querySelectorAll('.filter-btn');
    var activeBtn = document.querySelector('.filter-btn[data-filter="' + filter + '"]');
    if (activeBtn) {
      allBtns.forEach(function (b) {
        b.classList.toggle('active', b === activeBtn);
      });
    }
    var cards = grid ? grid.querySelectorAll('.jewelery-card') : [];
    var isAll = (filter === 'all' || filter === 'more');

    cards.forEach(function (card, index) {
      var cat = card.getAttribute('data-category');
      var show = isAll || cat === filter;
      if (show) {
        card.classList.remove('hide');
        card.style.animation = 'none';
        void card.offsetHeight;
        card.style.animation = 'cardFadeIn 0.4s ease forwards';
        card.style.animationDelay = (index * 0.05) + 's';
      } else {
        card.classList.add('hide');
      }
    });

    setCategoryHeading(filter);
  }

  function renderItems(items) {
    if (!grid) return;
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      html +=
        '<article class="jewelery-card" data-category="' + escapeHtml(item.category) + '" style="animation-delay:' + (i * 0.05) + 's">' +
        '<div class="jewelery-card-image">' +
        '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.name) + '" loading="lazy">' +
        '</div>' +
        '<div class="jewelery-card-body">' +
        '<a href="#explore" class="category-tag" data-filter-category="' + escapeHtml(item.category) + '">' + escapeHtml(item.category) + '</a>' +
        '<h3>' + escapeHtml(item.name) + '</h3>' +
        '<p>' + escapeHtml(item.desc) + '</p>' +
        '<p class="price">' + escapeHtml(item.price || 'On request') + '</p>' +
        '</div>' +
        '</article>';
    }
    grid.innerHTML = html;
  }

  renderItems(data);
  setCategoryHeading('all');

  // Filter buttons
  var filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.getAttribute('data-filter');
      applyFilter(filter);
    });
  });

  // Category cards in "We Provide" (supports both .category-card and .cat-card)
  document.querySelectorAll('.category-card, .cat-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      var cat = this.getAttribute('data-category');
      if (!cat) return;
      e.preventDefault();
      var target = document.getElementById('explore');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      applyFilter(cat === 'more' ? 'all' : cat);
    });
  });

  // Click anywhere on a jewellery card to filter that category
  if (grid) {
    grid.addEventListener('click', function (e) {
      var card = e.target.closest('.jewelery-card');
      if (!card) return;
      var filter = card.getAttribute('data-category');
      if (filter) {
        applyFilter(filter);
        var heading = document.getElementById('categoryViewHeading');
        if (heading) heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Contact Modal
  var contactModal = document.getElementById('contactModal');
  var openBtn = document.getElementById('openContactForm');
  var closeBtn = document.getElementById('closeContactForm');
  var contactForm = document.getElementById('contactForm');

  function closeModal() {
    if (contactModal) contactModal.classList.remove('open');
  }

  if (openBtn && contactModal) {
    openBtn.addEventListener('click', function () {
      contactModal.classList.add('open');
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (contactModal) {
    contactModal.addEventListener('click', function (e) {
      if (e.target === contactModal) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.elements.name.value.trim();
      var phone = contactForm.elements.phone.value.trim();
      var message = contactForm.elements.message.value.trim();

      if (!name || !phone) return;

      var text = 'Hi, I am ' + name + '.\nPhone: ' + phone;
      if (message) text += '\n\n' + message;

      var waUrl = 'https://wa.me/917981233951?text=' + encodeURIComponent(text);
      window.open(waUrl, '_blank');

      contactForm.innerHTML = '<p class="form-success">Message sent via WhatsApp!</p>';
      setTimeout(closeModal, 2000);
    });
  }

  // Dynamic Footer Year
  var footerBottom = document.querySelector('.footer-bottom p');
  if (footerBottom) {
    footerBottom.textContent = '\u00A9 ' + new Date().getFullYear() + ' Chandu Jewellers, Karimnagar. All rights reserved.';
  }

  // Featured Carousel Scroll Buttons
  var featuredCarousel = document.querySelector('.featured-carousel');
  var scrollLeftBtn = document.querySelector('.scroll-left');
  var scrollRightBtn = document.querySelector('.scroll-right');

  if (scrollLeftBtn && featuredCarousel) {
    scrollLeftBtn.addEventListener('click', function () {
      featuredCarousel.scrollBy({ left: -300, behavior: 'smooth' });
    });
  }

  if (scrollRightBtn && featuredCarousel) {
    scrollRightBtn.addEventListener('click', function () {
      featuredCarousel.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }
})();
