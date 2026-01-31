# OKLCH Palette Generator

A simple web app for generating **perceptually uniform** color palettes using the [OKLCH](https://oklch.com/) color space. Create beautiful, accessible palettes for your next web project—no build step, no dependencies.

![OKLCH Color Palette Generator](https://img.shields.io/badge/OKLCH-CSS%20native-blue)

## Features

- **Generate palettes** — Click **Generate** or press **Space** to create a new 5-color palette
- **Lock colors** — Keep colors you like with the lock icon; only unlocked swatches change on the next generate
- **Tune L, C, H** — Enable sliders to fix Lightness, Chroma, or Hue and regenerate around your constraints
- **Copy values** — Click any color code to copy its `oklch(...)` string to the clipboard
- **Info & guide** — Learn what OKLCH is and how to use the app from the help page

## What is OKLCH?

OKLCH is a modern color model that represents colors the way we perceive them. Unlike RGB, it is **perceptually uniform**:

| Channel | Meaning |
|--------|---------|
| **L** (Lightness) | Perceived brightness from black (0) to white (1) |
| **C** (Chroma)   | Color intensity / saturation (0 = gray) |
| **H** (Hue)      | Angle on the color wheel (0–360°) |

Values you copy (e.g. `oklch(0.65 0.15 180)`) work in **modern CSS** and are supported in current browsers.

## Project structure

```
oklchpalette/
├── index.html          # Main palette generator
├── info.html           # OKLCH guide & contact
├── script.js           # Palette logic, locks, sliders, copy
├── email.js            # Copy-email behavior on info page
├── styles/
│   ├── style.css       # Main UI styles
│   └── style-info.css  # Info page styles
├── images/             # Favicons & app icons
└── README.md
```

## How to run

1. Clone or download this repo.
2. Open `index.html` in a browser (e.g. double-click or use a local server).

To use a local server (optional):

```bash
# Python 3
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then open `http://localhost:8000` (or the port shown).

## Tech stack

- **HTML5** — Semantic markup, accessibility attributes
- **CSS** — Custom properties, OKLCH for theme colors, responsive layout
- **Vanilla JavaScript** — No frameworks; DOM, `navigator.clipboard`, keyboard (Space) handling
- **Fonts** — [Inter](https://fonts.google.com/specimen/Inter), [Material Symbols Outlined](https://fonts.google.com/icons) (Google Fonts)

## Browser support

Works in browsers that support:

- CSS `oklch()`
- `navigator.clipboard.writeText()`

Recent versions of Chrome, Edge, Safari, and Firefox are supported.

## License

Use and modify as you like. If you share it, attribution is appreciated.

© 2026 oklchpalette
