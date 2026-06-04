/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ABARROTES ALMIUX — main.js                                   ║
 * ║  Archivo de interactividad principal                           ║
 * ║                                                                ║
 * ║  CONTENIDO:                                                    ║
 * ║   1. Navbar: scroll hide/show + menú hamburguesa              ║
 * ║   2. Links activos según la página actual                      ║
 * ║   3. Animaciones de entrada al hacer scroll                    ║
 * ║   4. Contador animado en la Stats Strip                        ║
 * ║   5. Filtros de productos (productos.html)                     ║
 * ║   6. Búsqueda en tiempo real (productos.html)                  ║
 * ║   7. Carrito flotante (productos.html)                         ║
 * ║   8. Categorías en index.html → link a productos con filtro    ║
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * BUENAS PRÁCTICAS USADAS:
 * · Cada función está envuelta en un bloque IIFE (() => { ... })()
 *   para que sus variables no contaminen el espacio global.
 * · Usamos "DOMContentLoaded" para asegurarnos de que el HTML esté
 *   completamente cargado antes de ejecutar cualquier código.
 * · Cada sección tiene un guard "if (!elemento) return" para que
 *   no falle si el elemento no existe en la página actual.
 */

// ══════════════════════════════════════════════════════════════════
// PUNTO DE ENTRADA — se ejecuta cuando el HTML termina de cargar
// ══════════════════════════════════════════════════════════════════

const PRODUCTOS = [
  {
    nombre: 'Hola mundo',
    precio: 42.00,
    cat: 'lacteos',
    catLabel: 'Lácteos',
    desc: 'Yogurt cremoso sin azúcar añadida, rico en proteínas.',
    icono: '🍦',
  },
];
 
try {
  const adminProds = JSON.parse(localStorage.getItem('almiux_productos_admin')) || [];
  adminProds.forEach(p => PRODUCTOS.push(p));
} catch (e) {}
 
 
/* ══════════════════════════════════════════════════════════════════
   RENDERIZAR PRODUCTOS
══════════════════════════════════════════════════════════════════ */
 
function renderizarProductos() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
 
  PRODUCTOS.forEach(p => {
    const imgHTML = p.imagen
      ? `<img src="${p.imagen}" alt="${p.nombre}">`
      : `<span class="prod-icon">${p.icono}</span>`;
 
    const badgeHTML = p.badge
      ? `<span class="prod-badge">${p.badge}</span>`
      : '';
 
    const precioOrigHTML = p.precioOriginal
      ? `<span class="prod-original">$${p.precioOriginal.toFixed(2)}</span>`
      : '';
 
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.cat = p.cat;
    if (p.oferta) card.dataset.oferta = 'true';
 
    card.innerHTML = `
      <div class="prod-img-wrap">
        ${imgHTML}
        ${badgeHTML}
      </div>
      <div class="prod-info">
        <p class="prod-cat-tag">${p.catLabel}</p>
        <h3 class="prod-name">${p.nombre}</h3>
        <p class="prod-desc">${p.desc}</p>
        <div class="prod-prices">
          <span class="prod-price">$${p.precio.toFixed(2)}</span>
          ${precioOrigHTML}
        </div>
      </div>
      <button class="btn-agregar" onclick="agregarAlCarrito(this, '${p.nombre}')">
        + Agregar
      </button>
    `;
 
    grid.appendChild(card);
  });
}
 
 
/* ══════════════════════════════════════════════════════════════════
   DOM READY
══════════════════════════════════════════════════════════════════ */
 
document.addEventListener('DOMContentLoaded', () => {
 
  iniciarCategoriasHome();
 
  const basePath = obtenerBasePath().replace('/', '');
 
  // ── Cargar Navbar ────────────────────────────────────────────────
  cargarFragmento(
    `${basePath}/utils/navbar/navbar.html`,
    'navbar-container',
    () => {
      arreglarLinks();
      arreglarImagenes();
      arreglarBotones();
      iniciarNavbar();
      marcarLinkActivo();
 
      // Contadores y animaciones DESPUÉS de que el navbar cargó
      iniciarContadores();
      iniciarAnimacionesScroll();
 
      // Menú usuario
      const userBtn  = document.getElementById('userBtn');
      const userMenu = document.getElementById('userMenu');
 
      if (userBtn && userMenu) {
        userBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const abierto = userMenu.style.display === 'block';
          userMenu.style.display = abierto ? 'none' : 'block';
          userMenu.setAttribute('aria-hidden', String(abierto));
        });
 
        document.addEventListener('click', (e) => {
          if (!userMenu.contains(e.target) && !userBtn.contains(e.target)) {
            userMenu.style.display = 'none';
            userMenu.setAttribute('aria-hidden', 'true');
          }
        });
      }
    }
  );
 
  // ── Cargar Footer ────────────────────────────────────────────────
  cargarFragmento(
    `${basePath}/utils/footer/footer.html`,
    'footer-container',
    () => {
      arreglarLinks();
      arreglarImagenes();
    }
  );
 
  // ── Productos ────────────────────────────────────────────────────
  if (document.getElementById('productsGrid')) {
    iniciarFiltros();
    iniciarBusqueda();
    revisarFiltroURL();
    renderizarProductos();
  }
 
});
 
 
/* ══════════════════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════════════════ */
 
function iniciarNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
 
  if (!navbar) return;
 
  let ultimoScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollActual = window.scrollY;
    navbar.style.transform = (scrollActual > ultimoScroll && scrollActual > 80)
      ? 'translateY(-100%)'
      : 'translateY(0)';
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
 
 
/* ══════════════════════════════════════════════════════════════════
   LINK ACTIVO
══════════════════════════════════════════════════════════════════ */
 
function marcarLinkActivo() {
  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes(paginaActual) && !link.classList.contains('nav-cta')) {
      link.classList.add('active');
    }
  });
}
 
 
/* ══════════════════════════════════════════════════════════════════
   CARGAR FRAGMENTOS HTML
══════════════════════════════════════════════════════════════════ */
 
function cargarFragmento(url, elementoId, callback) {
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar ' + url);
      return response.text();
    })
    .then(html => {
      const elemento = document.getElementById(elementoId);
      if (!elemento) return;
      elemento.innerHTML = html;
      if (callback) callback();
    })
    .catch(error => console.error('Error:', error));
}
 
 
/* ══════════════════════════════════════════════════════════════════
   DETECTAR BASE PATH
══════════════════════════════════════════════════════════════════ */
 
function obtenerBasePath() {
  return window.location.pathname.includes('/usuario/') ? '../' : './';
}
 
 
/* ══════════════════════════════════════════════════════════════════
   ARREGLAR LINKS / IMÁGENES / BOTONES
══════════════════════════════════════════════════════════════════ */
 
function arreglarLinks() {
  const base = obtenerBasePath();
  document.querySelectorAll('[data-link]').forEach(link => {
    link.href = `${base}${link.dataset.link}`;
  });
}
 
function arreglarImagenes() {
  const base = obtenerBasePath();
  document.querySelectorAll('[data-img]').forEach(img => {
    img.src = `${base}${img.dataset.img}`;
  });
}
 
function arreglarBotones() {
  const base = obtenerBasePath();
  document.querySelectorAll('[data-go]').forEach(btn => {
    btn.onclick = () => { window.location.href = `${base}${btn.dataset.go}`; };
  });
}
 
 
/* ══════════════════════════════════════════════════════════════════
   3. ANIMACIONES DE ENTRADA AL HACER SCROLL
══════════════════════════════════════════════════════════════════ */
 
function iniciarAnimacionesScroll() {
  const selectores = [
    '.cat-card',
    '.product-card',
    '.valor-card',
    '.miembro-card',
    '.dato-card',
    '.promo',
    '.hero-text',
    '.page-hero-content',
  ];
 
  const elementos = document.querySelectorAll(selectores.join(','));
  if (elementos.length === 0) return;
 
  elementos.forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, indice) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, indice * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
 
  elementos.forEach(el => observer.observe(el));
}
 
 
/* ══════════════════════════════════════════════════════════════════
   4. CONTADOR ANIMADO (Stats Strip)
══════════════════════════════════════════════════════════════════ */
 
function iniciarContadores() {
  const strip = document.querySelector('.stats-strip');
  if (!strip) return;
 
  // Flag para que no corra dos veces
  if (strip.dataset.contadorIniciado) return;
  strip.dataset.contadorIniciado = 'true';
 
  function animarContador(el, destino, prefijo = '', sufijo = '', duracion = 1200) {
    // Evitar doble animación en el mismo elemento
    if (el.dataset.animando) return;
    el.dataset.animando = 'true';
 
    let inicio = null;
    function paso(timestamp) {
      if (!inicio) inicio = timestamp;
      const progreso  = Math.min((timestamp - inicio) / duracion, 1);
      const suavizado = 1 - Math.pow(1 - progreso, 3);
      el.textContent  = prefijo + Math.floor(suavizado * destino).toLocaleString('es-MX') + sufijo;
      if (progreso < 1) {
        requestAnimationFrame(paso);
      } else {
        el.textContent = prefijo + destino.toLocaleString('es-MX') + sufijo;
        delete el.dataset.animando;
      }
    }
    requestAnimationFrame(paso);
  }
 
  function correrContadores() {
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
      const destino = parseInt(el.dataset.target, 10);
      const prefijo = el.dataset.prefix || '';
      const sufijo  = el.dataset.suffix || '';
      if (!isNaN(destino)) animarContador(el, destino, prefijo, sufijo);
    });
  }
 
  // Usar IntersectionObserver — si el strip ya es visible, disparar de inmediato
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    correrContadores();
    observer.unobserve(strip);
  }, { threshold: 0 });
 
  observer.observe(strip);
 
  // Seguro: si el strip ya está en pantalla el observer puede no disparar en algunos browsers
  const rect = strip.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    correrContadores();
    observer.unobserve(strip);
  }
}
 
 
/* ══════════════════════════════════════════════════════════════════
   5. FILTROS DE PRODUCTOS
══════════════════════════════════════════════════════════════════ */
 
function iniciarFiltros() {
  const botonesFiltro = document.querySelectorAll('.filter-btn');
  if (botonesFiltro.length === 0) return;
 
  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
      botonesFiltro.forEach(b => b.classList.remove('filter-active'));
      boton.classList.add('filter-active');
      aplicarFiltro(boton.dataset.filter);
    });
  });
}
 
function aplicarFiltro(filtro) {
  const tarjetas      = document.querySelectorAll('.product-card');
  const contadorTexto = document.getElementById('resultsCount');
  const noResultados  = document.getElementById('noResults');
  let visibles = 0;
 
  tarjetas.forEach(tarjeta => {
    let mostrar = false;
    if (filtro === 'all') {
      mostrar = true;
    } else if (filtro === 'ofertas') {
      mostrar = tarjeta.dataset.oferta === 'true';
    } else {
      mostrar = tarjeta.dataset.cat.split(' ').includes(filtro);
    }
    tarjeta.classList.toggle('hidden', !mostrar);
    if (mostrar) visibles++;
  });
 
  if (contadorTexto) {
    contadorTexto.textContent = filtro === 'all'
      ? 'Mostrando todos los productos'
      : `${visibles} producto${visibles !== 1 ? 's' : ''} encontrado${visibles !== 1 ? 's' : ''}`;
  }
 
  if (noResultados) noResultados.style.display = visibles === 0 ? 'block' : 'none';
}
 
function resetFiltros() {
  const botonTodos = document.querySelector('.filter-btn[data-filter="all"]');
  if (botonTodos) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-active'));
    botonTodos.classList.add('filter-active');
  }
  aplicarFiltro('all');
}
 
 
/* ══════════════════════════════════════════════════════════════════
   6. BÚSQUEDA EN TIEMPO REAL
══════════════════════════════════════════════════════════════════ */
 
function iniciarBusqueda() {
  const inputBusqueda = document.getElementById('searchInput');
  if (!inputBusqueda) return;
 
  inputBusqueda.addEventListener('input', () => {
    const termino      = inputBusqueda.value.toLowerCase().trim();
    const tarjetas     = document.querySelectorAll('.product-card');
    const noResultados = document.getElementById('noResults');
    const contadorTexto = document.getElementById('resultsCount');
 
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-active'));
    const botonTodos = document.querySelector('.filter-btn[data-filter="all"]');
    if (botonTodos) botonTodos.classList.add('filter-active');
 
    let visibles = 0;
    tarjetas.forEach(tarjeta => {
      const nombre  = tarjeta.querySelector('.prod-name')?.textContent.toLowerCase()    || '';
      const desc    = tarjeta.querySelector('.prod-desc')?.textContent.toLowerCase()    || '';
      const cat     = tarjeta.querySelector('.prod-cat-tag')?.textContent.toLowerCase() || '';
      const coincide = nombre.includes(termino) || desc.includes(termino) || cat.includes(termino);
      tarjeta.classList.toggle('hidden', !coincide && termino !== '');
      if (coincide || termino === '') visibles++;
    });
 
    if (contadorTexto) {
      contadorTexto.textContent = termino
        ? `${visibles} resultado${visibles !== 1 ? 's' : ''} para "${termino}"`
        : 'Mostrando todos los productos';
    }
    if (noResultados) noResultados.style.display = visibles === 0 ? 'block' : 'none';
  });
}
 
 
/* ══════════════════════════════════════════════════════════════════
   7. CARRITO FLOTANTE
══════════════════════════════════════════════════════════════════ */
 
let conteoCarrito = 0;
 
function agregarAlCarrito(boton, nombre) {
  const carritoFlotante = document.getElementById('carritoFlotante');
  const carritoCount    = document.getElementById('carritoCount');
 
  conteoCarrito++;
  if (carritoCount)    carritoCount.textContent  = conteoCarrito;
  if (carritoFlotante) carritoFlotante.style.display = 'flex';
 
  const textoOriginal = boton.textContent;
  boton.textContent = '✓ Agregado';
  boton.classList.add('agregado');
  boton.disabled = true;
 
  setTimeout(() => {
    boton.textContent = textoOriginal;
    boton.classList.remove('agregado');
    boton.disabled = false;
  }, 1500);
 
  console.log(`Producto agregado: ${nombre} | Total en carrito: ${conteoCarrito}`);
}
 
function cerrarCarrito() {
  const carritoFlotante = document.getElementById('carritoFlotante');
  if (carritoFlotante) carritoFlotante.style.display = 'none';
}
 
 
/* ══════════════════════════════════════════════════════════════════
   8. CATEGORÍAS HOME → PRODUCTOS CON FILTRO
══════════════════════════════════════════════════════════════════ */
 
function iniciarCategoriasHome() {
  const tarjetasCat = document.querySelectorAll('.cat-card[data-cat]');
  if (tarjetasCat.length === 0) return;
 
  tarjetasCat.forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
      window.location.href = `productos.html?filtro=${tarjeta.dataset.cat}`;
    });
  });
}
 
function revisarFiltroURL() {
  const filtro = new URLSearchParams(window.location.search).get('filtro');
  if (!filtro) return;
 
  const botonFiltro = document.querySelector(`.filter-btn[data-filter="${filtro}"]`);
  if (botonFiltro) {
    botonFiltro.click();
    setTimeout(() => {
      document.getElementById('productsGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  }
}
 
 
/* ══════════════════════════════════════════════════════════════════
   CARGAR CONTACTO (nosotros.html)
══════════════════════════════════════════════════════════════════ */
 
fetch('contacto.html')
  .then(res => res.text())
  .then(data => {
    const contenedor = document.getElementById('contacto-container');
    if (contenedor) contenedor.innerHTML = data;
  })
  .catch(err => console.error(err));
 
 
/* ══════════════════════════════════════════════════════════════════
   FORMULARIO DE REGISTRO (registro.html)
══════════════════════════════════════════════════════════════════ */
 
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  if (!form) return; // Solo corre en registro.html
 
  const alertaError = document.getElementById('alertaError');
  const alertaExito = document.getElementById('alertaExito');
 
  if (alertaError) alertaError.style.display = 'none';
  if (alertaExito) alertaExito.style.display = 'none';
 
  function validarNombres() {
    const nombres = document.getElementById('nombres');
    const error   = document.getElementById('errorNombres');
    if (nombres.value.trim() === '') {
      error.textContent = 'El nombre es obligatorio.';
      error.style.display = 'block';
      return false;
    }
    error.style.display = 'none';
    return true;
  }
 
  function validarApellidos() {
    const apellidos = document.getElementById('apellidos');
    const error     = document.getElementById('errorApellidos');
    if (apellidos.value.trim() === '') {
      error.textContent = 'Los apellidos son obligatorios.';
      error.style.display = 'block';
      return false;
    }
    error.style.display = 'none';
    return true;
  }
 
  function validarEmail() {
    const email = document.getElementById('email');
    const error = document.getElementById('errorEmail');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email.value)) {
      error.textContent = 'Correo inválido.';
      error.style.display = 'block';
      return false;
    }
    error.style.display = 'none';
    return true;
  }
 
  function validarTelefono() {
    const tel   = document.getElementById('telefono');
    const error = document.getElementById('errorTelefono');
    if (!/^[0-9]{10}$/.test(tel.value)) {
      error.textContent = 'Teléfono inválido (10 dígitos).';
      error.style.display = 'block';
      return false;
    }
    error.style.display = 'none';
    return true;
  }
 
  function validarFecha() {
    const fecha = document.getElementById('fechaNacimiento');
    const error = document.getElementById('errorFecha');
    if (!fecha.value) {
      error.textContent = 'La fecha de nacimiento es obligatoria.';
      error.style.display = 'block';
      return false;
    }
    error.style.display = 'none';
    return true;
  }
 
  function validarDireccion() {
    const dir   = document.getElementById('direccion');
    const error = document.getElementById('errorDireccion');
    if (dir.value.trim() === '') {
      error.textContent = 'La dirección es obligatoria.';
      error.style.display = 'block';
      return false;
    }
    error.style.display = 'none';
    return true;
  }
 
  function validarPassword() {
    const pwd   = document.getElementById('password');
    const error = document.getElementById('errorPassword');
    if (pwd.value.length < 8) {
      error.textContent = 'La contraseña debe tener al menos 8 caracteres.';
      error.style.display = 'block';
      return false;
    }
    error.style.display = 'none';
    return true;
  }
 
  function validarConfirmar() {
    const pwd     = document.getElementById('password').value;
    const confirm = document.getElementById('confirmarPassword').value;
    const error   = document.getElementById('errorConfirmar');
    if (pwd !== confirm) {
      error.textContent = 'Las contraseñas no coinciden.';
      error.style.display = 'block';
      return false;
    }
    error.style.display = 'none';
    return true;
  }
 
  function validarTerminos() {
    const terminos = document.getElementById('terminos');
    const error    = document.getElementById('errorTerminos');
    if (!terminos.checked) {
      error.textContent = 'Debes aceptar los términos y condiciones.';
      error.style.display = 'block';
      return false;
    }
    error.style.display = 'none';
    return true;
  }
 
  function togglePassword(inputId, btnId) {
    const input  = document.getElementById(inputId);
    const btn    = document.getElementById(btnId);
    const hidden = input.type === 'password';
    input.type   = hidden ? 'text' : 'password';
    btn.textContent = hidden ? '🙈' : '👁️';
  }
 
  document.getElementById('ojoPwd').addEventListener('click', () =>
    togglePassword('password', 'ojoPwd'));
  document.getElementById('ojoConfirm').addEventListener('click', () =>
    togglePassword('confirmarPassword', 'ojoConfirm'));
 
  function evaluarFortaleza(pwd) {
    const wrap  = document.getElementById('fortalezaWrap');
    const fill  = document.getElementById('fortalezaFill');
    const label = document.getElementById('fortalezaLabel');
    if (!pwd) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'flex';
    let puntos = 0;
    if (pwd.length >= 8)           puntos++;
    if (pwd.length >= 12)          puntos++;
    if (/[A-Z]/.test(pwd))         puntos++;
    if (/\d/.test(pwd))            puntos++;
    if (/[^A-Za-z0-9]/.test(pwd))  puntos++;
    if (puntos <= 1) {
      fill.style.cssText  = 'width:25%; background:#dc3545';
      label.textContent   = 'Contraseña débil';
      label.style.color   = '#dc3545';
    } else if (puntos <= 3) {
      fill.style.cssText  = 'width:60%; background:#ffc107';
      label.textContent   = 'Contraseña regular';
      label.style.color   = '#856404';
    } else {
      fill.style.cssText  = 'width:100%; background:#28a745';
      label.textContent   = 'Contraseña fuerte ✓';
      label.style.color   = '#28a745';
    }
  }
 
  document.getElementById('password').addEventListener('input', () => {
    evaluarFortaleza(document.getElementById('password').value);
    if (document.getElementById('confirmarPassword').value) validarConfirmar();
  });
 
  document.getElementById('nombres').addEventListener('blur', validarNombres);
  document.getElementById('apellidos').addEventListener('blur', validarApellidos);
  document.getElementById('email').addEventListener('blur', validarEmail);
  document.getElementById('telefono').addEventListener('blur', validarTelefono);
  document.getElementById('fechaNacimiento').addEventListener('blur', validarFecha);
  document.getElementById('direccion').addEventListener('blur', validarDireccion);
  document.getElementById('password').addEventListener('blur', validarPassword);
  document.getElementById('confirmarPassword').addEventListener('blur', validarConfirmar);
 
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valido =
      validarNombres()   &&
      validarApellidos() &&
      validarEmail()     &&
      validarTelefono()  &&
      validarFecha()     &&
      validarDireccion() &&
      validarPassword()  &&
      validarConfirmar() &&
      validarTerminos();
 
    if (valido) {
      alertaError.style.display = 'none';
      alertaExito.style.display = 'block';
      const datosUsuario = {
        nombres:          document.getElementById('nombres').value,
        apellidos:        document.getElementById('apellidos').value,
        email:            document.getElementById('email').value,
        telefono:         document.getElementById('telefono').value,
        fechaNacimiento:  document.getElementById('fechaNacimiento').value,
        genero:           document.getElementById('genero').value,
        direccion:        document.getElementById('direccion').value,
      };
      document.getElementById('jsonCode').textContent = JSON.stringify(datosUsuario, null, 2);
    } else {
      alertaError.style.display = 'block';
      alertaExito.style.display = 'none';
    }
  });
 
  document.getElementById('btnLimpiar').addEventListener('click', () => {
    form.reset();
    document.querySelectorAll('.alert-danger').forEach(div => {
      div.style.display = 'none';
      div.textContent   = '';
    });
    alertaError.style.display = 'none';
    alertaExito.style.display = 'none';
    document.getElementById('fortalezaWrap').style.display  = 'none';
    document.getElementById('fortalezaFill').style.width    = '0';
    document.getElementById('fortalezaLabel').textContent   = '';
    document.getElementById('jsonCode').textContent         = '';
  });
});
