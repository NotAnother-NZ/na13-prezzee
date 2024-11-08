$(document).ready(function () {
  if ($("#blog-showcase").length) {
    console.log("blog showcase is present");

    function breakNumberBlog(n) {
      let sequence = [];
      let total = 0;
      let threeCount = 0;

      function addThree() {
        threeCount++;
        let label = threeCount % 2 === 1 ? "3(i)" : "3(ii)";
        sequence.push(label);
        total += 3;
      }

      function addFour() {
        sequence.push(4);
        total += 4;
      }

      function addTwo() {
        sequence.push(2);
        total += 2;
      }

      function addOne() {
        sequence.push(1);
        total += 1;
      }

      if (n % 4 === 0) {
        while (total < n) {
          addFour();
        }
      } else if (n >= 3) {
        addThree();
        while (total < n) {
          let remaining = n - total;
          if (remaining >= 4) {
            addFour();
          } else if (remaining === 3) {
            addThree();
          } else if (remaining === 2) {
            addTwo();
          } else if (remaining === 1) {
            if (sequence.length > 0 && sequence[sequence.length - 1] === 4) {
              sequence.pop();
              total -= 4;
              addThree();
              addTwo();
            } else if (
              sequence.length > 0 &&
              (sequence[sequence.length - 1] === "3(i)" ||
                sequence[sequence.length - 1] === "3(ii)")
            ) {
              sequence.pop();
              total -= 3;
              addTwo();
              addTwo();
            } else {
              addOne();
            }
          }
        }
      } else if (n === 2) {
        addTwo();
      } else if (n === 1) {
        addOne();
      } else {
        console.error("Cannot break down the number with the given logic.");
      }

      const formattedSequence = sequence.join(" + ");
      console.log(`${n} will be broken into ${formattedSequence}`);
      return sequence;
    }

    function calculateReadingTime() {
      var allSet = true;

      $("[data-reading-time]").each(function () {
        var readingTimeElement = $(this);

        if (readingTimeElement.text().trim() === "") {
          var contentElement = readingTimeElement
            .closest(".blog-overview-card-details")
            .find("[data-reading-time-content]");

          if (contentElement.length) {
            var textContent = contentElement.text().replace(/\s+/g, " ").trim();
            var words = textContent.split(" ").length;
            var readingTime = Math.max(1, Math.ceil(words / 200));
            readingTimeElement.text((readingTime + " MIN READ").toUpperCase());
          }

          if (readingTimeElement.text().trim() === "") {
            allSet = false;
          }
        }
      });

      if (!allSet) {
        setTimeout(calculateReadingTime, 500);
      }
    }

    let caseStudies = [];

    function renderCard(item, isType2) {
      if (isType2) {
        return `
          <div id="w-node-_8ce77667-79e0-44e3-5862-f026ad742b72-ffdf4913" class="blog-overview-card-desktop-wrapper">
          <!-- Hidden on tablet and mobile, shown only on desktop -->
  
  
            <div id="w-node-d4b1dd82-6bbc-f4cd-0af7-1ead77f69288-ffdf4913" class="blog-overview-card type2 cream">
              <div class="blog-overview-card-details type2">
                <div class="blog-overview-card-header">
                  <div data-reading-time-content class="hide w-richtext">${item.richContent}</div>
                  <div class="blog-tag">
                    <div class="title10">${item.tagText}</div>
                  </div>
                  <h2 class="title7-2 text-style-5lines">${item.titleText}</h2>
                </div>
                <div data-reading-time class="title10"></div>
                <div class="cs-location-names hide">${item.locationNames}</div>
              </div>
              <div class="blog-overview-hero type2 flower-8">
                <img src="${item.imageCoverSrc}" loading="lazy" alt="" class="image-cover">
              </div>
              <a aria-label="Read the Case Study" href="${item.caseStudyLink}" class="cms-link-wrapper w-inline-block"></a>
            </div>
  
        
          <!-- Shown on tablet and mobile, hidden on desktop -->
          
  
            <div id="w-node-bdf4bfa2-196d-f56f-195c-f176d8f55b57-ffdf4913" class="blog-overview-card type3 cream">
              <div class="blog-overview-card-details">
                <div class="blog-overview-card-header">
                  <div data-reading-time-content class="hide w-richtext">${item.richContent}</div>
                  <div class="blog-tag">
                    <div class="title10">${item.tagText}</div>
                  </div>
                  <div class="blog-overview-hero flower-8">
                    <img src="${item.imageCoverSrc}" loading="lazy" alt="" class="image-cover">
                  </div>
                </div>
                <div class="blog-overview-card-content">
                  <h2 class="title7-2 text-style-3lines">${item.titleText}</h2>
                  <div data-reading-time class="title10"></div>
                  <div class="cs-location-names hide">${item.locationNames}</div>
                </div>
              </div>
              <a aria-label="Read the Case Study" href="${item.caseStudyLink}" class="cms-link-wrapper w-inline-block"></a>
            </div>
  
  
        </div>
        
                    `;
      } else {
        return `
                      <div id="w-node-_17d7696a-e9bc-be03-c484-bb6d46c67115-ffdf4913" class="blog-overview-card cream">
                        <div class="blog-overview-card-details">
                          <div class="blog-overview-card-header">
                            <div data-reading-time-content class="hide w-richtext">${item.richContent}</div>
                            <div class="blog-tag">
                              <div class="title10">${item.tagText}</div>
                            </div>
                            <div class="blog-overview-hero flower-8">
                              <img src="${item.imageCoverSrc}" loading="lazy" alt="" class="image-cover">
                            </div>
                          </div>
                          <div class="blog-overview-card-content">
                            <h2 class="title7-2 text-style-3lines">${item.titleText}</h2>
                            <div data-reading-time class="title10"></div>
                            <div class="cs-location-names hide">${item.locationNames}</div>
                          </div>
                        </div>
                        <a aria-label="Read the Case Study" href="${item.caseStudyLink}" class="cms-link-wrapper w-inline-block"></a>
                      </div>
                    `;
      }
    }

    function renderCards(data, showAll = false) {
      $("#case-study-overview-showcase-grid").empty();
      let n = data.length;
      let sequence = breakNumberBlog(n);

      if (n === 0) {
        $("#cms-not-found").removeClass("hide");
        $("#more-cs-wrapper").addClass("hide");
      } else {
        $("#cms-not-found").addClass("hide");
      }

      let limit;
      let windowWidth = $(window).width();

      if (windowWidth > 768) {
        let desiredRows = 3;
        let sequencesToInclude = sequence.slice(0, desiredRows);
        limit = sequencesToInclude.reduce((acc, val) => {
          if (typeof val === "number") {
            return acc + val;
          } else if (typeof val === "string" && val.startsWith("3")) {
            return acc + 3;
          } else {
            return acc;
          }
        }, 0);
      } else {
        limit = 8;
      }

      if (showAll) {
        limit = n;
      }

      let cardsRendered = 0;
      let dataIndex = 0;

      for (let seqIndex = 0; seqIndex < sequence.length; seqIndex++) {
        if (cardsRendered >= limit || dataIndex >= n) {
          break;
        }

        let element = sequence[seqIndex];

        if (element === 4) {
          for (let i = 0; i < 4; i++) {
            if (cardsRendered >= limit || dataIndex >= n) {
              break;
            }
            let item = data[dataIndex++];
            let newCard = renderCard(item, false);
            $("#case-study-overview-showcase-grid").append(newCard);
            cardsRendered++;
          }
        } else if (element === "3(i)") {
          if (cardsRendered < limit && dataIndex < n) {
            let item = data[dataIndex++];
            let newCard = renderCard(item, true);
            $("#case-study-overview-showcase-grid").append(newCard);
            cardsRendered++;
          }
          for (let i = 0; i < 2; i++) {
            if (cardsRendered >= limit || dataIndex >= n) {
              break;
            }
            let item = data[dataIndex++];
            let newCard = renderCard(item, false);
            $("#case-study-overview-showcase-grid").append(newCard);
            cardsRendered++;
          }
        } else if (element === "3(ii)") {
          for (let i = 0; i < 2; i++) {
            if (cardsRendered >= limit || dataIndex >= n) {
              break;
            }
            let item = data[dataIndex++];
            let newCard = renderCard(item, false);
            $("#case-study-overview-showcase-grid").append(newCard);
            cardsRendered++;
          }
          if (cardsRendered < limit && dataIndex < n) {
            let item = data[dataIndex++];
            let newCard = renderCard(item, true);
            $("#case-study-overview-showcase-grid").append(newCard);
            cardsRendered++;
          }
        } else if (element === 2) {
          for (let i = 0; i < 2; i++) {
            if (cardsRendered >= limit || dataIndex >= n) {
              break;
            }
            let item = data[dataIndex++];
            let newCard = renderCard(item, true);
            $("#case-study-overview-showcase-grid").append(newCard);
            cardsRendered++;
          }
        } else if (element === 1) {
          if (cardsRendered < limit && dataIndex < n) {
            let item = data[dataIndex++];
            let newCard = renderCard(item, false);
            $("#case-study-overview-showcase-grid").append(newCard);
            cardsRendered++;
          }
        }
      }

      if (n > limit && !showAll) {
        $("#more-cs-wrapper").removeClass("hide");
      } else {
        $("#more-cs-wrapper").addClass("hide");
      }

      updateFilterOpenText();
      calculateReadingTime();
    }

    function updateFilterOpenText() {
      let desktopSelected = $(".cms-filter-wrapper a.selected").not(
        "#cs-all-tags, #cs-all-products, #cs-all-locations"
      ).length;

      let mobileSelectedTags = $(
        "#w-node-b30b95a0-0575-8a87-3c4b-640d6a48a777-ffdf4911 a.selected"
      ).not("#cs-all-tags-mobile").length;
      let mobileSelectedProducts = $(
        "#w-node-_5d163fef-674e-e3a8-a98a-d97cef4e7915-ffdf4911 a.selected"
      ).not("#cs-all-products-mobile").length;
      let mobileSelectedLocations = $(
        "#filter-location-buttons a.selected"
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

    function applyFilters(showAll = false) {
      let filterTagDesktop = $(".cms-filter-wrapper a.selected").text();
      let filterTagMobile = $(
        "#w-node-b30b95a0-0575-8a87-3c4b-640d6a48a777-ffdf4911 a.selected"
      ).text();

      let filterProductDesktop = $("#cs-products").val();
      let filterProductMobile = $(
        "#w-node-_5d163fef-674e-e3a8-a98a-d97cef4e7915-ffdf4911 a.selected"
      ).text();

      let filterLocationDesktop = $("#cs-locations").val();
      let filterLocationMobile = $(
        "#filter-location-buttons a.selected"
      ).text();

      let filteredData = caseStudies;

      let finalTag = "All";
      if (filterTagDesktop && filterTagDesktop !== "All") {
        finalTag = filterTagDesktop;
      } else if (filterTagMobile && filterTagMobile !== "All") {
        finalTag = filterTagMobile;
      }
      if (finalTag !== "All") {
        filteredData = filteredData.filter((item) => item.tagText === finalTag);
      }

      let finalProduct = "";
      if (filterProductDesktop) {
        finalProduct = filterProductDesktop;
      } else if (filterProductMobile && filterProductMobile !== "All") {
        finalProduct = filterProductMobile;
      }
      if (finalProduct) {
        filteredData = filteredData.filter(
          (item) =>
            item.productNames && item.productNames.includes(finalProduct)
        );
      }

      let finalLocation = "All";
      if (filterLocationDesktop && filterLocationDesktop !== "All") {
        finalLocation = filterLocationDesktop;
      } else if (filterLocationMobile && filterLocationMobile !== "All") {
        finalLocation = filterLocationMobile;
      }

      if (finalLocation !== "All") {
        filteredData = filteredData.filter(
          (item) =>
            item.locationNames && item.locationNames.includes(finalLocation)
        );
      }

      renderCards(filteredData, showAll);
    }

    $("#case-study-overview-showcase .cs-overview-card-item").each(function () {
      var imageCoverElement = $(this).find(".image-cover");
      var imageCoverSrc = "";
      if (
        !imageCoverElement.hasClass("w-condition-invisible") &&
        !imageCoverElement.hasClass("w-dyn-bind-empty")
      ) {
        imageCoverSrc = imageCoverElement.attr("src");
      }

      var tagText = $(this).find(".blog-tag .title10").text().trim();
      if (!tagText) {
        console.warn("Tag Text not found. Please check the selector.");
        tagText = "";
      }

      var locationNames = $(this).find(".blog-tag .title10").text().trim();
      if (!locationNames) {
        console.warn("Location Names not found. Please check the selector.");
        locationNames = "";
      }

      var titleText = $(this).find(".title7-2").text().trim();
      var caseStudyLink = $(this).find(".cms-link-wrapper").attr("href") || "";
      var richContent = $(this)
        .find(".blog-overview-card-header [data-reading-time-content]")
        .html();

      if (!richContent) {
        console.warn("Primary selector failed. Trying alternative selector.");
        richContent = $(this).find("[data-reading-time-content]").html();
      }

      if (!richContent) {
        console.warn(
          "Alternative selector failed. Trying another alternative."
        );
        richContent = $(this).find(".w-richtext").html();
      }

      if (!richContent) {
        console.error(
          "Failed to extract richContent. Setting as empty string."
        );
        richContent = "";
      }

      caseStudies.push({
        imageCoverSrc: imageCoverSrc,
        tagText: tagText,
        locationNames: locationNames,
        titleText: titleText,
        caseStudyLink: caseStudyLink,
        richContent: richContent,
      });
    });

    $("#case-study-overview-showcase .cs-overview-card-item").remove();

    renderCards(caseStudies);
    calculateReadingTime();

    // $(".cms-filter-wrapper a").click(function (e) {
    //   e.preventDefault();
    //   $(".cms-filter-wrapper a").removeClass("selected").addClass("deselected");
    //   $(this).removeClass("deselected").addClass("selected");
    //   applyFilters();
    // });

    // $("#cs-products, #cs-locations").change(function () {
    //   updateSelectText("#cs-products", "All Products");
    //   updateSelectText("#cs-locations", "All Locations");
    //   applyFilters();
    // });

    $("#cs-locations").change(function () {
      updateSelectText("#cs-locations", "All Locations");
      applyFilters();
    });

    $("#reset-cs").click(function (e) {
      e.preventDefault();
      $(".cms-filter-wrapper a").removeClass("selected").addClass("deselected");
      $("#cs-all-tags").removeClass("deselected").addClass("selected");
      $("#cs-products").val("");
      $("#cs-locations").val("");
      updateSelectText("#cs-products", "Products");
      updateSelectText("#cs-locations", "All Locations");
      applyFilters();
    });

    // $(
    //   "#cs-all-tags-mobile, #cs-employee-mobile, #cs-acquisition-mobile, #cs-loyalty-mobile, #cs-relief-mobile"
    // ).click(function (e) {
    //   e.preventDefault();
    //   $("#w-node-b30b95a0-0575-8a87-3c4b-640d6a48a777-ffdf4911 a")
    //     .removeClass("selected")
    //     .addClass("deselected");
    //   $(this).removeClass("deselected").addClass("selected");
    // });

    // $(
    //   "#cs-all-products-mobile, #cs-api-mobile, #cs-business-mobile, #cs-campaigns-mobile"
    // ).click(function (e) {
    //   e.preventDefault();
    //   $("#w-node-_5d163fef-674e-e3a8-a98a-d97cef4e7915-ffdf4911 a")
    //     .removeClass("selected")
    //     .addClass("deselected");
    //   $(this).removeClass("deselected").addClass("selected");
    // });

    $(
      "#cs-all-locations-mobile, #cs-australia-mobile, #cs-newzealand-mobile, #cs-unitedkingdom-mobile, #cs-unitedstates-mobile"
    ).click(function (e) {
      e.preventDefault();
      $("#filter-location-buttons a")
        .removeClass("selected")
        .addClass("deselected");
      $(this).removeClass("deselected").addClass("selected");
    });

    $("#cs-apply-mobile").click(function (e) {
      e.preventDefault();
      applyFilters();
      $("#filter-page-back")[0].click();
      enableScroll();
    });

    $("#cs-reset-mobile").click(function (e) {
      e.preventDefault();
      // $("#cs-all-tags-mobile").removeClass("deselected").addClass("selected");
      // $("#cs-all-products-mobile")
      //   .removeClass("deselected")
      //   .addClass("selected");

      $("#filter-location-buttons a")
        .removeClass("selected")
        .addClass("deselected");

      $("#cs-all-locations-mobile")
        .removeClass("deselected")
        .addClass("selected");
      applyFilters();
      $("#more-cs-wrapper").addClass("hide");
      $("#filter-page-back")[0].click();
      enableScroll();
    });

    $("#reset-cs").click(function (e) {
      e.preventDefault();
      $("#cs-reset-mobile").click();
    });

    $("#more-cs").click(function (e) {
      e.preventDefault();
      renderCards(caseStudies, true);
      $("#more-cs-wrapper").addClass("hide");
    });

    $("#filter-page-close").click(function () {
      $("#filter-page-back")[0].click();
      enableScroll();
    });

    $("#filter-page-back").click(function () {
      $("#filter-page-menu").scrollTop(0);
    });


    //when #cs-filter-open is clicked, disableScroll()
    $("#cs-filter-open").click(function () {
      disableScroll();
    });

    //when #filter-page-back is clicked, enableScroll()
    $("#filter-page-back").click(function () {
      enableScroll();
    });

    updateFilterOpenText();

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
  }
});
