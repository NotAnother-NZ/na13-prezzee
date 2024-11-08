$(document).ready(function () {
  if ($("#case-study-showcase").length) {
    console.log("case study showcase is present");

    function breakNumber(n) {
      let sequence = [];
      let total = 0;
      let twoCount = 0;

      if (n % 3 === 0) {
        while (total < n) {
          sequence.push(3);
          total += 3;
        }
        const formattedSequence = sequence.join(" + ");
        console.log(`${n} will be broken into ${formattedSequence}`);
        return sequence;
      }

      let nextNum = n % 5 === 0 || n % 5 === 3 ? 3 : 2;

      while (total < n) {
        if (total + nextNum > n) {
          if (nextNum === 3 && total + 2 <= n) {
            nextNum = 2;
          } else {
            break;
          }
        }

        if (nextNum === 2) {
          twoCount++;
          let label = twoCount % 2 === 1 ? "2(i)" : "2(ii)";
          sequence.push(label);
          total += 2;
        } else {
          sequence.push(nextNum);
          total += 3;
        }

        nextNum = nextNum === 3 ? 2 : 3;
      }

      if (total < n) {
        if (n - total === 2) {
          twoCount++;
          let label = twoCount % 2 === 1 ? "2(i)" : "2(ii)";
          sequence.push(label);
          total += 2;
        } else if (n - total === 3) {
          sequence.push(3);
          total += 3;
        } else {
          for (let i = sequence.length - 1; i >= 0; i--) {
            if (sequence[i] === 3) {
              sequence[i] = "2(ii)";
              total = total - 3 + 2;
              twoCount++;
              break;
            }
          }
          if (total < n) {
            let difference = n - total;
            if (difference === 2) {
              twoCount++;
              let label = twoCount % 2 === 1 ? "2(i)" : "2(ii)";
              sequence.push(label);
              total += 2;
            }
          }
        }
      }

      const formattedSequence = sequence.join(" + ");
      console.log(`${n} will be broken into ${formattedSequence}`);
      return sequence;
    }

    function findYIndices(sequence) {
      let yIndices = [];
      let currentIndex = 1;

      sequence.forEach((element) => {
        if (element === 3) {
          currentIndex += 3;
        } else if (element === "2(i)") {
          yIndices.push(currentIndex);
          currentIndex += 2;
        } else if (element === "2(ii)") {
          yIndices.push(currentIndex + 1);
          currentIndex += 2;
        }
      });

      return yIndices;
    }

    let caseStudies = [];

    function renderCards(data, showAll = false) {
      $("#case-study-overview-showcase-grid").empty();
      let n = data.length;
      let sequence = breakNumber(n);
      let uniqueIndices = findYIndices(sequence);

      if (n === 0) {
        $("#cms-not-found").removeClass("hide");
        $("#more-cs-wrapper").addClass("hide");
      } else {
        $("#cms-not-found").addClass("hide");
      }

      const limit = 8;
      const cardsToShow = showAll ? n : Math.min(n, limit);

      data.forEach((item, index) => {
        let imageCoverClass = item.imageCoverSrc === "" ? "hide" : "";
        if (index < cardsToShow) {
          let newCard = uniqueIndices.includes(index + 1)
            ? `
            <div id="w-node-d4b1dd82-6bbc-f4cd-0af7-1ead77f69288-32ba6cc3" class="cs-overview-card type2 cream">
                <div class="cs-overview-hero type2" style="background-color:${item.heroBgColor}">
                    <img src="${item.imageCoverSrc}" loading="lazy" alt="" class="image-cover ${imageCoverClass}">
                    <div class="image-dark-overlay"></div>
                    <img src="${item.cardLogoSrc}" loading="lazy" alt="" class="cs-overview-card-logo">
                </div>
                <div class="cs-overview-card-details type2">
                    <div class="cs-tag" style="background-color:${item.tagBgColor}">
                        <div class="title10">${item.tagText}</div>
                    </div>
                    <h2 class="title7-2">${item.titleText}</h2>
                    <div class="cs-product-names hide">${item.productNames}</div>
                    <div class="cs-location-names hide">${item.locationNames}</div>
                </div>
                <a aria-label="Read the Case Study" href="${item.caseStudyLink}" class="cms-link-wrapper w-inline-block"></a>
            </div>
          `
            : `
            <div id="w-node-_17d7696a-e9bc-be03-c484-bb6d46c67115-32ba6cc3" class="cs-overview-card cream">
                <div class="cs-overview-hero" style="background-color:${item.heroBgColor}">
                    <img src="${item.imageCoverSrc}" loading="lazy" alt="" class="image-cover ${imageCoverClass}">
                    <div class="image-dark-overlay"></div>
                    <img src="${item.cardLogoSrc}" loading="lazy" alt="" class="cs-overview-card-logo">
                </div>
                <div class="cs-overview-card-details">
                    <div class="cs-tag" style="background-color:${item.tagBgColor}">
                        <div class="title10">${item.tagText}</div>
                    </div>
                    <h2 class="title7-2">${item.titleText}</h2>
                    <div class="cs-product-names hide">${item.productNames}</div>
                    <div class="cs-location-names hide">${item.locationNames}</div>
                </div>
                <a aria-label="Read the Case Study" href="${item.caseStudyLink}" class="cms-link-wrapper w-inline-block"></a>
            </div>
          `;
          $("#case-study-overview-showcase-grid").append(newCard);
        }
      });

      if (n > limit && !showAll) {
        $("#more-cs-wrapper").removeClass("hide");
      } else {
        $("#more-cs-wrapper").addClass("hide");
      }

      // Update the filter open text based on selected filters
      updateFilterOpenText();
    }

    function applyFilters(showAll = false) {
      // Get selected tag from desktop
      let filterTagDesktop = $(".cms-filter-wrapper a.selected").text();
      // Get selected tag from mobile
      let filterTagMobile = $(
        "#w-node-b30b95a0-0575-8a87-3c4b-640d6a48a777-32ba6cc3 a.selected"
      ).text();
      // Get selected product from desktop
      let filterProductDesktop = $("#cs-products").val();
      // Get selected product from mobile
      let filterProductMobile = $(
        "#w-node-_5d163fef-674e-e3a8-a98a-d97cef4e7915-32ba6cc3 a.selected"
      ).text();
      // Get selected location from desktop
      let filterLocationDesktop = $("#cs-locations").val();
      // Get selected location from mobile
      let filterLocationMobile = $(
        "#w-node-c991d0ac-eaff-0c2a-701c-fd36caad0684-32ba6cc3 a.selected"
      ).text();

      let filteredData = caseStudies;

      // Determine tag: prioritize desktop, then mobile
      let finalTag = "All";
      if (filterTagDesktop && filterTagDesktop !== "All") {
        finalTag = filterTagDesktop;
      } else if (filterTagMobile && filterTagMobile !== "All") {
        finalTag = filterTagMobile;
      }
      if (finalTag !== "All") {
        filteredData = filteredData.filter((item) => item.tagText === finalTag);
      }

      // Determine product: prioritize desktop, then mobile
      let finalProduct = "";
      if (filterProductDesktop) {
        finalProduct = filterProductDesktop;
      } else if (filterProductMobile && filterProductMobile !== "All") {
        finalProduct = filterProductMobile;
      }
      if (finalProduct) {
        filteredData = filteredData.filter((item) =>
          item.productNames.includes(finalProduct)
        );
      }

      // Determine location: prioritize desktop, then mobile
      let finalLocation = "";
      if (filterLocationDesktop) {
        finalLocation = filterLocationDesktop;
      } else if (filterLocationMobile && filterLocationMobile !== "All") {
        finalLocation = filterLocationMobile;
      }
      if (finalLocation) {
        filteredData = filteredData.filter((item) =>
          item.locationNames.includes(finalLocation)
        );
      }

      renderCards(filteredData, showAll);
    }

    function updateSelectText(selectId, firstOptionText) {
      const selectElement = $(selectId);
      if (selectElement.val() !== "") {
        selectElement.find("option:first").text(firstOptionText);
      } else {
        selectElement
          .find("option:first")
          .text(selectId === "#cs-products" ? "Products" : "Locations");
      }
    }

    function updateFilterOpenText() {
      // Desktop selected filters excluding 'All'
      let desktopSelected = $(".cms-filter-wrapper a.selected").not(
        "#cs-all-tags, #cs-all-products, #cs-all-locations"
      ).length;

      // Mobile selected filters excluding 'All'
      let mobileSelectedTags = $(
        "#w-node-b30b95a0-0575-8a87-3c4b-640d6a48a777-32ba6cc3 a.selected"
      ).not("#cs-all-tags-mobile").length;
      let mobileSelectedProducts = $(
        "#w-node-_5d163fef-674e-e3a8-a98a-d97cef4e7915-32ba6cc3 a.selected"
      ).not("#cs-all-products-mobile").length;
      let mobileSelectedLocations = $(
        "#w-node-c991d0ac-eaff-0c2a-701c-fd36caad0684-32ba6cc3 a.selected"
      ).not("#cs-all-locations-mobile").length;

      let totalSelected =
        desktopSelected +
        mobileSelectedTags +
        mobileSelectedProducts +
        mobileSelectedLocations;

      if (totalSelected > 0) {
        $("#filter-open-text").text(`Filter (${totalSelected})`);
      } else {
        $("#filter-open-text").text("Filter");
      }
    }

    // Extract case studies data
    $("#case-study-overview-showcase .cs-overview-card-item").each(function () {
      var cardLogoSrc = $(this).find(".cs-overview-card-logo").attr("src");
      var imageCoverElement = $(this).find(".image-cover");
      var imageCoverSrc = "";
      if (
        !imageCoverElement.hasClass("w-condition-invisible") &&
        !imageCoverElement.hasClass("w-dyn-bind-empty")
      ) {
        imageCoverSrc = imageCoverElement.attr("src");
      }
      var heroBgColor = $(this)
        .find(".cs-overview-hero")
        .css("background-color");
      var tagBgColor = $(this).find(".cs-tag").css("background-color");
      var tagText = $(this).find(".title10").text();
      var titleText = $(this).find(".title7-2").text();
      var productNames = $(this).find(".cs-product-names").text().trim();
      var locationNames = $(this).find(".cs-location-names").text().trim();
      var caseStudyLink = $(this).find(".cms-link-wrapper").attr("href");
      caseStudies.push({
        cardLogoSrc: cardLogoSrc,
        imageCoverSrc: imageCoverSrc,
        heroBgColor: heroBgColor,
        tagBgColor: tagBgColor,
        tagText: tagText,
        titleText: titleText,
        productNames: productNames,
        locationNames: locationNames,
        caseStudyLink: caseStudyLink,
      });
    });

    // Remove original cards
    $("#case-study-overview-showcase .cs-overview-card-item").remove();

    // Render initial cards
    renderCards(caseStudies);

    // Handle desktop filter buttons
    $(".cms-filter-wrapper a").click(function (e) {
      e.preventDefault();
      $(".cms-filter-wrapper a").removeClass("selected").addClass("deselected");
      $(this).removeClass("deselected").addClass("selected");
      applyFilters();
    });

    // Handle desktop dropdowns
    $("#cs-products, #cs-locations").change(function () {
      updateSelectText("#cs-products", "All Products");
      updateSelectText("#cs-locations", "All Locations");
      applyFilters();
    });

    // Handle reset for desktop filters
    $("#reset-cs").click(function (e) {
      e.preventDefault();
      $(".cms-filter-wrapper a").removeClass("selected").addClass("deselected");
      $("#cs-all-tags").removeClass("deselected").addClass("selected");
      $("#cs-products").val("");
      $("#cs-locations").val("");
      updateSelectText("#cs-products", "Products");
      updateSelectText("#cs-locations", "Locations");
      applyFilters();
    });

    // Handle mobile filter buttons - Tags
    $(
      "#cs-all-tags-mobile, #cs-employee-mobile, #cs-acquisition-mobile, #cs-loyalty-mobile, #cs-relief-mobile"
    ).click(function (e) {
      e.preventDefault();
      $("#w-node-b30b95a0-0575-8a87-3c4b-640d6a48a777-32ba6cc3 a")
        .removeClass("selected")
        .addClass("deselected");
      $(this).removeClass("deselected").addClass("selected");
      // Optionally, update the filter open text here if you want instant feedback
    });

    // Handle mobile filter buttons - Products
    $(
      "#cs-all-products-mobile, #cs-api-mobile, #cs-business-mobile, #cs-campaigns-mobile"
    ).click(function (e) {
      e.preventDefault();
      $("#w-node-_5d163fef-674e-e3a8-a98a-d97cef4e7915-32ba6cc3 a")
        .removeClass("selected")
        .addClass("deselected");
      $(this).removeClass("deselected").addClass("selected");
      // Optionally, update the filter open text here if you want instant feedback
    });

    // Handle mobile filter buttons - Locations
    $(
      "#cs-all-locations-mobile, #cs-australia-mobile, #cs-newzealand-mobile, #cs-unitedkingdom-mobile, #cs-unitedstates-mobile"
    ).click(function (e) {
      e.preventDefault();
      $("#w-node-c991d0ac-eaff-0c2a-701c-fd36caad0684-32ba6cc3 a")
        .removeClass("selected")
        .addClass("deselected");
      $(this).removeClass("deselected").addClass("selected");
      // Optionally, update the filter open text here if you want instant feedback
    });

    // Handle apply filters for mobile
    $("#cs-apply-mobile").click(function (e) {
      e.preventDefault();
      applyFilters();
      // The "Show More" button visibility is handled within renderCards
      // Optionally, close the filter sidebar here
      $("#filter-page-back")[0].click();
    });

    // Handle reset filters for mobile
    $("#cs-reset-mobile").click(function (e) {
      e.preventDefault();
      $("#cs-all-tags-mobile").removeClass("deselected").addClass("selected");
      $("#cs-all-products-mobile")
        .removeClass("deselected")
        .addClass("selected");
      $("#cs-all-locations-mobile")
        .removeClass("deselected")
        .addClass("selected");
      applyFilters();
      $("#more-cs-wrapper").addClass("hide");
      // Optionally, close the filter sidebar here
      $("#filter-page-back")[0].click();
    });

    // Handle "Show More" button
    $("#more-cs").click(function (e) {
      e.preventDefault();
      renderCards(caseStudies, true);
      $("#more-cs-wrapper").addClass("hide");
    });

    // Handle sidebar filter close and back actions
    $("#filter-page-close").click(function () {
      $("#filter-page-back")[0].click();
    });

    $("#filter-page-back").click(function () {
      $("#filter-page-menu").scrollTop(0);
    });

    /**
     * Function to update the filter-open-text based on selected filters
     */
    function updateFilterOpenText() {
      // Desktop selected filters excluding 'All'
      let desktopSelected = $(".cms-filter-wrapper a.selected").not(
        "#cs-all-tags, #cs-all-products, #cs-all-locations"
      ).length;

      // Mobile selected filters excluding 'All'
      let mobileSelectedTags = $(
        "#w-node-b30b95a0-0575-8a87-3c4b-640d6a48a777-32ba6cc3 a.selected"
      ).not("#cs-all-tags-mobile").length;
      let mobileSelectedProducts = $(
        "#w-node-_5d163fef-674e-e3a8-a98a-d97cef4e7915-32ba6cc3 a.selected"
      ).not("#cs-all-products-mobile").length;
      let mobileSelectedLocations = $(
        "#w-node-c991d0ac-eaff-0c2a-701c-fd36caad0684-32ba6cc3 a.selected"
      ).not("#cs-all-locations-mobile").length;

      let totalSelected =
        desktopSelected +
        mobileSelectedTags +
        mobileSelectedProducts +
        mobileSelectedLocations;

      if (totalSelected > 0) {
        $("#filter-open-text").text(`Filter (${totalSelected})`);
      } else {
        $("#filter-open-text").text("Filter");
      }
    }

    // Call updateFilterOpenText initially
    updateFilterOpenText();

    // Modify the renderCards function to call updateFilterOpenText after rendering
    function renderCards(data, showAll = false) {
      $("#case-study-overview-showcase-grid").empty();
      let n = data.length;
      let sequence = breakNumber(n);
      let uniqueIndices = findYIndices(sequence);

      if (n === 0) {
        $("#cms-not-found").removeClass("hide");
        $("#more-cs-wrapper").addClass("hide");
      } else {
        $("#cms-not-found").addClass("hide");
      }

      const limit = 8;
      const cardsToShow = showAll ? n : Math.min(n, limit);

      data.forEach((item, index) => {
        let imageCoverClass = item.imageCoverSrc === "" ? "hide" : "";
        if (index < cardsToShow) {
          let newCard = uniqueIndices.includes(index + 1)
            ? `
            <div id="w-node-d4b1dd82-6bbc-f4cd-0af7-1ead77f69288-32ba6cc3" class="cs-overview-card type2 cream">
                <div class="cs-overview-hero type2" style="background-color:${item.heroBgColor}">
                    <img src="${item.imageCoverSrc}" loading="lazy" alt="" class="image-cover ${imageCoverClass}">
                    <div class="image-dark-overlay"></div>
                    <img src="${item.cardLogoSrc}" loading="lazy" alt="" class="cs-overview-card-logo">
                </div>
                <div class="cs-overview-card-details type2">
                    <div class="cs-tag" style="background-color:${item.tagBgColor}">
                        <div class="title10">${item.tagText}</div>
                    </div>
                    <h2 class="title7-2">${item.titleText}</h2>
                    <div class="cs-product-names hide">${item.productNames}</div>
                    <div class="cs-location-names hide">${item.locationNames}</div>
                </div>
                <a aria-label="Read the Case Study" href="${item.caseStudyLink}" class="cms-link-wrapper w-inline-block"></a>
            </div>
          `
            : `
            <div id="w-node-_17d7696a-e9bc-be03-c484-bb6d46c67115-32ba6cc3" class="cs-overview-card cream">
                <div class="cs-overview-hero" style="background-color:${item.heroBgColor}">
                    <img src="${item.imageCoverSrc}" loading="lazy" alt="" class="image-cover ${imageCoverClass}">
                    <div class="image-dark-overlay"></div>
                    <img src="${item.cardLogoSrc}" loading="lazy" alt="" class="cs-overview-card-logo">
                </div>
                <div class="cs-overview-card-details">
                    <div class="cs-tag" style="background-color:${item.tagBgColor}">
                        <div class="title10">${item.tagText}</div>
                    </div>
                    <h2 class="title7-2">${item.titleText}</h2>
                    <div class="cs-product-names hide">${item.productNames}</div>
                    <div class="cs-location-names hide">${item.locationNames}</div>
                </div>
                <a aria-label="Read the Case Study" href="${item.caseStudyLink}" class="cms-link-wrapper w-inline-block"></a>
            </div>
          `;
          $("#case-study-overview-showcase-grid").append(newCard);
        }
      });

      if (n > limit && !showAll) {
        $("#more-cs-wrapper").removeClass("hide");
      } else {
        $("#more-cs-wrapper").addClass("hide");
      }

      // Update the filter open text based on selected filters
      updateFilterOpenText();
    }

    // Handle desktop filter buttons
    $(".cms-filter-wrapper a").click(function (e) {
      e.preventDefault();
      $(".cms-filter-wrapper a").removeClass("selected").addClass("deselected");
      $(this).removeClass("deselected").addClass("selected");
      applyFilters();
    });

    // Handle desktop dropdowns
    $("#cs-products, #cs-locations").change(function () {
      updateSelectText("#cs-products", "All Products");
      updateSelectText("#cs-locations", "All Locations");
      applyFilters();
    });

    // Handle reset for desktop filters
    $("#reset-cs").click(function (e) {
      e.preventDefault();
      $(".cms-filter-wrapper a").removeClass("selected").addClass("deselected");
      $("#cs-all-tags").removeClass("deselected").addClass("selected");
      $("#cs-products").val("");
      $("#cs-locations").val("");
      updateSelectText("#cs-products", "Products");
      updateSelectText("#cs-locations", "Locations");
      applyFilters();
    });

    // Handle mobile filter buttons - Tags
    $(
      "#cs-all-tags-mobile, #cs-employee-mobile, #cs-acquisition-mobile, #cs-loyalty-mobile, #cs-relief-mobile"
    ).click(function (e) {
      e.preventDefault();
      $("#w-node-b30b95a0-0575-8a87-3c4b-640d6a48a777-32ba6cc3 a")
        .removeClass("selected")
        .addClass("deselected");
      $(this).removeClass("deselected").addClass("selected");
      // Optionally, update the filter open text here if you want instant feedback
    });

    // Handle mobile filter buttons - Products
    $(
      "#cs-all-products-mobile, #cs-api-mobile, #cs-business-mobile, #cs-campaigns-mobile"
    ).click(function (e) {
      e.preventDefault();
      $("#w-node-_5d163fef-674e-e3a8-a98a-d97cef4e7915-32ba6cc3 a")
        .removeClass("selected")
        .addClass("deselected");
      $(this).removeClass("deselected").addClass("selected");
      // Optionally, update the filter open text here if you want instant feedback
    });

    // Handle mobile filter buttons - Locations
    $(
      "#cs-all-locations-mobile, #cs-australia-mobile, #cs-newzealand-mobile, #cs-unitedkingdom-mobile, #cs-unitedstates-mobile"
    ).click(function (e) {
      e.preventDefault();
      $("#w-node-c991d0ac-eaff-0c2a-701c-fd36caad0684-32ba6cc3 a")
        .removeClass("selected")
        .addClass("deselected");
      $(this).removeClass("deselected").addClass("selected");
      // Optionally, update the filter open text here if you want instant feedback
    });

    // Handle apply filters for mobile
    $("#cs-apply-mobile").click(function (e) {
      e.preventDefault();
      applyFilters();
      // The "Show More" button visibility is handled within renderCards
      // Optionally, close the filter sidebar here
      $("#filter-page-back")[0].click();
    });

    // Handle reset filters for mobile
    $("#cs-reset-mobile").click(function (e) {
      e.preventDefault();
      $("#cs-all-tags-mobile")[0].click();
      $("#cs-all-products-mobile")[0].click();
      $("#cs-all-locations-mobile")[0].click();
      applyFilters();
      // Optionally, close the filter sidebar here
      $("#filter-page-back")[0].click();
    });

    $("#reset-cs").click(function (e) {
      $("#cs-reset-mobile")[0].click();
    });

    // Handle "Show More" button
    $("#more-cs").click(function (e) {
      e.preventDefault();
      renderCards(caseStudies, true);
      $("#more-cs-wrapper").addClass("hide");
    });

    // Handle sidebar filter close and back actions
    $("#filter-page-close").click(function () {
      $("#filter-page-back")[0].click();
    });

    $("#filter-page-back").click(function () {
      $("#filter-page-menu").scrollTop(0);
    });

    // Call updateFilterOpenText initially
    updateFilterOpenText();

    /**
     * Function to update the filter-open-text based on selected filters
     */
    function updateFilterOpenText() {
      // Desktop selected filters excluding 'All'
      let desktopSelected = $(".cms-filter-wrapper a.selected").not(
        "#cs-all-tags, #cs-all-products, #cs-all-locations"
      ).length;

      // Mobile selected filters excluding 'All'
      let mobileSelectedTags = $(
        "#w-node-b30b95a0-0575-8a87-3c4b-640d6a48a777-32ba6cc3 a.selected"
      ).not("#cs-all-tags-mobile").length;
      let mobileSelectedProducts = $(
        "#w-node-_5d163fef-674e-e3a8-a98a-d97cef4e7915-32ba6cc3 a.selected"
      ).not("#cs-all-products-mobile").length;
      let mobileSelectedLocations = $(
        "#w-node-c991d0ac-eaff-0c2a-701c-fd36caad0684-32ba6cc3 a.selected"
      ).not("#cs-all-locations-mobile").length;

      let totalSelected =
        desktopSelected +
        mobileSelectedTags +
        mobileSelectedProducts +
        mobileSelectedLocations;

      if (totalSelected > 0) {
        $("#filter-open-text").text(`Filter (${totalSelected})`);
      } else {
        $("#filter-open-text").text("Filter");
      }
    }
  }
});
