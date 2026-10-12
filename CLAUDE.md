You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## Project Structure

This is the Red Automotriz web app (Angular + Angular Material + SSR). It follows the same architecture as `ultron-gestion-activos-frontend`:

- `src/app/core/`: app-wide singleton services (auth, interceptors, guards).
- `src/app/layouts/main-layout/`: header menu + `<main>` with the page `router-outlet`.
- `src/app/shared/`: reusable components, models, services, pipes and directives. Export them from `src/app/shared/index.ts`.
- `src/app/features/<feature>/`: one folder per business feature, with `<feature>.routes.ts` (`<FEATURE>_ROUTES`) and `pages/`. Register it in `app.routes.ts` with `loadChildren`, as a child of `MainLayoutComponent`.
- The header menu lives in `src/app/shared/components/header/`. Its layout (brand on the left; search, cart and user icons on the right; search opens inline in the middle of the bar, never below it) is documented in `README.md`; keep it.

## Styles and Angular Material

- Use Angular Material components (`mat-toolbar`, `mat-icon-button`, `mat-icon`, …) before writing custom ones.
- Customize Material with the `mat.*-overrides` mixins in the component SCSS. Do NOT use `::ng-deep` or target internal `.mat-mdc-*` classes.
- Colors come from the CSS variables in `src/styles.scss` (`:root`): `--brand-color`, `--on-brand-color`, `--on-brand-muted`, `--bg-color`, `--text-primary`, `--text-secondary`. Do NOT hardcode colors in components; if a token is missing, add it to `src/styles.scss`.
- `--on-brand-muted` over `--brand-color` is only 3:1: use it for icons and borders, never for text.
- Icons use the `material-icons` font. Use `fontSet="material-icons-outlined"` for outlined icons.
- Keep each component stylesheet under the 4 kB budget.

## Git Workflow

- Branch from `develop` with a valid prefix (`feat/`, `fix/`, `refactor/`, `test/`, `docs/`, `chore/`, `style/`, `cursor/`) and open the PR to `develop`.
- Only `develop` merges into `main`.
- There is no release yet: merging into `main` must not trigger any workflow. Do NOT add release or versioning jobs unless asked. See `CONTRIBUTING.md`.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection
