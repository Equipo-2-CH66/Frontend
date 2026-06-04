/* ══════════════════════════════════════════════════════════════════
   ABARROTES ALMIUX — registro.js
   Validación del formulario de registro (usuario/registro.html).
   Requiere: utils.js
══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registroForm');
  if (!form) return;

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
    input.type      = hidden ? 'text' : 'password';
    btn.textContent = hidden ? '🙈' : '👁️';
  }

  document.getElementById('ojoPwd')?.addEventListener('click', () =>
    togglePassword('password', 'ojoPwd'));
  document.getElementById('ojoConfirm')?.addEventListener('click', () =>
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

  document.getElementById('password')?.addEventListener('input', () => {
    evaluarFortaleza(document.getElementById('password').value);
    if (document.getElementById('confirmarPassword').value) validarConfirmar();
  });

  document.getElementById('nombres')?.addEventListener('blur', validarNombres);
  document.getElementById('apellidos')?.addEventListener('blur', validarApellidos);
  document.getElementById('email')?.addEventListener('blur', validarEmail);
  document.getElementById('telefono')?.addEventListener('blur', validarTelefono);
  document.getElementById('fechaNacimiento')?.addEventListener('blur', validarFecha);
  document.getElementById('direccion')?.addEventListener('blur', validarDireccion);
  document.getElementById('password')?.addEventListener('blur', validarPassword);
  document.getElementById('confirmarPassword')?.addEventListener('blur', validarConfirmar);

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
        nombres:         document.getElementById('nombres').value,
        apellidos:       document.getElementById('apellidos').value,
        email:           document.getElementById('email').value,
        telefono:        document.getElementById('telefono').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        genero:          document.getElementById('genero').value,
        direccion:       document.getElementById('direccion').value,
      };
      document.getElementById('jsonCode').textContent = JSON.stringify(datosUsuario, null, 2);
    } else {
      alertaError.style.display = 'block';
      alertaExito.style.display = 'none';
    }
  });

  document.getElementById('btnLimpiar')?.addEventListener('click', () => {
    form.reset();
    document.querySelectorAll('.alert-danger').forEach(div => {
      div.style.display = 'none';
      div.textContent   = '';
    });
    alertaError.style.display = 'none';
    alertaExito.style.display = 'none';
    const fortalezaWrap  = document.getElementById('fortalezaWrap');
    const fortalezaFill  = document.getElementById('fortalezaFill');
    const fortalezaLabel = document.getElementById('fortalezaLabel');
    const jsonCode       = document.getElementById('jsonCode');
    if (fortalezaWrap)  fortalezaWrap.style.display = 'none';
    if (fortalezaFill)  fortalezaFill.style.width   = '0';
    if (fortalezaLabel) fortalezaLabel.textContent   = '';
    if (jsonCode)       jsonCode.textContent         = '';
  });
});
