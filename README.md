# Frontend — Chivapp Web App

Aplicación web **Next.js 16** (App Router) para descubrir y contratar músicos. Marca: **Chivapp**. UI en español; código en inglés.

## Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16.2 | Framework, SSR, App Router |
| React | 19.2 | UI |
| HeroUI | 2.8 | Componentes (Button, Input, Card, …) |
| Tailwind CSS | 4 | Estilos y tokens |
| TypeScript | 5 | Tipado |
| @iconify/react | 6 | Iconos |
| Vitest + React Testing Library | — | Tests unitarios y de componentes |

## Estructura

```
src/
├── types/
│   ├── api/                    # Espejo de schemas Pydantic (*Out, *Create)
│   │   ├── enums.ts            # UserRole, BookingStatus, PaymentStatus, ...
│   │   ├── auth.ts             # UserOut, LoginRequest, TokenOut
│   │   ├── profiles.ts         # MusicianProfileListOut, MusicianProfilePublicOut, ...
│   │   ├── booking.ts
│   │   ├── contract.ts
│   │   ├── payment.ts
│   │   ├── notification.ts
│   │   ├── availability.ts
│   │   ├── media.ts
│   │   ├── search.ts
│   │   └── index.ts
│   └── ui/
│       └── musician.ts         # MusicianCard, MusicianDetail (vista)
├── app/
│   ├── layout.tsx              # Root: fuentes Geist, Providers
│   ├── providers.tsx           # NextThemesProvider > HeroUIProvider > AuthProvider > NotificationsProvider > AuthModalProvider
│   ├── globals.css
│   ├── sitemap.ts               # SEO — usa slug del músico cuando existe, fallback a id
│   ├── (public)/                # Home, /musicians/[id], /contractors/[id], /share/[token]
│   ├── (auth)/                  # login, register, forgot/reset-password, verify-email, complete-role
│   ├── (musician)/musician/*    # Dashboard de músico: bookings, earnings, members, profile, reports...
│   ├── (contractor)/contractor/*# Dashboard de contratista: bookings, expenses, operations, profile...
│   ├── (admin)/admin/*          # Dashboard de administración
│   ├── invite/member/[token]    # Invitación de integrante de ensamble
│   └── api/                     # geocode, proxy a /api/v1
├── components/
│   ├── home/                   # home-intro-section, rotating-message-card, process-view
│   ├── layout/                 # app-navbar, theme-toggle, musician-card
│   ├── auth/                   # login-form, register-form, book-action-button, social-auth-buttons
│   ├── booking/                 # booking-confirmed-workspace (flujo multi-fase), collapsible-phase-section
│   ├── musician/                # musician-detail-view, share-profile-button
│   └── ui/                     # masonry-item, hero-card-wrapper
├── contexts/                    # auth-context, notifications-context, auth-modal-context
├── hooks/                       # use-is-client, ...
└── lib/
    ├── api.ts                  # apiFetch<T>() genérico
    ├── auth.ts                 # login/registerUser, getCurrentUser(): UserOut | null
    ├── auth-errors.ts          # isEmailTakenError() — detecta "correo ya en uso" en errores del backend
    ├── musicians.ts            # getMusicians(), getMusicianById(), searchMusicians()
    └── mappers/
        ├── musician.ts         # toMusicianCardFromList, toMusicianDetail, ...
        └── index.ts
```

## Variables de entorno

Copiar `.env.example` a `.env.local`:

| Variable | Descripción | Valor local |
|----------|-------------|-------------|
| `NEXT_PUBLIC_API_URL` | Base URL del backend | `http://localhost:8000/api/v1` |

> El fallback en `api.ts` apunta a `http://localhost:8080/api/v1`; usar siempre `.env.local` para evitar desalineación.

## Arranque local

```bash
cd Frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # Build producción
npm run start    # Servir build
npm run lint     # ESLint
npm run test     # Vitest (unitarios + componentes)
```

## Rutas

| Ruta | Tipo | Descripción |
|------|------|-------------|
| `/` | Server Component | Home con grid de músicos desde API |
| `/musicians/[id]` | Server Component | Detalle público del músico |
| `/login` | Client Component | Inicio de sesión conectado al API |
| `/register` | Client Component | Registro (contratista / músico) |
| `/musicians/[id]/book` | Client + gate | Solicitud de reserva (solo contratistas autenticados) |

Grupos de rutas:

- `(public)` — incluye `NavbarPublic` y `Footer`
- `(auth)` — layout centrado para formularios

## Integración con Backend

### Capas de tipos

| Capa | Ubicación | Propósito |
|------|-----------|-----------|
| API | `types/api/` | Contrato 1:1 con schemas Pydantic del backend |
| UI | `types/ui/` | Formas simplificadas para componentes |
| Mappers | `lib/mappers/` | Transformación API → UI |

### Cliente API (`lib/api.ts`)

```typescript
apiFetch<MusicianProfileListOut[]>("/profiles/musicians?skip=0&limit=20")
```

- Prefijo: `NEXT_PUBLIC_API_URL`
- `credentials: "include"` para cookies JWT
- Genérico tipado; lanza `ApiError` si `!res.ok`

### Datos en Home

1. `page.tsx` (server) llama `getMusicians()`
2. `getMusicians()` → `GET /profiles/musicians` → `MusicianProfileListOut[]`
3. `toMusicianCardFromList()` transforma a `MusicianCard` para cards

### Auth (`lib/auth.ts` + `contexts/auth-context.tsx`)

- `getCurrentUser()` → `GET /auth/me` retorna `UserOut | null`
- `loginUser()` / `registerUser()` / `logoutUser()` envuelven `POST /auth/login|register|logout`; `AuthProvider` expone `login`/`register`/`logout`/`user` vía `useAuth()`
- Errores del backend se interpretan con `lib/auth-errors.ts::isEmailTakenError()` para distinguir "correo ya en uso" de otras colisiones (teléfono, nombre artístico)

### Mappers disponibles

| Función | Entrada API | Salida UI |
|---------|-------------|-----------|
| `toMusicianCardFromList` | `MusicianProfileListOut` | `MusicianCard` |
| `toMusicianCardFromSearch` | `MusicianSearchResult` | `MusicianCard` |
| `toMusicianDetail` | `MusicianProfilePublicOut` | `MusicianDetail` |

## Testing

Suite de **Vitest + React Testing Library** en `src/`, junto a los archivos que testean:

```bash
npm run test        # unitarios + componentes (excluye smoke)
npm run test:watch  # modo watch
npm run test:smoke  # smoke tests, requiere SMOKE_BASE_URL
```

- Tests unitarios: mappers (`lib/mappers/musician.test.ts`), helpers (`lib/auth-errors.test.ts`).
- Tests de componentes: `theme-toggle`, `musician-card`, `login-form`, `register-form` — mockean `next/navigation` y `@/lib/auth`/`@heroui/react` según corresponda.
- `src/__smoke__/` — pruebas de solo lectura (home, sitemap.xml) contra un sitio **ya desplegado**. Se saltan automáticamente si no hay `SMOKE_BASE_URL`:
  ```bash
  SMOKE_BASE_URL=https://tuapp.com npm run test:smoke
  ```

CI en GitHub Actions (`.github/workflows/tests.yml`) corre `npm run test` en cada push/PR, y expone un job `smoke-tests` disparable a mano apuntando a la URL ya desplegada en GCP.

## Despliegue en GCP

- Build de producción estándar de Next.js (`npm run build` + `npm run start`), sin configuración especial de Cloud Run adicional por ahora.
- Después de cada despliegue, correr el job `smoke-tests` del workflow de CI (o `npm run test:smoke` localmente) apuntando a la URL real para confirmar que el sitio quedó sano.
- Asegurar que `NEXT_PUBLIC_API_URL` apunte al backend desplegado (no a `localhost`).

## Design system

Ver [DESIGN.md](./DESIGN.md) para tokens de color, tipografía, espaciado y patrones HeroUI.

Resumen:

- Color primario: `#9EE3EF` (celeste)
- Fuente: Geist Sans
- Componentes interactivos: HeroUI directo
- `lang="es"` en HTML root

## Configuración Next.js

`next.config.ts`:

- `reactCompiler: true`
- `transpilePackages`: HeroUI
- Imágenes remotas: `images.pexels.com`

## Convenciones

| Ámbito | Idioma |
|--------|--------|
| Texto visible al usuario | Español |
| Código (archivos, variables, funciones) | Inglés |
| Commits y docs técnicos | Español o inglés (consistente por archivo) |

### Nombres de archivos

- Componentes: `kebab-case.tsx` (`musician-card.tsx`)
- Páginas: App Router (`page.tsx`, `layout.tsx`)
- Lib/utilidades: `camelCase` exports en archivos descriptivos

## Estado de implementación

| Feature | Estado |
|---------|--------|
| Landing + listado músicos | ✅ Conectado al API |
| Detalle músico `/musicians/[id]` | ✅ Conectado al API |
| Navbar / Footer / Hero | ✅ |
| Sección "Cómo funciona" | ✅ |
| Login / registro | ✅ Conectado al API |
| Logout + sesión en navbar | ✅ |
| Reserva protegida (solo contratistas) | ✅ Gate en botones y `/book` |
| Perfil músico / contratista | ✅ Dashboards en `(musician)/musician/*` y `(contractor)/contractor/*` |
| Dashboard de administración | ✅ `(admin)/admin/*` |
| Búsqueda avanzada | ❌ (`searchMusicians()`/`toMusicianCardFromSearch` existen en `lib/` pero no están conectados a ninguna página) |
| Bookings / contratos / pagos | ✅ `booking-confirmed-workspace` — ciclo de vida, contrato PDF, pagos/settlement, ubicación en vivo, reseñas |
| Compartir perfil de músico | ✅ `share-profile-button` |
| Tema claro/oscuro | ✅ `theme-toggle` + `next-themes` |
| Invitación de integrantes de ensamble | ✅ `/invite/member/[token]` |
| Auth middleware / rutas privadas | ⚠️ Gate por rol *client-side* (`RoleDashboardShell` + `useAuth`, redirige con `router.replace`) — no hay `middleware.ts` de Next |

## Próximos pasos sugeridos

1. Conectar `searchMusicians()`/`toMusicianCardFromSearch` a una página de búsqueda (hoy existen pero no se usan desde ninguna UI).
2. Migrar el gate de rutas privadas de chequeo client-side a `middleware.ts` de Next, para evitar el flash de contenido antes de redirigir.
3. Ampliar la suite de tests (ver sección Testing) a los dashboards de músico/contratista/admin y al flujo de booking.
4. Alinear CORS si el dev server usa puerto distinto a 3000.
