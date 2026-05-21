/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */

const $ = id => document.getElementById(id);

function toggleError(campoId, mensajeId, mostrar) {
    $(campoId)?.classList.toggle('campo-error', mostrar);
    $(mensajeId)?.classList.toggle('visible', mostrar);
}

/* ═══════════════════════════════════════════════════════════════
   VALIDACIÓN
═══════════════════════════════════════════════════════════════ */

function validarFormulario() {

    let esValido = true;

    const campos = [
        {
            id: 'nombre',
            error: 'error-nombre',
            valido: $('nombre').value.trim() !== ''
        },
        {
            id: 'descripcion',
            error: 'error-descripcion',
            valido: $('descripcion').value.trim() !== ''
        },
        {
            id: 'categoria',
            error: 'error-categoria',
            valido: $('categoria').value !== ''
        },
        {
            id: 'precio',
            error: 'error-precio',
            valido: parseFloat($('precio').value) > 0
        }
    ];

    campos.forEach(campo => {
        toggleError(campo.id, campo.error, !campo.valido);

        if (!campo.valido) {
            esValido = false;
        }
    });

    // Validar descuento solo si hay oferta
    if ($('oferta').checked) {

        const descuento = parseInt($('descuento').value);

        const valido =
            !isNaN(descuento) &&
            descuento >= 1 &&
            descuento <= 99;

        toggleError(
            'descuento',
            'error-descuento',
            !valido
        );

        if (!valido) {
            esValido = false;
        }

    } else {

        toggleError(
            'descuento',
            'error-descuento',
            false
        );
    }

    return esValido;
}

/* ═══════════════════════════════════════════════════════════════
   MOSTRAR / OCULTAR DESCUENTO
═══════════════════════════════════════════════════════════════ */

$('oferta')?.addEventListener('change', () => {

    $('descuentoGroup')?.classList.toggle(
        'visible',
        $('oferta').checked
    );

    if (!$('oferta').checked) {
        $('descuento').value = '';
    }

    actualizarPreview();
});

/* ═══════════════════════════════════════════════════════════════
   EVENTOS PREVIEW
═══════════════════════════════════════════════════════════════ */

[
    'nombre',
    'descripcion',
    'categoria',
    'precio',
    'descuento',
    'imagen'
].forEach(id => {

    $(id)?.addEventListener('input', actualizarPreview);
    $(id)?.addEventListener('change', actualizarPreview);

});

/* ═══════════════════════════════════════════════════════════════
   PREVIEW
═══════════════════════════════════════════════════════════════ */

const etiquetas = {
    lacteos: 'Lácteos',
    bebidas: 'Bebidas',
    enlatados: 'Enlatados',
    carnes: 'Carnes',
    limpieza: 'Limpieza',
    panaderia: 'Panadería',
    especias: 'Especias',
    botanas: 'Botanas',
    abarrotes: 'Abarrotes',
    higiene: 'Higiene personal'
};

function crearHTMLPreview({
    imagen,
    categoria,
    nombre,
    descripcion,
    precioFinal,
    precioOriginalHTML,
    badgeHTML
}) {

    return `
        ${imagen}

        <div class="preview-info">

            <p class="preview-cat">
                ${etiquetas[categoria] || 'Categoría'}
            </p>

            <p class="preview-name">
                ${nombre || 'Nombre del producto'}
            </p>

            <p class="preview-desc">
                ${descripcion || 'Descripción del producto'}
            </p>

            <div>

                <span class="preview-price">
                    ${
                        !isNaN(precioFinal)
                            ? `$${precioFinal.toFixed(2)}`
                            : '$0.00'
                    }
                </span>

                ${precioOriginalHTML}
                ${badgeHTML}

            </div>

        </div>
    `;
}

function actualizarPreview() {

    const nombre = $('nombre').value.trim();
    const descripcion = $('descripcion').value.trim();
    const categoria = $('categoria').value;
    const precio = parseFloat($('precio').value);

    const enOferta = $('oferta').checked;
    const descuento = parseInt($('descuento').value);

    const imagenInput = $('imagen');
    const card = $('previewCard');

    // Placeholder
    if (!nombre && !descripcion && isNaN(precio)) {

        card.innerHTML = `
            <p class="preview-placeholder">
                Llena el formulario para ver la previsualización aquí.
            </p>
        `;

        return;
    }

    // Precios
    let precioFinal = precio;
    let precioOriginalHTML = '';
    let badgeHTML = '';

    if (
        enOferta &&
        !isNaN(descuento) &&
        !isNaN(precio)
    ) {

        precioFinal =
            precio - (precio * descuento / 100);

        precioOriginalHTML = `
            <span class="preview-original">
                $${precio.toFixed(2)}
            </span>
        `;

        badgeHTML = `
            <span class="preview-badge">
                -${descuento}%
            </span>
        `;
    }

    // Imagen default
    let imagenHTML = `
        <div class="preview-image-placeholder">
            🛒
        </div>
    `;

    // Si hay imagen
    if (imagenInput.files?.[0]) {

        const reader = new FileReader();

        reader.onload = e => {

            imagenHTML = `
                <img
                    src="${e.target.result}"
                    alt="Producto"
                    class="preview-image"
                >
            `;

            card.innerHTML = crearHTMLPreview({
                imagen: imagenHTML,
                categoria,
                nombre,
                descripcion,
                precioFinal,
                precioOriginalHTML,
                badgeHTML
            });
        };

        reader.readAsDataURL(imagenInput.files[0]);

        return;
    }

    // Render normal
    card.innerHTML = crearHTMLPreview({
        imagen: imagenHTML,
        categoria,
        nombre,
        descripcion,
        precioFinal,
        precioOriginalHTML,
        badgeHTML
    });
}
 //STORAGE — guardar y leer productos del admin en localStorage

const STORAGE_KEY = 'almiux_productos_admin';
function obtenerProductosAdmin() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}
 
function guardarProductosAdmin(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

/* ═══════════════════════════════════════════════════════════════
   SUBMIT — crear objeto, guardarlo y mostrar JSON + tarjetas
═══════════════════════════════════════════════════════════════ */
 
$('formProducto')?.addEventListener('submit', async function (e) {
    e.preventDefault();
 
    // Ocultar alertas previas
    $('alertaError')?.classList.remove('show');
    $('alertaExito')?.classList.remove('show');
 
    // Validar con la función
    if (!validarFormulario()) {
        $('alertaError')?.classList.add('show');
        return;
    }
 
    // Leer valores del formulario
    const nombre      = $('nombre').value.trim();
    const descripcion = $('descripcion').value.trim();
    const categoria   = $('categoria').value;
    const precio      = parseFloat($('precio').value);
    const enOferta    = $('oferta').checked;
    const descuento   = parseInt($('descuento').value) || 0;
    const imagenInput = $('imagen');
 
    // Leer imagen como base64 (para persistir en localStorage)
    let imagenBase64 = null;
    if (imagenInput?.files?.length > 0) {
        imagenBase64 = await new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload  = () => res(reader.result);
            reader.onerror = () => rej();
            reader.readAsDataURL(imagenInput.files[0]);
        });
    }
 
    // Calcular precio final
    const precioFinal    = enOferta && descuento > 0
        ? parseFloat((precio * (1 - descuento / 100)).toFixed(2))
        : precio;
    const precioOriginal = enOferta && descuento > 0 ? precio : null;
 
    // Construir objeto producto 
    const producto = {
        id:            `prod_${Date.now()}`,
        nombre,
        desc:          descripcion,
        cat:           categoria,
        catLabel:      etiquetas[categoria] || categoria,
        precio:        precioFinal,
        precioOriginal,
        oferta:        enOferta,
        badge:         enOferta && descuento > 0 ? `-${descuento}%` : (enOferta ? 'Oferta' : null),
        icono:         '📦',
        imagen:        imagenBase64,
        creadoEn:      new Date().toLocaleDateString('es-MX', {
                           year: 'numeric', month: '2-digit', day: '2-digit'
                       }),
    };
 
    // Guardar en localStorage
    const lista = obtenerProductosAdmin();
    lista.push(producto);
    guardarProductosAdmin(lista);
 
    // También inyectar en el arreglo global de main.js si existe
    if (typeof PRODUCTOS !== 'undefined') {
        PRODUCTOS.push(producto);
    }
 
    // Mostrar JSON (sin el base64 de imagen para que sea legible)
    const paraJSON = { ...producto, imagen: producto.imagen ? '[imagen cargada]' : null };
    const jsonBlock = $('jsonBlock');
    if (jsonBlock) {
        jsonBlock.innerHTML = `<code>${JSON.stringify(paraJSON, null, 2)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>`;
    }
    $('btnCopy') && ($('btnCopy').style.display = 'inline-flex');
 
    // Alerta de éxito
    $('alertaExito')?.classList.add('show');
 
    // Re-renderizar grid de productos creados
    renderizarTarjetasAdmin();
    actualizarContadorAdmin();
 
    // Reset del formulario
    this.reset();
    $('descuentoGroup')?.classList.remove('visible');
    actualizarPreview();
 
    // Scroll al JSON
    jsonBlock?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
 
/* ═══════════════════════════════════════════════════════════════
   COPIAR JSON
═══════════════════════════════════════════════════════════════ */
 
function copiarJSON() {
    const texto = $('jsonBlock')?.innerText || '';
    navigator.clipboard.writeText(texto).then(() => {
        const btn = $('btnCopy');
        if (!btn) return;
        const orig = btn.textContent;
        btn.textContent = '✅ ¡Copiado!';
        setTimeout(() => { btn.textContent = orig; }, 1500);
    }).catch(() => alert('No se pudo copiar. Selecciona el texto manualmente.'));
}
 
/* ═══════════════════════════════════════════════════════════════
   GRID DE PRODUCTOS CREADOS (sección debajo del formulario)
═══════════════════════════════════════════════════════════════ */
 
function renderizarTarjetasAdmin() {
    const contenedor = $('productosAdminGrid');
    if (!contenedor) return;
 
    const lista = obtenerProductosAdmin();
 
    if (lista.length === 0) {
        contenedor.innerHTML = `
            <p style="color:var(--color-muted);font-size:14px;grid-column:1/-1;
                      text-align:center;padding:40px 0;">
                Aún no has creado ningún producto. ¡Usa el formulario de arriba!
            </p>`;
        return;
    }
 
    contenedor.innerHTML = '';
 
    lista.forEach((p, index) => {
 
        // Imagen o ícono
        const imgHTML = p.imagen
            ? `<img src="${p.imagen}" alt="${p.nombre}"
                    style="width:100%;height:140px;object-fit:cover;
                           border-radius:8px 8px 0 0;">`
            : `<div class="preview-image-placeholder">${p.icono || '📦'}</div>`;
 
        // Badge de oferta
        const badgeHTML = p.badge
            ? `<span class="prod-badge">${p.badge}</span>`
            : '';
 
        // Precio original tachado
        const precioOrigHTML = p.precioOriginal
            ? `<span class="prod-original">$${p.precioOriginal.toFixed(2)}</span>`
            : '';
 
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.position = 'relative';
        card.innerHTML = `
            <div class="prod-img-wrap">
                ${imgHTML}
                ${badgeHTML}
            </div>
            <div class="prod-info">
                <p class="prod-cat-tag">${p.catLabel || p.cat}</p>
                <h3 class="prod-name">${p.nombre}</h3>
                <p class="prod-desc">${p.desc}</p>
                <div class="prod-prices">
                    <span class="prod-price">$${p.precio.toFixed(2)}</span>
                    ${precioOrigHTML}
                </div>
            </div>
            <button
                class="btn-eliminar-admin"
                data-index="${index}"
                title="Eliminar producto"
                style="position:absolute;top:8px;right:8px;
                       background:#fff;border:1.5px solid #dc3545;
                       color:#dc3545;border-radius:50%;width:28px;height:28px;
                       font-size:13px;cursor:pointer;display:flex;
                       align-items:center;justify-content:center;line-height:1;"
            >✕</button>
        `;
 
        contenedor.appendChild(card);
    });
 
    // Eventos de eliminar
    contenedor.querySelectorAll('.btn-eliminar-admin').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            const lista = obtenerProductosAdmin();
            lista.splice(idx, 1);
            guardarProductosAdmin(lista);
            renderizarTarjetasAdmin();
            actualizarContadorAdmin();
        });
    });
}
 
function actualizarContadorAdmin() {
    const badge = $('adminProdCount');
    if (badge) badge.textContent = obtenerProductosAdmin().length;
}
 
/* ═══════════════════════════════════════════════════════════════
   INICIALIZACIÓN
═══════════════════════════════════════════════════════════════ */
 
document.addEventListener('DOMContentLoaded', () => {
    renderizarTarjetasAdmin();
    actualizarContadorAdmin();
});