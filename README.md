# Ultron Red Automotriz — Frontend

## Acerca del proyecto

**Red Automotriz** es la **tienda web para clientes** de Ultron Sistemas. El ERP/admin queda en el desktop de gestión de activos; este sitio es solo vitrina y compra. Vende **productos** publicados desde el backend (`mostrarEnWeb`, imagen y precio de venta > 0).

El **catálogo se navega sin registrarse**. La cuenta de cliente es opcional (más rápida en checkout) y se vincula a `personas.cliente` vía GraphQL.

Está hecho con Angular 22 + Angular Material, con SSR. Misma arquitectura base que `ultron-gestion-activos-frontend`.

## Requisitos

- Node.js `^22.22.3`, `^24.15.0` o `>=26` (lo exige Angular 22).
- npm 11.
- Backend Ultron en `http://localhost:8081` (GraphQL en `/graphql`, imágenes en `/uploads/...`). Se puede overridear con `localStorage` key `ra-api-base-url`.

## Comandos

```bash
npm install
npm start          # ng serve en http://localhost:4200/
npm run build      # build de producción con SSR en dist/
npm test           # tests unitarios con Vitest
npm run serve:ssr:ultron-red-automotriz-frontend   # sirve el build SSR (puerto 4000)
```

## Estructura de carpetas

```text
src/app/
├── config/            # api.config.ts + sitio.config.ts
├── core/              # graphql, almacenamiento local, auth cliente web
├── layouts/main-layout/  # header + barra de departamentos + drawer
├── shared/            # header, footer, svg-icon
└── features/
    ├── inicio/        # hero + categorías + destacados + newsletter
    ├── productos/     # listado, detalle, nav de departamentos, GraphQL
    ├── cuenta/        # registro, login, mi cuenta
    ├── carrito/       # carrito en localStorage
    ├── checkout/      # cliente + tarjeta → registrarPedidoWeb
    └── pedido/        # confirmación por código
```

Rutas principales: `/`, `/productos`, `/productos/:id`, `/productos?categoria=&q=`, `/categorias/:id` (redirige), `/carrito`, `/checkout`, `/pedido/:codigo`, `/cuenta`, `/cuenta/iniciar-sesion`, `/cuenta/registro`.

## Menú superior y departamentos

Barra roja `#EA1414`, marca a la izquierda; búsqueda, carrito y usuario a la derecha. La búsqueda se abre en el medio de la barra. Debajo, barra horizontal de departamentos (`catalogoWebCategoriasNav`) hacia `/productos?categoria=<id>`. El icono de cuenta lleva a `/cuenta` si hay sesión, si no a `/cuenta/iniciar-sesion`.

## Catálogo, cuenta y carrito

- `ProductosService`: `catalogoWebProductos(filter, idCategoria)`, `catalogoWebProductoPorId`, `catalogoWebCategorias`, `catalogoWebCategoriasNav`.
- `AuthService`: sesión en `localStorage` (`ra-cliente-sesion-v1`); `GraphqlService` envía `Authorization: Bearer` cuando hay token.
- Cuenta: `registrarCuentaClienteWeb`, `loginClienteWeb`, `miCuentaClienteWeb`.
- Checkout permite invitado; si hay sesión, precarga datos y muestra CTA suave para login/registro.
- `CarritoService` persiste en `localStorage` (`ra-carrito-v1`).
- Pedido: `registrarPedidoWeb`. Newsletter: `suscribirNewsletter`.

## Pie de página

Contacto en `sitio.config.ts`. Menú: Productos, Categorías (inicio), Carrito, Cuenta, Métodos de pago — en `footer-contenido.ts`.

## Estilos

Tema Material claro con paleta roja y Poppins (`src/styles.scss`). Tokens: `--brand-color`, `--on-brand-color`, `--on-brand-muted`, `--bg-color`, `--surface-color`, `--border-color`, `--text-primary`, `--text-secondary`, `--radius-md`, `--header-height`, `--content-max-width`, `--font-brand`.

## Flujo de trabajo y CI

Igual que en `ultron-gestion-activos-frontend`, pero sin release. Ver [CONTRIBUTING.md](CONTRIBUTING.md).
