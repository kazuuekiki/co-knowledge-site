/* ================================================
   Co-knowledge — script.js
   Pure vanilla JS / No external libraries
   ================================================ */

'use strict';

/* ---- Loader ---- */
(function initLoader() {
  document.documentElement.style.overflow = 'hidden';

  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('out');
      document.documentElement.style.overflow = '';

      loader.addEventListener('transitionend', () => {
        loader.remove();
      }, { once: true });
    }, 1600);
  });
}());


/* ---- Custom Cursor ---- */
(function initCursor() {
  const dot      = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!dot || !follower) return;

  // Detect touch-only device — bail out
  if (window.matchMedia('(hover: none)').matches) return;

  let mx = -200, my = -200;
  let fx = -200, fy = -200;
  let rafId;

  // Move dot instantly
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    dot.style.opacity = '1';
    follower.style.opacity = '1';
  }, { passive: true });

  // Smooth follower via RAF
  function followLoop() {
    fx += (mx - fx) * 0.11;
    fy += (my - fy) * 0.11;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    rafId = requestAnimationFrame(followLoop);
  }
  rafId = requestAnimationFrame(followLoop);

  // Hover states for links / buttons
  const interactives = document.querySelectorAll('a, button');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('is-hover');
      follower.classList.add('is-hover');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('is-hover');
      follower.classList.remove('is-hover');
    });
  });
}());


/* ---- Navigation — transparent → frosted glass ---- */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  function update() {
    nav.classList.toggle('is-solid', window.scrollY > 60);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}());


/* ---- Scroll Reveal via IntersectionObserver ---- */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);

      setTimeout(() => {
        el.classList.add('in');
      }, delay);

      observer.unobserve(el);
    });
  }, {
    threshold:  0.1,
    rootMargin: '0px 0px -48px 0px'
  });

  items.forEach(el => observer.observe(el));
}());


/* ---- Word Field — スクロール視差 ---- */
(function initWordField() {
  const words = document.querySelectorAll('.wf');
  if (!words.length) return;

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    words.forEach(word => {
      const speed  = parseFloat(word.dataset.speed || 0.06);
      const offset = -(scrollY * speed);
      // CSS individual `translate` property composes with the 3D animation transform
      word.style.translate = `0 ${offset.toFixed(1)}px`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
}());


/* ---- ADGNO Watermark Parallax ---- */
(function initParallax() {
  const watermark = document.querySelector('.adgno-watermark');
  if (!watermark) return;

  const section = watermark.parentElement;

  function update() {
    const rect = section.getBoundingClientRect();
    const vh   = window.innerHeight;

    // Only compute when section is in view
    if (rect.bottom < 0 || rect.top > vh) return;

    // progress: 0 at bottom of viewport → 1 at top of viewport
    const progress = (vh - rect.top) / (vh + rect.height);
    const offset   = (progress - 0.5) * 70; // ±35px vertical drift

    watermark.style.transform = `translateY(${offset.toFixed(2)}px)`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}());


/* ---- Hero section subtle background movement on scroll ---- */
(function initHeroBg() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  function update() {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;

    // Very subtle — moves slower than scroll
    const offset = scrollY * 0.18;
    hero.style.backgroundPositionY = `${offset}px`;
  }

  window.addEventListener('scroll', update, { passive: true });
}());


/* ---- Smooth anchor scroll ---- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const hash = a.getAttribute('href');

      if (hash === '#' || hash === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();

      // Offset for fixed nav height
      const navH   = document.getElementById('nav')?.offsetHeight || 0;
      const targetY = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
}());
