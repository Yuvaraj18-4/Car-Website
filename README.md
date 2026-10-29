# NOCTIS

> **The city is asleep. It doesn't need the city's light. It brings its own.**

NOCTIS is a fictional, luxury electric vehicle brand. This project is a premium, minimal, single-page scrollytelling experience built with pure vanilla HTML, CSS, and JavaScript.

---

## Philosophy & Design Language

* **Mood**: A city in total blackout at night where the car's light is the only light in the world. Quiet, expensive, and precise.
* **Strict Aesthetic**:
  * Pure flat solid colors, 1px hairlines, photography, and typography.
  * **Zero gradients**, **zero glassmorphism/blurs**, **zero drop shadows**, and **zero glowing cards**.
* **Palette**:
  * `--asphalt`: `#07080A` (Deepest page background)
  * `--graphite`: `#121418` (Surface contrast)
  * `--fog`: `#8A8F98` (Secondary mono text)
  * `--bone`: `#EDEAE4` (Primary high-contrast type)
  * `--xenon`: `#CFE3FF` (Optical headlight accent)
  * `--taillight`: `#E1251B` (Razor-thin active accents)
  * `--hairline`: `rgba(237, 234, 228, 0.12)` (Structural 1px borders)
* **Typography**:
  * **Display**: Archivo Variable Font (`wdth` 125%, 300/400 weights, uppercase, letter-spacing 0.02em)
  * **Body**: Inter 400 (max-width 52ch, line-height 1.6)
  * **HUD / Specs**: JetBrains Mono 400 (uppercase, letter-spacing 0.12em)

---

## Technical Architecture

* **Pure Vanilla**: No frameworks, no build tools, no npm packages, no React, no Vite, no GSAP, no Tailwind.
* **Canvas Scrollytelling**:
  * Scroll-scrubbed image sequences drawn onto high-performance `<canvas>` elements.
  * 60fps lerp loop (`current += (target - current) * 0.15`).
  * Nearest loaded frame fallback with progressive background streaming.
  * Dynamic landscape cover-fit / portrait contain-fit.
* **Film Grain Engine**: Offscreen monochromatic noise tile shifted ~8 times per second at 3.8% opacity.
* **The Headlight (Custom Cursor)**: Desktop-only 6px solid xenon dot with a 28px hairline ring that morphs into a 44×2px light signature with dynamic contextual mono labels (`VIEW`, `RESERVE`, `MENU`, `OPEN`, `CONFIGURE`).
* **Lineup Hover Accordion**: 5 full-height vertical slides with 80ms debounced hover, 72% floor line positioning, and 6% car entrance motion.
* **Accessible**: Full `prefers-reduced-motion` fallbacks, keyboard navigation (Arrow keys on lineup), and semantic dialog focus states.

---

## Local Development

Run the site using any simple static file server:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

Open `http://localhost:8000` in your browser.

---

## Tuning Matrix

All section heights, chapter scroll ranges, frame paths, callout coordinates, and hover debounces are configurable in [`config.js`](config.js).

---

## License

Fictional automotive concept for creative showcase purposes. © 2026 NOCTIS.

