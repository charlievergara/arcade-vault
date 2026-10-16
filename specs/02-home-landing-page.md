# SPEC 02 — Home landing page

> **Status:** Approved
> **Depends on:** SPEC 01
> **Date:** 2026-10-16
> **Objective:** Replace the Library at `/` with a Home landing page ported pixel-for-pixel from `references/templates/home-about/home.jsx` (English copy), and move the Library to `/games`.

---

## Why this spec exists

SPEC 01 used the Library as the root page because the first templates had no landing page. The `home-about` template adds a Home (hero, features, games preview, stats, live activity, pricing, final CTA) that must own `/`. This forces three changes outside the Home itself: the Library route moves, the nav gains new links, and the CSS in `references/templates/home-about/styles.css` (about 800 lines more than the SPEC 01 stylesheet) must be ported. The About page from the same folder is NOT built here.

---

## Scope

**In:**

- New `/` route (`app/page.tsx`) rendering the Home with the 7 sections of `home.jsx`: Hero, `// 01` Why, `// 02` Games preview, Stats band, `// 03` Live activity, `// 04` Pricing, Final CTA.
- Library moved from `/` to `/games` (`app/games/page.tsx`), keeping its current hero and behavior.
- Nav and mobile drawer updated to four links: `Home`, `Library`, `Hall of Fame`, `About`. The template's `home-about/nav.jsx` is the visual reference.
- Port to a page-scoped CSS Module `components/home/home.module.css` (not `app/globals.css`) of every Home rule from `references/templates/home-about/styles.css` that does not already exist in `globals.css` (`.home-*`, `.hero-*`, `.silo`, `.section-*`, `.feature-*`, `.mini-*`, `.stat-*`, `.activity-*`, `.ticker`, `.tick-row`, `.top-*`, `.price-*`, `.pc-*`, `.pricing-*`, `.faq-*`, `.final-*`, `.reveal`, `.lb-link`, and their keyframes and media queries). Existing rules are not changed unless the template version differs and the Home needs it.
- All copy translated to English. Numbers use `toLocaleString("en-US")`. Game names in the activity ticker use the English titles from SPEC 01.
- Real navigation with `next/link` (no callbacks): both hero CTAs, mini-cards, `VIEW ALL GAMES`, `VIEW HALL`, the pricing CTA and the final CTA.
- Scroll-reveal (`.reveal` → `.in` with `IntersectionObserver`) as the only client island of the Home.
- Replace every link to Library at `/` with `/games` (nav, `BACK TO THE VAULT` links, redirects).

**Out of scope (for future specs):**

- The About page and its content (`about.jsx`). The `About` nav link points to `/about`, which does not exist yet and returns the 404 page.
- Real data for stats, activity and top players. Everything is hardcoded mock data.
- Any new interaction not in the template (carousels, live updates, animations beyond the template's CSS).
- Light theme, i18n, automated tests.

---

## Data model

New file `lib/home-data.ts` with the static mock data of the Home (ported from the arrays inline in `home.jsx`):

```ts
import type { GameColor } from "@/lib/data";

export type FeatureIconKind = "GAMEPAD" | "FREE" | "TROPHY" | "ROCKET";

export type Feature = { icon: FeatureIconKind; title: string; desc: string; color: GameColor };
export type HomeStat = { n: string; unit: string; sub: string };
export type ActivityRow = { player: string; game: string; score: number; when: string; color: GameColor };
export type TopPlayer = { rank: number; player: string; score: number };

export const FEATURES: Feature[];       // 4 items, same order as the template
export const HOME_STATS: HomeStat[];    // 3 items: "12+", "MANY", "GLOBAL"
export const ACTIVITY: ActivityRow[];   // 7 items, same order as the template
export const TOP_PLAYERS: TopPlayer[];  // 5 items; bar width = (100 - index * 16) %
export const FAQ: { q: string; a: string }[]; // 3 items
export const PRICING_FEATURES: string[];      // 6 items, each rendered with "✔ " prefix
```

The games preview reuses `GAMES.slice(0, 6)` from `lib/data.ts` (SPEC 01). No new game fields.

Conventions:

- Translation of the Spanish game names in the ticker: Caída → `DROP`, Glotón → `CHOMPER`, Invasores → `INVADERS`, Rocas → `ROCKS`, Bloque Buster → `BRICK BUSTER`, Serpentina → `SERPENT`, Ranaria → `FROGGIE`. Names are rendered in the same case as in `GAMES[].title`.
- Relative times use the form `2 min ago`.
- No data is read from `localStorage`; the Home is deterministic and server-rendered.

---

## Implementation plan

Before step 1, read the relevant guides in `node_modules/next/dist/docs/01-app/` (routing, `cacheComponents`, `next/link`, Client Components), as required by `CLAUDE.md`. Use `/frontend-design` for all UI work.

1. **Move the Library.** Create `app/games/page.tsx` with the current content of `app/page.tsx` (hero + `Library`). Update nav links, active-state logic and every internal link to Library from `/` to `/games`. Keep `app/page.tsx` as a temporary copy of the same content until step 6. Check: `/games` shows the 8 cards and filters work.
2. **Port the CSS.** Copy the Home rules, keyframes and media queries from `references/templates/home-about/styles.css` into `components/home/home.module.css`. Exclude `*.module.css` from the Tailwind rule in `next.config.ts` (`condition: { not: { path: /\.module\.css$/ } }`), otherwise Turbopack does not hash the class names. `app/globals.css` is not modified. Check: `npm run build` passes and the built CSS contains hashed names (e.g. `.xxxx_home-hero`).
3. **Home data.** Create `lib/home-data.ts` with the types and constants from the data model. Check: `npx tsc --noEmit` passes.
4. **Presentational pieces.** Create `components/home/silhouettes.tsx` (8 decorative SVGs, `aria-hidden`), `components/home/feature-icon.tsx` (4 SVG icons) and `components/home/mini-card.tsx` (`next/link` to `/games/[id]`). All Server Components. Check: typecheck passes.
5. **Reveal island.** Create `components/home/reveal.tsx` (`"use client"`): wraps its children, imports `home.module.css` and observes every `styles.reveal` descendant, adding `styles.in`, with `IntersectionObserver` (threshold `0.12`), adds `in` and unobserves, disconnects on unmount. Check: typecheck passes.
6. **Home page.** Replace `app/page.tsx` with the Home, composing the 7 sections with the exact structure and class names of `home.jsx` (Home-specific classes read from `styles` of `home.module.css`, e.g. `styles["home-hero"]`; shared classes such as `btn`, `pixel`, `neon-*` and `cover-*` stay global strings), wrapped in `Reveal`. Delete the temporary copy of the Library. Check: `/` renders every section.
7. **Nav.** Update `components/nav.tsx` (desktop links and mobile drawer) to `Home`, `Library`, `Hall of Fame`, `About`. Active rules: `Home` on `/`, `Library` on `/games` and `/games/*`, `Hall of Fame` on `/hall-of-fame`, `About` on `/about`. Check: the active link is correct on each route, at desktop and mobile widths.
8. **Visual comparison.** Render `references/templates/home-about/arcade-vault-standalone.html` (Home route) and `/` side by side at 1280 px and 375 px, and fix any difference in spacing, color, font or animation. Save screenshots to `.playwright-screenshots/`. Check: no visible difference other than the English copy.
9. **Cleanup.** Remove unused code. Check: `npm run lint` and `npm run build` pass.

---

## Acceptance criteria

- [ ] `npm run build` and `npm run lint` finish with no errors.
- [ ] `/` and `/games` return HTTP 200 in `npm run dev`. `/about` returns 404.
- [ ] The browser console shows no errors or hydration warnings on `/` and `/games`.
- [ ] `/` shows, in this order: hero, `// 01` section, `// 02` section, stats band, `// 03` section, `// 04` section, final CTA.
- [ ] The hero has 8 floating silhouettes, the eyebrow with a blinking `_`, the 3 title lines (`.line-1` `THE CLASSIC`, `.line-2` `ARCADE IS`, `.line-3` `BACK`), the subtitle, 2 CTAs and the `SCROLL ▼` hint.
- [ ] The `// 01` section shows exactly 4 feature cards with colors cyan, yellow, magenta and green.
- [ ] The `// 02` section shows exactly 6 mini-cards, the first 6 of `GAMES`, and each one links to `/games/[id]`.
- [ ] The stats band shows 3 blocks: `12+`, `MANY`, `GLOBAL`.
- [ ] The `// 03` section shows 7 ticker rows and 5 top-player rows. Rows 1 to 3 of the top list have the gold, silver and bronze styles. The fill bar widths are 100, 84, 68, 52 and 36 %.
- [ ] The `// 04` section shows 1 pricing card with 6 benefits and 3 FAQ items.
- [ ] `EXPLORE GAMES`, `VIEW ALL GAMES` and `INSERT COIN →` navigate to `/games`. `CREATE ACCOUNT` and `START FREE →` navigate to `/auth`. `VIEW HALL →` navigates to `/hall-of-fame`.
- [ ] Sections with `.reveal` start hidden and gain the `in` class when scrolled into view.
- [ ] The nav shows 4 links in this order: `Home`, `Library`, `Hall of Fame`, `About`. The mobile drawer shows the same 4 plus the auth link.
- [ ] `Home` is active only on `/`. `Library` is active on `/games`, `/games/[id]` and `/games/[id]/play`.
- [ ] At 1280 px and 375 px, a side-by-side screenshot of `/` and the template Home shows no difference in layout, colors, fonts or animations other than the translated text.
- [ ] `/` has no horizontal scroll at 375 px width.
- [ ] No Spanish copy remains on the Home or the nav.
- [ ] No internal link in the app points to the Library at `/` (nav, detail, player, hall of fame, not-found).
- [ ] The only client component added by this spec is `components/home/reveal.tsx`. `app/page.tsx` is a Server Component.

---

## Decisions

- **Yes:** Home at `/` and Library at `/games`. The user chose it. It mirrors the template (separate `home` and `biblioteca` routes). **No:** `/library` and `/home` as alternatives.
- **Yes:** English copy. The user chose it, for consistency with SPEC 01. "Looks exactly like the template" applies to layout, styling and animation, not to language.
- **Yes:** Nav with 4 links including `About`, even though the page does not exist. The user chose it, to match the template's nav. `/about` returns the 404 page until its own spec. **No:** hiding the link or leaving the nav unchanged.
- **Yes:** Real `next/link` links instead of the template's `navigate()` callbacks. Keeps the Home a Server Component. **No:** a full client Home.
- **Yes:** Only the scroll-reveal is a client island. It needs the DOM, and everything else is static.
- **Yes:** Home-only CSS goes into a CSS Module (`components/home/home.module.css`) with the template's class names and rules unchanged. The user asked for page-scoped CSS, and the Next.js docs say plain imported stylesheets are not removed on client navigation. **No:** appending it to `app/globals.css` (original plan), a plain `home.css` import, or rewriting the Home in Tailwind utilities (drifts from the template).
- **Yes:** Exclude `*.module.css` from the Tailwind Turbopack rule in `next.config.ts`. With the rule applied to every `*.css`, class names are not hashed and the module is effectively global.
- **Yes:** Mock data in `lib/home-data.ts`, separate from `lib/data.ts`. Home-only content does not pollute the game model.
- **Yes:** Keep the template's stat values (`12+ GAMES`) even though only 8 games exist. The user asked for an exact copy. **No:** deriving the number from `GAMES.length`.
- **Yes:** SPEC 01 criteria that name `/` as the Library are superseded by this spec (Library is now `/games`). SPEC 01 itself is not edited.
- **No:** the About page, in this spec. **No:** automated tests.

---

## Risks

| Risk                                                                                   | Mitigation                                                                                                      |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Moving the Library leaves stale links to `/`                                           | Step 1 updates all of them. Acceptance criterion checks nav, detail, player, hall of fame and not-found.         |
| `.reveal` hides content before hydration, or forever if the observer fails             | `Reveal` only adds `in`. Verify in the browser that all sections appear when scrolled. Reduced-motion is not handled by the template, so no change here. |
| Ported CSS collides with existing rules (`.av-hero`, `.btn`, `.card`, stat classes)    | Home rules live in a CSS Module, so they cannot collide. Verify `/games`, detail and Hall of Fame still look unchanged. |
| Dev server did not serve the Arcade Vault theme CSS in SPEC 01 verification            | Verify visually against a production build (`npm run build && npm run start`) as well as dev.                   |
| Broken `About` link in the nav                                                         | Accepted by decision. It returns 404 until the About spec lands.                                                 |
| Floating silhouettes and animations cause horizontal scroll on mobile                  | Check at 375 px. `.home-silos` is `position: absolute; inset: 0` inside the hero, so the hero must clip overflow. |

---

## What is **not** in this spec

- The About page.
- Real or dynamic data for stats, ticker, top players or pricing.
- Real authentication or payments (the pricing card is decorative).
- Language switcher, light theme or automated tests.

Each one of those, if it lands, goes in its own spec.
