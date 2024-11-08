// Set scroll restoration to manual to control scroll position
history.scrollRestoration = "manual";

// Check if the page has just loaded
$(document).ready(function () {
  $(window).scrollTop(0); // Scroll to the top only on page load
});

/* custom attribute-based anchor offset generator - using Lenis for seamless in-page scrolling */

$(document).ready(function () {
  // Initialize offsets based on CSS properties specified in `data-scroll-to-offset`
  $("[data-scroll-to-offset]").each(function () {
    let offsetAttr = $(this).attr("data-scroll-to-offset");

    // Regular expression to match CSS property expressions like `#element.property`
    const regex = /#([\w-]+)\.(\w+)(\s*[\+\-\*\/]\s*[\d.]+)?/g;

    // Replace each `#element.property` pattern with its CSS value, allowing arithmetic
    offsetAttr = offsetAttr.replace(regex, (match, id, property, operation) => {
      const element = $(`#${id}`);
      if (element.length) {
        const cssValue = parseFloat(element.css(property));
        if (!isNaN(cssValue)) {
          return operation ? cssValue + operation : cssValue;
        }
      }
      return 0;
    });

    // Safely evaluate the final arithmetic expression (e.g., `180 * 1.5`)
    try {
      const finalOffset = Function("return " + offsetAttr)();
      $(this).attr("data-scroll-to-offset", finalOffset);
    } catch (error) {
      console.error("Invalid offset expression:", offsetAttr);
      $(this).attr("data-scroll-to-offset", 0); // Default to 0 if there's an error
    }
  });

  // Populate `data-scroll-to-sticky` with the initial position of the target element
  $("[data-scroll-to-sticky]").each(function () {
    let targetSelector = $(this).attr("data-scroll-to") || $(this).attr("href");
    const targetElement = $(targetSelector);

    if (targetElement.length) {
      const targetPosition = targetElement.offset().top;
      $(this).attr("data-scroll-to-sticky", targetPosition);
    }
  });

  const anchorContainer = $(".solutions-overview-anchors");
  const anchorElements = $("[data-anchor-button]");

  let isAnimating = false; // Flag to prevent multiple simultaneous animations

  // Scroll event handler
  $(window).on("scroll", function () {
    // Loop through anchor elements to check for the "w--current" class
    anchorElements.each(function () {
      if ($(this).hasClass("w--current")) {
        // Deselect all anchors and select only the current one
        anchorElements.removeClass("selected").addClass("deselected");
        $(this).addClass("selected").removeClass("deselected");

        // For mobile: Scroll the container smoothly to bring the current element into view
        if ($(window).width() < 768 && !isAnimating) {
          // Calculate the target scroll position with 1rem (16px) padding offset
          const elementPosition = $(this).position().left;
          const paddingOffset = 16; // 1rem in pixels (adjust if your root font size is different)
          const currentScroll = anchorContainer.scrollLeft();
          const scrollAmount = currentScroll + elementPosition - paddingOffset;

          // Set flag to indicate animation is in progress
          isAnimating = true;

          // Animate the scrollLeft property to the calculated position over 300 milliseconds
          anchorContainer.animate(
            { scrollLeft: scrollAmount },
            300,
            function () {
              // Reset the flag after animation completes
              isAnimating = false;
            }
          );
        }
      }
    });
  });
});

// Utility function to calculate offset based on `data-scroll-to-offset`
function calculateOffset(offsetAttr) {
  return parseFloat(offsetAttr) || $("#nav-bar").outerHeight(); // Default to #nav-bar height if offsetAttr is not a number
}

// Handle click event for scrolling
$(document).on("click", "[data-scroll-to]", function (e) {
  e.preventDefault();

  // Fallback to `href` if `data-scroll-to` is empty
  let targetSelector = $(this).attr("data-scroll-to") || $(this).attr("href");
  $(this).attr("href", ""); // Clear href to prevent navigation

  const targetElement = $(targetSelector);
  const customOffset = $(this).attr("data-scroll-to-offset");
  const offsetValue = calculateOffset(customOffset);

  // Determine if scroll should be locked based on `data-scroll-to-lock`
  const lockScroll = $(this).attr("data-scroll-to-lock") !== "false";

  if ($(this).is("[data-scroll-to-sticky]")) {
    // Use stored sticky position if `data-scroll-to-sticky` is present
    const stickyPosition = parseInt($(this).attr("data-scroll-to-sticky"), 10);
    lenis.scrollTo(stickyPosition, {
      offset: -offsetValue,
      duration: 1.25,
      lock: lockScroll, // Apply the lock based on attribute
      onComplete: () =>
        console.log("Sticky scroll completed to", stickyPosition),
    });
  } else if (targetElement.length) {
    // Default scroll behavior for non-sticky elements
    const targetPosition = targetElement.offset().top - offsetValue;
    lenis.scrollTo(targetPosition, {
      duration: 1.25,
      lock: lockScroll, // Apply the lock based on attribute
      onComplete: () => console.log("Scroll completed to", targetSelector),
    });
  }
});
