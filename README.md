# NOVA Casino

Interactive, responsive prototype of an online casino. One React app; every page shares the same layout, design tokens and components.

Current state and plans: [PROJECT_STATUS.md](PROJECT_STATUS.md).

## Preview

GitHub Pages: https://alex16wow.github.io/nova-casino/

## Development

```bash
npm install
npm run dev      # http://localhost:5173/nova-casino/
npm run build    # production build in dist/
npm run preview  # serve the build
```

## Structure

```
public/assets/        images, video, provider logos
src/
  main.jsx, App.jsx   entry and routes
  components/
    layout/           AppLayout (header, sidebar, footer, dock) shared by all pages
    header/           search, wallet, notifications, level rewards, profile menu
    ui/               reusable pieces: GameCard, Modal, Button, fields, StateMessage, Skeleton, icons
    auth/             login, sign-up, password reset and logout dialogs
    account/          AccountLayout: title + section tabs shared by /account/* pages
    demo/             States switcher (shown on every page)
  pages/home/         lobby sections
  pages/profile/      My profile (/account/profile)
  pages/not-found/    404
  context/            ToastContext, AuthContext (session, dialogs), PlayerContext (wallet, notifications, rewards, favorites), ProfileContext (demo player profile)
  lib/                fake API, storage, demo modes
  hooks/              breakpoints, popup dismissal, scroll indicators
  data/               sample content
  styles/
    tokens.css        design tokens for all new UI
    components/       token-based styles for new UI (controls, overlays)
    legacy/           lobby styles carried over from the static page
docs/                 design references
```

## States demo

The **States** button (bottom left) is part of the prototype and is always shown (build with `VITE_DEMO_PANEL=0` to hide it). It switches guest / signed in, data mode (normal, slow, error, empty) and the account dialogs. Every new page adds its own states to this panel. Test values: password `wrongpass` fails login, email `taken@nova.casino` is already registered, card `4000 0000 0000 0002` is declined.

## Adding a page

1. Create `src/pages/<name>/<Name>Page.jsx`.
2. Add a child route under `AppLayout` in `src/App.jsx`.
3. Build it from `src/components/ui` and the tokens in `src/styles/tokens.css`.

## Breakpoints

Mobile ≤680px, tablet 681–1279px, desktop ≥1280px. Use `useBreakpoint()` from `src/hooks/useMediaQuery.js`.

## Publishing

Pushes to `main` build and deploy through GitHub Actions (`.github/workflows/deploy.yml`). In repository Settings → Pages, the source must be set to **GitHub Actions**.

Deposit, account, play and demo actions are prototype placeholders. Balances and activity are sample data.
