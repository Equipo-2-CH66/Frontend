# 🏪 Abarrotes Almiux — Sitio Web

> Proyecto final del Bootcamp **Generation México** · Equipo **404 Team Not Found**

<!-- ============================================================
     IMAGEN SUGERIDA #1
     Captura de pantalla del hero de index.html en desktop.
     Reemplaza la línea de abajo con tu imagen:
     ![Hero de inicio](./images/readme/screenshot-hero.png)
     ============================================================ -->
![Banner del proyecto](https://via.placeholder.com/1100x400?text=📸+Agrega+aquí+un+screenshot+del+hero+de+inicio)

---

## 📋 Tabla de contenidos

- [Descripción](#descripción)
- [Páginas del proyecto](#páginas-del-proyecto)
- [Estructura de archivos](#estructura-de-archivos)
- [Tecnologías usadas](#tecnologías-usadas)
- [Funcionalidades](#funcionalidades)
- [Equipo](#equipo)
- [Cómo correr el proyecto](#cómo-correr-el-proyecto)

---

## Descripción

**Abarrotes Almiux** es el sitio web de una tienda de abarrotes familiar ubicada en Tizayuca, Hidalgo. El sitio permite a los clientes explorar el catálogo de productos, conocer la historia de la tienda, registrarse como usuarios y contactar al negocio. Cuenta además con un panel de administración para gestionar el inventario.

El proyecto fue desarrollado como entrega final del bootcamp de Generation México, usando únicamente HTML, CSS y JavaScript vanilla, sin frameworks de frontend.

<!-- ============================================================
     IMAGEN SUGERIDA #2
     Vista general del sitio en distintos dispositivos (mockup responsive).
     ![Mockup responsive](./images/readme/mockup-responsive.png)
     ============================================================ -->

---

## Páginas del proyecto

### 🏠 `index.html` — Inicio

Página principal del sitio. Contiene el hero de bienvenida con la ilustración del anaquel animada, una franja de estadísticas con contadores animados, el grid de categorías y el banner de ofertas de temporada.

<!-- ============================================================
     IMAGEN SUGERIDA #3
     Screenshot de index.html completo (desktop).
     ![Página de inicio](./images/readme/screenshot-index.png)
     ============================================================ -->

---

### 🛒 `productos.html` — Catálogo de productos

Muestra todos los productos disponibles en un grid de tarjetas. Incluye barra de búsqueda en tiempo real y filtros por categoría. Soporta parámetros en la URL para preseleccionar un filtro (ej: `productos.html?filtro=ofertas`).

<!-- ============================================================
     IMAGEN SUGERIDA #4
     Screenshot del grid de productos con los filtros visibles.
     ![Catálogo de productos](./images/readme/screenshot-productos.png)
     ============================================================ -->

**Categorías disponibles:**
- 🥩 Carnes y embutidos
- 🧴 Limpieza y hogar
- 🥛 Lácteos y huevo
- 🍞 Panadería
- 🥤 Bebidas
- 🫙 Enlatados y conservas
- 🌶️ Chiles y especias
- 🍬 Dulces y botanas

---

### 🏠 `nosotros.html` — Acerca de nosotros

Historia de la tienda, datos destacados, tarjetas de valores (Confianza, Frescura, Comunidad, Rapidez), sección del equipo de colaboradores, sección del equipo de desarrollo y formulario de contacto con mapa de Google Maps.

<!-- ============================================================
     IMAGEN SUGERIDA #5
     Screenshot de la sección de historia o valores.
     ![Nosotros](./images/readme/screenshot-nosotros.png)
     ============================================================ -->

---

### 👤 `registro.html` — Registro de usuarios

Formulario de registro de nuevos clientes. Incluye validaciones en tiempo real y al enviar, alertas de Bootstrap para errores y éxito, indicador de fortaleza de contraseña y generación de un objeto JSON con los datos del usuario al completar el registro.

<!-- ============================================================
     IMAGEN SUGERIDA #6
     Screenshot del formulario de registro con el panel de beneficios.
     ![Registro de usuarios](./images/readme/screenshot-registro.png)
     ============================================================ -->

**Campos del formulario:**
| Campo | Validación |
|---|---|
| Nombre(s) | Obligatorio |
| Apellidos | Obligatorio |
| Correo electrónico | Obligatorio · Formato válido |
| Teléfono | Obligatorio · Exactamente 10 dígitos |
| Fecha de nacimiento | Obligatorio · Mayor de 18 años |
| Género | Opcional |
| Dirección | Obligatorio |
| Contraseña | Obligatorio · Mínimo 8 caracteres · Al menos 1 número |
| Confirmar contraseña | Debe coincidir con la contraseña |
| Términos y condiciones | Debe aceptarse para enviar |

---

### 🔧 `admin.html` — Panel de administración

Página interna para que la dueña de la tienda registre nuevos productos. Incluye un formulario con selector de ícono (emoji), previsualización en tiempo real de cómo quedará la tarjeta del producto, validaciones de campos y generación del objeto JSON del producto al guardar.

<!-- ============================================================
     IMAGEN SUGERIDA #7
     Screenshot del panel de admin con el formulario y la previsualización.
     ![Panel de administración](./images/readme/screenshot-admin.png)
     ============================================================ -->

**Campos del producto:**
| Campo | Validación |
|---|---|
| Nombre | Obligatorio |
| Descripción | Obligatorio |
| Categoría | Obligatorio · Debe seleccionarse |
| Precio (MXN) | Obligatorio · Mayor a $0 |
| En oferta | Opcional (checkbox) |
| Descuento (%) | Requerido si hay oferta · Entre 1% y 99% |
| Ícono | Obligatorio · Seleccionar del grid de emojis |

---

## Estructura de archivos

```
abarrotes-almiux/
│
├── index.html          → Página de inicio
├── productos.html      → Catálogo de productos con filtros
├── nosotros.html       → Historia, valores, equipo y contacto
├── registro.html       → Registro de nuevos usuarios
├── admin.html          → Panel de administración de productos
│
├── styles.css          → Todos los estilos del proyecto
├── main.js             → Interactividad global (navbar, filtros, carrito)
│
└── images/
    ├── Almiux_Logo_Sin_Fondo.png
    ├── Almiux_tienda.jpeg
    ├── Alma.jpeg
    ├── Arturo_dev.jpeg
    ├── Confianza.png
    ├── Frescura.png
    ├── Comunidad.png
    ├── Rapidez.png
    ├── KALEB.png
    ├── DANNA.png
    ├── ARTURO.jpeg
    ├── ZARED.png
    ├── YARIS.png
    ├── DIEGO.png
    ├── NOE.jpeg
    └── imagenes-bebidas/   → Imágenes de productos de bebidas
```

---

## Tecnologías usadas

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura de todas las páginas |
| **CSS3** | Estilos, variables CSS, animaciones, responsive |
| **JavaScript (ES6+)** | Interactividad, validaciones, generación de JSON |
| **Bootstrap 4.4** | Alertas en formularios de registro y admin |
| **Google Fonts** | Fuentes Fraunces (títulos) y DM Sans (cuerpo) |
| **Formspree** | Envío del formulario de contacto |
| **Google Maps Embed** | Mapa de ubicación de la tienda |

---

## Funcionalidades

### Globales (todas las páginas)
- Navbar sticky con efecto de ocultar/mostrar al hacer scroll
- Menú hamburguesa para dispositivos móviles
- Link activo marcado automáticamente según la página actual
- Animaciones de entrada al hacer scroll (`reveal`)
- Diseño responsive: desktop · tablet · móvil

### Inicio (`index.html`)
- Contador animado en la franja de estadísticas
- Grid de categorías con navegación a productos con filtro preseleccionado
- Scroll suave al banner de ofertas

### Productos (`productos.html`)
- Filtros por categoría en tiempo real
- Búsqueda de productos por nombre en tiempo real
- Soporte para filtro vía parámetro en la URL (`?filtro=...`)
- Carrito flotante con contador de productos

### Registro (`registro.html`)
- Validación campo por campo en tiempo real (evento `blur`)
- Validación completa al hacer submit
- Alertas de Bootstrap para errores individuales y error global
- Indicador de fortaleza de contraseña (débil / regular / fuerte)
- Botón para mostrar/ocultar contraseña
- Generación del objeto JSON del usuario al registrarse exitosamente

### Admin (`admin.html`)
- Previsualización en tiempo real de la tarjeta del producto
- Selector de ícono con grid de emojis
- Campo de descuento que aparece solo si el producto está en oferta
- Generación y copia del objeto JSON del producto
- Botón para limpiar el formulario

---

## Equipo

**404 Team Not Found** · Generación [número de generación]

<!-- ============================================================
     IMAGEN SUGERIDA #8
     Foto grupal del equipo o grid con las fotos de perfil de cada integrante.
     ![Equipo 404 Team Not Found](./images/readme/foto-equipo.png)
     ============================================================ -->

| Integrante | Rol |
|---|---|
| **Kaleb Torres** | Developer · Scrum Master |
| **Danna Remigio** | Developer |
| **Arturo Ramírez** | Developer |
| **Yarilis Hernández** | Developer |
| **Zared Ortiz** | Developer |
| **Noé Hernández** | Developer |
| **Diego Quiñónez** | Developer |

---

## Cómo correr el proyecto

Este es un proyecto de frontend puro, no requiere instalación de dependencias ni servidor especial.

**Opción 1 — Abrir directamente en el navegador:**
```
Descarga o clona el repositorio y abre index.html en tu navegador.
```

**Opción 2 — Con Live Server (recomendado para desarrollo):**
```
1. Instala la extensión Live Server en VS Code
2. Clic derecho sobre index.html
3. Selecciona "Open with Live Server"
```

**Opción 3 — Clonar el repositorio:**
```bash
git clone https://github.com/[usuario]/[repositorio].git
cd [repositorio]
```

> **Nota:** Para que el formulario de contacto funcione correctamente, reemplaza el endpoint de Formspree en `contacto.html` con tu propio ID de formulario en [formspree.io](https://formspree.io).

---

*© 2026 · Abarrotes Almiux · Hecho en México con ❤️*
*Proyecto académico — Generation México Bootcamp*
