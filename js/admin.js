function mostrarError(campoId, mensajeId) {
    const campo = document.getElementById(campoId);
    const mensaje = document.getElementById(mensajeId);
    if (campo) campo.classList.add('campo-error');
    if (mensaje) mensaje.classList.add('visible');
}

function limpiarError(campoId, mensajeId) {
    const campo = document.getElementById(campoId);
    const mensaje = document.getElementById(mensajeId);
    if (campo) campo.classList.remove('campo-error');
    if (mensaje) mensaje.classList.remove('visible');
}

function validarFormulario() {
    let esValido = true;

    // Nombre
    const nombre = document.getElementById('nombre').value.trim();
    if (nombre === '') {
        mostrarError('nombre', 'error-nombre');
        esValido = false;
    } else {
        limpiarError('nombre', 'error-nombre');
    }

    // Descripción
    const descripcion = document.getElementById('descripcion').value.trim();
    if (descripcion === '') {
        mostrarError('descripcion', 'error-descripcion');
        esValido = false;
    } else {
        limpiarError('descripcion', 'error-descripcion');
    }

    // Categoría
    const categoria = document.getElementById('categoria').value;
    if (categoria === '') {
        mostrarError('categoria', 'error-categoria');
        esValido = false;
    } else {
        limpiarError('categoria', 'error-categoria');
    }

    // Precio
    const precio = parseFloat(document.getElementById('precio').value);
    if (isNaN(precio) || precio <= 0) {
        mostrarError('precio', 'error-precio');
        esValido = false;
    } else {
        limpiarError('precio', 'error-precio');
    }

    // Descuento (solo si hay oferta activa)
    const esOferta = document.getElementById('oferta').checked;
    if (esOferta) {
        const descuento = parseInt(document.getElementById('descuento').value, 10);
        if (isNaN(descuento) || descuento < 1 || descuento > 99) {
            mostrarError('descuento', 'error-descuento');
            esValido = false;
        } else {
            limpiarError('descuento', 'error-descuento');
        }
    } else {
        limpiarError('descuento', 'error-descuento');
    }

    // Ícono — descomentar cuando Danna agregue el selector
    /*
    const icono = document.getElementById('icono').value;
    if (icono === '') {
        document.getElementById('error-icono').classList.add('visible');
        esValido = false;
    } else {
        document.getElementById('error-icono').classList.remove('visible');
    }
    */

    return esValido;
}