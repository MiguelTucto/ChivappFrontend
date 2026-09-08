# Chivapp — Design System

Referencia de diseño para mantener consistencia visual en todas las vistas.

## Marca

| Campo | Valor |
|-------|-------|
| Nombre | **Chivapp** |
| Copy de UI | Español |
| Código (variables, funciones, archivos) | Inglés |

## Fuente de verdad

Los tokens viven en `tailwind.config.ts` (plugin HeroUI). **No** duplicar colores en CSS ni usar valores sueltos.

- Componentes interactivos → HeroUI directo (`Button`, `Input`, `Card`, etc.)
- UI custom de dominio → mismas clases/token del tema (sin wrappers genéricos)

## Colores

Paleta refinada (v2): celeste/teal originales, más profundos y con escala completa para
degradados y estados. Se mantiene la identidad, se gana contraste y profundidad.

| Token | Hex (DEFAULT) | Uso | Clases |
|-------|-----|-----|--------|
| `primary` | `#46C0D9` | CTAs, acentos, hover celeste (escala 50–900 disponible) | `bg-primary`, `text-primary-700`, `border-primary/40` |
| `primary-foreground` | `#101826` | Texto sobre celeste | `text-primary-foreground` |
| `secondary` | `#3A6169` | Acento complementario (teal, escala 50–900 disponible) | `bg-secondary`, `text-secondary-700` |
| `background` | `#F5F7F8` | Fondo de página | `bg-background` |
| `foreground` | `#101826` | Texto principal (navy casi negro, más "trust" que gris puro) | `text-foreground` |
| `content1` | `#FFFFFF` | Cards, navbar, superficies | `bg-content1` |
| `default-200` | `#E4E4E7` | Bordes suaves | `border-default-200` |
| `default-300` | `#D4D4D8` | Bordes visibles | `border-default-300` |
| `default-400` | `#A1A1AA` | Texto secundario | `text-default-400` |
| `default-500` | `#71717A` | Texto muted | `text-default-500` |
| `default-900` | `#0F1213` | Footer, secciones oscuras | `bg-default-900` |

### Degradados y sombras

| Token | Clase | Uso |
|-------|-------|-----|
| `bg-gradient-brand` | fondo degradado celeste → teal | Botones/CTAs destacados, badges premium |
| `bg-gradient-radial-brand` | halo radial celeste sutil | Fondo detrás del hero, secciones destacadas |
| `bg-gradient-surface` | degradado blanco → gris muy sutil | Cards con relieve suave sin usar imagen |
| `shadow-soft` | sombra baja, casi imperceptible | Cards en reposo |
| `shadow-elevated` | sombra amplia y difusa | Cards en hover / modales destacados |
| `shadow-glow` / `shadow-glow-lg` | resplandor celeste | CTAs primarios, elementos que necesitan foco |

### Reglas de color

- ❌ No usar `text-black`, `text-gray-*`, `bg-white`, hex sueltos (`#0f1213`)
- ✅ Usar tokens del tema
- ✅ Sobre imágenes oscuras se permite `text-white` / `border-white/40` (overlay)
- ✅ Usar `bg-gradient-brand` con moderación (1–2 elementos por vista) para no perder el look minimalista

## Tipografía

**Una sola familia** en toda la app: **Geist Sans** (`font-sans`, aplicada globalmente en
`body`). Legible, profesional y neutra — no se usan fuentes serif ni display adicionales.
La jerarquía se logra solo con tamaño, peso y tracking, nunca cambiando de fuente.

| Nivel | Clases | Uso |
|-------|--------|-----|
| Hero / H1 | `text-3xl md:text-4xl font-bold tracking-tight leading-tight` | Títulos principales |
| Sección / H2 | `text-3xl md:text-4xl font-bold tracking-tight` | Títulos de sección |
| Card / H3 | `text-lg font-bold` | Subtítulos en cards |
| Body | `text-base` | Párrafos |
| Body large | `text-lg` | Subtítulos hero |
| Muted | `text-sm text-default-500` | Texto secundario |
| Label | `text-sm font-semibold` | Labels de navegación |
| Números / cifras | `font-bold tabular-nums leading-none` | Contadores, pasos, precios |

## Espaciado y layout

| Patrón | Clases | Uso |
|--------|--------|-----|
| Offset navbar | `pt-28` | Contenido bajo navbar fija |
| Padding horizontal | `px-4 md:px-8` | Páginas y secciones |
| Sección vertical | `py-20` | Bloques de contenido |
| Ancho contenido | `max-w-content mx-auto` | Secciones amplias (80rem) |
| Ancho footer | `max-w-footer mx-auto` | Footer (75rem) |
| Grid home | `gap-6` | Masonry de músicos |

## Border radius

| Token HeroUI | Valor | Uso |
|--------------|-------|-----|
| `radius="sm"` | 0.5rem | Elementos pequeños |
| `radius="md"` | 0.75rem | Botones navbar |
| `radius="lg"` | 2rem | Cards, HeroUI large |
| `rounded-4xl` | 2rem | Cards custom (hero, músicos, process) |
| `rounded-full` | — | Pills, avatares, CTAs redondos |

## HeroUI — componentes y cuándo usarlos

```tsx
import { Button, Input, Card, CardBody, CardHeader } from "@heroui/react";
```

| Componente | Cuándo |
|------------|--------|
| `Button` | CTAs, acciones navbar, formularios |
| `Input` | Campos de formulario (login, registro) |
| `Card` | Contenedores con borde/sombra (auth, modals) |
| `Modal` | Diálogos y confirmaciones |
| `Dropdown` | Menús de usuario |

### Variantes de Button habituales

```tsx
// CTA principal (celeste)
<Button color="primary" radius="lg" className="font-semibold">

// Icono navbar
<Button isIconOnly variant="light" radius="full" aria-label="Buscar">

// CTA secundario (fondo blanco → hover celeste)
<Button variant="flat" radius="full" className="bg-content1 font-semibold hover:bg-primary">
```

## Patrones de clases (UI custom)

### Card de superficie

```
bg-content1 rounded-4xl shadow-soft border border-default-200/70 hover:shadow-elevated
```

### Card con degradado (destacada)

```
bg-gradient-to-br from-primary/15 via-content1 to-secondary/10 rounded-4xl border border-primary/20
```

### Navbar (glass/transparente)

```
fixed top-0 w-full z-50 bg-content1/60 backdrop-blur-xl border-b border-white/40 shadow-soft
```

### Footer oscuro

```
bg-default-900 text-white border-t border-white/10
```

Texto muted en footer: `text-default-400`, hover: `hover:text-white`.

## Transiciones

| Patrón | Clases |
|--------|--------|
| Hover suave | `transition-all duration-300` |
| Hover escala (CTA) | `hover:scale-105 transition-all duration-300` |
| Hover card | `hover:-translate-y-1 transition-all duration-300` |
| Imagen zoom | `group-hover:scale-105 transition-transform duration-500 ease-out` |

## Archivos clave

| Archivo | Responsabilidad |
|---------|-----------------|
| `tailwind.config.ts` | Tokens de color, radius, fuentes |
| `src/app/globals.css` | Estilos base del body |
| `src/app/layout.tsx` | Fuente Geist, metadata, `lang="es"` |
| `src/app/providers.tsx` | `HeroUIProvider` |
