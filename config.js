/**
 * NOCTIS — Configuration & Design Tuning
 * All section heights, chapter ranges, frame counts, frame paths and callout coordinates.
 */

window.NOCTIS_CONFIG = {
  // Global performance & interaction tuning
  lerpFactor: 0.15,
  cursorLerp: 0.18,
  mobileBreakpoint: 768,
  initialPreloadCount: 40,

  // Section 1: Hero scrollytelling sequence
  hero: {
    wrapperHeight: '600vh',
    frameCount: 598,
    framePathDesktop: (i) => `assets/frames/hero/frame_${String(i).padStart(4, '0')}.webp`,
    framePathMobile: (i) => `assets/frames/hero-mobile/frame_${String(i).padStart(4, '0')}.webp`,
    fadeToBlackRange: [0.95, 1.0],
    speedRange: [0, 118], // km/h
    distanceRange: [0.0, 4.2], // km
    chapters: [
      {
        id: '01',
        range: [0.0, 0.14],
        title: 'NOCTIS',
        subtitle: 'The city is asleep.',
        hint: 'SCROLL TO WAKE IT'
      },
      {
        id: '02',
        range: [0.22, 0.40],
        headline: "It doesn't need the city's light."
      },
      {
        id: '03',
        range: [0.50, 0.68],
        headline: 'It brings its own.'
      },
      {
        id: '04',
        range: [0.80, 1.00],
        title: 'GT-E',
        specs: '0–100 KM/H 3.1S · 640 KM RANGE · DUAL MOTOR',
        linkText: 'Discover the GT-E',
        linkHref: '#lineup'
      }
    ]
  },

  // Section 2: Statement
  statement: {
    label: '02 — ENGINEERING',
    text: 'Every part was designed to disappear into one line of light.'
  },

  // Section 3: Dismantle exploded sequence
  dismantle: {
    wrapperHeight: '350vh',
    frameCount: 200,
    framePathDesktop: (i) => `assets/frames/dismantle/frame_${String(i).padStart(4, '0')}.webp`,
    framePathMobile: (i) => `assets/frames/dismantle-mobile/frame_${String(i).padStart(4, '0')}.webp`,
    title: 'Look closer.',
    calloutsStart: 0.70,
    callouts: [
      {
        id: 'body',
        title: 'BODY',
        description: 'Carbon composite monocoque',
        // Coordinate percentages relative to stage (x: left%, y: top%)
        x: 44,
        y: 28,
        labelAlign: 'right', // line extends toward right or left
        progress: 0.73
      },
      {
        id: 'battery',
        title: 'BATTERY',
        description: '110 kWh structural pack',
        x: 52,
        y: 72,
        labelAlign: 'left',
        progress: 0.81
      },
      {
        id: 'drive',
        title: 'DRIVE',
        description: 'Dual axial-flux motors, 680 kW',
        x: 68,
        y: 52,
        labelAlign: 'right',
        progress: 0.89
      },
      {
        id: 'light',
        title: 'LIGHT',
        description: 'Single-line LED signature',
        x: 32,
        y: 54,
        labelAlign: 'left',
        progress: 0.96
      }
    ]
  },

  // Section 4: Lineup hover accordion
  lineup: {
    label: '03 — THE LINEUP',
    heading: 'Five ways to drive the night.',
    defaultOpenIndex: 0,
    hoverDebounceMs: 80,
    models: [
      {
        id: 'gt-e',
        num: '01',
        name: 'GT-E',
        tagline: 'The grand tourer.',
        specs: [
          { label: 'RANGE', value: '640 km' },
          { label: '0–100 KM/H', value: '3.1 s' },
          { label: 'POWER', value: '680 kW' }
        ],
        image: 'assets/cars/gt-e.webp',
        alt: 'NOCTIS GT-E electric grand tourer coupe in matte graphite',
        colors: ['#121418', '#2B2F38', '#EDEAE4', '#151D2A']
      },
      {
        id: 's',
        num: '02',
        name: 'S',
        tagline: 'Four doors, no compromise.',
        specs: [
          { label: 'RANGE', value: '600 km' },
          { label: '0–100 KM/H', value: '3.6 s' },
          { label: 'POWER', value: '520 kW' }
        ],
        image: 'assets/cars/s.webp',
        alt: 'NOCTIS S four-door electric sport sedan in satin bone white',
        colors: ['#EDEAE4', '#121418', '#343B45', '#1A2736']
      },
      {
        id: 'x',
        num: '03',
        name: 'X',
        tagline: 'Higher, never heavier.',
        specs: [
          { label: 'RANGE', value: '560 km' },
          { label: '0–100 KM/H', value: '4.2 s' },
          { label: 'POWER', value: '480 kW' }
        ],
        image: 'assets/cars/x.webp',
        alt: 'NOCTIS X electric SUV with coupe roofline in midnight blue',
        colors: ['#0E1B2A', '#121418', '#424850', '#D6D3CD']
      },
      {
        id: 'r',
        num: '04',
        name: 'R',
        tagline: 'Built for the track.',
        specs: [
          { label: 'RANGE', value: '420 km' },
          { label: '0–100 KM/H', value: '2.4 s' },
          { label: 'POWER', value: '900 kW' }
        ],
        image: 'assets/cars/r.webp',
        alt: 'NOCTIS R track coupe with fixed rear wing in satin black with red accents',
        colors: ['#0A0B0D', '#E1251B', '#23272D', '#CFE3FF']
      },
      {
        id: 'one',
        num: '05',
        name: 'ONE',
        tagline: 'The future, early.',
        specs: [
          { label: 'STATUS', value: 'Concept' },
          { label: 'ARCHITECTURE', value: 'Dual-Cell' },
          { label: 'CLASSIFICATION', value: 'Hypercar' }
        ],
        image: 'assets/cars/one.webp',
        alt: 'NOCTIS ONE low and long electric concept hypercar in liquid silver',
        colors: ['#B8BCC4', '#07080A', '#CFE3FF', '#3B424E']
      }
    ]
  },

  // Section 5: Reserve
  reserve: {
    heading: 'Drive the night.',
    body: 'Production commences Autumn 2026. Private allocations are strictly limited.',
    buttonText: 'RESERVE YOUR NOCTIS'
  }
};

