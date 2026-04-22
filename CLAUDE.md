# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint
npm run preview    # preview production build locally
```

Sound assets are generated programmatically:
```bash
node scripts/generate-sounds.cjs   # writes WAV files to public/sounds/
```

## Architecture

Single-page React 19 + TypeScript game. No router — phase state drives everything.

### Phase flow
`start` → `countdown` → `preview` → `playing` → `won` | `lost` → (loop back to `countdown`)

`App.tsx` owns `phase` and wires all top-level components. `useGameEngine` owns all game state (cards, score, support, timer). Phase transitions happen via `setPhase` passed down to the hook.

### Key hooks
- **`useGameEngine`** — card shuffling, flip logic, scoring, timer. Uses `stateRef.current = state` to expose latest state inside `useCallback` without dependency churn. High-water mark (`highestReached`) prevents re-scoring already-seen cards on retry.
- **`useAudio`** — Howler.js sounds (flip, correct, wrong, win, lose, tick). Volume and mute are managed here; `SoundControls` is a pure UI component.
- **`useBestScore`** — persists best score to `localStorage`.

### Scoring system
- Correct card flip: +100 pts only if `card.id > highestReached` (prevents farming on retry)
- Win bonus applied at game end: `Math.max(0, 2000 - elapsedSeconds * 10) - mistakes * 30`
- Support meter: 100% → 0%; each mistake costs 5%. Hitting 0 triggers `lost`.

### CSS approach
All theme values are CSS custom properties on `:root` in `src/index.css`. No CSS-in-JS. Each component has a co-located `.css` file. Responsive breakpoints used consistently:
- `≤380px` — very small phones
- `≤600px` — phones
- `641–1099px` — tablets
- `1100–1439px` — small desktop (implicit default)
- `1440px+` — large desktop
- `2400px+` — 2K/ultrawide
- `960–1200px + min-height 1500px` — portrait desktop

### Floating overlays (z-index)
- `z-index: 100` — home button (top-left), sound controls (top-right); both move to bottom corners on mobile
- `z-index: 200` — ResultModal
- `z-index: 300` — ConfirmLeave dialog

### framer-motion gotcha
Easing arrays must be typed `as const` to satisfy framer-motion's `Easing` type:
```ts
ease: [0.22, 1, 0.36, 1] as const
```

### SupportMeter sizing
The SVG is a fixed 160×160 px; responsive scaling is done with CSS `transform: scale()` in `SupportMeter.css`, not by changing SVG props.
