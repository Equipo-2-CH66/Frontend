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