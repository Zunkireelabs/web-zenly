(function () {
  'use strict';

  // ── Card 2 — Bell auto-play + manual click ────────────────
  const c2Bell  = document.getElementById('c2Bell');
  const c2Panel = document.getElementById('c2Panel');
  if (c2Bell && c2Panel) {
    var c2Items      = c2Panel.querySelectorAll('.c2-panel__item');
    var c2Order      = [0, 1, 2];
    var c2States     = ['c2-card-active', 'c2-card-peek1', 'c2-card-peek2'];
    var c2CycleTimer = null;

    function c2ClearStates() {
      c2Items.forEach(function (item) {
        item.classList.remove('c2-card-active', 'c2-card-peek1', 'c2-card-peek2', 'c2-card-exit');
      });
    }

    function c2ApplyStates() {
      c2ClearStates();
      c2Order.forEach(function (itemIdx, stateIdx) {
        c2Items[itemIdx].classList.add(c2States[stateIdx]);
      });
    }

    function c2CycleCard() {
      var exitIdx = c2Order[0];
      c2Items[exitIdx].classList.remove('c2-card-active');
      c2Items[exitIdx].classList.add('c2-card-exit');
      setTimeout(function () {
        c2Order = [c2Order[1], c2Order[2], c2Order[0]];
        c2ApplyStates();
      }, 420);
    }

    function c2Open() {
      c2Panel.classList.add('open');
      c2Order = [0, 1, 2];
      c2ClearStates();
      // Stagger cards in one by one
      setTimeout(function () { c2Items[0].classList.add('c2-card-active'); }, 60);
      setTimeout(function () { c2Items[1].classList.add('c2-card-peek1');  }, 240);
      setTimeout(function () { c2Items[2].classList.add('c2-card-peek2');  }, 420);
      // Start cycling after all cards are in
      if (c2CycleTimer) clearInterval(c2CycleTimer);
      c2CycleTimer = setTimeout(function () {
        c2CycleTimer = setInterval(c2CycleCard, 1800);
      }, 1000);
    }

    function c2Close() {
      c2Panel.classList.remove('open');
      if (c2CycleTimer) { clearInterval(c2CycleTimer); c2CycleTimer = null; }
      c2ClearStates();
    }

    function c2Play() {
      c2Bell.classList.remove('ringing');
      void c2Bell.offsetWidth;
      c2Bell.classList.add('ringing');
      setTimeout(c2Open, 250);
    }
    setTimeout(c2Play, 600);

    c2Bell.addEventListener('click', function () {
      c2Bell.classList.remove('ringing');
      void c2Bell.offsetWidth;
      c2Bell.classList.add('ringing');
      if (c2Panel.classList.contains('open')) { c2Close(); } else { c2Open(); }
    });
    document.addEventListener('click', function (e) {
      if (!c2Bell.contains(e.target) && !c2Panel.contains(e.target)) {
        c2Close();
      }
    });
  }

  // ── Nav: add .scrolled on scroll ──────────────────────────
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('nav-toggle');
  const mobile = document.getElementById('nav-mobile');

  if (nav) {
    const syncScrolled = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', syncScrolled, { passive: true });
    syncScrolled(); // apply immediately if page loads mid-scroll
  }

  // ── Nav: mobile hamburger toggle ──────────────────────────
  if (toggle && mobile && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      mobile.classList.toggle('open', isOpen);
      nav.classList.toggle('menu-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      mobile.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close when any mobile nav link is tapped
    mobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobile.classList.remove('open');
        nav.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        mobile.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // ── Value mockup: left phone parallax upward on scroll ──
  const listPhone = document.querySelector('.mock-phone--list');
  if (listPhone && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to(listPhone, {
      y: -160,
      ease: 'none',
      scrollTrigger: {
        trigger: '.value-mock',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }

  // ── Features header: fades in as #value (curtain) scrolls upward ────────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set('#features .entr-header', { opacity: 0, y: 40 });
    gsap.to('#features .entr-header', {
      opacity: 1,
      y: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#value',
        start: 'bottom 80%',   // #value bottom enters 80% of viewport
        end: 'bottom 30%',     // #value bottom at 30% — header fully visible
        scrub: true,
      },
    });
  }

  // ── Hero features: 3 visible, zigzag, exits from position ─
  const features = document.querySelectorAll('.hero-feature');
  if (features.length) {
    const SHOW_DURATION = 2800;
    const FADE_DURATION = 450;

    // stack = [current, prev, prev2]
    let stack = [0, 1, 2];
    features[0].classList.add('active');
    features[1].classList.add('prev');
    features[2].classList.add('prev2');

    let next = 3 % features.length;

    setInterval(() => {
      const [curr, p, p2] = stack;

      // prev2 fades out from its position
      features[p2].classList.remove('prev2');
      features[p2].classList.add('exiting');
      setTimeout(() => features[p2].classList.remove('exiting'), FADE_DURATION);

      // shift prev → prev2, active → prev
      features[p].classList.remove('prev');
      features[p].classList.add('prev2');

      features[curr].classList.remove('active');
      features[curr].classList.add('prev');

      // new element enters at bottom
      const entering = next;
      setTimeout(() => features[entering].classList.add('active'), FADE_DURATION);

      stack = [entering, curr, p];
      next = (next + 1) % features.length;
    }, SHOW_DURATION);
  }

  // ── Scroll reveal — shared .reveal elements ───────────────────────────
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) {
    // Immediately reveal anything already in or above the viewport
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('is-visible');
    } else {
      revealObserver.observe(el);
    }
  });

  // ── Feature cards: scroll reveal ─────────────────────────────────────
  const cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        cardObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.feat-card').forEach(function (el) {
    cardObserver.observe(el);
  });

  // ── Booking card: cycle active time slot ──────────────────────────────
  const slots = document.querySelectorAll('.bk-mock__slot:not(.bk-mock__slot--taken)');
  if (slots.length) {
    let activeSlotIdx = Array.from(slots).findIndex(function (s) {
      return s.classList.contains('bk-mock__slot--active');
    });
    if (activeSlotIdx === -1) activeSlotIdx = 0;
    setInterval(function () {
      slots[activeSlotIdx].classList.remove('bk-mock__slot--active');
      activeSlotIdx = (activeSlotIdx + 1) % slots.length;
      slots[activeSlotIdx].classList.add('bk-mock__slot--active');
    }, 2200);
  }

  // ── Branch selector (Card 4) ─────────────────────────────────────────
  const branchData = [
    { name: 'Downtown', rev: '$1,840', bookings: '12', staff: '8' },
    { name: 'Uptown',   rev: '$1,240', bookings: '9',  staff: '6' },
    { name: 'Westside', rev: '$960',   bookings: '7',  staff: '5' },
  ];
  const bSel     = document.getElementById('bSel');
  const bSelBtn  = document.getElementById('bSelBtn');
  const bSelMenu = document.getElementById('bSelMenu');
  const bSelLabel= document.getElementById('bSelLabel');
  const bStats   = document.getElementById('bStats');
  const bRevEl   = document.getElementById('bRev');
  const bBkEl    = document.getElementById('bBk');
  const bStfEl   = document.getElementById('bStf');
  const bItems   = bSelMenu ? bSelMenu.querySelectorAll('.bsel__item') : [];
  let activeBranch = 0;

  function setBranch(idx) {
    activeBranch = idx;
    bSelLabel.textContent = branchData[idx].name;
    bItems.forEach((item, i) => item.classList.toggle('bsel__item--active', i === idx));
    if (bStats) {
      bStats.classList.add('changing');
      setTimeout(function () {
        bRevEl.textContent = branchData[idx].rev;
        bBkEl.textContent  = branchData[idx].bookings;
        bStfEl.textContent = branchData[idx].staff;
        bStats.classList.remove('changing');
      }, 250);
    }
  }

  if (bSel && bSelBtn) {
    bSelBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      bSel.classList.toggle('bsel--open');
    });
    document.addEventListener('click', function () {
      bSel.classList.remove('bsel--open');
    });
    bItems.forEach(function (item, i) {
      item.addEventListener('click', function (e) {
        e.stopPropagation();
        setBranch(i);
        bSel.classList.remove('bsel--open');
      });
    });
    setInterval(function () {
      const next = (activeBranch + 1) % branchData.length;
      // 1. Open dropdown
      bSel.classList.add('bsel--open');
      // 2. Hover highlight the next item
      setTimeout(function () {
        bItems.forEach(function (item, i) {
          item.classList.toggle('bsel__item--hover', i === next);
        });
      }, 600);
      // 3. Select and close
      setTimeout(function () {
        bItems.forEach(function (item) { item.classList.remove('bsel__item--hover'); });
        setBranch(next);
        bSel.classList.remove('bsel--open');
      }, 1200);
    }, 3200);
  }

  // ── Circular Testimonials ────────────────────────────────────────────
  (function () {
    const testimonials = [
      {
        name: 'Spa Manager',
        biz: 'Nuad Thai Spa · Spa & Wellness',
        quote: '"Before Zenly, closing the day meant 45 minutes of Excel — comparing receipts, chasing staff, hoping the numbers matched. Now it takes one click. I don\'t know how we managed without it."',
      },
      {
        name: 'Salon Owner',
        biz: 'Pure Glow · Hair & Beauty',
        quote: '"No-shows dropped to almost zero since we turned on confirmations. Clients actually show up now — and so does the revenue."',
      },
      {
        name: 'Clinic Manager',
        biz: 'SmileWell · Dental Clinic',
        quote: '"Staff know their schedule without a group chat. Managers see the whole day at a glance. It just works — and patients notice."',
      },
    ];

    const imgs    = document.querySelectorAll('.testi-img');
    const nameEl  = document.getElementById('testiName');
    const bizEl   = document.getElementById('testiBiz');
    const quoteEl = document.getElementById('testiQuote');
    const prevBtn = document.getElementById('testiPrev');
    const nextBtn = document.getElementById('testiNext');

    if (!imgs.length || !nameEl) return;

    const n = testimonials.length;
    let active = 0;
    let timer;

    function setClasses(i) {
      const left  = (i - 1 + n) % n;
      const right = (i + 1) % n;
      imgs.forEach(function (img, idx) {
        img.className = 'testi-img';
        if (idx === i)           img.classList.add('is-active');
        else if (idx === left)   img.classList.add('is-left');
        else if (idx === right)  img.classList.add('is-right');
        else                     img.classList.add('is-hidden');
      });
    }

    function animateWords(text) {
      quoteEl.innerHTML = '';
      text.split(' ').forEach(function (word, i) {
        const span = document.createElement('span');
        span.className = 'testi-word';
        span.textContent = word + ' ';
        span.style.animationDelay = (i * 0.025) + 's';
        quoteEl.appendChild(span);
      });
    }

    function show(i) {
      active = (i + n) % n;
      const t = testimonials[active];
      setClasses(active);
      nameEl.textContent = t.name;
      bizEl.textContent  = t.biz;
      animateWords(t.quote);
    }

    function startAutoplay() {
      clearInterval(timer);
      timer = setInterval(function () { show(active + 1); }, 5000);
    }

    prevBtn.addEventListener('click', function () { show(active - 1); startAutoplay(); });
    nextBtn.addEventListener('click', function () { show(active + 1); startAutoplay(); });

    show(0);
    startAutoplay();
  }());

  // ── Stats carousel prev/next ──────────────────────────────
  (function () {
    const wrap = document.getElementById('statsWrap');
    const prev = document.getElementById('statsPrev');
    const next = document.getElementById('statsNext');
    if (!wrap || !prev || !next) return;

    function getStep() {
      const card = wrap.querySelector('.stats-card');
      if (!card) return 280;
      const gap = 24; // --space-md
      return card.offsetWidth + gap;
    }

    function updateButtons() {
      prev.disabled = wrap.scrollLeft <= 0;
      next.disabled = wrap.scrollLeft >= wrap.scrollWidth - wrap.clientWidth - 1;
    }

    prev.addEventListener('click', function () {
      wrap.scrollBy({ left: -getStep(), behavior: 'smooth' });
    });
    next.addEventListener('click', function () {
      wrap.scrollBy({ left: getStep(), behavior: 'smooth' });
    });

    wrap.addEventListener('scroll', updateButtons, { passive: true });
    updateButtons();
  }());

})();
