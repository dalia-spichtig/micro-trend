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
  initParallax();
  initDubaiParallax();
  initGifsParallax();
  initLabubuBorder2Parallax();
  initLabubuBorder3Parallax();
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

// Subtle parallax effect for labubu border
function initParallax() {
  const labubuBorder = document.querySelector('.labubu-border');
  if (!labubuBorder) return;

  const maxMovement = 20; // Maximum 5px movement
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  function updateParallax() {
    const scrollY = window.scrollY || window.pageYOffset;
    const heroHeight = heroSection.offsetHeight;
    const heroTop = heroSection.getBoundingClientRect().top + scrollY;
    
    // Calculate when the image area is visible
    const imageTop = heroTop + heroHeight - 50; // Account for margin-top: -50px
    const viewportBottom = scrollY + window.innerHeight;
    
    // Only apply parallax when image is in or near viewport
    if (viewportBottom >= imageTop) {
      // Calculate scroll progress relative to hero section
      const scrollProgress = Math.min(Math.max((scrollY - heroTop) / heroHeight, 0), 1);
      // Move image slowly (subtle movement)
      const translateY = scrollProgress * maxMovement;
      labubuBorder.style.transform = `translateY(${translateY}px)`;
    } else {
      labubuBorder.style.transform = 'translateY(0px)';
    }
  }

  // Use requestAnimationFrame for smooth performance
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateParallax(); // Initial call
}

// Parallax will be initialized by initializePage() after assets load

// Subtle parallax effect for dubai border (same as labubu border)
function initDubaiParallax() {
  const dubaiBorder = document.querySelector('.dubai-border');
  if (!dubaiBorder) return;

  const maxMovement = 40; // Same as labubu border
  const textBlockSection = document.querySelector('.text-block');
  if (!textBlockSection) return;

  function updateDubaiParallax() {
    const scrollY = window.scrollY || window.pageYOffset;
    const sectionHeight = textBlockSection.offsetHeight;
    const sectionTop = textBlockSection.getBoundingClientRect().top + scrollY;
    
    // Calculate when the image area is visible
    const imageTop = sectionTop + sectionHeight - 50; // Account for margin-top: -70px
    const viewportBottom = scrollY + window.innerHeight;
    
    // Only apply parallax when image is in or near viewport
    if (viewportBottom >= imageTop) {
      // Calculate scroll progress relative to text-block section
      const scrollProgress = Math.min(Math.max((scrollY - sectionTop) / sectionHeight, 0), 1);
      // Move image slowly (subtle movement)
      const translateY = scrollProgress * maxMovement;
      dubaiBorder.style.transform = `translateY(${translateY}px)`;
    } else {
      dubaiBorder.style.transform = 'translateY(0px)';
    }
  }

  // Use requestAnimationFrame for smooth performance
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateDubaiParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateDubaiParallax(); // Initial call
}

// Dubai parallax will be initialized by initializePage() after assets load

// Parallax effect for GIFs (same as labubu border)
function initGifsParallax() {
  const gifs = document.querySelectorAll('.gif-front');
  if (gifs.length === 0) return;

  const maxMovement = 60; // Same as labubu border
  const movingTextSection = document.querySelector('.moving-text-section');
  if (!movingTextSection) return;

  function updateGifsParallax() {
    const scrollY = window.scrollY || window.pageYOffset;
    const sectionHeight = movingTextSection.offsetHeight;
    const sectionTop = movingTextSection.getBoundingClientRect().top + scrollY;
    
    // Calculate when the GIFs area is visible
    const gifsTop = sectionTop;
    const viewportBottom = scrollY + window.innerHeight;
    
    // Only apply parallax when GIFs are in or near viewport
    if (viewportBottom >= gifsTop) {
      // Calculate scroll progress relative to moving-text-section
      const scrollProgress = Math.min(Math.max((scrollY - sectionTop) / sectionHeight, 0), 1);
      // Move GIFs slowly (subtle movement)
      const translateY = scrollProgress * maxMovement;
      
      gifs.forEach(gif => {
        gif.style.transform = `translateY(${translateY}px)`;
      });
    } else {
      gifs.forEach(gif => {
        gif.style.transform = 'translateY(0px)';
      });
    }
  }

  // Use requestAnimationFrame for smooth performance
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateGifsParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateGifsParallax(); // Initial call
}

// GIFs parallax will be initialized by initializePage() after assets load

// Subtle parallax effect for labubu border 2
function initLabubuBorder2Parallax() {
  const labubuBorder2 = document.querySelector('.labubu-border-2');
  if (!labubuBorder2) return;

  const maxMovement = 70;
  const textBlock2Section = document.querySelector('.text-block_2');
  if (!textBlock2Section) return;

  function updateLabubuBorder2Parallax() {
    const scrollY = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const viewportBottom = scrollY + viewportHeight;
    
    // Get image's actual position in the document
    const imageRect = labubuBorder2.getBoundingClientRect();
    const imageTop = scrollY + imageRect.top;
    const imageBottom = imageTop + imageRect.height;
    
    // Get section position
    const sectionRect = textBlock2Section.getBoundingClientRect();
    const sectionTop = scrollY + sectionRect.top;
    const sectionHeight = sectionRect.height;
    
    // Check if image is visible in viewport
    const isImageVisible = imageBottom > scrollY && imageTop < viewportBottom;
    
    if (isImageVisible) {
      // Calculate progress based on section scroll position
      // Start parallax when section enters viewport
      const startPoint = sectionTop - viewportHeight;
      const endPoint = sectionTop + sectionHeight;
      const totalRange = endPoint - startPoint;
      const currentPosition = scrollY - startPoint;
      
      const scrollProgress = Math.min(Math.max(currentPosition / totalRange, 0), 1);
      const translateY = scrollProgress * maxMovement;
      labubuBorder2.style.transform = `translateY(${translateY}px)`;
    } else if (scrollY < imageTop) {
      labubuBorder2.style.transform = 'translateY(0px)';
    } else {
      labubuBorder2.style.transform = `translateY(${maxMovement}px)`;
    }
  }

  // Use requestAnimationFrame for smooth performance
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateLabubuBorder2Parallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateLabubuBorder2Parallax(); // Initial call
}

// Labubu border 2 parallax will be initialized by initializePage() after assets load

// Subtle parallax effect for labubu border 3 (same as labubu border)
function initLabubuBorder3Parallax() {
  const labubuBorder3 = document.querySelector('.labubu-border-3');
  if (!labubuBorder3) return;

  const maxMovement = 40; // Same as labubu border
  const textBlock2Section = document.querySelector('.text-block_2');
  if (!textBlock2Section) return;

  function updateLabubuBorder3Parallax() {
    const scrollY = window.scrollY || window.pageYOffset;
    const sectionHeight = textBlock2Section.offsetHeight;
    const sectionTop = textBlock2Section.getBoundingClientRect().top + scrollY;
    
    // Calculate when the image area is visible
    const imageTop = sectionTop + sectionHeight - 50; // Account for margin-top: -30px
    const viewportBottom = scrollY + window.innerHeight;
    
    // Only apply parallax when image is in or near viewport
    if (viewportBottom >= imageTop) {
      // Calculate scroll progress relative to text-block_2 section
      const scrollProgress = Math.min(Math.max((scrollY - sectionTop) / sectionHeight, 0), 1);
      // Move image slowly (subtle movement)
      const translateY = scrollProgress * maxMovement;
      labubuBorder3.style.transform = `translateY(${translateY}px)`;
    } else {
      labubuBorder3.style.transform = 'translateY(0px)';
    }
  }

  // Use requestAnimationFrame for smooth performance
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateLabubuBorder3Parallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  updateLabubuBorder3Parallax(); // Initial call
}

// Labubu border 3 parallax will be initialized by initializePage() after assets load

