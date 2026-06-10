/* ══════════════════════════════════════════════════════════════════
   ABARROTES ALMIUX — navbar.js
   Comportamiento del navbar: scroll hide/show, hamburguesa, link activo.
   Requiere: utils.js
══════════════════════════════════════════════════════════════════ */

function iniciarNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (!navbar) return;

let ultimoScroll = window.scrollY;
window.addEventListener('scroll', () => {
    const scrollActual = window.scrollY;
    // Ocultar al bajar
    if (scrollActual > ultimoScroll && scrollActual > 100) {
        navbar.classList.add('navbar-hidden');
    }
    // Mostrar al subir aunque sea unos píxeles
    else {

        navbar.classList.remove('navbar-hidden');
    }

    ultimoScroll = scrollActual;
});

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

function marcarLinkActivo() {
  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(paginaActual) && !link.classList.contains('nav-cta')) {
      link.classList.add('active');
    }
  });
}
