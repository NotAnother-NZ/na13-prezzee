// // Reset scroll top
// history.scrollRestoration = "manual";
// $(window).on("beforeunload", function () {
//   $(window).scrollTop(0);
// });

// Initialize Lenis with base configuration
// const lenis = new Lenis({
//   duration: 0.85,
//   lerp: 1,
//   orientation: "vertical",
//   gestureOrientation: "vertical",
//   normalizeWheel: true,
//   ease: "easeInOutQuad",
//   wheelMultiplier: 0.95,
//   smoothTouch: true,
//   syncTouch: true,
//   syncTouchLerp: 0,
//   touchInertiaMultiplier: 10,
//   touchMultiplier: 0,
// });

// function raf(time) {
//   lenis.raf(time);
//   requestAnimationFrame(raf);
// }

// requestAnimationFrame(raf);

// Lenis configuration (your existing config)
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

// Animate Lenis scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Function to disable scrolling
function disableScroll() {
  lenis.stop(); // Stop Lenis scrolling
  document.body.classList.add("no-scroll"); // Disable native scrolling on mobile
}

// Function to enable scrolling
function enableScroll() {
  lenis.start(); // Resume Lenis scrolling
  document.body.classList.remove("no-scroll"); // Enable native scrolling on mobile
}

// $(document).ready(function () {
//   if (window.innerWidth > 1024) {
//     if ($("#loader-screen").length) {
//       console.log("Loader is present");

//       // Lenis will start once everything is loaded
//       lenis.stop();

//       // Disable arrow key scrolling
//       $(document).on("keydown", function (e) {
//         if (
//           e.key === "ArrowUp" ||
//           e.key === "ArrowDown" ||
//           e.key === "PageUp" ||
//           e.key === "PageDown" ||
//           e.key === "Home" ||
//           e.key === "End"
//         ) {
//           e.preventDefault();
//         }
//       });

//       // Set #loader-screen to display: flex by default
//       $("#loader-screen").css("display", "flex");

//       // Hide #hand-mockup-wrapper-2 by default
//       $("#hand-mockup-wrapper-2").hide();

//       const totalFrames = 302;
//       const initialFrames = 91;
//       const initialSequenceDuration = 3000; // 3 seconds for initial sequence
//       const imagePath =
//         "https://cdn.jsdelivr.net/gh/NotAnother-NZ/na13-prezzee@main/img_seq/prezzee_loader_with_bg/";
//       const $container = $("#hand-mockup-gift-box");
//       const $container2 = $("#hand-mockup-gift-box-2");
//       const $loaderScreen = $("#loader-screen");
//       const $loaderText = $("#loader-text");
//       const $loadingNum = $("#loading-num");
//       const $handMockupWrapper = $("#hand-mockup-wrapper");
//       const $handMockupWrapper2 = $("#hand-mockup-wrapper-2");

//       const initialImages = []; // Frames 1-91
//       const remainingImages = []; // Frames 92-302
//       let currentFrame = 1;
//       let isPreloaded = false;
//       let isSecondSequencePreloaded = false;
//       let startTime = null;

//       // Initial scaling based on viewport dimensions
//       const viewportWidth = window.innerWidth;
//       const viewportHeight = window.innerHeight;

//       const handMockupFrame = document.querySelector("#hand-mockup-frame");
//       const frameWidth = handMockupFrame.offsetWidth;
//       const frameHeight = handMockupFrame.offsetHeight;

//       const widthMultiplier = viewportWidth / frameWidth;
//       const heightMultiplier = viewportHeight / frameHeight;
//       const scaleMultiplier = Math.max(widthMultiplier, heightMultiplier);

//       // Scale parent elements initially
//       gsap.set(["#hand-mockup-wrapper", "#hand-mockup", "#hand-mockup-frame"], {
//         scale: scaleMultiplier,
//         transformOrigin: "center center",
//       });

//       // Intro animation for #loader-text
//       gsap.fromTo(
//         $loaderText,
//         { scale: 0.8, opacity: 0 },
//         {
//           scale: 1,
//           opacity: 1,
//           duration: 0.6,
//           ease: "power2.out",
//           delay: 0.3, // Slight delay to start after page load
//         }
//       );

//       // Pop-up animation for #hand-mockup-gift-box
//       gsap.fromTo(
//         $container,
//         { scale: 0, opacity: 0 },
//         {
//           scale: 1,
//           opacity: 1,
//           duration: 0.8,
//           ease: "back.out(1.7)", // "back.out" for a pop effect
//           delay: 0.5, // 0.5-second delay before starting the animation
//           onComplete: () => {
//             preloadInitialImages(); // Preload initial images after the pop-up animation
//           },
//         }
//       );

//       // Function to preload initial images (frames 1-91)
//       function preloadInitialImages() {
//         // Add is-animating class to the body when animation starts
//         $("body").addClass("is-animating");

//         let loadedImages = 0;
//         for (let i = 1; i <= initialFrames; i++) {
//           let frameNumber = String(i).padStart(4, "0");
//           let img = new Image();
//           img.src = `${imagePath}${frameNumber}.webp`;
//           img.onload = () => {
//             loadedImages++;
//             if (loadedImages === initialFrames) {
//               isPreloaded = true;
//               startTime = performance.now();
//               requestAnimationFrame(updateFrame);
//             }
//           };
//           initialImages.push(img);
//         }
//       }

//       // Update frame function for the initial sequence
//       function updateFrame(timestamp) {
//         if (!startTime) startTime = timestamp;
//         let elapsedTime = timestamp - startTime;

//         const frameDuration = initialSequenceDuration / initialFrames;

//         if (currentFrame <= initialFrames) {
//           let frameIndex = currentFrame - 1;
//           if (elapsedTime >= frameDuration * frameIndex) {
//             // Ensure the image is loaded
//             if (initialImages[frameIndex].complete) {
//               $container.css(
//                 "background-image",
//                 `url(${initialImages[frameIndex].src})`
//               );

//               // Update loading percentage based on current frame
//               const percentage = Math.floor(
//                 (currentFrame / initialFrames) * 99
//               );
//               $loadingNum.text(percentage); // Update the loading number

//               // Fade out loader text when percentage reaches 99
//               if (percentage === 99) {
//                 gsap.to($loaderText, {
//                   opacity: 0,
//                   duration: 0.5,
//                   ease: "power2.out",
//                   onComplete: () => {
//                     // Add 1-second delay before initiating rest of the animations
//                     gsap.delayedCall(0.25, () => {
//                       // Initial sequence complete
//                       gsap.to($container, {
//                         scale: 0,
//                         opacity: 0,
//                         duration: 0.35,
//                         ease: "power2.out",
//                         onComplete: () => {
//                           $container.hide();

//                           // Set #loader-screen background color to transparent instead of hiding it
//                           gsap.to($loaderScreen, {
//                             backgroundColor: "transparent",
//                             duration: 0,
//                             ease: "power2.out",
//                             onComplete: () => {
//                               // Hide #loader-text
//                               $loaderText.hide();

//                               // Scale down and rotate elements to their final state
//                               gsap.to(
//                                 [
//                                   "#hand-mockup-wrapper",
//                                   "#hand-mockup",
//                                   "#hand-mockup-frame",
//                                 ],
//                                 {
//                                   scale: 1,
//                                   rotation: 0, // Animate rotation to 0 degrees
//                                   duration: 0.75,
//                                   ease: "power2.out",
//                                   onComplete: () => {
//                                     // Remove is-animating class, start Lenis, and set z-index values
//                                     $("body").removeClass("is-animating");
//                                     lenis.start(); // Start Lenis as soon as the scale down is complete

//                                     // Set z-index values
//                                     $("#hand-mockup-wrapper-2").css(
//                                       "z-index",
//                                       1
//                                     );
//                                     $(".hand-mockup-frame").css("z-index", 0);
//                                     // $("#hand-mockup-gift-box-2").css("z-index", 4);

//                                     // Hide and show wrappers
//                                     $handMockupWrapper.hide();
//                                     $handMockupWrapper2.show();

//                                     // Center #hand-mockup-gift-box-2
//                                     gsap.set("#hand-mockup-gift-box-2", {
//                                       xPercent: -50,
//                                       yPercent: -50,
//                                       left: "50%",
//                                       top: "50%",
//                                       position: "absolute",
//                                     });

//                                     // Scale #hand-mockup-gift-box-2 from 0 to 1
//                                     gsap.fromTo(
//                                       $container2,
//                                       { scale: 0, opacity: 0 },
//                                       {
//                                         scale: 1,
//                                         opacity: 1,
//                                         duration: 0.5,
//                                         delay: 0.25,
//                                         ease: "power2.out",
//                                         onComplete: () => {
//                                           // Start the second image sequence
//                                           preloadRemainingImages();
//                                         },
//                                       }
//                                     );
//                                   },
//                                 }
//                               );
//                             },
//                           });
//                         },
//                       });
//                     });
//                   },
//                 });
//               }

//               currentFrame++;
//             }
//           }
//           requestAnimationFrame(updateFrame);
//         }
//       }

//       // Function to preload remaining images (frames 92-302)
//       function preloadRemainingImages() {
//         let loadedImages = 0;
//         for (let i = 92; i <= totalFrames; i++) {
//           let frameNumber = String(i).padStart(4, "0");
//           let img = new Image();
//           img.src = `${imagePath}${frameNumber}.webp`;
//           img.onload = () => {
//             loadedImages++;
//             if (loadedImages === totalFrames - initialFrames) {
//               isSecondSequencePreloaded = true;
//               currentFrame = 92;
//               startTime = performance.now();
//               requestAnimationFrame(updateSecondSequence);
//             }
//           };
//           remainingImages.push(img);
//         }
//       }

//       // Update frame function for the second sequence
//       function updateSecondSequence(timestamp) {
//         if (!startTime) startTime = timestamp;
//         let elapsedTime = timestamp - startTime;

//         const totalRemainingFrames = totalFrames - initialFrames;
//         const secondSequenceDuration = 7000; // Run over 7 seconds
//         const frameDurationSecond =
//           secondSequenceDuration / totalRemainingFrames;

//         if (currentFrame <= totalFrames) {
//           let frameIndex = currentFrame - 92;
//           if (elapsedTime >= frameDurationSecond * frameIndex) {
//             if (remainingImages[frameIndex].complete) {
//               $container2.css(
//                 "background-image",
//                 `url(${remainingImages[frameIndex].src})`
//               );
//               currentFrame++;
//             }
//           }
//           requestAnimationFrame(updateSecondSequence);
//         }
//       }
//     }
//   }
// });
