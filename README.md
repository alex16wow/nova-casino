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
    ui/               reusable pieces: GameCard, SectionHead, RotatingStage, ScrollIndicator, icons
  pages/home/         lobby sections
  context/            ToastContext, PlayerContext (wallet, notifications, rewards, favorites)
  hooks/              breakpoints, popup dismissal, scroll indicators
  data/               sample content
  styles/
    tokens.css        design tokens for all new UI
    legacy/           lobby styles carried over from the static page
docs/                 design references
```

## Adding a page

1. Create `src/pages/<name>/<Name>Page.jsx`.
2. Add a child route under `AppLayout` in `src/App.jsx`.
3. Build it from `src/components/ui` and the tokens in `src/styles/tokens.css`.

## Breakpoints

Mobile ≤680px, tablet 681–1279px, desktop ≥1280px. Use `useBreakpoint()` from `src/hooks/useMediaQuery.js`.

## Publishing

Pushes to `main` build and deploy through GitHub Actions (`.github/workflows/deploy.yml`). In repository Settings → Pages, the source must be set to **GitHub Actions**.

Deposit, account, play and demo actions are prototype placeholders. Balances and activity are sample data.
