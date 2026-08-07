// Mobile nav toggle
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    nav.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll-reveal animation for section blocks and cards.
const revealTargets = document.querySelectorAll(
  '.about, .services__grid > *, .pricing__grid > *, .gallery > *, .faq__list > *, .testimonials__grid > *, .booking'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('is-visible'));
}

// Gallery lightbox
const galleryItems = Array.from(document.querySelectorAll('.gallery__item'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let lightboxIndex = 0;

function openLightbox(index) {
  lightboxIndex = index;
  const item = galleryItems[lightboxIndex];
  lightboxImg.src = item.dataset.full;
  lightboxImg.alt = item.dataset.caption || '';
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

function showLightboxOffset(offset) {
  lightboxIndex = (lightboxIndex + offset + galleryItems.length) % galleryItems.length;
  const item = galleryItems[lightboxIndex];
  lightboxImg.src = item.dataset.full;
  lightboxImg.alt = item.dataset.caption || '';
}

if (galleryItems.length && lightbox) {
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => showLightboxOffset(-1));
  lightboxNext.addEventListener('click', () => showLightboxOffset(1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightboxOffset(-1);
    if (e.key === 'ArrowRight') showLightboxOffset(1);
  });
}

// Booking form -> prefilled WhatsApp message (no backend required)
const bookingForm = document.getElementById('bookingForm');
const WHATSAPP_NUMBER = '000000000000';

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!bookingForm.reportValidity()) return;

    const data = new FormData(bookingForm);
    const nombre = data.get('nombre');
    const telefono = data.get('telefono');
    const servicio = data.get('servicio');
    const fecha = data.get('fecha');
    const mensaje = data.get('mensaje');

    const lines = [
      `Hola Angie, soy ${nombre}.`,
      `Me interesa el servicio: ${servicio}.`,
      fecha ? `Fecha del evento: ${fecha}.` : null,
      `Mi teléfono: ${telefono}.`,
      mensaje ? `Mensaje: ${mensaje}` : null,
    ].filter(Boolean);

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  });
}
