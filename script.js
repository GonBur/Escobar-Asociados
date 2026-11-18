/**
 * ESCOBAR & ASOCIADOS — JAVASCRIPT INTERACTIVO Y ANIMACIONES (ES6+)
 * - Preloader animado + Barra de progreso de lectura
 * - Efecto máquina de escribir (Typewriter) en el titular principal
 * - Inclinación 3D magnética (Tilt JS) en tarjetas de servicios y valores
 * - Scroll Reveal con IntersectionObserver
 * - Enlace directo a WhatsApp (+51 963 046 141) desde los formularios
 * - Galería filtrable con visor Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '51963046141';

  /* ------------------------------------------------------------------------
     1. PRELOADER Y BARRA DE PROGRESO DE LECTURA
     ------------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('is-hidden'), 450);
  }

  const scrollProgress = document.getElementById('scroll-progress');
  const header = document.getElementById('site-header');

  window.addEventListener(
    'scroll',
    () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      if (scrollProgress) scrollProgress.style.width = `${pct}%`;
      header?.classList.toggle('is-scrolled', scrollTop > 20);
    },
    { passive: true }
  );

  /* ------------------------------------------------------------------------
     2. MENÚ MÓVIL Y AÑO DINÁMICO
     ------------------------------------------------------------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const yearSpan = document.getElementById('current-year');

  if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    primaryNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. EFECTO TYPEWRITER DINÁMICO EN HERO
     ------------------------------------------------------------------------ */
  const typewriterEl = document.querySelector('.js-typewriter');
  if (typewriterEl) {
    let words = ['expertos de confianza', 'aliados estratégicos', 'total seguridad fiscal'];
    try {
      words = JSON.parse(typewriterEl.dataset.words || '[]');
    } catch {
      /* mantiene arreglo por defecto */
    }

    let wordIdx = 0;
    let charIdx = words[0].length;
    let isDeleting = true;

    const tickTypewriter = () => {
      const currentWord = words[wordIdx];
      if (isDeleting) {
        charIdx--;
        typewriterEl.textContent = currentWord.substring(0, charIdx);
      } else {
        charIdx++;
        typewriterEl.textContent = currentWord.substring(0, charIdx);
      }

      let delay = isDeleting ? 45 : 85;

      if (!isDeleting && charIdx === currentWord.length) {
        isDeleting = true;
        delay = 2200;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        delay = 350;
      }

      setTimeout(tickTypewriter, delay);
    };

    setTimeout(tickTypewriter, 2200);
  }

  /* ------------------------------------------------------------------------
     4. SCROLL REVEAL (INTERSECTION OBSERVER)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  /* ------------------------------------------------------------------------
     5. INCLINACIÓN 3D MAGNÉTICA EN TARJETAS (.js-tilt)
     ------------------------------------------------------------------------ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    document.querySelectorAll('.js-tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. ONBOARDING INTERACTIVO (4 PASOS)
     ------------------------------------------------------------------------ */
  const stepCards = document.querySelectorAll('.step-card');
  stepCards.forEach((card) => {
    card.addEventListener('click', () => {
      stepCards.forEach((c) => c.classList.remove('is-active'));
      card.classList.add('is-active');
    });
  });

  /* ------------------------------------------------------------------------
     7. CALCULADORA REFERENCIAL DE IGV (18%)
     ------------------------------------------------------------------------ */
  const inputVentas = document.getElementById('calc-ventas');
  const inputCompras = document.getElementById('calc-compras');
  const outIgvVentas = document.getElementById('res-igv-ventas');
  const outIgvCompras = document.getElementById('res-igv-compras');
  const outIgvPagar = document.getElementById('res-igv-pagar');

  const formatPEN = (n) =>
    `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const updateIgv = () => {
    if (!inputVentas || !inputCompras) return;
    const ventas = Math.max(0, Number(inputVentas.value) || 0);
    const compras = Math.max(0, Number(inputCompras.value) || 0);
    const igvV = ventas - ventas / 1.18;
    const igvC = compras - compras / 1.18;
    const diff = igvV - igvC;

    if (outIgvVentas) outIgvVentas.textContent = formatPEN(igvV);
    if (outIgvCompras) outIgvCompras.textContent = formatPEN(igvC);
    if (outIgvPagar) {
      outIgvPagar.textContent =
        diff >= 0 ? formatPEN(diff) : `S/ 0.00 (Saldo a favor: ${formatPEN(Math.abs(diff))})`;
    }
  };

  inputVentas?.addEventListener('input', updateIgv);
  inputCompras?.addEventListener('input', updateIgv);
  updateIgv();

  /* ------------------------------------------------------------------------
     8. GALERÍA FILTRABLE Y LIGHTBOX
     ------------------------------------------------------------------------ */
  const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  let activeIndex = 0;

  galleryFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.galleryFilter;
      galleryFilterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      galleryCards.forEach((card) => {
        const match = cat === 'all' || card.dataset.galleryCat === cat;
        card.classList.toggle('is-hidden', !match);
      });
    });
  });

  const getVisibleCards = () => galleryCards.filter((c) => !c.classList.contains('is-hidden'));

  const openLightbox = (index) => {
    const visible = getVisibleCards();
    if (!visible.length || !lightbox || !lightboxImg || !lightboxCaption) return;
    activeIndex = (index + visible.length) % visible.length;
    const card = visible[activeIndex];
    lightboxImg.src = card.dataset.full || '';
    lightboxImg.alt = card.querySelector('img')?.alt || '';
    lightboxCaption.textContent = card.dataset.caption || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  galleryCards.forEach((card) => {
    card.addEventListener('click', () => {
      const idx = getVisibleCards().indexOf(card);
      openLightbox(idx >= 0 ? idx : 0);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxPrev?.addEventListener('click', () => openLightbox(activeIndex - 1));
  lightboxNext?.addEventListener('click', () => openLightbox(activeIndex + 1));
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(activeIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(activeIndex + 1);
  });

  /* ------------------------------------------------------------------------
     9. PRESELECCIÓN DE SERVICIOS Y ENVÍO DIRECTO POR WHATSAPP
     ------------------------------------------------------------------------ */
  const openWhatsApp = (nombre, telefono, servicio, mensaje, correo = '') => {
    const lines = [
      'Hola *Escobar & Asociados*, solicito una consulta gratuita:',
      `• *Nombre / Empresa:* ${nombre}`,
      `• *Teléfono / WhatsApp:* ${telefono}`,
      correo ? `• *Correo:* ${correo}` : '',
      `• *Servicio de interés:* ${servicio}`,
      mensaje ? `• *Consulta:* ${mensaje}` : ''
    ].filter(Boolean);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Botones "Solicitar servicio" en tarjetas
  document.querySelectorAll('.js-select-service').forEach((btn) => {
    btn.addEventListener('click', () => {
      const serviceName = btn.dataset.service || '';
      const serviceSelect = document.getElementById('servicio');
      if (serviceSelect) serviceSelect.value = serviceName;
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => document.getElementById('nombre')?.focus(), 450);
    });
  });

  // Formulario rápido en Hero
  const quickForm = document.getElementById('quick-whatsapp-form');
  quickForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('q-nombre').value.trim();
    const telefono = document.getElementById('q-telefono').value.trim();
    const servicio = document.getElementById('q-servicio').value.trim();
    const mensaje = document.getElementById('q-mensaje').value.trim();
    if (!nombre || !telefono || !servicio) return;
    openWhatsApp(nombre, telefono, servicio, mensaje);
  });

  // Formulario principal en Contacto
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre');
    const telefono = document.getElementById('telefono');
    const correo = document.getElementById('correo');
    const servicio = document.getElementById('servicio');
    const mensaje = document.getElementById('mensaje');

    const rules = [
      { el: nombre, err: 'error-nombre', ok: nombre.value.trim().length >= 3, msg: 'Ingresa tu nombre completo.' },
      { el: telefono, err: 'error-telefono', ok: /^[+\d\s()-]{6,20}$/.test(telefono.value.trim()), msg: 'Ingresa un número de WhatsApp o teléfono válido.' },
      { el: correo, err: 'error-correo', ok: !correo.value.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value.trim()), msg: 'Ingresa un correo válido.' },
      { el: servicio, err: 'error-servicio', ok: servicio.value.trim() !== '', msg: 'Selecciona el servicio de interés.' },
      { el: mensaje, err: 'error-mensaje', ok: mensaje.value.trim().length >= 8, msg: 'Cuéntanos brevemente tu consulta.' }
    ];

    let valid = true;
    rules.forEach(({ el, err, ok, msg }) => {
      const node = document.getElementById(err);
      el.setAttribute('aria-invalid', String(!ok));
      if (node) node.textContent = ok ? '' : msg;
      if (!ok) valid = false;
    });

    if (!valid) return;

    openWhatsApp(
      nombre.value.trim(),
      telefono.value.trim(),
      servicio.value,
      mensaje.value.trim(),
      correo.value.trim()
    );

    if (formFeedback) {
      formFeedback.hidden = false;
      formFeedback.innerHTML = `
        <strong>¡Listo, ${nombre.value.trim()}!</strong> Abrimos WhatsApp con tu consulta lista para enviar. También puedes escribirnos por correo a
        <a href="mailto:contabilidad@escobarasociados.net" style="text-decoration:underline;font-weight:700;">contabilidad@escobarasociados.net</a>.
      `;
    }
  });
});