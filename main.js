/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  ABARROTES ALMIUX — main.js                                  ║
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
    nombre: 'Hola mundo', precio: 42.00, cat: 'lacteos', catLabel: 'Lácteos', desc: 'Yogurt cremoso sin azúcar añadida, rico en proteínas.', icono: '🍦',

  },
];
try {
  const adminProds = JSON.parse(localStorage.getItem('almiux_productos_admin')) || [];
  adminProds.forEach(p => PRODUCTOS.push(p));
} catch (e) {}

function renderizarProductos() {
  const grid = document.getElementById('productsGrid');

  if (!grid) return;

  // Limpiar tarjetas existentes
  // grid.innerHTML = '';

  PRODUCTOS.forEach(p => {

    // Construir imagen o ícono
    const imgHTML = p.imagen
      ? `<img src="${p.imagen}" alt="${p.nombre}">`
      : `<span class="prod-icon">${p.icono}</span>`;

    // Badge de oferta
    const badgeHTML = p.badge
      ? `<span class="prod-badge">${p.badge}</span>`
      : '';

    // Precio original tachado
    const precioOrigHTML = p.precioOriginal
      ? `<span class="prod-original">$${p.precioOriginal.toFixed(2)}</span>`
      : '';

    // Crear tarjeta
    const card = document.createElement('div');

    card.className = 'product-card';

    card.dataset.cat = p.cat;

    if (p.oferta) {
      card.dataset.oferta = 'true';
    }

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

      <button 
        class="btn-agregar"
        onclick="agregarAlCarrito(this, '${p.nombre}')"
      >
        + Agregar
      </button>
    `;

    grid.appendChild(card);
  });
}








document.addEventListener('DOMContentLoaded', () => {

  iniciarNavbar();
  marcarLinkActivo();
  iniciarCategoriasHome();

  if (document.getElementById('productsGrid')) {
    iniciarFiltros();
    iniciarBusqueda();
    revisarFiltroURL();  // Lee el filtro de la URL (ej: ?filtro=ofertas)
    renderizarProductos(); // Renderiza las tarjetas de producto desde el arreglo PRODUCTOS
  }

});


/* ══════════════════════════════════════════════════════════════════
   1. NAVBAR
   · Oculta la navbar al bajar en la página
   · La muestra al subir
   · Maneja el menú hamburguesa en mobile
   ══════════════════════════════════════════════════════════════════ */
function iniciarNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');

  if (!navbar) return;

  // ── Scroll hide/show ──────────────────────────────────────────
  let ultimoScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollActual = window.scrollY;

    if (scrollActual > ultimoScroll && scrollActual > 80) {
      // Usuario bajando: ocultar navbar
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Usuario subiendo: mostrar navbar
      navbar.style.transform = 'translateY(0)';
    }

    ultimoScroll = scrollActual;
  });

  // ── Menú hamburguesa (mobile) ─────────────────────────────────
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    // Alternar la clase .open en el botón y el menú
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Cerrar el menú al hacer clic en cualquier link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}


/* ══════════════════════════════════════════════════════════════════
   2. LINK ACTIVO EN EL NAVBAR
   Detecta en qué página estamos y marca el link correspondiente
   con la clase .active para resaltarlo visualmente.
   ══════════════════════════════════════════════════════════════════ */
function marcarLinkActivo() {
  // Nombre del archivo actual (ej: "productos.html")
  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';

  // Seleccionar todos los links del navbar
  const links = document.querySelectorAll('.nav-links a');

  links.forEach(link => {
    const href = link.getAttribute('href');

    // Si el href del link coincide con la página actual, marcarlo como activo
    if (href && href.includes(paginaActual) && !link.classList.contains('nav-cta')) {
      link.classList.add('active');
    }
  });
}


/* ══════════════════════════════════════════════════════════════════
   3. ANIMACIONES DE ENTRADA AL HACER SCROLL
   Usa IntersectionObserver para animar elementos cuando entran
   al viewport. Los elementos aparecen con un fade + slide-up.
   ══════════════════════════════════════════════════════════════════ */
function iniciarAnimacionesScroll() {
  // Selectores de los elementos que se van a animar
  const selectores = [
    '.cat-card',       // Tarjetas de categoría (home)
    '.product-card',   // Tarjetas de producto
    '.valor-card',     // Tarjetas de valores (nosotros)
    '.miembro-card',   // Tarjetas del equipo (nosotros)
    '.dato-card',      // Datos numéricos (nosotros)
    '.promo',          // Banner de ofertas
    '.hero-text',      // Texto del hero
    '.page-hero-content', // Texto del hero de páginas internas
  ];

  // Seleccionar todos los elementos que coincidan
  const elementos = document.querySelectorAll(selectores.join(','));

  if (elementos.length === 0) return;

  // Estado inicial: invisible y 24px hacia abajo
  elementos.forEach(el => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });

  // Observer: se activa cuando el 10% del elemento es visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, indice) => {
      if (entry.isIntersecting) {
        // Retraso escalonado para que los elementos no aparezcan todos al mismo tiempo
        setTimeout(() => {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
        }, indice * 60); // 60ms de diferencia entre cada elemento

        // Dejar de observar el elemento una vez que ya apareció
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Registrar cada elemento en el observer
  elementos.forEach(el => observer.observe(el));
}


/* ══════════════════════════════════════════════════════════════════
   4. CONTADOR ANIMADO (Stats Strip)
   Los números en la barra de estadísticas cuentan desde 0 hasta
   su valor real cuando entran al viewport.
   Solo funciona en elementos con el atributo data-target.
   ══════════════════════════════════════════════════════════════════ */
function iniciarContadores() {
  const strip = document.querySelector('.stats-strip');
  if (!strip) return;

  /**
   * Anima un elemento de 0 al número destino.
   * @param {HTMLElement} el      - Elemento cuyo texto se va a animar
   * @param {number}      destino - Número final
   * @param {string}      prefijo - Texto antes del número (ej: "+")
   * @param {string}      sufijo  - Texto después del número (ej: " años")
   * @param {number}      duracion - Duración en milisegundos
   */
  function animarContador(el, destino, prefijo = '', sufijo = '', duracion = 1200) {
    let inicio = null;

    function paso(timestamp) {
      if (!inicio) inicio = timestamp;

      const progreso = Math.min((timestamp - inicio) / duracion, 1);

      // Easing: ease-out cúbico — arranca rápido y frena al final
      const suavizado = 1 - Math.pow(1 - progreso, 3);

      const actual = Math.floor(suavizado * destino);
      el.textContent = prefijo + actual.toLocaleString('es-MX') + sufijo;

      if (progreso < 1) {
        requestAnimationFrame(paso); // Continuar la animación
      } else {
        // Asegurar que el valor final sea exacto
        el.textContent = prefijo + destino.toLocaleString('es-MX') + sufijo;
      }
    }

    requestAnimationFrame(paso);
  }

  // Observer para el strip de estadísticas
  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;

    // Buscar todos los .stat-num con data-target
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
      const destino = parseInt(el.dataset.target, 10);
      const prefijo = el.dataset.prefix || '';
      const sufijo  = el.dataset.suffix || '';

      if (!isNaN(destino)) {
        animarContador(el, destino, prefijo, sufijo);
      }
    });

    observer.unobserve(strip); // Solo animar una vez
  }, { threshold: 0.5 });

  observer.observe(strip);
}


/* ══════════════════════════════════════════════════════════════════
   5. FILTROS DE PRODUCTOS (productos.html)
   Los botones de filtro muestran/ocultan tarjetas según su
   atributo data-cat. El filtro "ofertas" usa data-oferta="true".
   ══════════════════════════════════════════════════════════════════ */
function iniciarFiltros() {
  const botonesFiltro = document.querySelectorAll('.filter-btn');
  if (botonesFiltro.length === 0) return;

  botonesFiltro.forEach(boton => {
    boton.addEventListener('click', () => {
      const filtro = boton.dataset.filter;

      // Marcar el botón clicado como activo y desactivar los demás
      botonesFiltro.forEach(b => b.classList.remove('filter-active'));
      boton.classList.add('filter-active');

      // Aplicar el filtro
      aplicarFiltro(filtro);
    });
  });
}

/**
 * Muestra u oculta las tarjetas de producto según el filtro.
 * @param {string} filtro - Categoría a mostrar, o "all" para mostrar todo
 */
function aplicarFiltro(filtro) {
  const tarjetas       = document.querySelectorAll('.product-card');
  const contadorTexto  = document.getElementById('resultsCount');
  const noResultados   = document.getElementById('noResults');

  let visibles = 0;

  tarjetas.forEach(tarjeta => {
    let mostrar = false;

    if (filtro === 'all') {
      // Mostrar todo
      mostrar = true;
    } else if (filtro === 'ofertas') {
      // Solo tarjetas con data-oferta="true"
      mostrar = tarjeta.dataset.oferta === 'true';
    } else {
      // Convertir las categorías en un arreglo
      const categorias = tarjeta.dataset.cat.split(' ');

      // Verificar si el filtro existe dentro de las categorías
      mostrar = categorias.includes(filtro);
    }

    if (mostrar) {
      tarjeta.classList.remove('hidden');
      visibles++;
    } else {
      tarjeta.classList.add('hidden');
    }
  });

  // Actualizar contador de resultados
  if (contadorTexto) {
    if (filtro === 'all') {
      contadorTexto.textContent = `Mostrando todos los productos`;
    } else {
      contadorTexto.textContent = `${visibles} producto${visibles !== 1 ? 's' : ''} encontrado${visibles !== 1 ? 's' : ''}`;
    }
  }

  // Mostrar u ocultar el mensaje de "sin resultados"
  if (noResultados) {
    noResultados.style.display = visibles === 0 ? 'block' : 'none';
  }
}

/**
 * Restablece todos los filtros y muestra todos los productos.
 * Llamada por el botón "Ver todos" en el mensaje de "sin resultados".
 */
function resetFiltros() {
  const botonTodos = document.querySelector('.filter-btn[data-filter="all"]');
  if (botonTodos) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-active'));
    botonTodos.classList.add('filter-active');
  }
  aplicarFiltro('all');
}


/* ══════════════════════════════════════════════════════════════════
   6. BÚSQUEDA EN TIEMPO REAL (productos.html)
   Filtra las tarjetas mientras el usuario escribe en el input.
   Busca en el nombre y la descripción del producto.
   ══════════════════════════════════════════════════════════════════ */
function iniciarBusqueda() {
  const inputBusqueda = document.getElementById('searchInput');
  if (!inputBusqueda) return;

  inputBusqueda.addEventListener('input', () => {
    const termino = inputBusqueda.value.toLowerCase().trim();
    const tarjetas = document.querySelectorAll('.product-card');
    const noResultados = document.getElementById('noResults');
    const contadorTexto = document.getElementById('resultsCount');

    // Al buscar, quitar el filtro de categoría activo
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-active'));
    const botonTodos = document.querySelector('.filter-btn[data-filter="all"]');
    if (botonTodos) botonTodos.classList.add('filter-active');

    let visibles = 0;

    tarjetas.forEach(tarjeta => {
      // Texto del nombre del producto
      const nombre = tarjeta.querySelector('.prod-name')?.textContent.toLowerCase() || '';
      // Texto de la descripción
      const desc   = tarjeta.querySelector('.prod-desc')?.textContent.toLowerCase() || '';
      // Texto de la categoría
      const cat    = tarjeta.querySelector('.prod-cat-tag')?.textContent.toLowerCase() || '';

      // Mostrar si alguno de los textos contiene el término buscado
      const coincide = nombre.includes(termino) || desc.includes(termino) || cat.includes(termino);

      if (coincide || termino === '') {
        tarjeta.classList.remove('hidden');
        visibles++;
      } else {
        tarjeta.classList.add('hidden');
      }
    });

    // Actualizar contador
    if (contadorTexto) {
      contadorTexto.textContent = termino
        ? `${visibles} resultado${visibles !== 1 ? 's' : ''} para "${termino}"`
        : 'Mostrando todos los productos';
    }

    // Mostrar/ocultar mensaje de sin resultados
    if (noResultados) {
      noResultados.style.display = visibles === 0 ? 'block' : 'none';
    }
  });
}


/* ══════════════════════════════════════════════════════════════════
   7. CARRITO FLOTANTE (productos.html)
   Muestra un chip flotante con el conteo de productos agregados.
   Se activa al hacer clic en "Agregar" de cualquier producto.
   ══════════════════════════════════════════════════════════════════ */

// Variable global del conteo (compartida entre funciones del carrito)
let conteoCarrito = 0;

/**
 * Agrega un producto al carrito flotante.
 * Llamada por el atributo onclick="agregarAlCarrito(this, 'nombre')" en cada botón.
 *
 * @param {HTMLElement} boton  - El botón que fue clicado
 * @param {string}      nombre - Nombre del producto agregado
 */
function agregarAlCarrito(boton, nombre) {
  const carritoFlotante = document.getElementById('carritoFlotante');
  const carritoCount    = document.getElementById('carritoCount');

  // Incrementar conteo
  conteoCarrito++;

  // Actualizar el número en el chip
  if (carritoCount) carritoCount.textContent = conteoCarrito;

  // Mostrar el chip si está oculto
  if (carritoFlotante) carritoFlotante.style.display = 'flex';

  // Dar feedback visual al botón: cambiar texto y color temporalmente
  const textoOriginal = boton.textContent;
  boton.textContent = '✓ Agregado';
  boton.classList.add('agregado');
  boton.disabled = true;

  // Restaurar el botón después de 1.5 segundos
  setTimeout(() => {
    boton.textContent = textoOriginal;
    boton.classList.remove('agregado');
    boton.disabled = false;
  }, 1500);

  // Log en consola (útil para debug)
  console.log(`Producto agregado: ${nombre} | Total en carrito: ${conteoCarrito}`);
}

/**
 * Cierra/oculta el chip flotante del carrito.
 * Llamada por el botón ✕ dentro del chip.
 */
function cerrarCarrito() {
  const carritoFlotante = document.getElementById('carritoFlotante');
  if (carritoFlotante) carritoFlotante.style.display = 'none';
}


/* ══════════════════════════════════════════════════════════════════
   8. CATEGORÍAS EN HOME → LINK A PRODUCTOS CON FILTRO
   Al hacer clic en una tarjeta de categoría en index.html,
   redirige a productos.html con el filtro correspondiente en la URL.
   ══════════════════════════════════════════════════════════════════ */
function iniciarCategoriasHome() {
  const tarjetasCat = document.querySelectorAll('.cat-card[data-cat]');
  if (tarjetasCat.length === 0) return;

  tarjetasCat.forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
      const categoria = tarjeta.dataset.cat;
      // Redirigir a productos.html con el filtro en la URL
      window.location.href = `productos.html?filtro=${categoria}`;
    });
  });
}

/**
 * Lee el parámetro "filtro" de la URL y aplica el filtro al cargar la página.
 * Ejemplo: productos.html?filtro=bebidas → activa el filtro "bebidas"
 */
function revisarFiltroURL() {
  const params  = new URLSearchParams(window.location.search);
  const filtro  = params.get('filtro');

  if (!filtro) return; // No hay filtro en la URL

  // Buscar el botón de filtro correspondiente
  const botonFiltro = document.querySelector(`.filter-btn[data-filter="${filtro}"]`);

  if (botonFiltro) {
    // Simular un clic en ese botón para activar el filtro
    botonFiltro.click();

    // Hacer scroll suave al grid de productos
    setTimeout(() => {
      document.getElementById('productsGrid')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 300);
  }
}

fetch('contacto.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('contacto-container').innerHTML = data;
  })
  .catch(err => console.error(err));
  