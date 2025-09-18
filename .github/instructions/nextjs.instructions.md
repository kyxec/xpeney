---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---
# TSX Coding Standards and Patterns

These rules guide Copilot completions for all TSX in this repo. Favor server-first data fetching, colocated ("close‑lived") components, and reuse of existing utilities.

## Component Boundaries
- Default to server components for pages/layouts. Only add `"use client"` to leaf components that need interactivity (event handlers, router, controlled inputs, portals, browser APIs).
- Co-locate short‑lived UI under the route in an `_components/` folder (see `app/tags/_components/TagManager/*`). Keep files small and focused.
- Keep server → client data interface explicit via typed props. Avoid passing big blobs of client state; prefer preloaded data objects.

### Folder & File Structure
- Route structure:
	- Place route files under `app/<route>/`. Put local UI in `app/<route>/_components/`.
	- Group each feature area in its own folder inside `_components/`, e.g. `app/tags/_components/TagManager/`.
- Root leaf component:
	- Each feature folder should expose a single root leaf via `index.tsx`.
	- The root leaf component should include `"use client"` at the top when interactivity is required and be the default export.
	- Subcomponents live alongside as separate files: `TagGrid.tsx`, `TagList.tsx`, `TagDialog.tsx`, etc.
- Naming:
	- Use PascalCase for component files and folders. Keep names specific to the feature (avoid generic names).
	- Keep files focused. If a file grows beyond ~200–300 lines or houses multiple responsibilities, split into smaller files.
- Exports:
	- Default export the feature’s root leaf from `index.tsx`.
	- Named export smaller building blocks if reused by siblings within the same feature.
- Nesting limits:
	- Prefer a flat structure inside each feature folder (1–2 levels max). Promote widely reused building blocks from multiple features into `components/ui/` or `lib/` as appropriate.
- Promotion rules:
	- If a primitive or helper is used by ≥2 distinct routes/features, extract it:
		- Visual/interactive UI → `components/ui/`
		- Pure helpers/types → `lib/`
		- Reusable hooks → `hooks/` (avoid generic abstractions; keep purpose-specific).

## Convex: Preloaded Queries (Tags example)
- In server components, preload with Convex and pass the preloaded handle down:
	- Use `preloadQuery` from `convex/nextjs` with `{ token: await convexAuthNextjsToken() }`.
	- Example:
		- Server: `const preloaded = await preloadQuery(api.tags.list, { includeShared }, { token: await convexAuthNextjsToken() })`.
		- Client: accept `preloaded: Preloaded<typeof api.tags.list>` and read with `usePreloadedQuery(preloaded)`.
- Prefer this pattern over calling queries directly in client components. Use URL `searchParams` to shape the server query (like `includeShared`).
- When you need client-only filters (e.g., quick text filter), apply them on the result of `usePreloadedQuery` without adding new client state libraries.

### Convex Reactivity & Writes
- Convex queries are reactive. When you update data via mutations, subscribed queries (including `usePreloadedQuery`) update automatically — do not manually refetch or splice arrays after writes.
- For writes, use `useMutation(api.module.mutation)` in client leaf components or a server action that calls Convex. Keep the UI simple and let Convex propagate updates.
- Avoid ad-hoc caches or global stores around Convex data; rely on Convex’s live query semantics.

## Search Params & Routing
- Read `searchParams` in the server page and pass down as plain props. If using the deferred pattern, type as `searchParams: Promise<...>` and `await` it at the top of the page component (see `app/tags/page.tsx`).
- In clients, use `next/navigation`'s `useRouter()` to mutate the URL for UI actions (e.g., `action=create`, `selected=<id>`), avoiding local modal state.
 - Treat the URL as the primary state for view/filters/dialogs. Derive component state from `searchParams` instead of mirroring with local state.
- Prefer `next/link` for declarative navigation when possible; use `router.push` for imperative URL updates tied to UI actions.

## State Management
## State Management
- Avoid introducing client/global state stores. Prefer URL state + server preloading. Use local component state only for ephemeral UI (input value, open/close), and keep it minimal.
- If you need a debounced input handler, reuse `hooks/useDebounce.ts`.
- Prefer deriving state from props/URL rather than syncing via `useEffect`. Only use `useEffect` for imperative, non-render side effects (subscriptions to non-React APIs, focus, measurement, etc.).
- After Convex mutations, do not run manual invalidations/effects — rely on reactivity to update `usePreloadedQuery` consumers.
- Avoid prop drilling: don’t pass `onOpen/onClose` handlers through many layers. Use URL state to control dialogs/selection and have the leaf component read/act on it.
- Handle actions closest to where they happen: trigger Convex `useMutation` in the leaf component instead of bubbling callbacks upward.

## Hooks
- Placement:
	- `app/<route>/_hooks/`: Only feature‑specific hooks for that route/feature. These may compose generic hooks from `hooks/`.
	- `hooks/`: Only generic, domain‑agnostic hooks reusable across features (no business/domain logic baked in).
- Promotion:
	- Start local in `_hooks/` for feature‑only needs. Extract and move to `hooks/` only after the API is made generic (no feature/domain assumptions) and it’s reused by ≥2 features.
	- If a hook remains domain‑specific, keep it under `_hooks/` even if used in multiple places within the same feature area.
- Naming:
	- Use `useFeatureThing` for close‑lived hooks and `useXyz` for generic ones. Export as named exports from an index when a feature accumulates multiple hooks.
- Patterns:
	- Prefer simple functions with React state/effects where needed; avoid unnecessary memoization. In React 19, there is no general need for `useCallback` or `useMemo`; do not use them unless a dependency explicitly requires referential stability (e.g., a third‑party lib dependency array or imperative subscription API).
	- Derive computation from inputs/URL props rather than syncing with `useEffect` when possible.
	- Reuse existing hooks: `hooks/useDebounce.ts`, `hooks/useUrlState.ts` before creating new ones.
	- Keep hooks pure and side‑effect free except where they intentionally manage subscriptions or external effects—document such behaviors in JSDoc.
	- Type hook inputs/outputs precisely; avoid `any`. Prefer discriminated unions and exact object shapes.

- Use `react-hook-form@7` for all interactive forms. Favor uncontrolled inputs and RHF’s form state instead of per-field `useState`.
- Integrate with shadcn/ui inputs directly; use `Controller` where necessary. Keep forms as leaf client components under `_components/<Feature>/`.

## Reuse, Don’t Reinvent
- Utilities:
	- `lib/utils.ts`: use `cn(...)` for Tailwind class merging.
	- `lib/constants.ts`, `lib/user-utils.ts`: check here before adding new helpers.
- Hooks:
	- `hooks/`: Only generic hooks with no domain assumptions; safe to reuse anywhere.
	- `app/<route>/_hooks/`: Feature‑specific hooks; may compose generic hooks. Promote only after generic extraction.
- Components:
	- `components/ui/`: Only generic, domain‑agnostic primitives or widely reusable UI. No feature/business logic.
	- `app/<route>/_components/`: Feature‑specific components; keep close to the route. Promote to `components/ui/` only when made generic.
- If you repeat logic ≥2 times, extract a small utility in `lib/`, a shared component in a nearby `_components/` folder, or a hook in `hooks/`/`_hooks/`. Keep APIs specific to the use case; avoid premature generalization.
	- `lib/utils.ts`: use `cn(...)` for Tailwind class merging.
## Search Params & Routing
	- `hooks/useDebounce.ts`: reuse this for debounced callbacks.
## Next.js 15 & React 19
- Raise errors from server components when appropriate; keep client error UI simple.

## Styling & Accessibility
- Prefer shadcn/ui primitives and Tailwind 4 utilities; avoid writing custom CSS in `.css` files except `app/globals.css` for truly global resets/tokens.
- Use Tailwind with `cn` for conditional classes. Respect dark mode classes as seen in Tags pages.
- Keep interactive elements accessible: proper roles, labels, focus states. Prefer existing UI components which include sensible defaults.

## Next.js 15 & React 19
- Lean on Server Components, Route Segment Configs, and built-in `Suspense`/streaming for data boundaries.
- Use `next/navigation` for URL state and actions; prefer server preloading and server actions where appropriate over client data fetching.
- No need for `useMemo`/`useCallback` in general. Do not use them unless a third‑party dependency requires stable references or profiling demonstrates a real bottleneck.

## TypeScript
- Strongly type props and preloaded handles:
	- `preloadedFoo: Preloaded<typeof api.module.query>`.
	- Narrow `searchParams` types to known keys and unions (e.g., `'grid' | 'list'`).
- Avoid `any`. Infer from Convex API types wherever possible.

### Convex + TypeScript
- Write Convex functions in `.ts` and use argument validators to infer arg types automatically; add manual arg types for complex internal functions when needed.
- Add a Convex schema to enable precise DB types; import `Doc`/`Id` from `convex/_generated/dataModel` and use them in both server and client.
- Type server-side helpers with generated ctx types: `QueryCtx`, `MutationCtx`, `ActionCtx`, `DatabaseReader/Writer` from `convex/_generated/server`.
- Infer types from validators via `Infer<typeof v.validator>`; reuse validators across args and schema.
- Use `WithoutSystemFields<Doc<...>>` when creating/updating documents without `_id`/`_creationTime`.
- On the client, pass around `Doc`/`Id` types; for function-based typing, use `FunctionReturnType<typeof api.module.fn>` and `UsePaginatedQueryReturnType<typeof api.module.fn>`.

## Do / Don’t
- Do: server‑fetch with `preloadQuery`; pass `Preloaded` to small client components; use URL for state; reuse `hooks/`, `lib/`, and `components/ui/*`.
- Don’t: introduce new state libraries; write generic hooks; call Convex queries directly in clients when a preloaded path exists; duplicate className merge logic; create new UI primitives that already exist.

## Convex Best Practices
- Await all Promises: Always `await` Convex APIs (e.g., `ctx.scheduler.runAfter`, `ctx.db.patch`) to avoid missed side effects and unhandled errors. Enable `no-floating-promises` in ESLint.
- Prefer indexes over `.filter`: Use `.withIndex`/`.withSearchIndex` for large sets; otherwise, fetch and filter in TypeScript. Avoid `.filter` on DB queries except with `.paginate` where it affects page size.
- Use `.collect` only for small result sets: For potentially large data, filter with indexes, use `.paginate`, `.take`, or denormalize counts instead of loading everything.
- Prune redundant indexes: Avoid prefixes like `by_foo` plus `by_foo_and_bar` unless you need ordering on `_creationTime` for the shorter index.
- Validate inputs: Add `args` validators (and optional return validators) for all public `query`/`mutation`/`action` functions.
- Enforce access control: Check `ctx.auth.getUserIdentity()` and resource membership/ownership in every public function; avoid spoofable identifiers like email for authz.
- Use internal functions for scheduled/run* calls: `ctx.runQuery`/`runMutation`/`runAction` and `ctx.scheduler`/crons should invoke `internal.*` functions, not `api.*`.
- Extract helpers: Keep most logic in plain TS helpers (e.g., `convex/model/*`), with thin `query`/`mutation` wrappers calling helpers.
- Use `runAction` only for different runtime needs: Prefer plain TS helper calls; reserve `runAction` for Node-only libs from Convex runtime.
- Avoid sequential `ctx.run*` in actions: Combine related reads/writes into a single internal `query`/`mutation` to preserve consistency; batch loops into one mutation when possible.
- Use `ctx.run*` sparingly within queries/mutations: Prefer plain helper functions unless you need transactional boundaries or component requirements.

