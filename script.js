// Asset Loading Manager
(function() {
  'use strict';

  // List of all assets to preload
  const assets = [
    // Images
    'image/labubuBorder.png',
    'image/dubaiBorder.png',
    'image/labubuBorder2.png',
    'image/labubuBorder3.png',
    'image/laurine1.png',
    'image/laurine2.png',
    'image/laurine3.png',
    // GIFs
    'giff/giff1.gif',
    'giff/giff2.gif',
    'giff/giff3.gif',
    'giff/giff_star.gif',
    'giff/fond.gif'
  ];

  let loadedAssets = 0;
  let totalAssets = assets.length;
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');

  // Function to preload an image/GIF
  function preloadAsset(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        loadedAssets++;
        updateLoadingProgress();
        resolve();
      };
      img.onerror = () => {
        loadedAssets++;
        updateLoadingProgress();
        // Still resolve to continue loading even if one asset fails
        resolve();
      };
      img.src = src;
    });
  }

  // Update loading progress (optional - can add progress bar later)
  function updateLoadingProgress() {
    const progress = (loadedAssets / totalAssets) * 100;
    // You can update a progress bar here if needed
  }

  // Wait for all assets to load
  async function loadAllAssets() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Wait for CSS to load
      await new Promise(resolve => {
        if (document.styleSheets.length > 0) {
          // Check if stylesheet is loaded
          const checkCSS = setInterval(() => {
            try {
              if (document.styleSheets[0].cssRules) {
                clearInterval(checkCSS);
                resolve();
              }
            } catch (e) {
              // Cross-origin stylesheet, assume loaded
              clearInterval(checkCSS);
              resolve();
            }
          }, 10);
        } else {
          resolve();
        }
      });

      // Preload critical images only (non-blocking)
      // Load hero background first, then others in parallel
      const criticalAssets = ['image/laurine1.png', 'giff/fond.gif'];
      const otherAssets = assets.filter(a => !criticalAssets.includes(a));
      
      // Load critical assets first
      await Promise.all(criticalAssets.map(asset => preloadAsset(asset)));
      
      // Load other assets in background (non-blocking)
      Promise.all(otherAssets.map(asset => preloadAsset(asset))).catch(() => {});
      
      // Minimal delay - let browser handle rendering
      await new Promise(resolve => setTimeout(resolve, 100));

      // Hide loading screen and show main content
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
      }
      if (mainContent) {
        mainContent.classList.add('loaded');
      }

      // Initialize all page functionality after content is shown
      initializePage();

      // Remove loading screen from DOM after transition
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.remove();
        }
      }, 500);

    } catch (error) {
      console.error('Error loading assets:', error);
      // Still show content even if there's an error
      if (loadingScreen) {
        loadingScreen.classList.add('hidden');
      }
      if (mainContent) {
        mainContent.classList.add('loaded');
      }
    }
  }

  // Start loading process
  loadAllAssets();
})();

// Exemple de JS très simple
const dynamicText = document.getElementById("dynamic-text");

// Initialize all page functionality
function initializePage() {
  generateNoise();
  initAllParallax(); // Combined parallax handler for better performance
}

// Generate subtle noise effect
function generateNoise() {
  const canvas = document.getElementById("noise-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  
  // Set canvas size to match viewport
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  
  // Generate noise pattern
  function drawNoise() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Generate subtle noise (low intensity)
      const noise = Math.random() * 20 - 10; // Range: -10 to 10
      data[i] = 255 + noise;     // R
      data[i + 1] = 240 + noise;  // G
      data[i + 2] = 240 + noise;  // B
      data[i + 3] = 30;           // Alpha (subtle)
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
  
  drawNoise();
}

// Initialize noise when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", generateNoise);
} else {
  generateNoise();
}

// Optimized parallax handler - 100% transform-based, no layout recalculations
function initAllParallax() {
  const elements = {
    labubuBorder: document.querySelector('.labubu-border'),
    dubaiBorder: document.querySelector('.dubai-border'),
    labubuBorder2: document.querySelector('.labubu-border-2'),
    labubuBorder3: document.querySelector('.labubu-border-3')
  };

  if (!elements.labubuBorder && !elements.dubaiBorder && 
      !elements.labubuBorder2 && !elements.labubuBorder3) return;

  // Cache section positions ONCE at init (no recalculation during scroll)
  const parallaxConfig = [];
  
  // Labubu border - hero section
  if (elements.labubuBorder) {
    const hero = document.querySelector('.hero');
    if (hero) {
      const rect = hero.getBoundingClientRect();
      parallaxConfig.push({
        element: elements.labubuBorder,
        startY: rect.top + window.scrollY,
        endY: rect.top + window.scrollY + rect.height,
        maxMovement: 20,
        speed: 0.15
      });
    }
  }

  // Dubai border - text-block section
  if (elements.dubaiBorder) {
    const section = document.querySelector('.text-block');
    if (section) {
      const rect = section.getBoundingClientRect();
      parallaxConfig.push({
        element: elements.dubaiBorder,
        startY: rect.top + window.scrollY,
        endY: rect.top + window.scrollY + rect.height,
        maxMovement: 40,
        speed: 0.2
      });
    }
  }

  // Labubu border 2 - text-block_2 section
  if (elements.labubuBorder2) {
    const section = document.querySelector('.text-block_2');
    if (section) {
      const rect = section.getBoundingClientRect();
      parallaxConfig.push({
        element: elements.labubuBorder2,
        startY: rect.top + window.scrollY - window.innerHeight,
        endY: rect.top + window.scrollY + rect.height,
        maxMovement: 70,
        speed: 0.25
      });
    }
  }

  // Labubu border 3 - text-block_2 section
  if (elements.labubuBorder3) {
    const section = document.querySelector('.text-block_2');
    if (section) {
      const rect = section.getBoundingClientRect();
      parallaxConfig.push({
        element: elements.labubuBorder3,
        startY: rect.top + window.scrollY,
        endY: rect.top + window.scrollY + rect.height,
        maxMovement: 40,
        speed: 0.2
      });
    }
  }

  // LERP function for smooth interpolation
  function lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  // Current transform values (for LERP)
  const currentValues = parallaxConfig.map(() => ({ y: 0, targetY: 0 }));

  let ticking = false;
  let rafId = null;

  function updateParallax() {
    const scrollY = window.scrollY;
    let needsUpdate = false;

    parallaxConfig.forEach((config, index) => {
      const { startY, endY, maxMovement, speed } = config;
      const range = endY - startY;
      
      if (scrollY < startY) {
        currentValues[index].targetY = 0;
      } else if (scrollY > endY) {
        currentValues[index].targetY = maxMovement;
      } else {
        const progress = (scrollY - startY) / range;
        currentValues[index].targetY = progress * maxMovement;
      }

      // LERP for smooth animation
      const current = currentValues[index].y;
      const target = currentValues[index].targetY;
      const newY = lerp(current, target, speed);
      
      if (Math.abs(newY - current) > 0.01) {
        currentValues[index].y = newY;
        config.element.style.transform = `translate3d(0, ${newY}px, 0)`;
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      rafId = requestAnimationFrame(updateParallax);
    } else {
      ticking = false;
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      rafId = requestAnimationFrame(updateParallax);
    }
  }

  function onResize() {
    // Recalculate positions on resize (debounced)
    clearTimeout(window.parallaxResizeTimeout);
    window.parallaxResizeTimeout = setTimeout(() => {
      parallaxConfig.forEach((config, index) => {
        const hero = document.querySelector('.hero');
        const textBlock = document.querySelector('.text-block');
        const textBlock2 = document.querySelector('.text-block_2');
        
        if (config.element === elements.labubuBorder && hero) {
          const rect = hero.getBoundingClientRect();
          config.startY = rect.top + window.scrollY;
          config.endY = rect.top + window.scrollY + rect.height;
        } else if (config.element === elements.dubaiBorder && textBlock) {
          const rect = textBlock.getBoundingClientRect();
          config.startY = rect.top + window.scrollY;
          config.endY = rect.top + window.scrollY + rect.height;
        } else if ((config.element === elements.labubuBorder2 || config.element === elements.labubuBorder3) && textBlock2) {
          const rect = textBlock2.getBoundingClientRect();
          if (config.element === elements.labubuBorder2) {
            config.startY = rect.top + window.scrollY - window.innerHeight;
          } else {
            config.startY = rect.top + window.scrollY;
          }
          config.endY = rect.top + window.scrollY + rect.height;
        }
      });
    }, 150);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  updateParallax(); // Initial call
}

