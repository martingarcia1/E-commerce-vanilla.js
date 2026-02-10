# 🛒 MG Store - E-commerce Vanilla JS

¡Bienvenido al repositorio de **MG Store**! Este proyecto es un sistema de E-commerce desarrollado como proyecto final de programación II. Combina un frontend dinámico construido con **Vanilla JavaScript** y un backend robusto con **Node.js y Express**.

## 🚀 Características Principales

### 🔐 Autenticación y Seguridad
- **Login y Registro**: Sistema seguro utilizando **JWT (JSON Web Tokens)** para manejo de sesiones.
- **Roles de Usuario**: Diferenciación entre usuarios administradores y clientes.
- **Seguridad**: Contraseñas encriptadas mediante **bcryptjs**.

### 🛠️ Panel de Administración
- **Gestión de Productos**: Los administradores pueden **agregar, editar y eliminar** productos del catálogo.
- **Persistencia en Cliente**: Los productos se gestionan dinámicamente utilizando `localStorage` para simular una base de datos persistente en el navegador.

### 🛍️ Experiencia de Usuario
- **Catálogo de Productos**: Visualización dinámica de productos disponibles con stock en tiempo real (simulado).
- **Carrito de Compras**: Funcionalidad completa para agregar productos, ver el resumen y "realizar compra".
- **Interfaz Responsiva**: Diseño adaptable a diferentes dispositivos.

## 💻 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla).
- **Backend**: Node.js, Express.js.
- **Seguridad**: `bcryptjs`, `jsonwebtoken` (JWT), `cookie-parser`.
- **Despliegue**: Optimizado para **Vercel** (Serverless Functions).

## 🌐 Ver Demo en Vivo

El proyecto está desplegado y funcionando en Vercel:
👉 **[Visitar MG Store](https://e-commerce-vanilla-js-mu.vercel.app/)**

> **Nota sobre el Despliegue**: Al estar desplegado en un entorno Serverless (Vercel) sin base de datos externa, los usuarios registrados se reinician periódicamente. Para pruebas, utiliza las credenciales fijas provistas abajo.

## 🛠️ Instalación y Ejecución Local

Si deseas correr el proyecto en tu máquina local:

1.  **Clonar el repositorio**:
    ```bash
    git clone https://github.com/martingarcia1/e-commerce-vanilla-js.git
    cd e-commerce-vanilla-js
    ```

2.  **Instalar dependencias**:
    ```bash
    cd login
    npm install
    ```

3.  **Configurar Variables de Entorno**:
    Crea un archivo `.env` en la carpeta `login` con el siguiente contenido (puedes cambiar los valores):
    ```env
    JWT_SECRET=tu_secreto_super_seguro
    JWT_COOKIE_EXPIRES=90
    ```

4.  **Iniciar el Servidor**:
    ```bash
    npm run dev
    ```

5.  Abrir en el navegador: `http://localhost:3000`

## 🧪 Credenciales de Prueba

Para probar las funcionalidades de los diferentes roles, puedes usar estos usuarios preconfigurados:

| Rol | Usuario | Contraseña |
| :--- | :--- | :--- |
| **Administrador** | `admin` | (Contraseña configurada en backend, default en código) |
| **Cliente** | `usuario` | (Contraseña configurada en backend, default en código) |

---
Desarrollado por **Martin Garcia** para el Examen Final de Programación II.
