/* ══════════════════════════════════════════════════════════════════
   ABARROTES ALMIUX — login.js  (archivo nuevo)
   Inicio de sesión con validación y autenticación via localStorage.
   Requiere: utils.js · auth.js
══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('authForm');
  if (!form) return;

  /* Alertas globales */
  const alerta = new Alerta('alertaError', 'alertaExito');
  alerta.limpiar();

  /* ── Campos (IDs exactos del HTML) ─────────────────────── */
  const fEmail    = new CampoForm('loginEmail',    'errorEmail');
  const fPassword = new CampoForm('loginPassword', 'errorPassword');

  /* ── Botón ojo ──────────────────────────────────────────── */
  new TogglePassword('loginPassword', 'ojoPwd', 'ojoIcon');

  /* ── Validaciones individuales ──────────────────────────── */
  function vEmail() { return validarEmail(fEmail); }

  function vPassword() {
    const v = fPassword.valor;
    if (v === '')
      return fPassword.error('La contraseña es obligatoria.');
    if (v.length < 8)
      return fPassword.error('La contraseña debe tener al menos 8 caracteres.');
    if (!/[A-Z]/.test(v))
      return fPassword.error('La contraseña debe contener al menos una mayúscula.');
    if (!/[0-9]/.test(v))
      return fPassword.error('La contraseña debe contener al menos un número.');
    return fPassword.ok();
  }

  /* ── Validación blur ────────────────────────────────────── */
  fEmail.input?.addEventListener('blur',    vEmail);
  fPassword.input?.addEventListener('blur', vPassword);

  /* ── Helpers del spinner / botón ────────────────────────── */
  function setSpinner(activo) {
    const spinner = document.getElementById('loginSpinner');
    const icon    = document.getElementById('loginBtnIcon');
    const texto   = document.getElementById('loginBtnText');
    const btn     = document.getElementById('btnLogin');
    if (!btn) return;
    spinner && (spinner.style.display = activo ? 'inline-block' : 'none');
    icon    && (icon.style.display    = activo ? 'none'         : 'inline');
    texto   && (texto.textContent     = activo ? 'Verificando…' : 'Iniciar sesión');
    btn.disabled = activo;
  }

  /* ── Submit ─────────────────────────────────────────────── */
  form.addEventListener('submit', e => {
    e.preventDefault();
    alerta.limpiar();

    /* 1. Validar campos vacíos y formato */
    const formatoOk = [vEmail(), vPassword()];
    if (formatoOk.includes(false)) {
      alerta.error('Revisa los campos antes de continuar.');
      return;
    }

    setSpinner(true);

    setTimeout(() => {
      const email    = fEmail.valor.trim().toLowerCase();
      const password = fPassword.valor;

      /* 2. Verificar credenciales contra localStorage */
      const usuario = AlmiuxStorage.autenticar(email, password);
      setSpinner(false);

      if (!usuario) {
        /* Mostrar error de credenciales inválidas */
        alerta.error('Nombre de usuario o contraseña inválidos.');
        fEmail.error('Verifica tu correo electrónico.');
        fPassword.error('Verifica tu contraseña.');
        return;
      }

      /* 3. Sesión correcta */
      AlmiuxStorage.iniciarSesion(usuario);

      /* Recordarme */
      const recordar = document.getElementById('recordarme');
      if (recordar?.checked) {
        localStorage.setItem('almiux_recordar_email', email);
      } else {
        localStorage.removeItem('almiux_recordar_email');
      }

      alerta.exito(`¡Bienvenido/a, ${usuario.nombres}! Redirigiendo…`);

      /* 4. Redirigir a index.html (nivel superior) */
      setTimeout(() => {
        window.location.href = obtenerBasePath() + 'index.html';
      }, 1500);

    }, 600);
  });

  /* ── Precargar email si "Recordarme" estaba activo ──────── */
  const emailGuardado = localStorage.getItem('almiux_recordar_email');
  if (emailGuardado && fEmail.input) {
    fEmail.input.value = emailGuardado;
    const chk = document.getElementById('recordarme');
    if (chk) chk.checked = true;
  }

});
