# Ultron Red Automotriz — Frontend

## Acerca del proyecto

**Red Automotriz** es un sistema web (Angular 22 + Angular Material, con SSR) de Ultron Sistemas. Sigue la misma arquitectura, estructura de carpetas y buenas prácticas que `ultron-gestion-activos-frontend`, pero se publica como sitio web, no como app de escritorio.

## Requisitos

- Node.js `^22.22.3`, `^24.15.0` o `>=26` (lo exige Angular 22).
- npm 11.

## Comandos

```bash
npm install
npm start          # ng serve en http://localhost:4200/
npm run build      # build de producción con SSR y prerender en dist/
npm test           # tests unitarios con Vitest
npm run serve:ssr:ultron-red-automotriz-frontend   # sirve el build SSR (puerto 4000)
```

## Estructura de carpetas

Es la misma que en `ultron-gestion-activos-frontend`:

```text
src/app/
├── app.ts, app.config.ts, app.routes.ts     # raíz: solo <router-outlet />, providers y rutas
├── app.config.server.ts, app.routes.server.ts
├── config/            # configuración de la app (URLs de API, versión), cuando haga falta
├── core/              # servicios singleton transversales (auth, interceptores, guards)
├── layouts/
│   └── main-layout/   # menú superior + <main> con el router-outlet de las páginas
├── shared/            # piezas reutilizables, exportadas desde shared/index.ts
│   └── components/
│       └── header/    # el menú superior (ver abajo)
└── features/          # un directorio por módulo de negocio, cargado de forma lazy
    └── inicio/
        ├── inicio.routes.ts
        └── pages/inicio/
```

Cada feature expone un `*.routes.ts` (`INICIO_ROUTES`, …) y se registra en `app.routes.ts` con `loadChildren`, dentro de los hijos de `MainLayoutComponent`.

## Menú superior (`shared/components/header`)

Copia el estilo del menú de referencia (barra roja `#EA1414`, marca en Poppins seminegrita a la izquierda e iconos a la derecha) con estos cambios:

| Referencia | Red Automotriz |
|------------|----------------|
| Marca "Trébol." | "Red Automotriz." (enlace al inicio) |
| Lupa del centro | Se quitó |
| Icono de ubicación | Lupa |
| Corazón | Carrito, con el contador de productos |
| Carrito | Usuario |

Los iconos de la derecha están un poco más separados que en la referencia (12 px entre botones; 4 px en móvil).

Comportamiento:

- La lupa abre el campo de búsqueda debajo de la barra y le da el foco; otro clic lo cierra. `Escape` también lo cierra y devuelve el foco a la lupa.
- Al enviar, el header emite `buscar` con el término sin espacios; vacío no emite.
- El carrito emite `abrirCarrito` y muestra `cantidadCarrito` (input, por defecto 0). El usuario emite `abrirCuenta`.
- Todavía no hay páginas de búsqueda, carrito ni cuenta: el layout no escucha esas salidas. Al crear esas features, conectarlas en `MainLayoutComponent`.

Material: `mat-toolbar`, `mat-icon-button` y `mat-icon` (fuente `material-icons`; el usuario usa la variante `material-icons-outlined`). Los colores de la barra se ajustan con `mat.toolbar-overrides` y `mat.icon-button-overrides` en `header.scss`, usando los tokens de `src/styles.scss`.

## Estilos

- Tema de Angular Material claro con paleta roja y tipografía Poppins (`src/styles.scss`). La fuente viene de `@fontsource/poppins` (sin pedidos a Google Fonts).
- Los colores se toman de las variables CSS de `:root` en `src/styles.scss` (`--brand-color`, `--on-brand-color`, `--on-brand-muted`, `--bg-color`, `--text-primary`, `--text-secondary`, `--header-height`, `--content-max-width`, `--font-brand`). Si falta un color, se agrega ahí.

## Flujo de trabajo y CI

Igual que en `ultron-gestion-activos-frontend`, pero sin release. Ver [CONTRIBUTING.md](CONTRIBUTING.md).
