/* ══════════════════════════════════════════════════════════════════
   ABARROTES ALMIUX — productos.js
   Catálogo dinámico, filtros, búsqueda, carrito persistente y
   accesibilidad de categorías en el home.
   Requiere: utils.js
══════════════════════════════════════════════════════════════════ */

/* ── Datos de productos (admin via localStorage) ─────────────────── */

const PRODUCTOS = [];

(function cargarProductosAdmin() {
  try {
    const adminProds = JSON.parse(localStorage.getItem('almiux_productos_admin')) || [];
    adminProds.forEach(p => PRODUCTOS.push(p));
  } catch (_) {}
})();


/* ══════════════════════════════════════════════════════════════════
   CARRITO (persiste en localStorage)
══════════════════════════════════════════════════════════════════ */

let carrito = [];

(function inicializarCarrito() {
  try {
    carrito = JSON.parse(localStorage.getItem('almiux_carrito')) || [];
  } catch (_) {
    carrito = [];
  }
})();

function guardarCarrito() {
  localStorage.setItem('almiux_carrito', JSON.stringify(carrito));
}

function actualizarUICarrito() {
  const total           = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const carritoCount    = document.getElementById('carritoCount');
  const carritoFlotante = document.getElementById('carritoFlotante');
  if (carritoCount)    carritoCount.textContent = total;
  if (carritoFlotante) carritoFlotante.style.display = total > 0 ? 'flex' : 'none';
}

function agregarAlCarrito(boton, nombre) {
  const idx = carrito.findIndex(item => item.nombre === nombre);
  if (idx >= 0) {
    carrito[idx].cantidad++;
  } else {
    carrito.push({ nombre, cantidad: 1 });
  }
  guardarCarrito();
  actualizarUICarrito();

  const textoOriginal = boton.textContent;
  boton.textContent = '✓ Agregado';
  boton.classList.add('agregado');
  boton.disabled = true;
  setTimeout(() => {
    boton.textContent = textoOriginal;
    boton.classList.remove('agregado');
    boton.disabled = false;
  }, 1500);
}

function cerrarCarrito() {
  const carritoFlotante = document.getElementById('carritoFlotante');
  if (carritoFlotante) carritoFlotante.style.display = 'none';
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  actualizarUICarrito();
}


/* ══════════════════════════════════════════════════════════════════
   RENDERIZAR PRODUCTOS DINÁMICOS
   Usa escapeHtml() para prevenir XSS con datos de localStorage.
══════════════════════════════════════════════════════════════════ */

function renderizarProductos() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  PRODUCTOS.forEach(p => {
    const nombre      = escapeHtml(p.nombre   ?? '');
    const catLabel    = escapeHtml(p.catLabel  ?? '');
    const desc        = escapeHtml(p.desc      ?? '');
    const precio      = parseFloat(p.precio)   || 0;
    const catRaw      = escapeHtml(p.cat       ?? '');
    const imagenSrc   = escapeHtml(p.imagen    ?? '');
    const iconoEsc    = escapeHtml(p.icono     ?? '');
    const badgeEsc    = p.badge ? escapeHtml(p.badge) : '';

    const imgHTML = imagenSrc
      ? `<img src="${imagenSrc}" alt="${nombre}" loading="lazy">`
      : `<span class="prod-icon">${iconoEsc}</span>`;

    const badgeHTML = badgeEsc
      ? `<span class="prod-badge">${badgeEsc}</span>`
      : '';

    const precioOrigHTML = p.precioOriginal
      ? `<span class="prod-original">$${parseFloat(p.precioOriginal).toFixed(2)}</span>`
      : '';

    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.cat = catRaw;
    if (p.oferta) card.dataset.oferta = 'true';

    card.innerHTML = `
      <div class="prod-img-wrap">
        ${imgHTML}
        ${badgeHTML}
      </div>
      <div class="prod-info">
        <p class="prod-cat-tag">${catLabel}</p>
        <h3 class="prod-name">${nombre}</h3>
        <p class="prod-desc">${desc}</p>
        <div class="prod-prices">
          <span class="prod-price">$${precio.toFixed(2)}</span>
          ${precioOrigHTML}
        </div>
      </div>
    `;

    const btn = document.createElement('button');
    btn.className = 'btn-agregar';
    btn.textContent = '+ Agregar';
    btn.addEventListener('click', () => agregarAlCarrito(btn, p.nombre));
    card.appendChild(btn);

    grid.appendChild(card);
  });

  actualizarUICarrito();
}


/* ══════════════════════════════════════════════════════════════════
   FILTROS DE CATEGORÍA
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
   BÚSQUEDA EN TIEMPO REAL
══════════════════════════════════════════════════════════════════ */

function iniciarBusqueda() {
  const inputBusqueda = document.getElementById('searchInput');
  if (!inputBusqueda) return;

  inputBusqueda.addEventListener('input', () => {
    const termino       = inputBusqueda.value.toLowerCase().trim();
    const tarjetas      = document.querySelectorAll('.product-card');
    const noResultados  = document.getElementById('noResults');
    const contadorTexto = document.getElementById('resultsCount');

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-active'));
    const botonTodos = document.querySelector('.filter-btn[data-filter="all"]');
    if (botonTodos) botonTodos.classList.add('filter-active');

    let visibles = 0;
    tarjetas.forEach(tarjeta => {
      const nombre   = tarjeta.querySelector('.prod-name')?.textContent.toLowerCase()    || '';
      const desc     = tarjeta.querySelector('.prod-desc')?.textContent.toLowerCase()    || '';
      const cat      = tarjeta.querySelector('.prod-cat-tag')?.textContent.toLowerCase() || '';
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
   CATEGORÍAS HOME → PRODUCTOS CON FILTRO
   Incluye accesibilidad: role="button", tabindex, teclado.
══════════════════════════════════════════════════════════════════ */

function iniciarCategoriasHome() {
  const tarjetasCat = document.querySelectorAll('.cat-card[data-cat]');
  if (tarjetasCat.length === 0) return;

  tarjetasCat.forEach(tarjeta => {
    tarjeta.setAttribute('role', 'button');
    tarjeta.setAttribute('tabindex', '0');

    const navegar = () => {
      window.location.href = `productos.html?filtro=${tarjeta.dataset.cat}`;
    };

    tarjeta.addEventListener('click', navegar);
    tarjeta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navegar();
      }
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
