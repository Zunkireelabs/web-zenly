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

  // Features header — no animation, always visible

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

  // ── Pain points SplitText word reveal ────────────────────────────────
  const problemBody = document.getElementById('problemBody');
  if (problemBody && typeof gsap !== 'undefined' && typeof SplitText !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const split = new SplitText(problemBody, { type: 'words', wordsClass: 'split-word' });
    gsap.from(split.words, {
      scrollTrigger: {
        trigger: problemBody,
        start: 'top 80%',
      },
      opacity: 0,
      y: 20,
      stagger: 0.04,
      duration: 0.5,
      ease: 'power2.out',
    });
  }

  // ── Problem to Solution (THE TURN) Pinned Storytelling Transition ───
  const storySection = document.getElementById('storytellingSection');
  const storyInner = document.getElementById('storytellingInner');
  const slideProblem = document.getElementById('storySlideProblem');
  const slideSolution = document.getElementById('storySlideSolution');
  const dividerContainer = document.getElementById('storyDividerContainer');
  const solutionHeader = document.getElementById('solutionHeader');

  if (storySection && storyInner && slideProblem && slideSolution && problemBody && dividerContainer && solutionHeader && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Both slides share one grid cell so they can cross-fade; the tall problem
    // paragraph still occupies layout height even at opacity 0, leaving dead
    // space under the shorter solution content. Lock the container to its
    // measured starting height, then shrink it to the solution slide's height
    // in step with the rest of the timeline below.
    const problemSlideHeight = slideProblem.offsetHeight;
    const solutionSlideHeight = slideSolution.offsetHeight;
    gsap.set(storyInner, { height: problemSlideHeight });

    const dividerLeft = dividerContainer.querySelector('.story-divider-line--left');
    const dividerRight = dividerContainer.querySelector('.story-divider-line--right');
    const dividerLabel = dividerContainer.querySelector('.story-divider-label');
    const solPhrases = solutionHeader.querySelectorAll('.sol-phrase');

    // Setup initial styles
    gsap.set(slideSolution, { opacity: 1, y: 0 }); // slide is visible but sub-contents hidden
    gsap.set(dividerContainer, { opacity: 1 });
    gsap.set(dividerLeft, { scaleX: 0 });
    gsap.set(dividerRight, { scaleX: 0 });
    gsap.set(dividerLabel, { opacity: 0 });
    gsap.set(solutionHeader, { opacity: 1, y: 0 });
    
    // Hide solution header contents & cards initially
    const cards = document.querySelectorAll('#solCards .sol-card');
    gsap.set(solPhrases, { opacity: 0, y: 20 });
    gsap.set(solutionHeader.querySelector('.solution__sub'), { opacity: 0, y: 15 });
    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 30 });
    }

    // Create a pinned timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: storySection,
        start: "top top", // Pin when the top of storytelling section reaches the top of the viewport
        end: "+=100%", // Keep pinned for 100% of viewport height (cards removed for now, no longer need the extra 60%)
        pin: true,
        scrub: 1, // Smooth scrub to control animation via scroll
      }
    });

    // ── Phase 1: Problem exits (Fade out, translate up 30px) ──
    tl.to(problemBody, {
      y: -30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });

    // Disable problem pointer events once faded out
    tl.set(slideProblem, { pointerEvents: "none" });
    tl.set(slideSolution, { pointerEvents: "auto" });

    // Shrink the container to the solution slide's height so no gap is left
    // once the section unpins (runs alongside phases 2–3 below).
    tl.to(storyInner, {
      height: solutionSlideHeight,
      duration: 1.3,
      ease: "power2.out"
    }, "-=0.1");

    // ── Phase 2: Divider grows from center + Label fades in ──
    tl.to([dividerLeft, dividerRight], {
      scaleX: 1,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.1");

    tl.to(dividerLabel, {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.4");

    // ── Phase 3: Reveal solution staggered (Fade in, translate up 20px) ──
    solPhrases.forEach((phrase, idx) => {
      tl.to(phrase, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      }, `-=${idx === 0 ? 0.1 : 0.35}`);
    });

    tl.to(solutionHeader.querySelector('.solution__sub'), {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.2");

    // ── Phase 4: Reveal cards one by one (Staggered pop up) ──
    if (cards.length) {
      cards.forEach((card, idx) => {
        tl.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out"
        }, `-=${idx === 0 ? 0.1 : 0.35}`);
      });
    }
    
    // ── Interactive Hover for Solution Phrases ──
    solPhrases.forEach(phrase => {
      phrase.addEventListener('mouseenter', () => {
        solutionHeader.classList.add('is-hovered');
      });
      phrase.addEventListener('mouseleave', () => {
        solutionHeader.classList.remove('is-hovered');
      });
    });
  }

  // ── Value section corner callouts — draw-on-scroll connectors ────────
  const valueCallouts = document.querySelectorAll('.value-callout');
  if (valueCallouts.length && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    valueCallouts.forEach((callout, idx) => {
      const path = callout.querySelector('.value-callout__connector-path');
      if (!path) return;

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        delay: 0.15 * idx,
        scrollTrigger: {
          trigger: '#value',
          start: 'top 65%',
          toggleActions: 'play none none none'
        }
      });
    });
  }

  // ── Curtain Reveal & Features Header Animation ───────────────────────
  const featuresSection = document.getElementById('features');
  const entrHeader = document.getElementById('entrHeader');
  
  if (featuresSection && entrHeader && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    const entrPhrases = entrHeader.querySelectorAll('.entr-phrase');
    const entrSub = entrHeader.querySelector('.entr-header__sub');

    // Setup initial state
    gsap.set(entrHeader, { opacity: 1 });
    gsap.set(entrPhrases, { opacity: 0, y: 25 });
    gsap.set(entrSub, { opacity: 0, y: 15 });

    // Parallax uncover effect on features inner container
    const innerContainer = featuresSection.querySelector('.section__inner');
    if (innerContainer) {
      gsap.fromTo(innerContainer, 
        { y: -100 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: featuresSection,
            start: "top bottom",
            end: "top top+=100px",
            scrub: true
          }
        }
      );
    }

    // ScrollTrigger to reveal the header as the curtain scrolls up
    const tlEntr = gsap.timeline({
      scrollTrigger: {
        trigger: entrHeader,
        start: "top 92%", // Trigger exactly when the header is visible near the bottom of viewport
        end: "top 72%",
        scrub: 1,
      }
    });

    // Stagger reveal the phrases
    entrPhrases.forEach((phrase, idx) => {
      tlEntr.to(phrase, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: "power2.out"
      }, idx * 0.15);
    });

    // Reveal subtext
    tlEntr.to(entrSub, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }, "-=0.1");

    // Add hover interactivity
    entrPhrases.forEach(phrase => {
      phrase.addEventListener('mouseenter', () => {
        entrHeader.classList.add('is-hovered');
      });
      phrase.addEventListener('mouseleave', () => {
        entrHeader.classList.remove('is-hovered');
      });
    });
  }

  // ── Features Cards Scroll-Triggered Reveal Animations ────────────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // 1. Alternating Row Cards: slide text from left, visual from right
    const smCards = document.querySelectorAll('.entr-list > .feat-card--sm');
    smCards.forEach(card => {
      const text = card.querySelector('.feat-card__text');
      const visual = card.querySelector('.feat-card__visual');
      if (text && visual) {
        gsap.set(text, { opacity: 0, x: -50 });
        gsap.set(visual, { opacity: 0, x: 50 });
        
        gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 85%", // trigger when card top is 85% down viewport
            toggleActions: "play none none none"
          }
        })
        .to(text, { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" })
        .to(visual, { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.6");
      }
    });

    // 2. Middle Row Grid Cards: stagger popup from bottom
    const gridSection = document.querySelector('.entr-list > .feat-grid');
    if (gridSection) {
      const stackCards = gridSection.querySelectorAll('.feat-card--stack');
      if (stackCards.length) {
        gsap.set(stackCards, { opacity: 0, y: 50 });
        
        gsap.timeline({
          scrollTrigger: {
            trigger: gridSection,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        })
        .to(stackCards, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.25,
          ease: "power2.out"
        });
      }
    }
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

  document.querySelectorAll('.reveal, .reveal-scale, .reveal-fade').forEach(function (el) {
    // Immediately reveal anything already in or above the viewport
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('is-visible');
    } else {
      revealObserver.observe(el);
    }
  });

  // ── Features page: EOD panel trigger ─────────────────────────────────
  document.querySelectorAll('.fp-eod-panel').forEach(function (el) {
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

  // ── Feature sticky scroll: crossfade panels on scroll ────────────────
  var fssItems  = document.querySelectorAll('.fss-item');
  var fssPanels = document.querySelectorAll('.fss-panel');
  if (fssItems.length && fssPanels.length) {
    var fssObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var feat = entry.target.dataset.feat;
          fssPanels.forEach(function (p) { p.classList.remove('is-active'); });
          var active = document.querySelector('.fss-panel[data-feat="' + feat + '"]');
          if (active) active.classList.add('is-active');
        }
      });
    }, { rootMargin: '-20% 0px -20% 0px' });
    fssItems.forEach(function (item) { fssObserver.observe(item); });
  }

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

  // ── Circular Testimonials ────────────────────────────────────────────
  (function () {
    const testimonials = [
      {
        name: 'Owner',
        biz: 'Multi-branch spa · Kathmandu',
        quote: '"Before this, my manager was calling me 10 times a day. Now I open the app and see everything myself."',
      },
      {
        name: 'Admin',
        biz: 'Aesthetic clinic · Pokhara',
        quote: '"The discount approval alone saved us. We didn\'t realize how much we were giving away until we could see every request."',
      },
      {
        name: 'Manager',
        biz: 'Premium salon chain',
        quote: '"Our customers love booking online. We\'ve seen a noticeable drop in front-desk calls and a jump in confirmed appointments."',
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
        span.textContent = word;
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

  // ── Feature sticky scroll ─────────────────────────────────────────────────
  // Left col (heading + image) is position:sticky. Right col items stack
  // naturally and scroll past. Active item = whichever item's centre is
  // closest to the image centre. Past items (fully above image) fade to 0.25.
  var fdSscrollItems  = document.querySelectorAll('.fd-sscroll__item');
  var fdSscrollImgWrap = document.querySelector('.fd-sscroll__img-wrap');
  var fdSscrollLbl    = document.querySelector('.fd-sscroll__lbl');
  var fdSscrollTextCol = document.querySelector('.fd-sscroll__text-col');

  // Align text col so first item top = image top
  if (fdSscrollLbl && fdSscrollTextCol) {
    function fdAlignTextCol() {
      var lblH = fdSscrollLbl.offsetHeight;
      var gap  = parseFloat(getComputedStyle(fdSscrollLbl.parentElement).gap) || 24;
      fdSscrollTextCol.style.paddingTop = (lblH + gap) + 'px';
    }
    fdAlignTextCol();
    window.addEventListener('resize', fdAlignTextCol, { passive: true });
  }

  if (fdSscrollItems.length && fdSscrollImgWrap) {
    function fdUpdateActive() {
      var imgRect   = fdSscrollImgWrap.getBoundingClientRect();
      var imgCentre = (imgRect.top + imgRect.bottom) / 2;

      // Find item whose centre is closest to image centre
      var activeItem = fdSscrollItems[0];
      var minDist    = Infinity;
      fdSscrollItems.forEach(function (item) {
        var r    = item.getBoundingClientRect();
        var dist = Math.abs((r.top + r.bottom) / 2 - imgCentre);
        if (dist < minDist) { minDist = dist; activeItem = item; }
      });

      fdSscrollItems.forEach(function (item) {
        var r      = item.getBoundingClientRect();
        var isPast = r.bottom < imgRect.top; // fully scrolled above image
        item.classList.toggle('is-past',   isPast);
        item.classList.toggle('is-active', !isPast && item === activeItem);
      });
    }

    fdUpdateActive();
    window.addEventListener('scroll', fdUpdateActive, { passive: true });
    window.addEventListener('resize', fdUpdateActive, { passive: true });

    // GSAP parallax
    var fdSscrollImg = document.querySelector('.fd-sscroll__img');
    var fdSscrollSec = document.querySelector('.fd-sscroll');
    if (fdSscrollImg && fdSscrollSec && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      gsap.to(fdSscrollImg, {
        y: -50, ease: 'none',
        scrollTrigger: { trigger: fdSscrollSec, start: 'top bottom', end: 'bottom top', scrub: 1.2 }
      });
    }
  }

  // ── Feature detail: trust carousel pause/play ────────────────────────────
  var fdTrustBtn  = document.getElementById('fdTrustBtn');
  var fdTrustRail = document.getElementById('fdTrustRail');
  if (fdTrustBtn && fdTrustRail) {
    var fdTrustPlaying = true;
    fdTrustBtn.addEventListener('click', function () {
      fdTrustPlaying = !fdTrustPlaying;
      fdTrustRail.style.animationPlayState = fdTrustPlaying ? 'running' : 'paused';
      fdTrustBtn.querySelector('.fd-trust__icon--pause').style.display = fdTrustPlaying ? '' : 'none';
      fdTrustBtn.querySelector('.fd-trust__icon--play').style.display  = fdTrustPlaying ? 'none' : '';
      fdTrustBtn.setAttribute('aria-label', fdTrustPlaying ? 'Pause carousel' : 'Play carousel');
    });
  }

  // ── How-It-Works scroll spine ───────────────────────────
  var hiwContainer = document.querySelector('.hiw-rows');
  var hiwRows      = document.querySelectorAll('.hiw-row');
  var hiwFill      = document.getElementById('hiwRowsFill');

  if (hiwContainer && hiwRows.length) {
    var TRIGGER = 0.55;

    function hiwUpdate() {
      var containerRect = hiwContainer.getBoundingClientRect();
      var containerH    = hiwContainer.offsetHeight;
      var triggerY      = window.innerHeight * TRIGGER;

      // Fill line
      var scrolled = triggerY - containerRect.top;
      var ratio    = Math.max(0, Math.min(1, scrolled / containerH));
      if (hiwFill) {
        hiwFill.style.height = Math.round(ratio * (containerH - 48)) + 'px';
      }

      // Find the row closest to the trigger line and mark it active
      var activeIdx = -1;
      hiwRows.forEach(function (row, i) {
        var rowRect = row.getBoundingClientRect();
        var rowMid  = rowRect.top + rowRect.height * 0.35;
        if (rowMid < triggerY) activeIdx = i;
      });

      var anyActive = activeIdx >= 0;
      hiwContainer.classList.toggle('has-active', anyActive);

      hiwRows.forEach(function (row, i) {
        row.classList.toggle('is-active', i === activeIdx);
      });
    }

    window.addEventListener('scroll', hiwUpdate, { passive: true });
    hiwUpdate();
  }

})();
