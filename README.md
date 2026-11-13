# Ultron Red Automotriz — Frontend

## Acerca del proyecto

**Red Automotriz** es la tienda web de Ultron Sistemas. Vende **productos** publicados desde el backend de **gestión de activos** (GraphQL: `catalogoWebProductos`, pedidos web y newsletter). Solo aparecen ítems con `mostrarEnWeb`, imagen y precio de venta mayor a cero.

Está hecho con Angular 22 + Angular Material, con SSR. Sigue la misma arquitectura y buenas prácticas que `ultron-gestion-activos-frontend`, pero se publica como sitio web.

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
├── core/              # graphql, almacenamiento local
├── layouts/main-layout/
├── shared/            # header, footer, svg-icon
└── features/
    ├── inicio/        # hero + grilla de productos + newsletter
    ├── productos/     # listado, detalle, tarjeta, catálogo GraphQL
    ├── carrito/       # carrito en localStorage
    ├── checkout/      # cliente + tarjeta → registrarPedidoWeb
    └── pedido/        # confirmación por código
```

Rutas principales: `/`, `/productos`, `/productos/:id`, `/carrito`, `/checkout`, `/pedido/:codigo`. `/marcas` y `/vendedor` redirigen al catálogo.

## Menú superior (`shared/components/header`)

Barra roja `#EA1414`, marca a la izquierda; búsqueda, carrito y usuario a la derecha. La búsqueda se abre en el medio de la barra (nunca debajo). Al enviar, navega a `/productos?q=...`. El carrito muestra la cantidad y abre `/carrito`.

## Catálogo y carrito

- `ProductosService` consulta `catalogoWebProductos` / `catalogoWebProductoPorId` / `catalogoWebCategorias`.
- Las imágenes relativas se resuelven contra `{api}/uploads/...`.
- `CarritoService` persiste líneas `{ productoId, presentacionId?, cantidad, nombre, precio, imagenUrl }` en `localStorage` (`ra-carrito-v1`).
- Checkout envía `registrarPedidoWeb` (incluye `pagoTarjeta` al backend; no loguear el PAN).
- Newsletter: mutation `suscribirNewsletter`.

## Pie de página

Contacto en `sitio.config.ts`. Columnas (Menú → Productos/Carrito, etc.) en `footer-contenido.ts`.

## Estilos

Tema Material claro con paleta roja y Poppins (`src/styles.scss`). Tokens: `--brand-color`, `--on-brand-color`, `--on-brand-muted`, `--bg-color`, `--surface-color`, `--border-color`, `--text-primary`, `--text-secondary`, `--radius-md`, `--header-height`, `--content-max-width`, `--font-brand`.

## Flujo de trabajo y CI

Igual que en `ultron-gestion-activos-frontend`, pero sin release. Ver [CONTRIBUTING.md](CONTRIBUTING.md).
