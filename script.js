/* ── 1. NAVBAR: scroll + hamburger ──────────────────────────── */
(function () {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.querySelector('.nav-links');

  // Scroll → classe scrolled + aggiusta top del drawer
  function updateScroll() {
    if (!navbar) return;
    const isScrolled = window.scrollY > 40;
    navbar.classList.toggle('scrolled', isScrolled);

    // Pulizia stili inline per evitare conflitti con la navbar fluttuante
    if (navLinks && window.innerWidth > 768) {
      navLinks.style.top    = '';
      navLinks.style.height = '';
    }
  }

  if (navbar) {
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    updateScroll();
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
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    }

    hamburger.addEventListener('click', () => {
      setHamburgerState(!navLinks.classList.contains('open'));
    });

    // Chiudi cliccando un link
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => setHamburgerState(false));
    });

    // Chiudi cliccando fuori
    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        setHamburgerState(false);
      }
    });

    // Chiudi con Escape
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

/* ── 5. RADIAL / ROTATING WHEEL COURSE PICKER ────────────────── */
(function() {
  const courses = [
    { name: 'Danza Classica', url: 'danza-classica.html' },
    { name: 'Contemporaneo', url: 'danza-contemporanea.html' },
    { name: 'Ballo Liscio', url: 'ballo-liscio.html' },
    { name: 'Hip Hop', url: 'hip-hop.html' },
    { name: 'Danze Latine', url: 'danze-latine.html' },
    { name: 'Balli di Gruppo', url: 'balli-di-gruppo.html' },
    { name: 'Break Dance', url: 'break-dance.html' },
    { name: 'Caraibico', url: 'danze-caraibiche.html' },
    { name: 'Corsi Bambini', url: 'corsi-bambini.html' },
    { name: 'Tango Argentino', url: 'tango.html' },
    { name: 'Macumba', url: 'macumba.html' },
    { name: 'Bollywood', url: 'bollywood.html' },
    { name: 'Yoga', url: 'yoga.html' },
    { name: 'Total Body', url: 'total-body.html' }
  ];

  // Controlla il file corrente per segnare il corso attivo
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  // Mostriamo il selettore radiale su tutte le pagine del sito
  const trigger = document.createElement('button');
  trigger.className = 'dc-wheel-trigger';
  trigger.setAttribute('aria-label', 'Scegli il corso');
  trigger.innerHTML = `
    <span class="dc-wheel-trigger-label">Scegli Corso</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      <path d="M2 12h20"></path>
    </svg>
  `;
  document.body.appendChild(trigger);

  // Crea Overlay Modal
  const overlay = document.createElement('div');
  overlay.className = 'dc-wheel-overlay';
  
  // Genera gli elementi della ruota
  const itemCount = courses.length;
  const radius = window.innerWidth <= 580 ? 115 : 220;
  
  let itemsHTML = '';
  courses.forEach((course, i) => {
    const angle = (i * 360) / itemCount;
    const radian = (angle - 90) * Math.PI / 180;
    const x = Math.round(radius * Math.cos(radian));
    const y = Math.round(radius * Math.sin(radian));
    
    const isActive = course.url === currentFile ? ' active' : '';
    itemsHTML += `
      <a href="${course.url}" class="dc-wheel-item${isActive}" style="transform: translate(${x}px, ${y}px)">
        <span class="dc-wheel-item-inner">${course.name}</span>
      </a>
    `;
  });

  overlay.innerHTML = `
    <button class="dc-wheel-close" aria-label="Chiudi selettore">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="dc-wheel-wrapper">
      <h3 class="dc-wheel-mobile-title">Scegli il Corso</h3>
      <div class="dc-wheel-dial">
        ${itemsHTML}
      </div>
      <div class="dc-wheel-center">
        <span class="dc-wheel-center-logo">BigDance</span>
        <span class="dc-wheel-center-sub">Scegli Corso</span>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Interazioni
  const dial = overlay.querySelector('.dc-wheel-dial');
  let rotationAngle = 0;
  
  trigger.addEventListener('click', () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    rotationAngle += 360;
    dial.style.transform = `rotate(${rotationAngle}deg)`;
    
    // Contro-rotazione per mantenere il testo orizzontale e leggibile
    overlay.querySelectorAll('.dc-wheel-item').forEach(item => {
      const transformStr = item.style.transform;
      const translateMatch = transformStr.match(/translate\(([^)]+)\)/);
      const translatePart = translateMatch ? translateMatch[0] : '';
      item.style.transform = `${translatePart} rotate(${-rotationAngle}deg)`;
    });
  });

  const closeOverlay = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  overlay.querySelector('.dc-wheel-close').addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });
})();

