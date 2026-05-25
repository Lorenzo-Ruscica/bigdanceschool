/* ═══════════════════════════════════════════════════════════════
   BigDance School – script.js
   Tutti i blocchi sono opzionali: se un elemento non esiste sulla
   pagina corrente il blocco viene saltato senza errori.
═══════════════════════════════════════════════════════════════ */

/* ── 1. NAVBAR: scroll + hamburger ──────────────────────────── */
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  // Scroll → classe scrolled
  if (navbar) {
    function updateScroll() {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll(); // stato iniziale corretto (es. pagine con scrolled fisso)
  }

  // Hamburger apri/chiudi
  if (hamburger && navLinks) {
    function setHamburgerState(open) {
      const spans = hamburger.querySelectorAll('span');
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        document.body.style.overflow = 'hidden'; // blocca scroll dietro menu
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
        document.body.style.overflow = '';
      }
    }

    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      setHamburgerState(!isOpen);
    });

    // Chiudi cliccando un link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => setHamburgerState(false));
    });

    // Chiudi cliccando fuori dal menu
    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        setHamburgerState(false);
      }
    });

    // Chiudi premendo Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        setHamburgerState(false);
        hamburger.focus();
      }
    });
  }
})();


/* ── 2. HERO SLIDER (solo index.html) ───────────────────────── */
(function () {
  const slider  = document.getElementById('slider');
  if (!slider) return; // non siamo su index.html

  const slides  = slider.querySelectorAll('.slide');
  const dots    = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (!slides.length) return;

  let current   = 0;
  let autoTimer = null;
  const INTERVAL = 5000;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index));
      startAuto();
    });
  });

  startAuto();
})();


/* ── 3. CONTATORI ANIMATI (solo index.html) ─────────────────── */
(function () {
  const statNums = document.querySelectorAll('.stat-num');
  if (!statNums.length) return;

  function animateCount(el) {
    const target   = parseInt(el.dataset.target);
    const duration = 2000;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString('it-IT');
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statsObserver.observe(el));
})();


/* ── 4. ANIMAZIONI SCROLL (solo index.html) ─────────────────── */
(function () {
  const targets = document.querySelectorAll('.stat-card, .about-text-col, .about-image-wrapper');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });
})();
