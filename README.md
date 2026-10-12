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
├── config/            # configuración de la app: sitio.config.ts (contacto y redes)
├── core/              # servicios singleton transversales (auth, interceptores, guards)
├── layouts/
│   └── main-layout/   # menú superior + <main> con el router-outlet + pie de página
├── shared/            # piezas reutilizables, exportadas desde shared/index.ts
│   ├── models/        # interfaces compartidas (footer.model.ts)
│   └── components/
│       ├── header/    # el menú superior (ver abajo)
│       ├── footer/    # el pie de página (ver abajo)
│       └── svg-icon/  # logos de marcas en SVG
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

- La lupa muestra el campo de búsqueda en el espacio del medio de la barra (sin desplegar nada hacia abajo) y le da el foco; otro clic lo oculta. `Escape` también lo oculta y devuelve el foco a la lupa.
- En pantallas de menos de 768 px no hay lugar en el medio: mientras la búsqueda está abierta, el campo ocupa el lugar de la marca.
- Al enviar, el header emite `buscar` con el término sin espacios; vacío no emite.
- El carrito emite `abrirCarrito` y muestra `cantidadCarrito` (input, por defecto 0). El usuario emite `abrirCuenta`.
- Todavía no hay páginas de búsqueda, carrito ni cuenta: el layout no escucha esas salidas. Al crear esas features, conectarlas en `MainLayoutComponent`.

Material: `mat-toolbar`, `mat-icon-button` y `mat-icon` (fuente `material-icons`; el usuario usa la variante `material-icons-outlined`). Los colores de la barra se ajustan con `mat.toolbar-overrides` y `mat.icon-button-overrides` en `header.scss`, usando los tokens de `src/styles.scss`.

## Pie de página (`shared/components/footer`)

Sigue el pie de la referencia: fondo `--brand-color`, una fila de columnas, una línea divisoria, los enlaces legales, los métodos de pago y una franja blanca con los créditos.

- **Contacto:** marca, "¿Necesitas ayuda?", enlace a Atención al Cliente, teléfono (enlace `tel:`) y redes sociales (se abren en otra pestaña y lo avisan en la etiqueta).
- **Columnas:** Menú, Categorías, Info y Mi cuenta. Cada una es un `<nav>` nombrado por su título.
- **Legales:** Términos y condiciones, Política de privacidad y Métodos de pago.
- **Pagos:** Mastercard, American Express, JCB, Discover, Visa, PayPal y Diners Club.
- **Créditos:** "© {año} Red Automotriz."

Dónde se cambia cada cosa:

- Teléfono y redes sociales: `src/app/config/sitio.config.ts`. **Los valores actuales son provisorios** (`+595 21 000 000` y las portadas de cada red); hay que reemplazarlos por los reales.
- Columnas, enlaces legales y métodos de pago: `shared/components/footer/footer-contenido.ts`.
- Las rutas de esos enlaces todavía no tienen página: el comodín `**` de `app.routes.ts` las manda al inicio hasta que se cree cada feature.

Los logos de redes y tarjetas no existen en Material Icons. Salen de `@fortawesome/free-brands-svg-icons` (licencia CC BY 4.0) y se dibujan con `app-svg-icon` (`shared/components/svg-icon`), que solo agrega al bundle los logos importados.

En pantallas de menos de 1024 px las columnas pasan a dos por fila, con el bloque de contacto arriba ocupando todo el ancho.

## Estilos

- Tema de Angular Material claro con paleta roja y tipografía Poppins (`src/styles.scss`). La fuente viene de `@fontsource/poppins` (sin pedidos a Google Fonts).
- Los colores se toman de las variables CSS de `:root` en `src/styles.scss` (`--brand-color`, `--on-brand-color`, `--on-brand-muted`, `--bg-color`, `--text-primary`, `--text-secondary`, `--header-height`, `--content-max-width`, `--font-brand`). Si falta un color, se agrega ahí.

## Flujo de trabajo y CI

Igual que en `ultron-gestion-activos-frontend`, pero sin release. Ver [CONTRIBUTING.md](CONTRIBUTING.md).
