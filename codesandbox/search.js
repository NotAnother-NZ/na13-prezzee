$(document).ready(async function () {
  if ($("#search-section").length) {
    console.log("search section is present");

    $("#more-pages-wrapper").hide();
    lenis.resize();

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

    function setSectionHeight(auto) {
      if (auto) {
        $("#search-section").css({
          height: "auto",
          "max-height": "",
        });
      } else {
        $("#search-section").css({
          height: "100dvh",
          "max-height": "70rem",
        });
      }
    }

    showSkeletons(6);

    const region = detectRegionFromUrl();
    const storageKey = `prezzee-data-${region}`;
    const cacheDuration = 24 * 60 * 60 * 1000;
    let data = getDataWithExpiration(storageKey);

    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("query");
    const keywordLabel =
      query && query.trim().split(/\s+/).length > 1 ? "keywords" : "keyword";

    if (!query) {
      console.log("No search query provided.");
      setSectionHeight(false);
      return;
    }

    if (!data) {
      try {
        const response = await fetch(jsonUrls[region]);
        if (!response.ok) throw new Error("Network response was not ok");
        data = await response.json();
        storeDataWithExpiration(storageKey, data, cacheDuration);
      } catch (error) {
        console.error("Fetch error:", error);
        $("#result-found-text").text(
          "We’re unable to load cards or pages right now. Please refresh the page or try again later."
        );
        hideSkeletons();
        return;
      }
    }

    data = data.map((item) => {
      item.additional_search_terms = cleanSearchTerms(
        item.additional_search_terms
      );
      item.similar_search_terms = cleanSearchTerms(item.similar_search_terms);
      item.categories = extractCategoriesFromTags(item.tags || []);
      return item;
    });

    hideSkeletons();

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

    const results = fuse.search(query).map((result) => {
      const item = result.item;
      item.matchScore = (1 - result.score) * 100;
      item.matchReason = result.matches
        .map((match) => {
          const field = match.key;
          const value = match.value;
          const type =
            match.indices.length > 1 ? "Partial match" : "Exact match";
          return `${type} on ${field.replace("_", " ")} (value: "${value}")`;
        })
        .join(", ");
      return item;
    });

    const categoryMatches = data
      .filter((item) => item.categories.includes(query.toLowerCase()))
      .map((item) => {
        item.matchReason = "Matched by category";
        item.matchScore = undefined;
        return item;
      });

    const combinedResults = [...results, ...categoryMatches];
    const uniqueResults = [
      ...new Map(
        combinedResults.map((item) => [item.slug || item.name, item])
      ).values(),
    ];

    $("#card-result-holder").empty();

    const totalCards =
      uniqueResults.length > 100 ? "100+" : uniqueResults.length;
    const totalPages =
      $(".page-search-card").length > 50
        ? "50+"
        : $(".page-search-card").length;

    let resultText = "";

    if (totalCards > 0 && totalPages > 0) {
      resultText = `We've found <a href="#card-results" class="title8 link" data-scroll-to="#card-results">${totalCards} ${pluralize(
        totalCards,
        "card",
        "cards"
      )}</a> & <a href="#page-results" class="title8 link" data-scroll-to="#page-results">${totalPages} ${pluralize(
        totalPages,
        "page",
        "pages"
      )}</a> related to the ${keywordLabel} ‘${query}’`;
      $("#card-results").show();
      $("#page-results").show();
      setSectionHeight(true);
    } else if (totalCards > 0) {
      resultText = `We've found <a href="#card-results" class="title8 link" data-scroll-to="#card-results">${totalCards} ${pluralize(
        totalCards,
        "card",
        "cards"
      )}</a>, but no pages with the ${keywordLabel} ‘${query}’`;
      $("#page-results").hide();
      $("#card-results").show();
      setSectionHeight(true);
    } else if (totalPages > 0) {
      resultText = `We didn’t find any cards, but there ${
        totalPages === "1" ? "is" : "are"
      } <a href="#page-results" class="title8 link" data-scroll-to="#page-results">${totalPages} ${pluralize(
        totalPages,
        "page",
        "pages"
      )}</a> related to the ${keywordLabel} ‘${query}’`;
      $("#card-results").hide();
      $("#page-results").show();
      setSectionHeight(true);
    } else {
      resultText = `Sorry, no cards or pages were found for ‘${query}’. Please try adjusting your search.`;
      $("#card-results").hide();
      $("#page-results").hide();
      setSectionHeight(false);
    }

    if (totalPages > 10) {
      $("#more-pages-wrapper").show();
      $(".page-search-card").parent().slice(10).hide();
      lenis.resize();
    } else {
      $("#more-pages-wrapper").hide();
      lenis.resize();
    }

    $("#more-pages").click(function () {
      $(".page-search-card").parent().show();
      $("#more-pages-wrapper").hide();
      lenis.resize();
    });

    $("#result-found-text").html(resultText);

    uniqueResults.forEach((item) => {
      const theme = item.themes && item.themes[0];
      const columnSpan = getColumnSpan();

      console.log("Extracted Data:", {
        description_short: item.content?.description_short || "N/A",
        theme_image: theme?.image || "N/A",
        name: item.name || "N/A",
        categories: item.categories.join(", "),
      });

      const cardResult = $(`
      <div class="card-result search" style="grid-column: ${columnSpan};">
        <div class="card-result-bg" style="background-color: ${
          theme && theme.key_colour ? theme.key_colour : "#f0f0f0"
        };">
          <img src="${
            theme && theme.image
              ? theme.image
              : "https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg"
          }" loading="lazy" alt="${item.name}" class="card-result-logo">
        </div>
        <div class="card-result-detail">
          <div class="card-result-title-wrapper">
            <h3 id="search-page-title" class="title8">${
              item.display_name || item.name
            }</h3>
          </div>
          <div class="search-tag lilac-light mulberry">
            <div class="title10">Top Seller</div>
          </div>
        </div>
      </div>
    `);

      const hasFeaturedTag = item.tags.some(
        (tag) => tag.name === "category:featured"
      );
      if (!hasFeaturedTag) {
        cardResult.find(".search-tag").css("opacity", "0");
      }

      $("#card-result-holder").append(cardResult);

      // Handle click event for card popup
      cardResult.click(function () {
        $("#card-popup-open").click();

        $("#card-popup-name").text(item.name);

        const imageUrl =
          theme?.image ||
          "https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg";
        $("#card-popup-image").attr("src", imageUrl);

        const shortDescription = item.content?.description_short || "";
        if (shortDescription) {
          const firstSentence = shortDescription.split(".")[0] + ".";
          $("#card-popup-description").text(firstSentence).show();
        } else {
          $("#card-popup-description").hide();
        }

        $("#card-popup-tag-wrapper").empty();
        item.categories.forEach((category) => {
          const tagElement = $(
            `<div class="card-tag mulberry-border"><div class="title10">${category
              .toUpperCase()
              .replace(/-/g, " ")}</div></div>`
          );
          $("#card-popup-tag-wrapper").append(tagElement);
        });
      });
    });

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

    //if user clicks outside of #card-popup, click on #card-popup-close
    $(".popup-wrapper").click(function (event) {
      if (
        !$(event.target).closest("#card-popup").length &&
        $("#card-popup").is(":visible")
      ) {
        $("#card-popup-close").click();
      }
    });
  }
});
