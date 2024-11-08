// Reset scroll top
history.scrollRestoration = "manual";
$(window).on("beforeunload", function () {
  $(window).scrollTop(0);
});

// Initialize Lenis with base configuration
const lenis = new Lenis({
  duration: 0.85,
  lerp: 1,
  orientation: "vertical",
  gestureOrientation: "vertical",
  normalizeWheel: true,
  ease: "easeInOutQuad",
  wheelMultiplier: 0.95,
  smoothTouch: true,
  syncTouch: true,
  syncTouchLerp: 0,
  touchInertiaMultiplier: 10,
  touchMultiplier: 0,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

/*
 *
 *
 *
 *
 */

$(document).ready(function () {
  const totalFrames = 211;
  const frameRate = 1000 / 48; // 48fps
  const imagePath =
    "https://cdn.jsdelivr.net/gh/NotAnother-NZ/na13-prezzee@main/img_seq/prezzee_gift_open_mockup/";
  const $container = $("#hand-mockup-gift-box");
  let currentFrame = 1;
  let images = [];
  let isPreloaded = false;
  let lastFrameTime = performance.now();

  // Preload images
  function preloadImages() {
    let loadedImages = 0;
    for (let i = 1; i <= totalFrames; i++) {
      let frameNumber = String(i).padStart(4, "0");
      let img = new Image();
      img.src = `${imagePath}${frameNumber}.webp`;
      img.onload = () => {
        loadedImages++;
        if (loadedImages === totalFrames) {
          isPreloaded = true;
          requestAnimationFrame(updateFrame);
        }
      };
      images.push(img);
    }
  }

  // Update frame
  function updateFrame(timestamp) {
    if (isPreloaded) {
      if (timestamp - lastFrameTime >= frameRate) {
        $container.css(
          "background-image",
          `url(${images[currentFrame - 1].src})`
        );
        currentFrame = (currentFrame % totalFrames) + 1;
        lastFrameTime = timestamp;
      }
      requestAnimationFrame(updateFrame);
    }
  }

  preloadImages();
});
