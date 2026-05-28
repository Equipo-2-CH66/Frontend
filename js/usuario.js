// ═════════════════════════════════════════════════════════════
// HELPERS — mostrar y limpiar errores
// ═════════════════════════════════════════════════════════════

function mostrarError(input, mensaje) {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');

    const alerta = input.parentElement.querySelector('.invalid-feedback');

    if (alerta) {
        alerta.innerHTML = mensaje;
    }
}

function limpiarError(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
}

function validarNombre() {
    const nombre = document.getElementById('nombre');
    const valor = nombre.value.trim();

    // Solo letras y espacios
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,50}$/;

    if (valor === '') {
        mostrarError(nombre, 'El nombre es obligatorio');
        return false;
    }

    if (!regex.test(valor)) {
        mostrarError(nombre, 'Ingresa un nombre válido');
        return false;
    }

    limpiarError(nombre);
    return true;
}

function validarTelefono() {
    const telefono = document.getElementById('telefono');
    const valor = telefono.value.trim();

    // 10 dígitos mexicanos
    const regex = /^\d{10}$/;

    if (valor === '') {
        mostrarError(telefono, 'El teléfono es obligatorio');
        return false;
    }

    if (!regex.test(valor)) {
        mostrarError(telefono, 'Debe tener 10 dígitos');
        return false;
    }

    limpiarError(telefono);
    return true;
}


function validarEmail() {
    const email = document.getElementById('email');
    const valor = email.value.trim();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (valor === '') {
        mostrarError(email, 'El correo es obligatorio');
        return false;
    }

    if (!regex.test(valor)) {
        mostrarError(email, 'Correo electrónico inválido');
        return false;
    }

    limpiarError(email);
    return true;
}

function validarPassword() {
    const password = document.getElementById('password');
    const valor = password.value.trim();

    // Mínimo 8 caracteres, una mayúscula y un número
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (valor === '') {
        mostrarError(password, 'La contraseña es obligatoria');
        return false;
    }

    if (!regex.test(valor)) {
        mostrarError(
            password,
            'Debe tener mínimo 8 caracteres, una mayúscula y un número'
        );
        return false;
    }

    limpiarError(password);
    return true;
}

function validarConfirmar() {
    const password = document.getElementById('password');
    const confirmar = document.getElementById('confirmarPassword');

    if (confirmar.value.trim() === '') {
        mostrarError(confirmar, 'Confirma tu contraseña');
        return false;
    }

    if (password.value !== confirmar.value) {
        mostrarError(confirmar, 'Las contraseñas no coinciden');
        return false;
    }

    limpiarError(confirmar);
    return true;
}

// ═════════════════════════════════════════════════════════════
// VALIDACIÓN EN TIEMPO REAL
// ═════════════════════════════════════════════════════════════

window.addEventListener('DOMContentLoaded', () => {

    const nombre = document.getElementById('nombre');
    const telefono = document.getElementById('telefono');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmar = document.getElementById('confirmarPassword');

    if (nombre) {
        nombre.addEventListener('blur', validarNombre);
    }

    if (telefono) {
        telefono.addEventListener('blur', validarTelefono);
    }

    if (email) {
        email.addEventListener('blur', validarEmail);
    }

    if (password) {
        password.addEventListener('blur', validarPassword);
    }

    if (confirmar) {
        confirmar.addEventListener('blur', validarConfirmar);
    }

});