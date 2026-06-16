# Coffe Time — Examen Final

Aplicación web tipo SPA (Single Page Application) desarrollada con **Vue.js 3**, **Vue Router** y **Bootstrap 5**, conectada a una API simulada con **MockAPI**. El proyecto simula una tienda de cafetería con autenticación de usuarios, rutas protegidas y CRUD completo de **Usuarios** y **Productos**.

> Examen final — Desarrollo de Aplicaciones Web y Sistemas Operativos.
> Basado en el proyecto del segundo parcial, ahora conectado a MockAPI.

## Integrantes del grupo

- Integrante 1: _Juan Sebastian Bayona Peñaranda_ Codigo:_0192611_
- Integrante 2: _Andres Felipe Carrascal Avendaño_ Codigo:_0192631_

## Tecnologías utilizadas

- Vue.js 3 (Composition API / `<script setup>`)
- Vite
- Vue Router 4 (rutas protegidas con *navigation guards*)
- Bootstrap 5 (grid, formularios, modales, alertas)
- Bootstrap Icons
- MockAPI (API REST simulada para `usuarios` y `productos`)
- Axios (consumo de la API REST)
- localStorage (token simulado y sesión)

## Funcionalidades

### Autenticación
- Formulario de inicio de sesión que valida usuario y contraseña contra el recurso `usuarios` de MockAPI.
- Al autenticarse correctamente se genera un **token simulado** y se guarda junto con los datos de sesión en `localStorage`.
- Formulario de registro que crea un nuevo usuario (rol `user`) en MockAPI.
- Botón de **Cerrar sesión** que limpia el token y la sesión.

### Rutas protegidas
- `Vue Router` con *navigation guards* (`beforeEach`).
- Si no hay sesión activa, cualquier ruta privada redirige automáticamente a `/login`.
- Las vistas de **Productos** y **Usuarios** solo son accesibles con sesión activa.

### CRUD de Usuarios (`/usuarios`)
- Listado de usuarios en tabla responsiva.
- Crear usuario mediante modal de Bootstrap.
- Editar usuario mediante modal de Bootstrap.
- Eliminar usuario con modal de confirmación.
- Alertas de éxito/error tras cada operación.
- Consumo del recurso `usuarios` de MockAPI (GET, POST, PUT, DELETE).

### CRUD de Productos (`/`)
- Listado de productos en tarjetas (grid responsivo).
- Crear producto mediante modal de Bootstrap.
- Editar producto mediante modal de Bootstrap.
- Eliminar producto con modal de confirmación.
- Íconos de Bootstrap Icons (lápiz para editar, papelera para eliminar, `+` para crear).
- Consumo del recurso `productos` de MockAPI (GET, POST, PUT, DELETE).
- Solo el usuario con rol `admin` puede crear, editar o eliminar productos.

### Control de acceso por rol (RBAC)

La aplicación diferencia las acciones disponibles según el rol del usuario autenticado:

Implementado con v-if y computeds (canManageProducts, canBuyProducts) que leen el rol desde el authStore. El admin gestiona el catálogo, el usuario consume.

### Carrito de compras (función adicional)
- Agregar productos, aumentar/disminuir cantidades, eliminar ítems y calcular el total.
- Persistencia por usuario en `localStorage`.

## Estructura del proyecto

```txt
src/
  components/
    AppHeader.vue
    AppFooter.vue
    AppNavigation.vue
    ProductCard.vue
    ProductFormModal.vue   -> modal Bootstrap (crear/editar producto)
    UserFormModal.vue      -> modal Bootstrap (crear/editar usuario)
    ConfirmModal.vue        -> modal Bootstrap de confirmación (eliminar)
    CartItem.vue
  views/
    LoginView.vue
    ProductsView.vue
    UsersView.vue
    CartView.vue
  router/
    index.js               -> rutas + navigation guards
  services/
    config.js              -> URL base de MockAPI
    api.js                 -> cliente HTTP genérico (axios)
    userService.js         -> CRUD de "usuarios" + validación de login
    productService.js      -> CRUD de "productos"
  stores/
    authStore.js           -> sesión, login, registro, logout, token simulado
    usersStore.js          -> estado y CRUD de usuarios
    productsStore.js       -> estado y CRUD de productos
    shopStore.js           -> carrito de compras (extra)
  utils/
  App.vue
  main.js
  styles.css
scripts/
  seed.js                  -> script para poblar MockAPI con datos iniciales
data/
  productos.json           -> referencia (ya no se usa para cargar datos)
images/
img/
```

## Configuración de MockAPI

1. Crea una cuenta en [mockapi.io](https://mockapi.io) y un proyecto.
2. Crea dos recursos:
   - **usuarios**: `nombre` (string), `usuario` (string), `password` (string), `rol` (string), `email` (string)
   - **productos**: `nombre` (string), `descripcion` (string), `precio` (number), `imagen` (string)
3. Copia la URL base de tu proyecto y pégala en `src/services/config.js`:

```js
export const API_BASE_URL = 'https://6a2ecc5bc9776ca6c0c4f481.mockapi.io';
```

> Verifica abriendo en el navegador `TU-PROYECTO.mockapi.io/usuarios`: debe responder un arreglo JSON (`[]` o con datos). Si te da error 404, agrega el prefijo `/api/v1` a la URL base.

## Poblar MockAPI con datos iniciales (seed)

Una vez configurada la URL en `src/services/config.js`, ejecuta:

```bash
npm run seed
```

Esto crea automáticamente:
- 2 usuarios de prueba:
  - `Coffe` / `2026` -> rol **admin**
  - `demo` / `1234` -> rol **user**
- Los 10 productos del catálogo de café.

## Comandos

Instalar dependencias:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Generar versión de producción:

```bash
npm run build
```

## Credenciales de prueba

```txt
Usuario: Coffe
Contraseña: 2026
Rol: admin (puede gestionar productos y usuarios)
```

```txt
Usuario: Juan
Contraseña: 1523
Rol: user (puede ver productos y usar el carrito)
```

También puedes crear una cuenta nueva desde la opción **"Crear una cuenta nueva"** en el login.
