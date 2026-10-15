# SPEC 01 — MVP visual pages

> **Status:** Approved
> **Depends on:** None (builds on the global theme already present in `app/globals.css` and `app/layout.tsx`)
> **Date:** 2026-10-15
> **Objective:** Port the five screens from `references/templates/` (Library, Game Detail, Player, Auth, Hall of Fame) to Next.js App Router routes in English, as a visual-only MVP with mock data and no real game.

---

## Why this spec exists

The templates in `references/templates/` are a browser-Babel React prototype with hash routing, global `window.*` components and Spanish copy. None of that fits the project (Next.js 16.4, App Router, `cacheComponents`, TypeScript). This spec defines how the prototype is translated, so the later specs (real games, real auth, real scores) start from a correct structure.

---

## Scope

**In:**

- Five routes: `/` (Library), `/games/[id]` (Game Detail), `/games/[id]/play` (Player), `/auth` (Auth), `/hall-of-fame` (Hall of Fame).
- Shared chrome in the root layout: top nav (logo, links, static coin counter, auth button, mobile drawer) and footer.
- Mock data module with 8 games, 5 categories and a deterministic seeded-score generator.
- Fake session in `localStorage` (`av_user`): any input logs in, guest mode, sign out from the nav.
- Simulated Player: fake CRT arena, HUD, random score ticking, pause, end, game-over modal, save score to `localStorage` (`av_scores`).
- All UI copy translated to English, including game titles, ids and descriptions.
- Library search by title and category filter. Hall of Fame tabs per game.
- Mobile layout (hamburger drawer) as already defined in `app/globals.css`.
- `not-found` handling for unknown game ids.
- Server Components by default, with small client islands only where interaction is needed.

**Out of scope (for future specs):**

- Any real game logic (canvas, input, game loop).
- Real authentication, OAuth (the Google and GitHub buttons are visual only), password validation, user database.
- Persistent or shared leaderboards. Scores saved in `av_scores` are written but not displayed anywhere.
- Backend, API routes, database.
- Light theme, i18n or a language switcher.
- Automated tests.

---

## Data model

New file `lib/data.ts` (typed port of `data.jsx`):

```ts
export type Category = "ARCADE" | "PUZZLE" | "SHOOTER" | "VERSUS";
export type GameColor = "cyan" | "magenta" | "yellow" | "green";

export type Game = {
  id: string;        // URL slug, e.g. "brick-buster"
  title: string;     // e.g. "BRICK BUSTER"
  short: string;     // one-line description (cards)
  long: string;      // paragraph (detail page)
  cat: Category;
  cover: string;     // CSS class from globals.css, e.g. "cover-bricks"
  color: GameColor;  // drives the PLAY button variant
  best: number;      // global best score (mock)
  plays: string;     // formatted, e.g. "12.4K"
};

export type ScoreRow = { rank: number; name: string; score: number; date: string }; // date: "YYYY-MM-DD"

export const GAMES: Game[];
export const CATEGORIES: ["ALL", ...Category[]];
export function seededScores(seed: number, count?: number): ScoreRow[]; // deterministic, same algorithm as the template
```

Game ids and titles (translated):

| Template id     | New id          | Title           |
| --------------- | --------------- | --------------- |
| `bloque-buster` | `brick-buster`  | BRICK BUSTER    |
| `caida`         | `drop`          | DROP            |
| `serpentina`    | `serpent`       | SERPENT         |
| `gloton`        | `chomper`       | CHOMPER         |
| `invasores`     | `invaders`      | INVADERS        |
| `rocas`         | `rocks`         | ROCKS           |
| `ranaria`       | `froggie`       | FROGGIE         |
| `duelo-pixel`   | `pixel-duel`    | PIXEL DUEL      |

The `cover` classes (`cover-bricks`, `cover-tetro`, `cover-snake`, `cover-glot`, `cover-invaders`, `cover-rocas`, `cover-rana`, `cover-duelo`) already exist in `app/globals.css` and are NOT renamed.

Browser storage (client only, no versioning in this MVP):

```ts
// localStorage "av_user"   -> { name: string } | absent (guest)
// localStorage "av_scores" -> Array<{ game: string; score: number; name: string; at: number }>
```

Conventions:

- Numbers are formatted with `toLocaleString("en-US")`.
- `seededScores` stays deterministic so server and client render the same rows (no hydration mismatch).
- Seeds: detail page uses `id.length * 17 + 3` (10 rows), Hall of Fame uses `id.length * 23 + 7` (12 rows), as in the template.

---

## Implementation plan

Before step 1, read the relevant guides in `node_modules/next/dist/docs/01-app/` (routing, `cacheComponents`, `params`, `not-found`, `next/link`), as required by `CLAUDE.md`. Use `/frontend-design` for all UI work.

1. **Data module.** Create `lib/data.ts` with the types, `GAMES`, `CATEGORIES` and `seededScores`. Check: `npx tsc --noEmit` passes.
2. **Session store.** Create `lib/session.ts` (client): read/write `av_user` with `useSyncExternalStore` plus a `useSession()` hook returning `{ user, login, logout }`. Check: typecheck passes.
3. **Chrome.** Create `components/nav.tsx` (client, uses `usePathname` for the active link, mobile drawer state, session-aware auth button) and `components/footer.tsx` (server). Wire both into `app/layout.tsx` around `.av-main`. Replace the scaffold `app/page.tsx` with a temporary heading. Check: nav and footer render on `/` on desktop and mobile widths.
4. **Library page.** Create `components/game-card.tsx` (client, tilt effect, `next/link` to `/games/[id]`) and `components/library.tsx` (client: search input, category chips, grid, empty state). `app/page.tsx` renders hero + `Library`. Check: filtering by text and category works, empty state shows.
5. **Game Detail page.** Create `app/games/[id]/page.tsx` (server): cover, tags, description, stat strip, leaderboard (10 seeded rows), `PLAY NOW` link to `/games/[id]/play`, `BACK TO THE VAULT` link. Unknown id calls `notFound()`. Add `app/games/[id]/not-found.tsx` styled with the theme. Use `generateStaticParams` over `GAMES`. Check: all 8 ids render, `/games/nope` shows not-found.
6. **Hall of Fame page.** Create `app/hall-of-fame/page.tsx` (server shell: header, back button) and `components/hall-of-fame.tsx` (client: game tabs, podium, table, session-dependent "YOUR BEST" row with the template's mock values). Check: switching tabs changes podium and table; the "YOUR BEST" row appears only when logged in.
7. **Auth page.** Create `app/auth/page.tsx` and `components/auth-form.tsx` (client: sign in / sign up tabs, email field only on sign up, submit calls `login` with `(user || "PLAYER1").toUpperCase().slice(0, 10)` then `router.push("/")`, guest button calls `logout` then redirects, Google/GitHub buttons do nothing). Check: login shows the name in the nav, guest hides it, sign out from nav clears `av_user`.
8. **Player page.** Create `app/games/[id]/play/page.tsx` (server: validates id, renders client component) and `components/game-player.tsx` (client: HUD, simulated score tick every 220 ms, pause overlay, `END`, `EXIT` to detail, game-over modal with name input, save to `av_scores`, play again, back to vault). Pre-fill name from the session or `GUEST`. Check: the full simulated loop works and `av_scores` gains one entry on save.
9. **Cleanup.** Remove scaffold leftovers (unused `public/*.svg` imports if any, temporary heading). Check: `npm run lint` and `npm run build` pass, all five routes build.

---

## Acceptance criteria

- [ ] `npm run build` and `npm run lint` finish with no errors.
- [ ] `/`, `/games/[id]` (for each of the 8 ids), `/games/[id]/play`, `/auth` and `/hall-of-fame` return HTTP 200 in `npm run dev`.
- [ ] `/games/nope` and `/games/nope/play` show the not-found page.
- [ ] The browser console shows no errors or hydration warnings on any of the five routes.
- [ ] All visible text is in English. No Spanish copy from the templates remains.
- [ ] The Library shows exactly 8 cards. Typing `snake` in the search box shows 0 cards and the "NO RESULTS" state. Typing `rocks` shows 1 card.
- [ ] Selecting the `SHOOTER` chip shows exactly 2 cards (INVADERS, ROCKS). `ALL` shows 8.
- [ ] Clicking a card or its `PLAY` button navigates to `/games/[id]`.
- [ ] The Game Detail page shows 10 leaderboard rows, and rows 1 to 3 have the gold, silver and bronze styles.
- [ ] Reloading `/games/[id]` shows the same leaderboard names and scores.
- [ ] `PLAY NOW` navigates to `/games/[id]/play`.
- [ ] The nav marks `Library` as active on `/`, `/games/[id]` and `/games/[id]/play`, and `Hall of Fame` as active on `/hall-of-fame`.
- [ ] Below 768 px width the hamburger opens the drawer and the backdrop closes it. (Use the breakpoint defined in `app/globals.css`.)
- [ ] The Hall of Fame has one tab per game (8), the podium shows ranks 02, 01, 03, and the table shows 12 rows.
- [ ] Logging in at `/auth` with user `neonfox` stores `{"name":"NEONFOX"}` in `localStorage["av_user"]`, redirects to `/`, and the nav shows `NEONFOX`.
- [ ] Clicking `PLAY AS GUEST` redirects to `/` and the nav shows the sign-in button.
- [ ] Reloading the page keeps the session. Signing out from the nav removes `av_user`.
- [ ] The "YOUR BEST" row in the Hall of Fame appears only with an active session.
- [ ] In the Player, the score starts at 0 and increases while not paused. It stops increasing after `PAUSE` and resumes after `RESUME`.
- [ ] `END` opens the game-over modal with the final score. `SAVE SCORE` appends one entry `{ game, score, name, at }` to `localStorage["av_scores"]` and shows the saved message.
- [ ] `PLAY AGAIN` resets score, lives, level and closes the modal. `EXIT` returns to `/games/[id]`.
- [ ] The Library, Detail, Hall of Fame and Auth pages have no horizontal scroll at 375 px width.
- [ ] Only `nav`, game card, library, hall of fame, auth form and game player are client components. Pages other than `/`, `/hall-of-fame`, `/auth` are Server Components.

---

## Decisions

- **Yes:** App Router routes with English slugs (`/games/[id]`, `/games/[id]/play`, `/auth`, `/hall-of-fame`). Real URLs are shareable and fit `cacheComponents`. **No:** hash routing and a single-page client state (the template approach), because it ignores the framework.
- **Yes:** English UI, with translated game titles and ids (table in the data model). The user chose full English. **No:** keeping Spanish brand-style titles.
- **Yes:** Fake session in `localStorage` (`av_user`), same behavior as the template. It lets the nav, Hall of Fame and Player react to "logged in" without a backend. **No:** a static-only form (nothing to demo) and real auth (own spec).
- **Yes:** Player ports the template simulation, including `av_scores` writes. It demonstrates the full UX flow for the future real games. **No:** a static "coming soon" screen.
- **Yes:** Typed mock data in `lib/data.ts` with a deterministic generator. Same output on server and client, easy to replace later. **No:** merging `av_scores` into leaderboards, because it would create server/client differences and the MVP does not need it.
- **Yes:** Server Components by default, client islands only for interaction. **No:** porting everything as `"use client"`, to keep with `cacheComponents` idioms and smaller bundles.
- **Yes:** Dates in mock rows use `YYYY-MM-DD`, to avoid the ambiguous DD/MM vs MM/DD in English. Numbers use `en-US` formatting.
- **Yes:** Coin counter (`CREDITS · 03`) and footer stay as static decoration. Footer text is translated (copyright, "made with pixels and neon", `v2.6.0`).
- **Yes:** Reuse the CSS classes already in `app/globals.css` (`av-nav`, `card`, `btn`, `crt`, ...). **No:** new Tailwind-only styling for these screens, to stay faithful to the template. New classes are added to `globals.css` only if a screen needs something the template did not define.
- **No:** porting the template's `Arcade Vault.html` scripts or `window.*` globals.
- **No:** automated tests in this spec. Verification is manual through the acceptance criteria.

---

## Risks

| Risk                                                                                  | Mitigation                                                                                                           |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Hydration mismatch from reading `localStorage` during render                          | `useSyncExternalStore` with a server snapshot of `null`. The nav and "YOUR BEST" row render the guest state first.   |
| `cacheComponents` errors for dynamic access (`params`, client hooks like `usePathname`) | Read the docs first. Wrap client islands that need request data in `<Suspense>` if the build requires it.            |
| `localStorage` unavailable (private mode, blocked)                                    | Wrap reads and writes in `try/catch`, as the template does. The app keeps working without persistence.               |
| `Math.random` in the Player and server rendering                                      | Random only runs inside `useEffect` intervals on the client. Initial render is deterministic (score 0).              |
| Layout already wraps children in `.av-main`; adding nav and footer could break stacking | Keep nav and footer outside `.av-main` as in the template, verify the `z-index` layers visually.                     |
| Next.js 16.4 APIs differ from training data (`LayoutProps`, `PageProps`, async `params`) | Use the generated typed helpers and check `node_modules/next/dist/docs/` before writing each route.                  |

---

## What is **not** in this spec

- Any real game (canvas, input, game loop, collisions).
- Real authentication, OAuth, user accounts.
- Shared or persistent leaderboards, or showing saved scores anywhere.
- Backend, database or API routes.
- Language switcher or light theme.
- Automated tests.

Each one of those, if it lands, goes in its own spec.
