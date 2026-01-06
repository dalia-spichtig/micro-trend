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

      // Preload all images and GIFs
      await Promise.all(assets.map(asset => preloadAsset(asset)));

      // Small delay to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 300));

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

// Combined parallax handler for optimal performance
function initAllParallax() {
  // Cache all elements and references
  const elements = {
    labubuBorder: document.querySelector('.labubu-border'),
    dubaiBorder: document.querySelector('.dubai-border'),
    gifs: document.querySelectorAll('.gif-front'),
    labubuBorder2: document.querySelector('.labubu-border-2'),
    labubuBorder3: document.querySelector('.labubu-border-3'),
    heroSection: document.querySelector('.hero'),
    textBlockSection: document.querySelector('.text-block'),
    movingTextSection: document.querySelector('.moving-text-section'),
    textBlock2Section: document.querySelector('.text-block_2')
  };

  // Skip if no elements found
  if (!elements.labubuBorder && !elements.dubaiBorder && elements.gifs.length === 0 && 
      !elements.labubuBorder2 && !elements.labubuBorder3) return;

  let ticking = false;
  let cachedScrollY = 0;
  let cachedViewportHeight = window.innerHeight;

  function updateAllParallax() {
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = cachedViewportHeight;
    const viewportBottom = scrollY + viewportHeight;

    // Labubu border parallax
    if (elements.labubuBorder && elements.heroSection) {
      const heroHeight = elements.heroSection.offsetHeight;
      const heroTop = elements.heroSection.getBoundingClientRect().top + scrollY;
      const imageTop = heroTop + heroHeight - 50;
      
      if (viewportBottom >= imageTop) {
        const scrollProgress = Math.min(Math.max((scrollY - heroTop) / heroHeight, 0), 1);
        elements.labubuBorder.style.transform = `translateY(${scrollProgress * 20}px)`;
      } else {
        elements.labubuBorder.style.transform = 'translateY(0px)';
      }
    }

    // Dubai border parallax
    if (elements.dubaiBorder && elements.textBlockSection) {
      const sectionHeight = elements.textBlockSection.offsetHeight;
      const sectionTop = elements.textBlockSection.getBoundingClientRect().top + scrollY;
      const imageTop = sectionTop + sectionHeight - 50;
      
      if (viewportBottom >= imageTop) {
        const scrollProgress = Math.min(Math.max((scrollY - sectionTop) / sectionHeight, 0), 1);
        elements.dubaiBorder.style.transform = `translateY(${scrollProgress * 40}px)`;
      } else {
        elements.dubaiBorder.style.transform = 'translateY(0px)';
      }
    }

    // GIFs parallax
    if (elements.gifs.length > 0 && elements.movingTextSection) {
      const sectionHeight = elements.movingTextSection.offsetHeight;
      const sectionTop = elements.movingTextSection.getBoundingClientRect().top + scrollY;
      const gifsTop = sectionTop;
      
      if (viewportBottom >= gifsTop) {
        const scrollProgress = Math.min(Math.max((scrollY - sectionTop) / sectionHeight, 0), 1);
        const translateY = scrollProgress * 60;
        elements.gifs.forEach(gif => {
          gif.style.transform = `translateY(${translateY}px)`;
        });
      } else {
        elements.gifs.forEach(gif => {
          gif.style.transform = 'translateY(0px)';
        });
      }
    }

    // Labubu border 2 parallax
    if (elements.labubuBorder2 && elements.textBlock2Section) {
      const imageRect = elements.labubuBorder2.getBoundingClientRect();
      const imageTop = scrollY + imageRect.top;
      const imageBottom = imageTop + imageRect.height;
      const sectionRect = elements.textBlock2Section.getBoundingClientRect();
      const sectionTop = scrollY + sectionRect.top;
      const sectionHeight = sectionRect.height;
      const isImageVisible = imageBottom > scrollY && imageTop < viewportBottom;
      
      if (isImageVisible) {
        const startPoint = sectionTop - viewportHeight;
        const endPoint = sectionTop + sectionHeight;
        const totalRange = endPoint - startPoint;
        const currentPosition = scrollY - startPoint;
        const scrollProgress = Math.min(Math.max(currentPosition / totalRange, 0), 1);
        elements.labubuBorder2.style.transform = `translateY(${scrollProgress * 70}px)`;
      } else if (scrollY < imageTop) {
        elements.labubuBorder2.style.transform = 'translateY(0px)';
      } else {
        elements.labubuBorder2.style.transform = 'translateY(70px)';
      }
    }

    // Labubu border 3 parallax
    if (elements.labubuBorder3 && elements.textBlock2Section) {
      const sectionHeight = elements.textBlock2Section.offsetHeight;
      const sectionTop = elements.textBlock2Section.getBoundingClientRect().top + scrollY;
      const imageTop = sectionTop + sectionHeight - 50;
      
      if (viewportBottom >= imageTop) {
        const scrollProgress = Math.min(Math.max((scrollY - sectionTop) / sectionHeight, 0), 1);
        elements.labubuBorder3.style.transform = `translateY(${scrollProgress * 40}px)`;
      } else {
        elements.labubuBorder3.style.transform = 'translateY(0px)';
      }
    }

    cachedScrollY = scrollY;
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateAllParallax);
      ticking = true;
    }
  }

  // Handle resize to update viewport height cache
  function onResize() {
    cachedViewportHeight = window.innerHeight;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  updateAllParallax(); // Initial call
}

