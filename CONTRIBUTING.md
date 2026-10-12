# Guia de contribucion

## Ramas

- `main`: lo que esta estable. Solo recibe merges desde `develop`.
- `develop`: integracion. Todas las ramas de trabajo se crean desde aca y vuelven aca por PR.

## Flujo de trabajo

1. Actualizar `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. Crear rama con prefijo valido desde `develop`:
   ```bash
   git checkout -b feat/mi-funcionalidad
   ```
3. Commitear, pushear y abrir PR hacia `develop`.
4. Esperar CI en verde y mergear.
5. Cuando `develop` esta listo, abrir PR de `develop` hacia `main` y mergear.

## Workflows de GitHub Actions

| Workflow | Cuando corre | Que hace |
|----------|--------------|----------|
| `branch-check.yml` | PR hacia `develop` o `main` | Valida el prefijo de la rama. Hacia `main` solo acepta `develop`. |
| `ci.yml` | PR hacia `develop` o `main`, push a `develop` | `npm ci`, build y tests. |

**Todavia no hay release.** El merge de `develop` a `main` no dispara ningun workflow: no hay versionado automatico, tags ni GitHub Releases. Cuando se quiera publicar, se agrega un `release.yml` como el de `ultron-gestion-activos-frontend`.

## Convencion de ramas

| Prefijo | Uso |
|---------|-----|
| `fix/` | Correccion de bugs |
| `feat/` | Funcionalidades nuevas |
| `refactor/` | Limpieza interna |
| `test/` | Pruebas |
| `docs/` | Documentacion |
| `chore/` | Mantenimiento |
| `style/` | Formato/estilo |
| `cursor/` | Ramas creadas por agentes de Cursor |

## Ejemplos

```bash
git checkout -b fix/error-busqueda
git checkout -b feat/pagina-carrito
git checkout -b chore/actualizar-dependencias
```
