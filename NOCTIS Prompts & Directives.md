# NOCTIS — Streamlined Production Prompts

---

### Step 0: Base Car Design Lock Prompt

**Reusable Car Description `[CAR]`:**
> a fictional, unbadged, low-slung electric grand tourer coupe in matte graphite grey; long hood, smooth fastback roofline, flush glass, flush door handles, dark tinted windows, large dark 21-inch aero wheels with thin spokes; a single ultra-thin continuous horizontal LED light bar across the full width of the front (cool white) and an identical thin light bar across the full width of the rear (deep red); no logos, no badges, no text, no license plate characters

**Master Design Reference Sheet Prompt:**
```text
Create a photorealistic automotive design reference image of [CAR]. Show it twice on one image: a clean side profile facing right on the left half, and a rear three-quarter view on the right half. Pure near-black studio background (#07080A) with a soft reflective black floor. Single soft top light, subtle rim light tracing the body lines. Lights ON: thin white front bar and thin red rear bar glowing. Premium, minimal, cinematic, shot on medium format, ultra sharp, 16:9 landscape. This is the master design — every future image of this car must match it exactly.
```

---

### Hero Keyframes (ChatGPT Prompts)

#### K1 — The Wake
* **Descriptor:** Low rear shot, car parked at the edge of a dark city, only taillights + headlight spill.
* **Context / Attachment:** Attach reference sheet.
* **Prompt:**
```text
Cinematic photorealistic film still, 16:9 landscape. The exact same car as the reference image, seen from directly behind at a low camera height (bumper level), about 4 metres back, centred in frame. The car is parked, motionless, on a wet empty asphalt road at the edge of a vast dark city at night. Total blackout: every building, streetlight and window is OFF. The ONLY light in the entire scene comes from the car: its thin red rear light bar glowing, and its white headlight beams spilling forward into light fog, lighting the wet road ahead. Silhouettes of tall dark towers barely visible against a deep navy sky. Red reflections on the wet ground under the car. Minimal composition with large negative space above the car. Moody, quiet, premium automotive campaign, anamorphic lens, fine film grain, crushed blacks, no people, no other vehicles, no text, no logos.
```

---

#### K2 — The Departure
* **Descriptor:** Same angle, car 15 m ahead, rolling into the city avenue.
* **Context / Attachment:** Attach K1.
* **Prompt:**
```text
Create the next moment of the same film, matching the attached image exactly in colour grade, fog, darkness and lens. Same camera height and direction, camera has moved forward only slightly. The exact same car is now about 15 metres further ahead, driving away from camera down the centre of a wide empty city avenue, entering the city. Its white headlight beams cut long cones through the fog ahead; its thin red rear light bar glows; red light streaks reflect on the wet asphalt between car and camera. The dark towers on both sides are lit ONLY by faint spill from the car's headlights. Whole city still in total blackout, all windows off. No other light sources, no people, no other cars, no text. 16:9 landscape.
```

---

#### K3 — The Corridor
* **Descriptor:** Camera dropped low, swung to rear three-quarter, between dark towers.
* **Context / Attachment:** Attach K2.
* **Prompt:**
```text
Next moment of the same film, matching the attached image exactly in colour grade, fog and darkness. The camera has dropped very low (near the road surface) and swung to the left, now seeing the exact same car from its rear three-quarter left side while driving alongside it. The car is mid-way through a narrow canyon of tall dark glass skyscrapers. Its headlight beams light the road and fog ahead; the dark glass facades and the wet road mirror the car's white and red light in long reflections — the car is painting the city with its light. Everything else stays pitch dark, all windows off. Subtle motion feeling but the car is sharp. No people, no other cars, no text. 16:9 landscape.
```

---

#### K4 — The Overlook
* **Descriptor:** Camera has orbited to a clean side profile, car on an elevated bridge, skyline behind.
* **Context / Attachment:** Attach K3.
* **Prompt:**
```text
Final moment of the same film, matching the attached image exactly in colour grade, fog and darkness. The camera has orbited to a perfect side profile of the exact same car, car facing right, centred, filling about 60% of the frame width, camera at door-handle height. The car drives across a long elevated concrete bridge with a low barrier. Behind and below it, the full dark skyline of the blacked-out city stretches across the frame as silhouettes against a deep navy sky. Only the car's thin white front light bar, red rear light bar and the headlight beams on the bridge deck give light. Clean, symmetrical, iconic hero composition with empty sky above for typography. No people, no other cars, no text. 16:9 landscape.
```

---

### Hero Video Clips (Google Flow Prompts)

#### Clip 1 (Transition: K1 → K2)
* **First frame:** K1
* **Last frame:** K2
* **Prompt:**
```text
One continuous cinematic shot, no cuts. The parked electric coupe's red rear light bar pulses once brighter, then the car begins to roll forward and smoothly accelerates away from camera down the empty wet avenue into the dark city. The camera follows behind at bumper height, gliding forward slower than the car so the distance grows. Headlight beams sweep through the fog, red reflections stretch across the wet asphalt. The entire city stays in total blackout; the car is the only light source. By the final second the car is moving at a steady cruising speed, no slowing down. Smooth, stabilised, premium car commercial, anamorphic, film grain.

Avoid: city lights turning on, streetlights, other cars, people, text, logos, camera shake, cuts, the car changing shape or colour.
```

---

#### Clip 2 (Transition: K2 → K3)
* **First frame:** K2
* **Last frame:** K3
* **Prompt:**
```text
One continuous cinematic shot, no cuts. The electric coupe keeps driving at a constant steady speed deeper into the city. The camera, moving at the same constant speed, smoothly lowers toward the road surface and swings in a slow arc to the car's left rear three-quarter, tracking alongside it. Dark glass skyscrapers rise on both sides and reflect the car's white headlight beams and red rear light in long streaks; puddles on the road mirror the light. Everything except the car's own light stays pitch dark. Constant speed from first to last frame, no acceleration, no braking. Smooth gimbal motion, premium car commercial, anamorphic, film grain.

Avoid: city lights turning on, other cars, people, text, logos, camera shake, cuts, the car changing shape or colour.
```

---

#### Clip 3 (Transition: K3 → K4)
* **First frame:** K3
* **Last frame:** K4
* **Prompt:**
```text
One continuous cinematic shot, no cuts. The electric coupe drives at the same constant speed out of the tower canyon and onto a long elevated bridge. The camera continues its slow orbit from the rear three-quarter to a perfect side profile, rising to door-handle height and tracking alongside the car. The full blacked-out city skyline opens up behind and below the bridge. The car's thin white and red light bars and its headlight beams on the bridge deck are the only light in the world. Ends on a clean, centred, iconic side profile, car still moving smoothly. Smooth tracking shot, premium car commercial, anamorphic, film grain.

Avoid: city lights turning on, streetlights, other cars, people, text, logos, camera shake, cuts, the car changing shape or colour.
```

---

### Exploded Technical View

#### E1 — Assembled (ChatGPT)
* **Context / Attachment:** Attach reference sheet.
* **Prompt:**
```text
Photorealistic studio image, 16:9 landscape. The exact same car as the reference, in a perfect front three-quarter view from slightly above (camera about 20 degrees above the roofline), car centred and filling about 55% of the frame width with generous empty space around it. Pure near-black seamless studio background #07080A with a faint reflective floor. Thin white front light bar and thin red rear light bar glowing. Cool soft top light, crisp rim light tracing every body line. Technical, precise, minimal, premium engineering campaign. No text, no logos.
```

---

#### E2 — Exploded (ChatGPT)
* **Context / Attachment:** Attach E1.
* **Prompt:**
```text
Same camera, same angle, same framing, same lighting and background as the attached image. Now show the exact same car as a precise exploded technical view: every major component separated outward along straight lines while keeping the overall car silhouette. Roof and glass lifted straight up; doors moved outward sideways; hood and front fascia moved forward; four wheels and tyres pushed outward from their hubs; the flat battery pack lowered beneath the floor; two electric motors visible at the axles; suspension arms, brake discs and seats floating in place between the panels. Clean even gaps between parts, nothing overlapping, nothing cropped by the frame edge. The thin white and red light bars still glowing on their floating panels. Pure near-black background #07080A, crisp rim light, ultra detailed, engineering-grade realism. No labels, no text, no logos.
```

---

#### Flow Clip: Exploded Sequence (Google Flow)
* **First frame:** E1
* **Last frame:** E2
* **Prompt:**
```text
Locked-off static camera, the camera does not move at all. In a dark studio, the assembled electric coupe slowly and precisely separates into its components: the roof and glass rise straight up, doors slide outward, the hood moves forward, wheels push out from their hubs, the battery pack lowers beneath the floor, revealing motors, suspension and seats floating in place. Every part moves in a straight line at a calm, even speed, like a precise engineering animation. Parts keep their exact shape and material. The light bars stay lit. Ends perfectly still in the exploded layout.

Avoid: camera movement, parts bending or melting, parts merging, extra parts appearing, sparks, smoke, text, logos.
```

---

### Integrator Build Prompt (Antigravity)

**Prompt to pass to Antigravity:**
```text
Build a premium, minimal, single-page scrollytelling website for NOCTIS, a fictional electric car brand. Mood: a city in total blackout at night where the car's light is the only light in the world. Everything must feel quiet, expensive and precise: huge empty space, few words, perfect motion.

TECH RULES
- Plain HTML, CSS and vanilla JavaScript only: index.html, styles.css, main.js, config.js. No frameworks, no build tools, no npm packages for the site, no libraries (no React, Vite, GSAP, Lenis, Tailwind). Fonts from Google Fonts only.
- Scroll-scrubbed image sequences are drawn on a <canvas>. Never swap <img> tags and never use <video>.
- It must run from a simple local server (e.g. VS Code Live Server).

STEP 1 — PREPARE THE FRAMES (do this before writing the site)
My frames are in the project folder:
- frames/hero section/clip 1/, clip 2/, clip 3/ — JPG/PNG frames of three clips that continue one into the next, already in the right order.
- frames/dismantle/ — JPG/PNG frames for the dismantle section only (not the hero).
1. Sort each folder's files in natural numeric order (frame2 before frame10).
2. Hero: join clip 1 + clip 2 + clip 3, in that order, into one continuous sequence. If the first frame of clip 2 or clip 3 is identical or nearly identical to the last frame of the previous clip, skip it so there is no stutter at the join.
3. Convert everything to WebP and renumber, with no spaces in the output paths:
   assets/frames/hero/frame_0001.webp … (1600px wide, quality 78)
   assets/frames/hero-mobile/frame_0001.webp … (960px wide, quality 72)
   assets/frames/dismantle/frame_0001.webp … (1600px wide, quality 78)
   assets/frames/dismantle-mobile/frame_0001.webp … (960px wide, quality 72)
   Use any converter available (cwebp, ffmpeg, Python Pillow or a one-off Node script). Never modify or delete my original frames.
4. Write the real frame counts into config.js, then tell me the frame count and total size of each output folder.

STEP 2 — PRODUCT IMAGES FOR THE LINEUP
Generate 5 product images of the car for the lineup section (if you can't generate images, tell me and use placeholders). Use the first, fully assembled frame of the dismantle sequence as the design reference so every car belongs to the same family. Every image: photorealistic studio shot, perfect side profile facing RIGHT, car filling 70% of the width, wheels sitting on a line at 72% of the image height, plain flat near-black background #07080A, thin white front light bar and thin red rear light bar glowing, no text, no logos, no badges, 16:9. Save as WebP, 1600px wide, in assets/cars/:
- gt-e.webp — the hero car, matte graphite grand tourer coupe
- s.webp — four-door sport sedan, satin bone white
- x.webp — SUV with a coupe roofline, midnight blue
- r.webp — two-seat track coupe with a fixed rear wing, satin black with thin red accents
- one.webp — concept hypercar, extremely low and long, liquid silver
Until they exist, use the first dismantle frame as a placeholder.

DESIGN TOKENS
--asphalt #07080A (page bg) | --graphite #121418 | --fog #8A8F98 | --bone #EDEAE4 (text) | --xenon #CFE3FF (light accent) | --taillight #E1251B (tiny accents only) | --hairline rgba(237,234,228,0.12)
Fonts (Google Fonts): Display = Archivo variable font loaded with its width axis, font-stretch 125% (expanded), weights 300/400, uppercase, letter-spacing 0.02em, size clamp(40px,7vw,120px). Body = Inter 400, 15–17px, line-height 1.6, max 52ch. HUD = JetBrains Mono 400, 11–12px, uppercase, letter-spacing 0.12em.
Easing everywhere: cubic-bezier(0.16,1,0.3,1).

STRICT STYLE RULES
- NO gradients of any kind (linear, radial, conic, gradient masks, gradient text).
- NO glassmorphism: no backdrop-filter, no blur, no frosted or translucent panels.
- No glows, no drop shadows, no rounded bubbly cards, no emojis.
- Only flat solid colours, 1px hairlines, photography and type.

HOW THE PINNED SCROLLYTELLING MUST WORK (hero and dismantle)
- Each section is a tall wrapper (height from config.js, e.g. 600vh). Inside it, a stage div with position: sticky; top: 0; height: 100vh (100svh where supported) holds the canvas and the text. The user stays on the same screen while scrolling and only the frames advance, so it feels like a video playing under their scroll. Scrolling up plays it backwards. When the wrapper's scroll distance runs out, the page continues normally.
- progress = clamp(-wrapper.getBoundingClientRect().top / (wrapper.offsetHeight - innerHeight), 0, 1); target frame = round(progress × (frameCount − 1)).
- In one requestAnimationFrame loop: current += (target − current) × 0.15, and redraw only when the rounded frame changes. Scale the canvas by devicePixelRatio (cap at 2).
- Never put overflow: hidden on any ancestor of a sticky stage (it breaks sticky); use overflow-x: clip on html/body if needed.
- Draw cover-fit on landscape screens; on portrait screens draw contain-fit, vertically centred on --asphalt, so the car is never cropped, with text above and below.
- Use the -mobile frame sets when the viewport is narrower than 768px.
- Preload frames as Image objects, call img.decode() before first use, and if a frame isn't loaded yet draw the nearest loaded one.

GLOBAL EFFECTS
- Fixed film-grain overlay: a small noise tile drawn once to an offscreen canvas, shifted randomly about 8 times per second, 3–4% opacity, pointer-events none. No vignette.
- Headlines reveal line by line: each line inside an overflow-hidden mask slides up from 100%, 0.9s, 0.08s stagger (IntersectionObserver + CSS transitions; inside pinned sections, driven by scroll progress).
- A 1px xenon progress line at the bottom of each pinned section, filling with its scroll progress.

CUSTOM CURSOR ("the headlight", desktop only)
- 6px solid xenon dot inside a 28px ring drawn with a 1px xenon stroke (no blur, no glow), following the mouse with lerp 0.18.
- Over links and buttons it morphs into a 44x2px horizontal light bar (the car's light signature) with a tiny mono label beside it (VIEW, RESERVE, MENU).
- Over a closed lineup slide the label reads OPEN; over the open slide it reads CONFIGURE.
- On mousedown the bar turns brighter for 120ms.
- Hide the native cursor only on (pointer: fine). On touch devices and with prefers-reduced-motion, keep the normal cursor.

PRELOADER
- Black screen, NOCTIS wordmark in the display font, and a thin xenon line that grows from the centre outward with the load percentage (mono counter 000–100).
- Load hero frames 1–40 first, then reveal the page; keep loading the rest of the hero, then the dismantle frames, in the background in order.
- On exit the line turns brighter for a moment and the screen fades to the hero.

NAV
- Fixed, transparent, mix-blend-mode: difference. Left: NOCTIS wordmark. Right: Models, Technology, Reserve (mono, small). Hides on scroll down, shows on scroll up.

SECTION 1 — HERO (pinned, about 600vh)
- Full-screen canvas scrubbing the joined hero frames with scroll progress 0→1.
- Text chapters (fade + line reveal in, fade out), placed in empty sky, never over the car:
  0–12%: big "NOCTIS" + small line "The city is asleep." + mono hint "SCROLL TO WAKE IT" with a pulsing 1px line.
  22–40%: "It doesn't need the city's light."
  50–68%: "It brings its own."
  80–100%: "GT-E" in display + mono specs row "0–100 KM/H 3.1S · 640 KM RANGE · DUAL MOTOR" + text link "Discover the GT-E".
- Left-edge HUD in mono: chapter 01/04 with a taillight-red active tick; speed counter 000 → 118 KM/H and distance 0.0 → 4.2 KM tied to scroll progress.
- Over the last 5% of scroll, the canvas fades to solid black.

SECTION 2 — STATEMENT (not pinned, 100vh)
- Centred, one sentence in the display font that reveals word by word with scroll (each word goes from 15% to 100% opacity): "Every part was designed to disappear into one line of light." Small mono label above: "02 — ENGINEERING".

SECTION 3 — DISMANTLE (pinned, about 350vh)
- Same sticky canvas technique with the dismantle frames: scrolling down takes the car apart, scrolling up puts it back together, while the user stays on the same screen.
- After 70% progress, four callouts fade in one by one, each a 1px hairline from a small xenon dot on the part to a mono label + one line of Inter text:
  BODY — Carbon composite monocoque | BATTERY — 110 kWh structural pack | DRIVE — Dual axial-flux motors, 680 kW | LIGHT — Single-line LED signature
  Position them with percentage coordinates I can tweak in config.js.
- Section title top-left: "Look closer."

SECTION 4 — LINEUP (hover accordion, not pinned, 100vh)
- Five full-height vertical slides side by side across the full width, separated by 1px --hairline lines, on flat --asphalt. One slide is always open; GT-E is open by default.
- Closed slide (about 12vw wide): mono number 01–05 at the top, the model name in mono rotated 90 degrees reading bottom to top, and the car image cropped tight (object-fit cover, positioned on the car's front light bar) at 25% brightness and greyscale.
- Open slide (the remaining width, about 52vw): car image at full brightness and colour, sitting on a shared floor line at 72% of the slide height. As it opens, the car slides in 6% from the left, as if driving into view. Top-left: model name in the display font. Under the car: one line of body text, a 3-column mono spec row (RANGE · 0–100 KM/H · POWER), a row of 4 solid square colour swatches (12px, flat colours, the active one with a 1px bone outline) and a text link "Configure →".
- Opening: on hover (desktop) or tap/focus (touch and keyboard), widths change via flex-grow over 0.7s with the site easing; the image fades and slides in, then the text reveals line by line with a 0.06s stagger. The previously open slide closes at the same time with no layout jump. Debounce hover by 80ms so sweeping the mouse across slides doesn't flicker.
- Placeholder content:
  01 GT-E — The grand tourer. — 640 km · 3.1 s · 680 kW
  02 S — Four doors, no compromise. — 600 km · 3.6 s · 520 kW
  03 X — Higher, never heavier. — 560 km · 4.2 s · 480 kW
  04 R — Built for the track. — 420 km · 2.4 s · 900 kW
  05 ONE — The future, early. — Concept
- Above the slides: small mono label "03 — THE LINEUP" and "Five ways to drive the night." in the display font.
- When the section scrolls into view, the slides rise 40px and fade in one after another (0.08s stagger).
- Mobile (< 768px): stack the slides vertically as 72px rows; tapping one expands it to show the car and details; one open at a time.
- Each slide is a button with aria-expanded; arrow keys move between slides.

SECTION 5 — RESERVE (100vh)
- Black, centred: "Drive the night." in display + one line of body text + one button styled as a thin xenon outline with mono label RESERVE YOUR NOCTIS; on hover the outline fills with solid xenon and the label turns --asphalt, with a taillight-red 2px tick appearing at the left.

FOOTER
- Hairline top border, wordmark, 3 columns of small mono links, © 2026 NOCTIS (fictional brand).

ACCESSIBILITY + PERFORMANCE
- prefers-reduced-motion: no pinning, show one static frame per chapter (hero frames at 0%, 35%, 65%, 100%; dismantle first + last) with simple fades.
- Semantic headings, alt text on car images, focus-visible states using the xenon light bar.
- Target 60fps scrolling, no layout shift, lazy-load lineup images, Lighthouse performance 85+ on desktop.

Deliver clean, commented code, with all section heights, chapter ranges, frame counts, frame paths and callout positions in config.js so I can tune them.
```