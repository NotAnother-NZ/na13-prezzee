$(document).ready(async function () {
  if ($("#catalogue-section").length) {
    console.log("Catalogue section is present");

    //store the offset value
    const categorySticky = $("#brand-search-category-sticky").offset().top;

    $("#more-pages-wrapper").hide();
    if (typeof lenis !== "undefined" && lenis.resize) {
      lenis.resize();
    }

    const jsonUrls = {
      "en-au": "https://prezzee-search.vercel.app/api/en-au",
      "en-gb": "https://prezzee-search.vercel.app/api/en-gb",
      "en-us": "https://prezzee-search.vercel.app/api/en-us",
      "en-nz": "https://prezzee-search.vercel.app/api/en-nz",
    };

    function cleanSearchTerms(terms) {
      if (!terms) return "";
      return terms.replace(/,/g, "").split(/\s+/).join(" ");
    }

    function extractCategoriesFromTags(tags) {
      return tags
        .filter((tag) => tag.name.startsWith("category:"))
        .map((tag) => tag.name.replace("category:", ""));
    }

    function detectRegionFromUrl() {
      const url = window.location.href.toLowerCase();
      if (url.includes("en-gb")) return "en-gb";
      if (url.includes("en-au")) return "en-au";
      if (url.includes("en-nz")) return "en-nz";
      if (url.includes("en-us")) return "en-us";
      return "en-au";
    }

    function getColumnSpan() {
      const screenWidth = $(window).width();
      if (screenWidth >= 1024) return "span 3";
      if (screenWidth >= 768) return "span 6";
      return "span 12";
    }

    function storeDataWithExpiration(key, data, expirationTime) {
      const record = {
        data,
        timestamp: Date.now() + expirationTime,
      };
      localStorage.setItem(key, JSON.stringify(record));
    }

    function getDataWithExpiration(key) {
      const record = JSON.parse(localStorage.getItem(key));
      if (record && Date.now() < record.timestamp) {
        return record.data;
      } else {
        localStorage.removeItem(key);
        return null;
      }
    }

    function showSkeletons(count) {
      $("#card-result-holder").empty();
      for (let i = 0; i < count; i++) {
        const skeleton = $("#card-result-template").clone();
        skeleton.removeAttr("id").addClass("skeleton");
        $("#card-result-holder").append(skeleton);
      }
    }

    function hideSkeletons() {
      $(".skeleton").remove();
    }

    function pluralize(count, singular, plural) {
      return count === 1 ? singular : plural;
    }

    function toCamelCase(text) {
      return text
        .toLowerCase()
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    // Hide #no-results by default
    $("#no-results").hide();
    // Show #loading-results at the start
    $("#loading-results").show();

    showSkeletons(6);

    const region = detectRegionFromUrl();
    const storageKey = `prezzee-data-${region}`;
    const cacheDuration = 24 * 60 * 60 * 1000; // 24 hours
    let data = getDataWithExpiration(storageKey);

    if (!data) {
      try {
        const response = await fetch(jsonUrls[region]);
        if (!response.ok) throw new Error("Network response was not ok");
        data = await response.json();
        storeDataWithExpiration(storageKey, data, cacheDuration);
      } catch (error) {
        console.error("Fetch error:", error);
        $("#result-found-text").text(
          "We’re unable to load products right now. Please refresh the page or try again later."
        );
        hideSkeletons();
        return;
      }
    }

    // Process data: clean search terms and extract categories
    data = data.map((item) => {
      item.additional_search_terms = cleanSearchTerms(
        item.additional_search_terms
      );
      item.similar_search_terms = cleanSearchTerms(item.similar_search_terms);
      item.categories = extractCategoriesFromTags(item.tags || []);
      return item;
    });

    hideSkeletons();

    // Initialize Fuse.js
    const fuseOptions = {
      includeScore: true,
      includeMatches: true,
      shouldSort: true,
      threshold: 0.3,
      keys: [
        { name: "name", weight: 0.7 },
        { name: "display_name", weight: 0.7 },
        { name: "additional_search_terms", weight: 0.3 },
        { name: "similar_search_terms", weight: 0.3 },
      ],
    };

    const fuse = new Fuse(data, fuseOptions);

    // Extract unique categories and sort them alphabetically
    const allCategories = data.flatMap((item) => item.categories);
    const uniqueCategories = [...new Set(allCategories)].sort();

    // Create and append 'All' category tag
    const allCategoryElement = $(`
              <a href="#" data-search-brand-category="all" class="cta1 category-tag w-button selected">
                  All
              </a>
          `);
    $("#brand-search-category-wrapper").append(allCategoryElement);

    // Create and append sorted category tags with camel case text
    uniqueCategories.forEach((category) => {
      const formattedCategory = toCamelCase(category);
      const categoryElement = $(`
                  <a href="#" data-search-brand-category="${category}" class="cta1 category-tag w-button">
                      ${formattedCategory}
                  </a>
              `);
      $("#brand-search-category-wrapper").append(categoryElement);
    });

    // Initialize filter variables
    let currentCategory = "all";
    let currentSearchQuery = "";

    // Function to filter and display cards based on current filters
    function filterAndDisplayCards() {
      let filteredData = data;

      // Apply search filter if query is not empty
      if (currentSearchQuery.trim() !== "") {
        const fuseResults = fuse.search(currentSearchQuery);
        filteredData = fuseResults.map((result) => result.item);
      }

      // Apply category filter if not 'all'
      if (currentCategory !== "all") {
        filteredData = filteredData.filter((item) =>
          item.categories.includes(currentCategory)
        );
      }

      displayCards(filteredData);
    }

    // Function to display cards
    function displayCards(filteredData) {
      $("#card-result-holder").empty();

      // Show/hide #no-results and #result-wrapper based on filteredData length
      if (filteredData.length === 0) {
        $("#no-results").show();
        $("#result-wrapper").hide();
        $("#loading-results").hide();
        return;
      } else {
        $("#no-results").hide();
        $("#result-wrapper").show();
      }

      const totalProducts =
        filteredData.length > 100 ? "100+" : filteredData.length;
      const resultText = `Displaying ${totalProducts} ${pluralize(
        totalProducts,
        "product",
        "products"
      )}`;
      $("#result-found-text").html(resultText);

      filteredData.forEach((item) => {
        const theme = item.themes && item.themes[0];
        const columnSpan = getColumnSpan();
        const imageUrl =
          theme?.image ||
          "https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg";

        const cardResult = $(`
                      <div class="card-result brands w-node-_6009dd4f-3db3-0d0c-65b0-4d50e7f946ff-6f70cc76" style="grid-column: ${columnSpan};" data-categories="${item.categories.join(
          ","
        )}">
                          <div class="card-result-bg" style="background-color: ${
                            theme?.key_colour || "#f0f0f0"
                          };">
                              <img src="${imageUrl}" loading="lazy" alt="${
          item.name
        }" class="card-result-logo" id="search-card-logo">
                          </div>
                          <div class="card-result-detail">
                              <div class="card-result-title-wrapper" id="w-node-_6009dd4f-3db3-0d0c-65b0-4d50e7f94703-6f70cc76">
                                  <h3 id="search-card-name" class="title8">${
                                    item.display_name || item.name
                                  }</h3>
                              </div>
                              <div class="search-tag lilac-light mulberry">
                                  <div id="search-card-tag" class="title10">Top Seller</div>
                              </div>
                          </div>
                      </div>
                  `);

        // Handle image error
        cardResult.find("img").on("error", function () {
          $(this).hide();
          cardResult
            .find(".card-result-bg")
            .css("background-color", theme?.key_colour || "#f0f0f0");
        });

        const hasFeaturedTag = item.tags.some(
          (tag) => tag.name === "category:featured"
        );
        if (!hasFeaturedTag) {
          cardResult.find(".search-tag").hide();
        }

        $("#card-result-holder").append(cardResult);

        // Handle click event for card popup
        cardResult.click(function () {
          $("#card-popup-open").click();
          $("#card-popup-name").text(item.name);

          // Set image src
          const popupImageUrl =
            theme?.image ||
            "https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg";
          $("#card-popup-image").attr("src", popupImageUrl);

          // Handle description
          const shortDescription = item.content?.description_short || "";
          if (shortDescription) {
            const firstSentence = shortDescription.split(".")[0] + ".";
            $("#card-popup-description").text(firstSentence).show();
          } else {
            $("#card-popup-description").hide();
          }

          // Handle tags
          $("#card-popup-tag-wrapper").empty();
          item.categories.forEach((category) => {
            const formattedCategory = toCamelCase(category);
            const tagElement = $(`
                              <div class="card-tag mulberry-border">
                                  <div class="title10">${formattedCategory}</div>
                              </div>
                          `);
            $("#card-popup-tag-wrapper").append(tagElement);
          });
        });
      });

      // Hide #loading-results after cards are loaded
      $("#loading-results").hide();

      // Ensure lenis resizes after displaying cards
      if (typeof lenis !== "undefined" && lenis.resize) {
        lenis.resize();
      }
    }

    // Initial display of all cards
    filterAndDisplayCards();

    // Add click event to handle selected category tag
    $(".cta1.category-tag").on("click", function (e) {
      e.preventDefault();
      $(".cta1.category-tag").removeClass("selected");
      $(this).addClass("selected");

      currentCategory = $(this).data("search-brand-category");
      filterAndDisplayCards();

      // Scroll to #brand-search-category-sticky with Lenis
      if (typeof lenis !== "undefined") {
        // lenis.scrollTo("#brand-search-category-sticky");
        lenis.scrollTo(categorySticky);
      }
    });

    // Add input event to handle search
    $("#catalogue-search").on("input", function () {
      currentSearchQuery = $(this).val();
      filterAndDisplayCards();
    });

    // Handle window resize
    $(window).resize(function () {
      $(".card-result").each(function () {
        $(this).css("grid-column", getColumnSpan());
        if (typeof lenis !== "undefined" && lenis.resize) {
          lenis.resize();
        }
      });
    });

    if (typeof lenis !== "undefined" && lenis.resize) {
      lenis.resize();
    }
  }
});
