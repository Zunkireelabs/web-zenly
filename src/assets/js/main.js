(function () {
  'use strict';

  // ── Lenis smooth scroll (synced with GSAP ScrollTrigger) ──
  if (typeof Lenis !== 'undefined' && typeof gsap !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    try {
      var lenis = new Lenis({
        duration: 1.1,
        smoothWheel: true,
      });

      lenis.on('scroll', function () {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
      });

      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } catch (e) {
      // Smooth scroll is an enhancement — fail silently to native scroll.
    }
  }

  // NOTE: a scroll-linked parallax transform on .curved-content (and,
  // before that, a pinned-hero version) was tried and reverted — any
  // animated `transform` on an ancestor of #scrollStoryPinWrapper makes
  // that ancestor the containing block for the blueprint pin's
  // `position: fixed`, breaking the pin and causing it to stick/elongate
  // instead of pinning to the viewport. .curved-content stays a static
  // (non-transformed) wrapper — see main.css for its curtain styling.

  // ── Hero parallax (layered depth: glow drifts slower than the phone;
  // headline stays put) ──
  // #hero is a sibling of .curved-content/#scrollStoryPinWrapper, not an
  // ancestor, so animating transforms inside it doesn't touch the pin above.
  // NOTE: hero__text is already position:sticky in CSS to stay fixed in
  // place — it must NOT also get a scrubbed transform, or the two motions
  // (sticky reflow + tween) fight each other and read as scroll jank.
  const heroSection = document.getElementById('hero');
  const heroParallaxPhone = heroSection ? heroSection.querySelector('.hero__phone') : null;

  if (heroSection && heroParallaxPhone &&
      typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.registerPlugin(ScrollTrigger);

    var heroPhoneSpeed = -0.25; // foreground: phone mockup
    var heroGlowSpeed = -0.08;  // background: ambient glow (.hero__phone::before)

    // Both tweens live on the same timeline/scrollTrigger so they update on
    // the exact same tick — that's what keeps the layers from drifting out
    // of sync with each other.
    gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0
      }
    })
      .to(heroParallaxPhone, { y: () => window.innerHeight * heroPhoneSpeed, ease: 'none' }, 0)
      .to(heroParallaxPhone, {
        // The glow is a child (::before) of .hero__phone, so it already
        // inherits the phone's own translate — this custom property adds
        // just the extra local offset needed to make its NET speed slower.
        '--hero-glow-shift': () => (window.innerHeight * (heroGlowSpeed - heroPhoneSpeed)) + 'px',
        ease: 'none'
      }, 0);
  }

  // ── Card 2 — Bell auto-play + manual click ────────────────
  const c2Bell   = document.getElementById('c2Bell');
  const c2Panel  = document.getElementById('c2Panel');
  const c2Cursor = document.getElementById('c2BellCursor');
  if (c2Bell && c2Panel) {
    var c2Items  = c2Panel.querySelectorAll('.c2-panel__item');
    var c2Timers = [];

    function c2ClearTimers() {
      c2Timers.forEach(clearTimeout);
      c2Timers = [];
    }

    function c2ClearStates() {
      c2Items.forEach(function (item) {
        item.classList.remove('c2-card-active', 'c2-card-exit');
      });
    }

    function c2ShowCard(idx) {
      c2ClearStates();
      c2Items[idx].classList.add('c2-card-active');
    }

    // Opens the panel and plays through every notification exactly once,
    // then calls onComplete — this is "one loop" of the notification cycle.
    function c2Open(onComplete) {
      c2Panel.classList.add('open');
      c2ClearStates();
      c2ClearTimers();

      c2Timers.push(setTimeout(function () { c2ShowCard(0); }, 60));

      for (var i = 1; i < c2Items.length; i++) {
        (function (idx) {
          c2Timers.push(setTimeout(function () { c2ShowCard(idx); }, 1600 + (idx - 1) * 1800));
        })(i);
      }

      var finishAt = 1600 + (c2Items.length - 1) * 1800;
      c2Timers.push(setTimeout(function () {
        if (onComplete) onComplete();
      }, finishAt));
    }

    function c2Close() {
      c2Panel.classList.remove('open');
      c2ClearTimers();
      c2ClearStates();
    }

    function c2Ring() {
      c2Bell.classList.remove('ringing');
      void c2Bell.offsetWidth;
      c2Bell.classList.add('ringing');
    }

    // ── Manual click: independent of the autoplay loop ────────
    c2Bell.addEventListener('click', function () {
      c2Ring();
      if (c2Panel.classList.contains('open')) { c2Close(); } else { c2Open(); }
    });
    document.addEventListener('click', function (e) {
      if (!c2Bell.contains(e.target) && !c2Panel.contains(e.target)) {
        c2Close();
      }
    });

    // ── Autoplay loop: cursor glides in → clicks the bell → notifications
    // play through once → cursor retracts → pause → repeat. The cursor's
    // pace is locked to the notification cycle's own timing, not a
    // separate CSS loop, so the two never drift out of sync.
    function c2LoopStep() {
      if (c2Cursor) {
        c2Cursor.classList.remove('is-clicking');
        c2Cursor.classList.add('is-approaching'); // 0.7s glide-in transition
      }

      setTimeout(function () {
        if (c2Cursor) c2Cursor.classList.add('is-clicking');
        c2Ring();

        setTimeout(function () {
          if (c2Cursor) c2Cursor.classList.remove('is-clicking');
        }, 150);

        setTimeout(function () {
          c2Open(function () {
            c2Close();
            if (c2Cursor) c2Cursor.classList.remove('is-approaching'); // 0.7s retract transition
            setTimeout(c2LoopStep, 700 + 900); // wait for retract, then pause before repeating
          });
        }, 250);
      }, c2Cursor ? 700 : 0);
    }

    var c2Card = c2Bell.closest('.feat-card');
    if (c2Card) {
      var c2AutoplayObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setTimeout(c2LoopStep, 500);
            c2AutoplayObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      c2AutoplayObserver.observe(c2Card);
    } else {
      setTimeout(c2LoopStep, 600);
    }
  }

  // ── Nav (v2, shared — ported from homepage): add .is-scrolled on scroll ──
  const nav    = document.getElementById('v2Nav');
  const toggle = document.getElementById('v2-nav-toggle');
  const mobile = document.getElementById('v2-nav-mobile');

  if (nav) {
    const syncScrolled = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', syncScrolled, { passive: true });
    syncScrolled(); // apply immediately if page loads mid-scroll
  }

  // ── Nav: mobile hamburger toggle — ported 1:1 from the homepage's own
  // mobile nav script (scrim, Lenis stop/start, Features/Resources
  // accordion), so every page's mobile menu behaves like the homepage's. ──
  const navScrim = document.getElementById('v2-nav-mobile-scrim');
  if (toggle && mobile && nav) {
    // Lenis intercepts wheel/touch scrolling directly, so plain CSS
    // `overflow:hidden` on the body won't stop the page scrolling behind
    // the open menu — stop/start Lenis itself instead (guarded: Lenis is
    // an enhancement and may not have initialized on every page/browser).
    const setNavOpen = (isOpen) => {
      nav.classList.toggle('menu-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      mobile.setAttribute('aria-hidden', String(!isOpen));
      if (navScrim) {
        navScrim.classList.toggle('is-open', isOpen);
        navScrim.setAttribute('aria-hidden', String(!isOpen));
      }
      if (typeof lenis !== 'undefined' && lenis) {
        if (isOpen) lenis.stop(); else lenis.start();
      }
    };

    toggle.addEventListener('click', () => {
      setNavOpen(!nav.classList.contains('menu-open'));
    });

    if (navScrim) {
      navScrim.addEventListener('click', () => setNavOpen(false));
    }

    mobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setNavOpen(false));
    });

    // Features/Resources accordion — tap equivalent of the desktop mega menu,
    // which relies on hover/:has() sibling selectors with no touch equivalent.
    mobile.querySelectorAll('.v2-nav-mobile__group').forEach((group) => {
      const trigger = group.querySelector('.v2-nav-mobile__trigger');
      if (!trigger) return;
      trigger.addEventListener('click', () => {
        const isOpen = group.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      });
    });
  }

  // ── Nav: mega menu click-to-toggle ─────────────────────────
  // Panels live as top-level siblings of .v2-nav (not nested inside the
  // trigger), so open state is tracked on both the trigger item (chevron
  // flip / aria) and the panel itself (its own is-open visibility), linked
  // via matching data-mega / id (ported 1:1 from the homepage's own script).
  const megaItems = document.querySelectorAll('.v2-nav__item--has-mega');
  if (megaItems.length) {
    const panelFor = (item) => document.getElementById('v2Mega-' + item.dataset.mega);

    const closeAllMegas = (except) => {
      megaItems.forEach(item => {
        if (item === except) return;
        item.classList.remove('is-open');
        const panel = panelFor(item);
        if (panel) panel.classList.remove('is-open');
        const trigger = item.querySelector('.v2-nav__mega-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    };

    // The panel is fixed + centered on the viewport, not anchored under the
    // trigger, so the cursor crosses empty space moving from trigger to
    // panel. Bridge that gap with a short close-delay so hover isn't lost.
    let closeTimer = null;
    const cancelClose = () => {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    };
    // The compact "sm" panel (Resources) is small enough to anchor under its
    // own trigger instead of centering on the viewport like the wide Features
    // menu. It's still `position:fixed`, so we compute its `left` in px each
    // time it opens (mirrors "left:50%; transform:translateX(-50%)" from CSS,
    // just with a trigger-relative reference point instead of the viewport
    // center) and move the caret to match.
    const positionAnchoredPanel = (item, panel) => {
      if (!panel || !panel.classList.contains('v2-nav-mega--sm')) return;
      const rect = item.getBoundingClientRect();
      const panelWidth = panel.offsetWidth;
      const margin = 16;
      const triggerCenter = rect.left + rect.width / 2;
      const minCenterRef = margin + panelWidth / 2;
      const maxCenterRef = window.innerWidth - margin - panelWidth / 2;
      const centerRef = Math.min(Math.max(triggerCenter, minCenterRef), maxCenterRef);
      panel.style.left = centerRef + 'px';
      const caretLeft = (rect.left + rect.width / 2) - (centerRef - panelWidth / 2);
      panel.style.setProperty('--mega-caret-left', caretLeft + 'px');
    };

    const open = (item) => {
      cancelClose();
      closeAllMegas(item);
      item.classList.add('is-open');
      const panel = panelFor(item);
      if (panel) {
        panel.classList.add('is-open');
        positionAnchoredPanel(item, panel);
      }
      const trigger = item.querySelector('.v2-nav__mega-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    };
    const scheduleClose = (item) => {
      cancelClose();
      closeTimer = setTimeout(() => closeAllMegas(), 250);
    };

    megaItems.forEach(item => {
      const trigger = item.querySelector('.v2-nav__mega-trigger');
      const panel = panelFor(item);
      if (!trigger) return;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (item.classList.contains('is-open')) closeAllMegas();
        else open(item);
      });
      trigger.addEventListener('focus', () => open(item));

      item.addEventListener('mouseenter', () => open(item));
      item.addEventListener('mouseleave', () => scheduleClose(item));

      if (panel) {
        panel.addEventListener('mouseenter', cancelClose);
        panel.addEventListener('mouseleave', () => scheduleClose(item));
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('.v2-nav__item--has-mega') || e.target.closest('.v2-nav-mega')) return;
      closeAllMegas();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllMegas();
    });
  }

  // ── Hero headline: rotating word, fade swap (no typing effect) ──
  const heroRotate = document.getElementById('heroRotate');
  if (heroRotate) {
    const phrases = [
      'run',
      'scale',
      'grow',
      'thrive',
    ];
    const HOLD_DURATION = 2200;
    const FADE_DURATION = 300;
    const reduceMotion  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduceMotion) {
      let phraseIndex = 0;
      setInterval(() => {
        heroRotate.style.opacity = '0';
        setTimeout(() => {
          phraseIndex = (phraseIndex + 1) % phrases.length;
          heroRotate.textContent = phrases[phraseIndex];
          heroRotate.style.opacity = '1';
        }, FADE_DURATION);
      }, HOLD_DURATION);
    }
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

  // ── Transformation flow diagram: scroll-triggered draw-in ──────────────
  const flowDiagram = document.getElementById('flowDiagram');
  if (flowDiagram && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const flowLines = [
      'flowBorderCard1', 'flowBorderCard2',
      'flowPathA', 'flowPathB',
      'flowBorderPill1', 'flowPathC',
      'flowBorderCircle', 'flowPathD',
      'flowBorderPill2', 'flowPathE',
      'flowBorderBottom',
    ]
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    flowLines.forEach(function (path) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });

    const flowTl = gsap.timeline({
      scrollTrigger: {
        trigger: flowDiagram,
        start: 'top 75%',
        once: true,
      },
    });

    // Each node: its shape fades in, its outline traces in as a drawn
    // line, then its inner content (icon/label/dots) fades in — before
    // the connector line continues on to the next node. One continuous
    // "drawing" motion from the two source cards down to the result.
    flowTl
      .to(['#flowCard1', '#flowCard2'], { opacity: 1, duration: 0.3, stagger: 0.12 })
      .to(['#flowBorderCard1', '#flowBorderCard2'], { strokeDashoffset: 0, duration: 0.9, stagger: 0.12, ease: 'sine.inOut' }, '<')
      .to(['#flowCard1 .flow-card__icon', '#flowCard1 .flow-card__label'], { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.5')
      .to(['#flowCard2 .flow-card__icon', '#flowCard2 .flow-card__label'], { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.4')

      .to(['#flowPathA', '#flowPathB'], { strokeDashoffset: 0, duration: 1, ease: 'sine.inOut' }, '-=0.1')

      .to('#flowPill1', { opacity: 1, duration: 0.25 })
      .to('#flowBorderPill1', { strokeDashoffset: 0, duration: 0.6, ease: 'sine.inOut' }, '<')
      .to(['#flowPill1 .flow-pill__dot', '#flowPill1 .flow-pill__label'], { opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.3')

      .to('#flowPathC', { strokeDashoffset: 0, duration: 0.6, ease: 'sine.inOut' })

      .to('#flowCircle', { opacity: 1, duration: 0.3 })
      .to('#flowBorderCircle', { strokeDashoffset: 0, duration: 0.75, ease: 'sine.inOut' }, '<')
      .to('.flow-circle__ring span', { opacity: 1, duration: 0.6, stagger: 0.035 }, '-=0.45')
      .to('.flow-circle__label', { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.3')

      .to('#flowPathD', { strokeDashoffset: 0, duration: 0.6, ease: 'sine.inOut' })

      .to('#flowPill2', { opacity: 1, duration: 0.25 })
      .to('#flowBorderPill2', { strokeDashoffset: 0, duration: 0.6, ease: 'sine.inOut' }, '<')
      .to(['#flowPill2 .flow-pill__dots', '#flowPill2 .flow-pill__label'], { opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.3')

      .to('#flowPathE', { strokeDashoffset: 0, duration: 0.65, ease: 'sine.inOut' })

      .to('#flowBottomCard', { opacity: 1, duration: 0.3 })
      .to('#flowBorderBottom', { strokeDashoffset: 0, duration: 0.9, ease: 'sine.inOut' }, '<')
      .to(['.flow-bottom-card__icon', '.flow-bottom-card__label'], { opacity: 1, duration: 0.4, ease: 'power2.out' }, '-=0.5');
  }

  // ── Unified Storytelling Scroll Sequence (Pain -> Blueprint -> Dashboard) ──
  const pinWrapper = document.getElementById('scrollStoryPinWrapper');
  const blueprintContainer = document.getElementById('blueprintContainer');
  const dividerContainer = document.getElementById('storyDividerContainer');
  const solutionHeader = document.getElementById('solutionHeader');
  const solutionSub = document.getElementById('solutionSub');
  const valueSection = document.getElementById('value');
  const valueMock = valueSection ? valueSection.querySelector('.value-mock') : null;
  const valueCallouts = document.querySelectorAll('.value-callout');
  if (pinWrapper && blueprintContainer && solutionHeader && valueSection && valueMock &&
      typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    if (!isMobile && !prefersReducedMotion) {
      console.log("Zennly Scroll Timeline: Desktop pinned experience active");

      // 1. Initial State Setup
      const blueprintNodes = blueprintContainer.querySelector('.blueprint-nodes');
      const blueprintConnectors = blueprintContainer.querySelector('.blueprint-connectors');
      const blueprintCore = document.getElementById('blueprintCore');
      const coreStem = blueprintCore ? blueprintCore.querySelector('.core-stem') : null;

      const dividerLeft = dividerContainer ? dividerContainer.querySelector('.story-divider-line--left') : null;
      const dividerRight = dividerContainer ? dividerContainer.querySelector('.story-divider-line--right') : null;
      const dividerLabel = dividerContainer ? dividerContainer.querySelector('.story-divider-label') : null;
      const solPhrases = solutionHeader.querySelectorAll('.sol-phrase');
      const mobileMock = valueMock.querySelector('.value-mock__mobile');

      // Make connectors fully drawn at start
      const paths = blueprintContainer.querySelectorAll('.connector-path');
      paths.forEach(path => {
        const length = path.getTotalLength() || 200;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
      });

      // Clear/Reset positions to starting state
      gsap.set(blueprintContainer, { y: 0, opacity: 1 });
      gsap.set(blueprintNodes, { y: 0, opacity: 1 });
      gsap.set(blueprintConnectors, { opacity: 1, scaleY: 1, transformOrigin: "top center" });
      gsap.set(blueprintCore, { y: 0 });
      if (coreStem) gsap.set(coreStem, { display: "none" });

      if (dividerLeft && dividerRight) gsap.set([dividerLeft, dividerRight], { scaleX: 0 });
      if (dividerLabel) gsap.set(dividerLabel, { opacity: 0 });
      
      // Let both the solution header and value mockup start translated down and invisible
      gsap.set(solutionHeader, { opacity: 0, y: 180 });
      gsap.set(valueMock, { opacity: 0, y: 300 });
      
      // Reset solPhrases to be visible inside the header container
      gsap.set(solPhrases, { opacity: 1, y: 0 });
      if (solutionSub) gsap.set(solutionSub, { opacity: 1, y: 0 });
      
      if (mobileMock) {
        // Disable automatic CSS animation so we can animate it via ScrollTrigger
        gsap.set(mobileMock, { animation: "none", opacity: 0, y: 30 });
      }

      // Initialize callout connectors
      valueCallouts.forEach(callout => {
        const path = callout.querySelector('.value-callout__connector-path');
        if (path) {
          gsap.set(path, { strokeDashoffset: 1 });
        }
      });

      // 2. Create the unified scroll timeline with a shorter end scroll distance for responsive speed
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrapper,
          start: "top top",
          end: "+=1400", // Shorter distance so pinning doesn't feel stuck
          pin: true,
          pinSpacing: true,
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      // Phase 2 & 3: Blueprint nodes stay fixed, connectors stretch downward, Zennly core moves down slightly (y: 50)
      tl.to(blueprintCore, { y: 50, duration: 1.0, ease: "power2.inOut" }, 0)
        .to(blueprintConnectors, { scaleY: 1.26, duration: 1.0, ease: "power2.inOut" }, 0);

      // Activate the logo glow and flow state immediately on scroll start
      tl.call(() => {
        blueprintContainer.classList.add('state-unified');
      }, null, 0.01)
      tl.call(() => {
        blueprintContainer.classList.remove('state-unified');
      }, null, 0.0);

      // Phase 4: solutionHeader and valueMock slide up together from the bottom
      tl.to(solutionHeader, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, "reveal-start")
        .to(valueMock, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, "reveal-start");

      if (dividerLeft && dividerRight) {
        tl.to([dividerLeft, dividerRight], { scaleX: 1, duration: 0.4, ease: "power2.out" }, "reveal-start+=0.2");
      }
      if (dividerLabel) {
        tl.to(dividerLabel, { opacity: 1, duration: 0.3, ease: "power2.out" }, "reveal-start+=0.3");
      }
      
      if (mobileMock) {
        tl.to(mobileMock, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, "reveal-start+=0.4");
      }

      // Animate the callout draw-on-scroll lines in sequence
      valueCallouts.forEach((callout, idx) => {
        const path = callout.querySelector('.value-callout__connector-path');
        if (path) {
          tl.to(path, {
            strokeDashoffset: 0,
            duration: 0.6,
            ease: "power2.inOut"
          }, `reveal-start+=${0.7 + idx * 0.12}`);
        }
      });

      // Very brief settle hold at the end so it unpins smoothly right as the animation finishes
      tl.to({}, { duration: 0.05 });

      // Refresh ScrollTrigger calculations on load to make sure pinning calculations are exact
      window.addEventListener('load', () => {
        ScrollTrigger.refresh();
      });
      ScrollTrigger.refresh();

    } else {
      // ── MOBILE OR REDUCED-MOTION FALLBACK ──
      // Clean, lightweight scroll reveals that match original specs

      // Add state-unified immediately when blueprint comes into view
      ScrollTrigger.create({
        trigger: blueprintContainer,
        start: "top 75%",
        onEnter: () => blueprintContainer.classList.add('state-unified'),
        onLeaveBack: () => blueprintContainer.classList.remove('state-unified'),
      });

      // Gentle blueprint connector stem elongation
      const coreStemEl = blueprintContainer.querySelector('.core-stem');
      if (coreStemEl) {
        gsap.set(coreStemEl, { height: 0, opacity: 0 });
        gsap.to(coreStemEl, {
          height: 40,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: blueprintContainer,
            start: "top 65%",
            end: "bottom 30%",
            scrub: 1,
          }
        });
      }

      // Reveal Solution Header
      const dividerLeft = dividerContainer ? dividerContainer.querySelector('.story-divider-line--left') : null;
      const dividerRight = dividerContainer ? dividerContainer.querySelector('.story-divider-line--right') : null;
      const dividerLabel = dividerContainer ? dividerContainer.querySelector('.story-divider-label') : null;
      const solPhrases = solutionHeader.querySelectorAll('.sol-phrase');

      if (dividerLeft && dividerRight) gsap.set([dividerLeft, dividerRight], { scaleX: 0 });
      if (dividerLabel) gsap.set(dividerLabel, { opacity: 0 });
      gsap.set(solPhrases, { opacity: 0, y: 20 });
      if (solutionSub) gsap.set(solutionSub, { opacity: 0, y: 15 });

      const mobileRevealTl = gsap.timeline({
        scrollTrigger: {
          trigger: dividerContainer || solutionHeader,
          start: "top 80%",
        }
      });
      if (dividerLeft && dividerRight) {
        mobileRevealTl.to([dividerLeft, dividerRight], { scaleX: 1, duration: 0.5, ease: "power2.out" });
      }
      if (dividerLabel) {
        mobileRevealTl.to(dividerLabel, { opacity: 1, duration: 0.4, ease: "power2.out" }, "-=0.2");
      }
      mobileRevealTl.to(solPhrases, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.1");
      if (solutionSub) {
        mobileRevealTl.to(solutionSub, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, "-=0.2");
      }

      // Draw callout paths
      valueCallouts.forEach((callout, idx) => {
        const path = callout.querySelector('.value-callout__connector-path');
        if (path) {
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 0.7,
            ease: 'power2.inOut',
            delay: 0.15 * idx,
            scrollTrigger: {
              trigger: valueSection,
              start: 'top 70%',
              toggleActions: 'play none none none'
            }
          });
        }
      });
    }
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

  document.querySelectorAll('.reveal:not(.compare-card__row-content), .reveal-scale, .reveal-fade').forEach(function (el) {
    // Immediately reveal anything already in or above the viewport
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('is-visible');
    } else {
      revealObserver.observe(el);
    }
  });

  // ── Compare card: row bg/border render immediately, only the icon+text
  // inside each row (.compare-card__row-content) stagger in, all triggered
  // together off the card container rather than each row's own scroll position ─
  document.querySelectorAll('.compare-card').forEach(function (card) {
    var rows = card.querySelectorAll('.compare-card__row-content');
    var revealRows = function () {
      rows.forEach(function (row) { row.classList.add('is-visible'); });
    };
    if (card.getBoundingClientRect().top < window.innerHeight) {
      revealRows();
    } else {
      var compareCardObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            revealRows();
            compareCardObserver.unobserve(e.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
      compareCardObserver.observe(card);
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

  // ── Testimonial carousel (Calendly-style peeking cards) ───────────────
  // Cards are identified by a "virtual index" (page + offset), not by their
  // item index — exactly like the reference's `key={page+offset}`. That's
  // what keeps a single DOM element sliding continuously through offsets
  // -4→-3→-2… as `page` advances, instead of recomputing "shortest distance
  // to active" each render, which made the far card jump/overlap across the
  // carousel (-2 straight to +2) whenever you advanced past the ring's seam.
  (function () {
    const root = document.getElementById('tcar');
    const stage = document.getElementById('tcarStage');
    if (!root || !stage) return;

    const templates = Array.from(stage.querySelectorAll('.tcar__card')).map(function (card) {
      const inner = card.querySelector('.tcar__inner');
      return inner ? inner.innerHTML : card.innerHTML;
    });
    const tabs = Array.from(root.querySelectorAll('.tcar__tab'));
    const total = templates.length;
    if (!total) return;
    stage.innerHTML = '';

    const VISIBLE_OFFSETS = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
    const AUTOPLAY_MS = 6000;
    let page = 0; // unbounded — never wrapped, so slot offsets change continuously
    let viewportWidth = window.innerWidth;
    let tier = 'desktop';
    let rafId = null;
    let lastTime = null;
    let elapsed = 0;
    let reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const slots = new Map(); // virtualIndex -> <div class="tcar__card">

    function activeIndex() {
      return ((page % total) + total) % total;
    }

    function computeTier() {
      viewportWidth = window.innerWidth;
      if (viewportWidth < 768) tier = 'mobile';
      else if (viewportWidth < 1120) tier = 'tablet';
      else tier = 'desktop';
    }

    function activeDims() {
      if (tier === 'mobile') return { width: Math.min(340, viewportWidth - 56), height: 490 };
      if (tier === 'tablet') return { width: 560, height: 440 };
      return { width: 762, height: 513 };
    }

    // Returns the target { x, y, width, height, opacity, z, active } for a card at this
    // offset — x/y are the top-left translate from the stage center (i.e. already
    // account for -width/2, -height/2), matching the reference component's own layout math.
    function getVariant(offset) {
      const dims = activeDims();

      if (tier === 'mobile') {
        const gap = 16, peekW = 60, peekH = 410;
        if (offset === 0) return { x: -dims.width / 2, y: -dims.height / 2, width: dims.width, height: dims.height, opacity: 1, z: 0, active: true };
        if (offset === -1) return { x: -dims.width / 2 - gap - peekW, y: -peekH / 2, width: peekW, height: peekH, opacity: 1, z: 100, active: false };
        if (offset === 1) return { x: dims.width / 2 + gap, y: -peekH / 2, width: peekW, height: peekH, opacity: 1, z: 100, active: false };
        return { x: offset < 0 ? -dims.width / 2 - 220 : dims.width / 2 + 220, y: -peekH / 2, width: peekW, height: peekH, opacity: 0, z: 0, active: false };
      }

      if (tier === 'tablet') {
        const gap = 18, sideW = 100, sideH = 340;
        if (offset === 0) return { x: -dims.width / 2, y: -dims.height / 2, width: dims.width, height: dims.height, opacity: 1, z: 0, active: true };
        if (offset === -1) return { x: -dims.width / 2 - gap - sideW, y: -sideH / 2, width: sideW, height: sideH, opacity: 1, z: 100, active: false };
        if (offset === 1) return { x: dims.width / 2 + gap, y: -sideH / 2, width: sideW, height: sideH, opacity: 1, z: 100, active: false };
        return { x: offset < 0 ? -dims.width / 2 - 240 : dims.width / 2 + 240, y: -sideH / 2, width: 74, height: 205, opacity: 0, z: 0, active: false };
      }

      switch (offset) {
        case 0: return { x: -381, y: -256.5, width: 762, height: 513, opacity: 1, z: 0, active: true };
        case -1: return { x: -506, y: -172, width: 105, height: 344, opacity: 1, z: 100, active: false };
        case 1: return { x: 401, y: -172, width: 105, height: 344, opacity: 1, z: 100, active: false };
        case -2: return { x: -596, y: -102.5, width: 74, height: 205, opacity: 1, z: 100, active: false };
        case 2: return { x: 522, y: -102.5, width: 74, height: 205, opacity: 1, z: 100, active: false };
        default: return { x: offset < 0 ? -720 : 646, y: -102.5, width: 74, height: 205, opacity: 0, z: 0, active: false };
      }
    }

    const NOTCH_BIG = '<svg viewBox="0 0 20 37.3338" preserveAspectRatio="none"><path d="M0 0C0 0 1.2422 13.5759 10 13.5759C18.7578 13.5759 20 0 20 0V37.3338C20 37.3338 18.7578 23.7578 10 23.7578C1.2422 23.7578 0 37.3338 0 37.3338V0Z"/></svg>';
    const NOTCH_SM = '<svg viewBox="0 0 16 28" preserveAspectRatio="none"><path d="M0 0C0 0 0.993759 10.1818 8 10.1818C15.0062 10.1818 16 0 16 0V28C16 28 15.0062 17.8182 8 17.8182C0.993759 17.8182 0 28 0 28V0Z"/></svg>';

    function syncNotch(card, offset) {
      let notch = card.querySelector('.tcar__notch');
      const needsBig = offset === -1 || offset === 1;
      const needsSmall = tier === 'desktop' && (offset === -2 || offset === 2);

      if (!needsBig && !needsSmall) {
        if (notch) notch.remove();
        return;
      }

      if (!notch) {
        notch = document.createElement('span');
        notch.className = 'tcar__notch';
        notch.setAttribute('aria-hidden', 'true');
        card.appendChild(notch);
      }

      const onLeftSide = offset < 0; // card sits left of active → notch faces right edge
      notch.classList.toggle('tcar__notch--sm', needsSmall);
      notch.style.left = onLeftSide ? 'calc(100% - 1px)' : '';
      notch.style.right = onLeftSide ? '' : 'calc(100% - 1px)';
      notch.innerHTML = needsSmall ? NOTCH_SM : NOTCH_BIG;
    }

    function applyVariant(card, offset, opts) {
      const v = getVariant(offset);
      const apply = function () {
        card.style.transform = 'translate(' + v.x + 'px, ' + v.y + 'px)';
        card.style.width = v.width + 'px';
        card.style.height = v.height + 'px';
        card.style.opacity = v.opacity;
        card.style.zIndex = v.z;
        card.style.pointerEvents = v.opacity === 0 ? 'none' : 'auto';
        card.classList.toggle('tcar__card--active', v.active);
        card.classList.toggle('tcar__card--clickable', !v.active && v.opacity > 0);
      };
      if (opts && opts.instant) {
        card.style.transition = 'none';
        apply();
        void card.offsetWidth; // flush before re-enabling transitions
        card.style.transition = '';
      } else {
        apply();
      }
      syncNotch(card, offset);
      card.dataset.offset = offset;
    }

    // Reconciles the DOM slot pool against the current `page`: virtual indexes
    // that persist across the change get their existing element (so the CSS
    // transition animates it smoothly to its new offset); ones that fall out
    // of range are removed, new ones spawned in directly at their target spot.
    function render() {
      const desired = VISIBLE_OFFSETS.map(function (o) { return page + o; });
      const desiredSet = new Set(desired);

      slots.forEach(function (card, vIdx) {
        if (!desiredSet.has(vIdx)) {
          card.remove();
          slots.delete(vIdx);
        }
      });

      desired.forEach(function (vIdx) {
        const offset = vIdx - page;
        const itemIndex = ((vIdx % total) + total) % total;
        let card = slots.get(vIdx);

        if (!card) {
          card = document.createElement('div');
          card.className = 'tcar__card';
          const inner = document.createElement('div');
          inner.className = 'tcar__inner';
          inner.innerHTML = templates[itemIndex];
          card.appendChild(inner);
          stage.appendChild(card);
          slots.set(vIdx, card);
          applyVariant(card, offset, { instant: true });
        } else {
          applyVariant(card, offset);
        }
      });

      const active = activeIndex();
      tabs.forEach(function (tab, index) {
        tab.setAttribute('aria-selected', index === active ? 'true' : 'false');
      });
    }

    function resetAutoplay() {
      elapsed = 0;
      lastTime = null;
      const activeTab = tabs[activeIndex()];
      if (activeTab) {
        const fill = activeTab.querySelector('.tcar__tab-fill');
        if (fill) fill.style.transform = 'scaleX(0)';
      }
    }

    function shift(diff) {
      page += diff;
      resetAutoplay();
      render();
    }

    function goToIndex(targetIdx) {
      let diff = targetIdx - activeIndex();
      if (diff > total / 2) diff -= total;
      else if (diff < -total / 2) diff += total;
      shift(diff);
    }

    function tick(timestamp) {
      if (reduceMotion) return;
      if (lastTime === null) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      elapsed += delta;

      if (elapsed >= AUTOPLAY_MS) {
        shift(1);
      } else {
        const fill = tabs[activeIndex()] && tabs[activeIndex()].querySelector('.tcar__tab-fill');
        if (fill) fill.style.transform = 'scaleX(' + Math.min(elapsed / AUTOPLAY_MS, 1) + ')';
      }
      rafId = requestAnimationFrame(tick);
    }

    stage.addEventListener('click', function (e) {
      const card = e.target.closest('.tcar__card');
      if (!card) return;
      const offset = Number(card.dataset.offset || 0);
      if (offset !== 0) shift(offset);
    });

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { goToIndex(index); });
    });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') shift(-1);
      else if (e.key === 'ArrowRight') shift(1);
    });

    window.addEventListener('resize', function () {
      computeTier();
      slots.forEach(function (card, vIdx) {
        applyVariant(card, vIdx - page, { instant: true });
      });
    });

    computeTier();
    render();

    if (!reduceMotion) rafId = requestAnimationFrame(tick);
  }());

  // ── Industries: row slides left as the section scrolls into view ──
  // .ind-track is translated leftward in sync with page scroll (desktop),
  // and the arrows advance that same scroll-linked position — they move
  // the page's scroll position to a target progress along the section,
  // rather than scrolling the row itself, so the two never fight over
  // control of the row's position. Falls back to plain native touch
  // scroll (driven by the arrows via scrollBy) on narrow viewports or
  // reduced-motion.
  (function () {
    const section = document.getElementById('industries');
    const wrap    = document.getElementById('indWrap');
    const track   = wrap ? wrap.querySelector('.ind-track') : null;
    const prev    = document.getElementById('indPrev');
    const next    = document.getElementById('indNext');
    if (!section || !wrap || !track) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canScrub = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' &&
      !reduceMotion && window.innerWidth >= 768;

    function getMax() {
      return Math.max(0, track.scrollWidth - wrap.clientWidth);
    }

    if (canScrub) {
      gsap.registerPlugin(ScrollTrigger);
      wrap.classList.add('ind-wrap--slide');

      const tween = gsap.to(track, {
        x: () => -getMax(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      if (prev && next) {
        // Move the row itself, not the page — driving the click through
        // window/page scroll (as before) could scroll far enough to carry
        // the user into the next section. Directly tweening the track's
        // own transform keeps the click's effect local to the carousel.
        // The scroll-linked scrub above will simply take back over (and
        // override this offset) the next time the user scrolls.
        function nudge(dir) {
          const card = track.querySelector('.ind-card');
          const cardStep = (card ? card.offsetWidth : 260) + 12;
          const max = getMax();
          const currentX = gsap.getProperty(track, 'x');
          const targetX = Math.max(-max, Math.min(0, currentX + dir * -cardStep));
          gsap.to(track, { x: targetX, duration: 0.6, ease: 'power2.out', overwrite: true });
        }
        prev.addEventListener('click', function () { nudge(-1); });
        next.addEventListener('click', function () { nudge(1); });
      }
    } else {
      wrap.classList.add('ind-wrap--scroll');

      if (prev && next) {
        function getStep() {
          const card = wrap.querySelector('.ind-card');
          return card ? card.offsetWidth + 12 : 260;
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
      }
    }
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

  // ── Solutions sticky-scroll walkthrough ─────────────────────────────────
  // Left col (steps) stacks naturally; right col (mockup) is position:sticky.
  // Active step = whichever item's centre is closest to the visual col centre;
  // the matching mockup frame fades in over the others.
  var solnSscrollItems  = document.querySelectorAll('.soln-sscroll__item');
  var solnSscrollVisual = document.querySelector('.soln-sscroll__visual-col');
  var solnSscrollFrames = document.querySelectorAll('.soln-sscroll__visual-frame');

  if (solnSscrollItems.length && solnSscrollVisual) {
    function solnSscrollUpdate() {
      // Active = last item whose top has crossed a fixed line in the viewport.
      // (Not relative to the sticky visual col's own rect — near the end of
      // the section a sticky element gets pushed down by its container's
      // bottom edge, which drags the "centre" away from the last item and
      // leaves it permanently unable to activate.)
      var triggerY  = window.innerHeight * 0.5;
      var activeIdx = 0;
      solnSscrollItems.forEach(function (item, i) {
        var r = item.getBoundingClientRect();
        if (r.top <= triggerY) activeIdx = i;
      });

      solnSscrollItems.forEach(function (item, i) {
        var r      = item.getBoundingClientRect();
        var isPast = r.bottom < 0; // fully scrolled above the viewport
        item.classList.toggle('is-past',   isPast);
        item.classList.toggle('is-active', !isPast && i === activeIdx);
      });

      solnSscrollFrames.forEach(function (frame, i) {
        frame.classList.toggle('is-active', i === activeIdx);
      });
    }

    solnSscrollUpdate();
    window.addEventListener('scroll', solnSscrollUpdate, { passive: true });
    window.addEventListener('resize', solnSscrollUpdate, { passive: true });
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

  // ── Hero Mockup: Booking Flow Animation Loop ──
  (function () {
    var bookingFlow = document.querySelector('.booking-flow');
    if (bookingFlow && typeof gsap !== 'undefined') {
      var cursor = bookingFlow.querySelector('.app-cursor');
      var screenDash = bookingFlow.querySelector('.booking-screen--dashboard');
      var screenCal = bookingFlow.querySelector('.booking-screen--calendar');
      var screenServices = bookingFlow.querySelector('.booking-screen--services');
      var screenTime = bookingFlow.querySelector('.booking-screen--time');
      var screenConfirm = bookingFlow.querySelector('.booking-screen--confirm');

      var navDash = bookingFlow.querySelector('#nav-dash');
      var navCal = bookingFlow.querySelector('#nav-cal');
      var bottomNav = bookingFlow.querySelector('.app-bottom-nav');

      var slots = bookingFlow.querySelectorAll('.slot-chip');
      var therapists = bookingFlow.querySelectorAll('.therapist-chip');
      var items = bookingFlow.querySelectorAll('.booking-item');
      var btnServices = bookingFlow.querySelector('#btn-services');
      var btnTime = bookingFlow.querySelector('#btn-time');
      var notification = bookingFlow.querySelector('.app-notification');

      // Dashboard dynamic values
      var dashTodayRev = bookingFlow.querySelector('#dash-today-rev');
      var dashTodayPaid = bookingFlow.querySelector('#dash-today-paid');
      var dashWtdRev = bookingFlow.querySelector('#dash-wtd-rev');
      var dashWtdPaid = bookingFlow.querySelector('#dash-wtd-paid');
      var dashMtdRev = bookingFlow.querySelector('#dash-mtd-rev');
      var dashMtdPaid = bookingFlow.querySelector('#dash-mtd-paid');
      var utilAvgPct = bookingFlow.querySelector('#util-avg-pct');
      var utilDtnHours = bookingFlow.querySelector('#util-dtn-hours');
      var utilDtnPct = bookingFlow.querySelector('#util-dtn-pct');
      var utilDtnBar = bookingFlow.querySelector('#util-dtn-bar');
      
      // Activity Dynamic
      var activityNewBooking = bookingFlow.querySelector('#activity-new-booking');
      var activityPlaceholder = bookingFlow.querySelector('.dash-activity-placeholder');

      // Create a looping timeline
      var tl = gsap.timeline({ repeat: -1 });
      
      // Helper function for click animation
      function addClickStep(x, y, targetSelector, onSelect) {
        tl.to(cursor, { left: x, top: y, duration: 1.0, ease: 'power2.out' });
        
        if (targetSelector) {
          tl.to(cursor, { scale: 0.8, backgroundColor: 'rgba(48, 46, 45, 0.7)', duration: 0.15 })
            .to(targetSelector, { scale: 0.95, duration: 0.12 }, '-=0.15')
            .call(function() {
              if (onSelect) onSelect();
            })
            .to(cursor, { scale: 1, backgroundColor: 'rgba(48, 46, 45, 0.2)', duration: 0.15 })
            .to(targetSelector, { scale: 1, duration: 0.12 }, '-=0.15');
        } else {
          tl.to(cursor, { scale: 0.8, backgroundColor: 'rgba(48, 46, 45, 0.7)', duration: 0.15 })
            .call(function() {
              if (onSelect) onSelect();
            })
            .to(cursor, { scale: 1, backgroundColor: 'rgba(48, 46, 45, 0.2)', duration: 0.15 });
        }
        
        tl.to({}, { duration: 0.4 }); // delay after click
      }
      
      // Reset function
      function resetFlow() {
        bookingFlow.classList.remove('has-booking');

        screenDash.className = 'booking-screen booking-screen--dashboard active';
        screenCal.className = 'booking-screen booking-screen--calendar';
        screenServices.className = 'booking-screen booking-screen--services';
        screenTime.className = 'booking-screen booking-screen--time';
        screenConfirm.className = 'booking-screen booking-screen--confirm';

        navDash.classList.add('active');
        navCal.classList.remove('active');
        gsap.set(bottomNav, { yPercent: 0, opacity: 1 });

        items.forEach(function(item) { item.classList.remove('selected'); });
        slots.forEach(function(slot) { slot.classList.remove('selected'); });
        therapists.forEach(function(therapist) { therapist.classList.remove('selected'); });
        if (btnServices) btnServices.classList.add('disabled');
        if (btnTime) btnTime.classList.add('disabled');

        gsap.set(screenDash, { x: 0, opacity: 1 });
        gsap.set(screenCal, { x: 30, opacity: 0 });
        gsap.set(screenServices, { x: 30, opacity: 0 });
        gsap.set(screenTime, { x: 30, opacity: 0 });
        gsap.set(screenConfirm, { x: 30, opacity: 0 });

        gsap.set(cursor, { left: '30%', top: '50%', scale: 1, opacity: 1 });
        gsap.set(notification, { top: -130 }); // hide notification

        if (dashTodayRev) dashTodayRev.textContent = '$0';
        if (dashTodayPaid) dashTodayPaid.textContent = '0';
        if (dashWtdRev) dashWtdRev.textContent = '$0';
        if (dashWtdPaid) dashWtdPaid.textContent = '0';
        if (dashMtdRev) dashMtdRev.textContent = '$32.2K';
        if (dashMtdPaid) dashMtdPaid.textContent = '9';
        if (utilAvgPct) utilAvgPct.textContent = '0%';
        if (utilDtnHours) utilDtnHours.textContent = '0m / 12h';
        if (utilDtnPct) utilDtnPct.textContent = '0%';
        if (utilDtnBar) utilDtnBar.style.setProperty('--progress-width', '0%');

        if (activityPlaceholder) activityPlaceholder.style.display = 'block';
        if (activityNewBooking) {
          gsap.set(activityNewBooking, { opacity: 0, y: 10, display: 'none' });
        }
      }

      // Initial Setup
      tl.call(resetFlow);
      tl.to({}, { duration: 1.5 }); // let user look at empty dashboard

      // Step 1: Click "Calendar" tab in bottom navigation
      // navCal position: roughly 50% X, 95% Y
      addClickStep('50%', '95%', '#nav-cal', function() {
        // Tab click effect
      });

      // Transition Dashboard -> Calendar
      tl.to(screenDash, { x: -30, opacity: 0, duration: 0.3 })
        .call(function() {
          screenDash.classList.remove('active');
          screenCal.classList.add('active');
          navDash.classList.remove('active');
          navCal.classList.add('active');
        })
        .to(screenCal, { x: 0, opacity: 1, duration: 0.3 }, '-=0.3')
        .to({}, { duration: 1.0 }); // look at empty calendar

      // Step 2: Click target calendar slot (Emily Carter, 10:30 AM)
      // Emily cell position: roughly 62% X, 55% Y
      addClickStep('62%', '55%', '#cal-slot-emily-1030', function() {
        // Cell clicked
      });

      // Transition Calendar -> Booking Services Screen (drawer style, bottom nav slides down)
      tl.to(screenCal, { x: -30, opacity: 0, duration: 0.3 })
        .to(bottomNav, { yPercent: 100, opacity: 0, duration: 0.3 }, '-=0.3')
        .call(function() {
          screenCal.classList.remove('active');
          screenServices.classList.add('active');
        })
        .to(screenServices, { x: 0, opacity: 1, duration: 0.3 }, '-=0.3')
        .set(cursor, { left: '50%', top: '70%' })
        .to({}, { duration: 0.5 });

      // Step 3: Select Service "Traditional Thai Massage" (position roughly 50% X, 32% Y)
      addClickStep('50%', '32%', '#item-thai', function() {
        var targetItem = bookingFlow.querySelector('#item-thai');
        if (targetItem) targetItem.classList.add('selected');
        if (btnServices) btnServices.classList.remove('disabled');
      });

      // Step 4: Click the bottom "Select Treatment" CTA button (roughly 50% X, 90% Y)
      addClickStep('50%', '90%', '#btn-services', function() {
        // Transitioning
      });

      // Transition Services Screen -> Time / Review Screen
      tl.to(screenServices, { x: -30, opacity: 0, duration: 0.3 })
        .call(function() {
          screenServices.classList.remove('active');
          screenTime.classList.add('active');
        })
        .to(screenTime, { x: 0, opacity: 1, duration: 0.3 }, '-=0.3')
        .to({}, { duration: 0.5 });

      // Step 5: Click the "Confirm Booking" CTA button (roughly 50% X, 90% Y)
      addClickStep('50%', '90%', '#btn-time', function() {
        // Confirmed
      });

      // Transition Time Screen -> Confirmation Screen
      tl.to(screenTime, { x: -30, opacity: 0, duration: 0.3 })
        .call(function() {
          screenTime.classList.remove('active');
          screenConfirm.classList.add('active');
        })
        .to(screenConfirm, { x: 0, opacity: 1, duration: 0.3 }, '-=0.3')
        .to(cursor, { opacity: 0, duration: 0.2 }, '-=0.3'); // Hide cursor

      // iOS Notification Banner slide down & up
      tl.to(notification, { top: 54, duration: 0.6, ease: 'back.out(1.2)' })
        .to({}, { duration: 3.0 }) // hold notification
        .to(notification, { top: -130, duration: 0.4, ease: 'power2.in' });

      // Transition Confirmation -> back to Calendar View (showing the booked slot)
      tl.to(screenConfirm, { opacity: 0, duration: 0.3 })
        .call(function() {
          screenConfirm.classList.remove('active');
          screenCal.classList.add('active');
          bookingFlow.classList.add('has-booking');
        })
        .to(screenCal, { x: 0, opacity: 1, duration: 0.3 })
        .to(bottomNav, { yPercent: 0, opacity: 1, duration: 0.3 }, '-=0.3')
        .to(cursor, { opacity: 1, duration: 0.2 }) // Show cursor again
        .to({}, { duration: 2.5 }); // notice the slot filled

      // Step 6: Click "Dashboard" tab in bottom nav (roughly 10% X, 95% Y)
      addClickStep('10%', '95%', '#nav-dash', function() {
        // Tab changed
      });

      // Transition Calendar -> Dashboard (updated stats!)
      tl.to(screenCal, { x: 30, opacity: 0, duration: 0.3 })
        .call(function() {
          screenCal.classList.remove('active');
          screenDash.classList.add('active');
          navCal.classList.remove('active');
          navDash.classList.add('active');
        })
        .to(screenDash, { x: 0, opacity: 1, duration: 0.3 }, '-=0.3')
        .call(function() {
          // Update Dashboard values
          if (dashTodayRev) dashTodayRev.textContent = '$120';
          if (dashTodayPaid) dashTodayPaid.textContent = '1';
          if (dashWtdRev) dashWtdRev.textContent = '$120';
          if (dashWtdPaid) dashWtdPaid.textContent = '1';
          if (dashMtdRev) dashMtdRev.textContent = '$32.3K';
          if (dashMtdPaid) dashMtdPaid.textContent = '10';
          if (utilAvgPct) utilAvgPct.textContent = '3.3%';
          if (utilDtnHours) utilDtnHours.textContent = '1h / 12h';
          if (utilDtnPct) utilDtnPct.textContent = '8.3%';
          if (utilDtnBar) utilDtnBar.style.setProperty('--progress-width', '8.3%');

          if (activityPlaceholder) activityPlaceholder.style.display = 'none';
          if (activityNewBooking) {
            gsap.set(activityNewBooking, { display: 'flex' });
          }
        })
        .to(activityNewBooking, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        })
        .to({}, { duration: 4.0 }); // hold updated dashboard
    }
  })();

  // ── Stats Number Counter Animation ──────────────────────────────
  (function () {
    const counters = document.querySelectorAll('.fd-proof__num[data-count-target]');
    if (!counters.length) return;

    function parseValue(valStr) {
      const matches = valStr.match(/^([^0-9\.\-]*)([0-9\.]+)([^0-9\.\-]*)$/);
      if (!matches) return { prefix: '', value: parseFloat(valStr) || 0, suffix: '', decimals: 0 };
      
      const numVal = parseFloat(matches[2]);
      const decimals = matches[2].includes('.') ? matches[2].split('.')[1].length : 0;
      
      return {
        prefix: matches[1] || '',
        value: numVal,
        suffix: matches[3] || '',
        decimals: decimals
      };
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          observer.unobserve(el);
          
          const rawTarget = el.dataset.countTarget;
          const parsed = parseValue(rawTarget);
          
          const duration = 2000; // 2 seconds animation
          const start = 0;
          const startTime = performance.now();
          
          el.textContent = parsed.prefix + start.toFixed(parsed.decimals) + parsed.suffix;
          
          function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const ease = progress * (2 - progress);
            
            const current = start + ease * (parsed.value - start);
            el.textContent = parsed.prefix + current.toFixed(parsed.decimals) + parsed.suffix;
            
            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              el.textContent = rawTarget;
            }
          }
          
          requestAnimationFrame(update);
        }
      });
    }, { threshold: 0.15 });

    counters.forEach(function (c) {
      observer.observe(c);
    });
  })();

})();
