🏪 ALMIUX — Sistema de Gestión para Tienda de Abarrotes

Proyecto desarrollado por el equipo 404 Team Not Found como parte del Bootcamp de Desarrollo Full Stack de Generation México.

📖 Descripción

ALMIUX es una plataforma web desarrollada para la administración y gestión de una tienda de abarrotes. El sistema integra un frontend responsivo para la interacción de los usuarios y un backend desarrollado con Spring Boot que expone una API REST para la gestión de información.

La plataforma permite administrar productos, usuarios y operaciones relacionadas con el negocio mediante una arquitectura cliente-servidor, facilitando la organización del inventario y mejorando la experiencia de los clientes.

🚀 Características Principales
Frontend
Diseño responsivo para dispositivos móviles, tablets y escritorio.
Catálogo de productos organizado por categorías.
Búsqueda y filtrado dinámico de productos.
Formularios de registro y autenticación.
Página institucional con información del negocio.
Panel administrativo para gestión de productos.
Backend
API REST desarrollada con Spring Boot.
Arquitectura basada en capas.
Persistencia de datos mediante JPA/Hibernate.
Gestión de usuarios.
Gestión de productos.
Validación de datos.
Integración con base de datos MySQL.
🖼️ Capturas del Proyecto
Página de Inicio

Agregar captura de pantalla aquí.

![Inicio](./docs/images/inicio.png)
Catálogo de Productos

Agregar captura de pantalla aquí.

![Productos](./docs/images/productos.png)
Registro de Usuarios

Agregar captura de pantalla aquí.

![Registro](./docs/images/registro.png)
Panel Administrativo

Agregar captura de pantalla aquí.

![Admin](./docs/images/admin.png)
API REST

Agregar captura de Swagger o Postman aquí.

![Swagger](./docs/images/swagger.png)
🏗️ Arquitectura General
┌─────────────────────┐
│      Frontend       │
│ HTML • CSS • JS     │
└──────────┬──────────┘
           │ HTTP
           ▼
┌─────────────────────┐
│ Spring Boot REST API│
│ Controllers         │
│ Services            │
│ Repositories        │
└──────────┬──────────┘
           │ JPA
           ▼
┌─────────────────────┐
│       MySQL         │
│   Base de Datos     │
└─────────────────────┘
🛠️ Tecnologías Utilizadas
Frontend
Tecnología	Descripción
HTML5	Estructura del sitio
CSS3	Estilos y diseño responsivo
JavaScript ES6+	Interactividad del sistema
Bootstrap	Componentes y utilidades visuales
Backend
Tecnología	Descripción
Java	Lenguaje principal
Spring Boot	Framework backend
Spring Data JPA	Persistencia de datos
Hibernate	ORM
Maven	Gestión de dependencias
Base de Datos
Tecnología	Descripción
MySQL	Base de datos relacional
Herramientas
Herramienta	Uso
Git	Control de versiones
GitHub	Repositorio del proyecto
Postman	Pruebas de API
MySQL Workbench	Administración de base de datos
VS Code	Desarrollo Frontend
IntelliJ IDEA	Desarrollo Backend
📂 Estructura del Proyecto
ALMIUX/
│
├── frontend/
│   ├── index.html
│   ├── productos.html
│   ├── nosotros.html
│   ├── login.html
│   ├── registro.html
│   ├── admin.html
│   ├── css/
│   ├── js/
│   └── images/
│
├── backend/
│   ├── src/main/java
│   ├── src/main/resources
│   ├── pom.xml
│   └── application.properties
│
└── README.md
🔌 API REST
Usuarios
Método	Endpoint	Descripción
GET	/users	Obtener todos los usuarios
GET	/users/{id}	Obtener usuario por ID
GET	/users/email	Buscar usuario por correo
POST	/users	Crear usuario
PUT	/users/{id}	Actualizar usuario
DELETE	/users/{id}	Eliminar usuario
Productos
Método	Endpoint	Descripción
GET	/products	Obtener productos
GET	/products/{id}	Obtener producto por ID
POST	/products	Crear producto
PUT	/products/{id}	Actualizar producto
DELETE	/products/{id}	Eliminar producto
🗄️ Base de Datos

El sistema utiliza una base de datos relacional en MySQL para almacenar la información de usuarios y productos.

Modelo Entidad-Relación

Agregar imagen del diagrama ER aquí.

![Modelo ER](./docs/images/diagrama-er.png)
⚙️ Instalación y Configuración
1. Clonar el repositorio
git clone https://github.com/TU-USUARIO/ALMIUX.git
cd ALMIUX
2. Configurar la base de datos

Crear una base de datos en MySQL:

CREATE DATABASE almiux_db;

Configurar las credenciales en:

src/main/resources/application.properties

Ejemplo:

spring.datasource.url=jdbc:mysql://localhost:3306/almiux_db
spring.datasource.username=root
spring.datasource.password=tu_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
3. Ejecutar Backend

Desde la carpeta backend:

mvn clean install
mvn spring-boot:run

La API estará disponible en:

http://localhost:8080
4. Ejecutar Frontend

Abrir el archivo:

index.html

o utilizar la extensión Live Server de VS Code.

📋 Funcionalidades
Gestión de Usuarios
Registro de usuarios.
Consulta de usuarios.
Actualización de información.
Eliminación de registros.
Validación de datos.
Gestión de Productos
Alta de productos.
Consulta de productos.
Actualización de productos.
Eliminación de productos.
Clasificación por categorías.
Experiencia de Usuario
Diseño responsivo.
Navegación intuitiva.
Formularios validados.
Interfaz amigable.
👥 Equipo de Desarrollo
404 Team Not Found
Integrante	Rol
Kaleb Torres	Scrum Master · Developer
Danna Remigio	Developer
Arturo Ramírez	Developer
Yarilis Hernández	Developer
Zared Ortiz	Developer
Noé Hernández	Developer
Diego Quiñónez	Developer
🎓 Proyecto Académico

Proyecto desarrollado como parte del Bootcamp Full Stack Java de Generation México, aplicando conocimientos de:

Desarrollo Frontend
Desarrollo Backend
APIs REST
Bases de Datos Relacionales
Metodologías Ágiles
Control de Versiones con Git
📞 Contacto

Para más información sobre el proyecto:

GitHub del proyecto
Repositorio Backend
Repositorio Frontend
📄 Licencia

Este proyecto fue desarrollado con fines académicos y educativos.

Hecho en México 🇲🇽 por el equipo 404 Team Not Found
