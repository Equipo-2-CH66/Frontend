/* ══════════════════════════════════════════════════════════════════
   ABARROTES ALMIUX — utils.js
   Utilidades compartidas por todas las páginas.
══════════════════════════════════════════════════════════════════ */

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function obtenerBasePath() {
  return window.location.pathname.includes('/usuario/') ? '../' : './';
}

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
