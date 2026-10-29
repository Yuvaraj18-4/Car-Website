/**
 * NOCTIS — Main Scrollytelling Engine
 * Tech: Vanilla JavaScript (ES6+), HTML5 Canvas, IntersectionObserver
 * Performance: 60fps rAF loop, lazy frame preloading, nearest-frame fallback, cover/contain fit
 */

(function () {
  'use strict';

  // Verify configuration is loaded
  const CFG = window.NOCTIS_CONFIG;
  if (!CFG) {
    console.error('NOCTIS: config.js must be loaded before main.js');
    return;
  }

  // Detect user preferences & capabilities
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (prefersReducedMotion) {
    document.body.classList.add('prefers-reduced');
  }

  // State management
  const state = {
    isMobile: window.innerWidth < CFG.mobileBreakpoint,
    heroLoaded: 0,
    dismantleLoaded: 0,
    heroFrames: [],
    dismantleFrames: [],
    heroCurrentFrame: 0,
    heroTargetFrame: 0,
    dismantleCurrentFrame: 0,
    dismantleTargetFrame: 0,
    heroProgress: 0,
    dismantleProgress: 0,
    activeLineupIndex: CFG.lineup.defaultOpenIndex,
    isLoaded: false
  };

  /* ==========================================================================
     1. FILM GRAIN OVERLAY (Offscreen Noise Tile, ~8 FPS Shift)
     ========================================================================== */
  function initFilmGrain() {
    const canvas = document.getElementById('grainCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Create 128x128 offscreen noise tile
    const tileSize = 128;
    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = tileSize;
    tileCanvas.height = tileSize;
    const tileCtx = tileCanvas.getContext('2d');
    const imgData = tileCtx.createImageData(tileSize, tileSize);
    const buffer32 = new Uint32Array(imgData.data.buffer);
    const len = buffer32.length;
    
    for (let i = 0; i < len; i++) {
      // Monochromatic random noise between 0 and 255 with varying alpha
      const shade = Math.floor(Math.random() * 255);
      buffer32[i] = (255 << 24) | (shade << 16) | (shade << 8) | shade;
    }
    tileCtx.putImageData(imgData, 0, 0);

    function resizeGrain() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeGrain();
    window.addEventListener('resize', resizeGrain);

    // Shift noise pattern ~8 times per second (125ms)
    let lastShift = 0;
    const shiftInterval = 125;

    function renderGrain(timestamp) {
      if (timestamp - lastShift > shiftInterval) {
        lastShift = timestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Random offset for the noise pattern
        const offsetX = Math.floor(Math.random() * tileSize);
        const offsetY = Math.floor(Math.random() * tileSize);

        for (let x = -offsetX; x < canvas.width; x += tileSize) {
          for (let y = -offsetY; y < canvas.height; y += tileSize) {
            ctx.drawImage(tileCanvas, x, y);
          }
        }
      }
      requestAnimationFrame(renderGrain);
    }
    requestAnimationFrame(renderGrain);
  }

  /* ==========================================================================
     2. CUSTOM CURSOR ("The Headlight", Desktop Only)
     ========================================================================== */
  function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const label = document.getElementById('cursorLabel');
    if (!cursor || !isFinePointer || prefersReducedMotion) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let isActive = false;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    // Mousedown / mouseup flash behavior (120ms brightness boost)
    window.addEventListener('mousedown', () => {
      isActive = true;
      cursor.classList.add('is-active');
      setTimeout(() => {
        cursor.classList.remove('is-active');
      }, 120);
    });

    window.addEventListener('mouseup', () => {
      isActive = false;
    });

    // Delegate hover interactions
    document.addEventListener('mouseover', (e) => {
      const interactive = e.target.closest('a, button, [data-cursor], .lineup-slide');
      if (interactive) {
        cursor.classList.add('is-hover');
        
        let cursorText = interactive.getAttribute('data-cursor') || 'VIEW';
        if (interactive.classList.contains('lineup-slide')) {
          cursorText = interactive.classList.contains('is-open') ? 'CONFIGURE' : 'OPEN';
        }
        if (label) label.textContent = cursorText;
      }
    });

    document.addEventListener('mouseout', (e) => {
      const interactive = e.target.closest('a, button, [data-cursor], .lineup-slide');
      if (interactive) {
        cursor.classList.remove('is-hover');
        if (label) label.textContent = '';
      }
    });

    // 60FPS Cursor Lerp Loop (lerp 0.18)
    function updateCursor() {
      currentX += (targetX - currentX) * CFG.cursorLerp;
      currentY += (targetY - currentY) * CFG.cursorLerp;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);
  }

  /* ==========================================================================
     3. FRAME LOADER WITH NEAREST LOADED FALLBACK
     ========================================================================== */
  function createFrameArray(count, pathResolver) {
    const list = new Array(count);
    for (let i = 0; i < count; i++) {
      list[i] = {
        img: new Image(),
        src: pathResolver(i + 1),
        loaded: false,
        decoding: false
      };
    }
    return list;
  }

  function getNearestLoadedFrame(frameList, targetIdx) {
    if (!frameList || frameList.length === 0) return null;
    const clampedIdx = Math.max(0, Math.min(targetIdx, frameList.length - 1));
    
    // Check direct target
    if (frameList[clampedIdx] && frameList[clampedIdx].loaded) {
      return frameList[clampedIdx].img;
    }
    
    // Search outward for closest loaded frame
    let offset = 1;
    while (clampedIdx - offset >= 0 || clampedIdx + offset < frameList.length) {
      if (clampedIdx - offset >= 0 && frameList[clampedIdx - offset].loaded) {
        return frameList[clampedIdx - offset].img;
      }
      if (clampedIdx + offset < frameList.length && frameList[clampedIdx + offset].loaded) {
        return frameList[clampedIdx + offset].img;
      }
      offset++;
    }
    return null;
  }

  function loadSingleFrame(frameItem, onLoadedCallback) {
    if (frameItem.loaded || frameItem.decoding) return;
    frameItem.decoding = true;
    frameItem.img.src = frameItem.src;
    
    if ('decode' in frameItem.img) {
      frameItem.img.decode()
        .then(() => {
          frameItem.loaded = true;
          frameItem.decoding = false;
          if (onLoadedCallback) onLoadedCallback();
        })
        .catch(() => {
          // Fallback if decode fails
          frameItem.img.onload = () => {
            frameItem.loaded = true;
            frameItem.decoding = false;
            if (onLoadedCallback) onLoadedCallback();
          };
        });
    } else {
      frameItem.img.onload = () => {
        frameItem.loaded = true;
        frameItem.decoding = false;
        if (onLoadedCallback) onLoadedCallback();
      };
    }
  }

  /* ==========================================================================
     4. PRELOADER & PROGRESSIVE LOADING STRATEGY
     ========================================================================== */
  function initPreloader(onReady) {
    const preloader = document.getElementById('preloader');
    const bar = document.getElementById('preloaderBar');
    const counter = document.getElementById('preloaderCounter');
    
    const heroPath = state.isMobile ? CFG.hero.framePathMobile : CFG.hero.framePathDesktop;
    const dismantlePath = state.isMobile ? CFG.dismantle.framePathMobile : CFG.dismantle.framePathDesktop;
    
    state.heroFrames = createFrameArray(CFG.hero.frameCount, heroPath);
    state.dismantleFrames = createFrameArray(CFG.dismantle.frameCount, dismantlePath);

    const initialTotal = Math.min(CFG.initialPreloadCount, CFG.hero.frameCount);
    let initialLoaded = 0;

    function checkProgress() {
      initialLoaded++;
      const pct = Math.min(Math.round((initialLoaded / initialTotal) * 100), 100);
      
      if (bar) bar.style.width = `${pct}%`;
      if (counter) counter.textContent = String(pct).padStart(3, '0');

      if (initialLoaded >= initialTotal) {
        // Line flashes bright white on completion
        if (bar) bar.classList.add('is-finishing');
        
        setTimeout(() => {
          if (preloader) preloader.classList.add('is-hidden');
          document.body.classList.remove('is-loading');
          state.isLoaded = true;
          if (onReady) onReady();
          
          // Continue streaming remaining hero frames, then dismantle frames in background
          streamRemainingFrames();
        }, 350);
      }
    }

    // Load initial 1–40 hero frames first
    for (let i = 0; i < initialTotal; i++) {
      loadSingleFrame(state.heroFrames[i], checkProgress);
    }
  }

  function streamRemainingFrames() {
    let heroIdx = CFG.initialPreloadCount;
    let dismantleIdx = 0;

    function loadNextBatch() {
      const batchSize = 6;
      let count = 0;

      while (heroIdx < state.heroFrames.length && count < batchSize) {
        loadSingleFrame(state.heroFrames[heroIdx++]);
        count++;
      }

      if (heroIdx >= state.heroFrames.length) {
        while (dismantleIdx < state.dismantleFrames.length && count < batchSize) {
          loadSingleFrame(state.dismantleFrames[dismantleIdx++]);
          count++;
        }
      }

      if (heroIdx < state.heroFrames.length || dismantleIdx < state.dismantleFrames.length) {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadNextBatch, { timeout: 200 });
        } else {
          setTimeout(loadNextBatch, 50);
        }
      }
    }

    setTimeout(loadNextBatch, 200);
  }

  /* ==========================================================================
     5. SCROLL CALCULATIONS & RENDER LOOP (60FPS LERP)
     ========================================================================== */
  function drawCanvasFrame(canvas, ctx, img, fadeAlpha) {
    if (!canvas || !ctx) return;
    const stageWidth = canvas.clientWidth;
    const stageHeight = canvas.clientHeight;
    
    // Scale canvas by DPR (cap at 2)
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const renderWidth = Math.round(stageWidth * dpr);
    const renderHeight = Math.round(stageHeight * dpr);
    
    if (canvas.width !== renderWidth || canvas.height !== renderHeight) {
      canvas.width = renderWidth;
      canvas.height = renderHeight;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    
    // Fill pure flat asphalt
    ctx.fillStyle = '#07080A';
    ctx.fillRect(0, 0, stageWidth, stageHeight);

    if (img && img.naturalWidth) {
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      const imgAspect = imgW / imgH;
      const stageAspect = stageWidth / stageHeight;
      const isLandscape = stageWidth >= stageHeight;

      let drawW, drawH, drawX, drawY;

      if (isLandscape) {
        // Landscape screens: cover-fit
        if (stageAspect > imgAspect) {
          drawW = stageWidth;
          drawH = stageWidth / imgAspect;
          drawX = 0;
          drawY = (stageHeight - drawH) / 2;
        } else {
          drawH = stageHeight;
          drawW = stageHeight * imgAspect;
          drawX = (stageWidth - drawW) / 2;
          drawY = 0;
        }
      } else {
        // Portrait screens: contain-fit, vertically centered on --asphalt
        if (stageAspect > imgAspect) {
          drawH = stageHeight;
          drawW = stageHeight * imgAspect;
          drawX = (stageWidth - drawW) / 2;
          drawY = 0;
        } else {
          drawW = stageWidth;
          drawH = stageWidth / imgAspect;
          drawX = 0;
          drawY = (stageHeight - drawH) / 2;
        }
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }

    // Optional solid black fade overlay (e.g. Hero end 95%-100%)
    if (fadeAlpha && fadeAlpha > 0) {
      ctx.fillStyle = `rgba(7, 8, 10, ${Math.min(fadeAlpha, 1)})`;
      ctx.fillRect(0, 0, stageWidth, stageHeight);
    }

    ctx.restore();
  }

  function initScrollytelling() {
    // 1. Hero elements
    const heroWrapper = document.getElementById('heroWrapper');
    const heroCanvas = document.getElementById('heroCanvas');
    const heroCtx = heroCanvas ? heroCanvas.getContext('2d') : null;
    const heroFill = document.getElementById('heroProgressFill');
    const hudChapter = document.getElementById('hudChapter');
    const hudSpeed = document.getElementById('hudSpeed');
    const hudDist = document.getElementById('hudDist');
    const heroChapters = document.querySelectorAll('.hero-chapter');

    // 2. Dismantle elements
    const dismantleWrapper = document.getElementById('dismantleWrapper');
    const dismantleCanvas = document.getElementById('dismantleCanvas');
    const dismantleCtx = dismantleCanvas ? dismantleCanvas.getContext('2d') : null;
    const dismantleFill = document.getElementById('dismantleProgressFill');
    const dismantleCallouts = document.getElementById('dismantleCallouts');

    // Render Callout Nodes inside Dismantle
    if (dismantleCallouts) {
      dismantleCallouts.innerHTML = '';
      CFG.dismantle.callouts.forEach((callout) => {
        const node = document.createElement('div');
        node.className = `callout-node align-${callout.labelAlign || 'right'}`;
        node.id = `callout-${callout.id}`;
        node.style.left = `${callout.x}%`;
        node.style.top = `${callout.y}%`;
        node.innerHTML = `
          <div class="callout-dot"></div>
          <div class="callout-line"></div>
          <div class="callout-content">
            <span class="callout-tag">${callout.title}</span>
            <span class="callout-desc">${callout.description}</span>
          </div>
        `;
        dismantleCallouts.appendChild(node);
      });
    }

    // Set Section Wrapper Heights from config
    if (heroWrapper) heroWrapper.style.height = CFG.hero.wrapperHeight;
    if (dismantleWrapper) dismantleWrapper.style.height = CFG.dismantle.wrapperHeight;

    let lastHeroDrawn = -1;
    let lastDismantleDrawn = -1;

    // Main rAF Animation & Scrubbing Loop
    function renderLoop() {
      const vh = window.innerHeight;

      // --- HERO SECTION PROGRESS ---
      if (heroWrapper) {
        const rect = heroWrapper.getBoundingClientRect();
        const totalScrollable = heroWrapper.offsetHeight - vh;
        state.heroProgress = totalScrollable > 0 ? Math.max(0, Math.min(-rect.top / totalScrollable, 1)) : 0;
        state.heroTargetFrame = Math.round(state.heroProgress * (CFG.hero.frameCount - 1));

        // Smooth Lerp (0.15)
        state.heroCurrentFrame += (state.heroTargetFrame - state.heroCurrentFrame) * CFG.lerpFactor;
        const currentHeroRounded = Math.round(state.heroCurrentFrame);

        // Calculate fade to solid black over last 5% of scroll
        let fadeAlpha = 0;
        if (state.heroProgress >= CFG.hero.fadeToBlackRange[0]) {
          fadeAlpha = (state.heroProgress - CFG.hero.fadeToBlackRange[0]) / (CFG.hero.fadeToBlackRange[1] - CFG.hero.fadeToBlackRange[0]);
        }

        // Draw canvas if frame or fade changed
        if (currentHeroRounded !== lastHeroDrawn || fadeAlpha > 0) {
          lastHeroDrawn = currentHeroRounded;
          const img = getNearestLoadedFrame(state.heroFrames, currentHeroRounded);
          drawCanvasFrame(heroCanvas, heroCtx, img, fadeAlpha);
        }

        // Update 1px bottom progress line
        if (heroFill) {
          heroFill.style.width = `${(state.heroProgress * 100).toFixed(2)}%`;
        }

        // Update HUD (chapter, speed, distance)
        const speed = Math.round(state.heroProgress * CFG.hero.speedRange[1]);
        const dist = (state.heroProgress * CFG.hero.distanceRange[1]).toFixed(1);
        if (hudSpeed) hudSpeed.textContent = String(speed).padStart(3, '0');
        if (hudDist) hudDist.textContent = dist;

        // Determine active chapter based on progress range
        let activeChapIdx = 0;
        CFG.hero.chapters.forEach((chap, idx) => {
          if (state.heroProgress >= chap.range[0] && state.heroProgress <= chap.range[1]) {
            activeChapIdx = idx;
          }
        });
        if (hudChapter) {
          hudChapter.textContent = CFG.hero.chapters[activeChapIdx].id;
        }

        heroChapters.forEach((el, idx) => {
          const chap = CFG.hero.chapters[idx];
          const inRange = state.heroProgress >= chap.range[0] && state.heroProgress <= chap.range[1];
          if (inRange) {
            el.classList.add('is-active');
          } else {
            el.classList.remove('is-active');
          }
        });
      }

      // --- DISMANTLE SECTION PROGRESS ---
      if (dismantleWrapper) {
        const rect = dismantleWrapper.getBoundingClientRect();
        const totalScrollable = dismantleWrapper.offsetHeight - vh;
        state.dismantleProgress = totalScrollable > 0 ? Math.max(0, Math.min(-rect.top / totalScrollable, 1)) : 0;
        state.dismantleTargetFrame = Math.round(state.dismantleProgress * (CFG.dismantle.frameCount - 1));

        state.dismantleCurrentFrame += (state.dismantleTargetFrame - state.dismantleCurrentFrame) * CFG.lerpFactor;
        const currentDismantleRounded = Math.round(state.dismantleCurrentFrame);

        if (currentDismantleRounded !== lastDismantleDrawn) {
          lastDismantleDrawn = currentDismantleRounded;
          const img = getNearestLoadedFrame(state.dismantleFrames, currentDismantleRounded);
          drawCanvasFrame(dismantleCanvas, dismantleCtx, img, 0);
        }

        // Update 1px bottom progress line
        if (dismantleFill) {
          dismantleFill.style.width = `${(state.dismantleProgress * 100).toFixed(2)}%`;
        }

        // After 70% progress, 4 callouts fade in one by one
        CFG.dismantle.callouts.forEach((callout) => {
          const node = document.getElementById(`callout-${callout.id}`);
          if (node) {
            if (state.dismantleProgress >= callout.progress) {
              node.classList.add('is-active');
            } else {
              node.classList.remove('is-active');
            }
          }
        });
      }

      requestAnimationFrame(renderLoop);
    }

    requestAnimationFrame(renderLoop);
  }

  /* ==========================================================================
     6. SECTION 2: STATEMENT WORD-BY-WORD SCROLL REVEAL
     ========================================================================== */
  function initStatementSection() {
    const quoteEl = document.getElementById('statementQuote');
    const statementSec = document.getElementById('statement');
    if (!quoteEl || !statementSec) return;

    // Split sentence into discrete word spans
    const text = quoteEl.textContent.trim();
    const words = text.split(/\s+/);
    quoteEl.innerHTML = words.map((w) => `<span class="statement-word">${w}&nbsp;</span>`).join('');
    const wordSpans = quoteEl.querySelectorAll('.statement-word');

    function updateStatementScroll() {
      const rect = statementSec.getBoundingClientRect();
      const vh = window.innerHeight;
      
      // Calculate progress of statement crossing the center of viewport
      const totalRange = vh + rect.height;
      const currentScroll = vh - rect.top;
      const progress = Math.max(0, Math.min(currentScroll / totalRange, 1));

      // Each word goes from 15% to 100% opacity as progress advances
      const numWords = wordSpans.length;
      wordSpans.forEach((span, i) => {
        const wordStart = 0.25 + (i / numWords) * 0.45;
        const wordEnd = wordStart + 0.12;
        
        let opacity = 0.15;
        if (progress >= wordEnd) {
          opacity = 1.0;
        } else if (progress > wordStart) {
          opacity = 0.15 + 0.85 * ((progress - wordStart) / (wordEnd - wordStart));
        }
        span.style.opacity = opacity.toFixed(3);
      });
    }

    window.addEventListener('scroll', updateStatementScroll, { passive: true });
    updateStatementScroll();
  }

  /* ==========================================================================
     7. SECTION 4: LINEUP HOVER ACCORDION & CAR INTERACTION
     ========================================================================== */
  function initLineupAccordion() {
    const container = document.getElementById('lineupAccordion');
    const section = document.getElementById('lineup');
    if (!container || !section) return;

    // Render slides from config.js
    container.innerHTML = CFG.lineup.models.map((model, idx) => {
      const isOpen = idx === state.activeLineupIndex;
      return `
        <button type="button" 
                class="lineup-slide ${isOpen ? 'is-open' : ''}" 
                id="slide-${model.id}" 
                data-index="${idx}"
                role="tab"
                aria-selected="${isOpen ? 'true' : 'false'}"
                aria-expanded="${isOpen ? 'true' : 'false'}"
                aria-label="${model.name} — ${model.tagline}">
          
          <!-- Closed Slide View -->
          <div class="slide-closed-view">
            <span class="slide-number mono-label">${model.num}</span>
            <span class="slide-vertical-name mono-label">${model.name}</span>
          </div>

          <!-- Car Photography (Cropped tight when closed, slides in when open) -->
          <div class="slide-bg-wrapper">
            <img src="${model.image}" alt="${model.alt}" class="slide-car-image" loading="lazy">
          </div>

          <!-- Floor Line at 72% height -->
          <div class="slide-floor-line" aria-hidden="true"></div>

          <!-- Open Slide View -->
          <div class="slide-open-view">
            <div class="slide-open-header">
              <span class="mono-label section-tag">${model.num} — ${model.tagline}</span>
              <h3 class="slide-model-title display-title">${model.name}</h3>
            </div>

            <div class="slide-open-footer">
              <div class="slide-specs-grid">
                ${model.specs.map(spec => `
                  <div class="spec-cell">
                    <span class="spec-label mono-label">${spec.label}</span>
                    <span class="spec-value mono-label">${spec.value}</span>
                  </div>
                `).join('')}
              </div>

              <div class="slide-bottom-bar">
                <div class="swatch-row" aria-label="Color Palette">
                  ${model.colors.map((color, cIdx) => `
                    <span class="color-swatch ${cIdx === 0 ? 'is-active' : ''}" 
                          style="background-color: ${color};" 
                          data-color="${color}" 
                          title="Color Swatch ${cIdx + 1}"></span>
                  `).join('')}
                </div>

                <a href="#reserve" class="slide-configure-link mono-label" data-cursor="CONFIGURE" data-model="${model.id}">
                  Configure →
                </a>
              </div>
            </div>
          </div>

        </button>
      `;
    }).join('');

    const slides = container.querySelectorAll('.lineup-slide');

    // Debounced hover mechanism (80ms debounce)
    let hoverTimeout = null;

    function openSlide(index) {
      if (index === state.activeLineupIndex) return;
      state.activeLineupIndex = index;

      slides.forEach((slide, idx) => {
        const isTarget = idx === index;
        slide.classList.toggle('is-open', isTarget);
        slide.setAttribute('aria-expanded', isTarget ? 'true' : 'false');
        slide.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      });
    }

    slides.forEach((slide, idx) => {
      // Desktop: hover with 80ms debounce
      slide.addEventListener('mouseenter', () => {
        if (!state.isMobile) {
          clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            openSlide(idx);
          }, CFG.lineup.hoverDebounceMs);
        }
      });

      // Mobile or Click / Keyboard Focus
      slide.addEventListener('click', (e) => {
        if (e.target.closest('.slide-configure-link')) {
          // Open Reservation Modal with pre-selected model
          const modelId = e.target.closest('.slide-configure-link').getAttribute('data-model');
          openReserveModal(modelId);
          return;
        }
        if (e.target.closest('.color-swatch')) {
          const swatches = slide.querySelectorAll('.color-swatch');
          swatches.forEach(s => s.classList.remove('is-active'));
          e.target.closest('.color-swatch').classList.add('is-active');
          return;
        }
        openSlide(idx);
      });

      // Keyboard arrow navigation
      slide.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const next = (idx + 1) % slides.length;
          slides[next].focus();
          openSlide(next);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = (idx - 1 + slides.length) % slides.length;
          slides[prev].focus();
          openSlide(prev);
        }
      });
    });

    // Staggered slide entrance via IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.classList.add('is-revealed');
          observer.unobserve(section);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(section);
  }

  /* ==========================================================================
     8. SECTION 5: RESERVE ACTION & MODAL DIALOG
     ========================================================================== */
  function openReserveModal(modelId) {
    const dialog = document.getElementById('reserveDialog');
    const modelSelect = document.getElementById('modelSelect');
    if (!dialog) return;

    if (modelId && modelSelect) {
      modelSelect.value = modelId;
    }

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  function initReserveActions() {
    const reserveBtn = document.getElementById('reserveBtn');
    const dialog = document.getElementById('reserveDialog');
    const dialogClose = document.getElementById('dialogClose');
    const reserveForm = document.getElementById('reserveForm');
    const formFeedback = document.getElementById('formFeedback');

    if (reserveBtn) {
      reserveBtn.addEventListener('click', () => {
        openReserveModal('gt-e');
      });
    }

    if (dialogClose && dialog) {
      dialogClose.addEventListener('click', () => {
        dialog.close();
      });
    }

    if (dialog) {
      dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width
        );
        if (!isInDialog) {
          dialog.close();
        }
      });
    }

    if (reserveForm) {
      reserveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('contactEmail').value;
        if (formFeedback) {
          formFeedback.textContent = 'TRANSMISSION COMPLETE. PRIVATE ALLOCATION ENCRYPTED & SUBMITTED.';
          setTimeout(() => {
            if (dialog) dialog.close();
            formFeedback.textContent = '';
            reserveForm.reset();
          }, 1800);
        }
      });
    }
  }

  /* ==========================================================================
     9. NAVIGATION SCROLL HIDE / SHOW
     ========================================================================== */
  function initNavScroll() {
    const nav = document.getElementById('mainNav');
    if (!nav) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 120 && currentScrollY > lastScrollY) {
        nav.classList.add('is-hidden');
      } else {
        nav.classList.remove('is-hidden');
      }
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  /* ==========================================================================
     10. WINDOW RESIZE HANDLING
     ========================================================================== */
  function initResizeListener() {
    window.addEventListener('resize', () => {
      const wasMobile = state.isMobile;
      state.isMobile = window.innerWidth < CFG.mobileBreakpoint;
      
      if (wasMobile !== state.isMobile) {
        // Update frame paths if breakpoint crossed
        const heroPath = state.isMobile ? CFG.hero.framePathMobile : CFG.hero.framePathDesktop;
        const dismantlePath = state.isMobile ? CFG.dismantle.framePathMobile : CFG.dismantle.framePathDesktop;
        
        state.heroFrames.forEach((f, i) => { f.src = heroPath(i + 1); });
        state.dismantleFrames.forEach((f, i) => { f.src = dismantlePath(i + 1); });
      }
    });
  }

  /* ==========================================================================
     11. INITIALIZATION DISPATCHER
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initFilmGrain();
    initCustomCursor();
    initNavScroll();
    initResizeListener();
    initStatementSection();
    initLineupAccordion();
    initReserveActions();

    // Start preloader and initiate scrollytelling on completion
    initPreloader(() => {
      initScrollytelling();
    });
  });

})();

