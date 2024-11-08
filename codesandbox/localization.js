$(document).ready(function () {
  if ($("#location-filter-wrapper").length) {
    console.log("Location filter is present");

    // Function to get language and country names using Intl.DisplayNames
    function getNames(locale, displayNamesCache) {
      const [languageCode, countryCode] = locale.split("-");
      const language = displayNamesCache.languageNames.of(
        languageCode.toLowerCase()
      );
      const country = displayNamesCache.countryNames.of(
        countryCode.toUpperCase()
      );
      return { language, country };
    }

    // Fetch country and currency data
    $.ajax({
      url: "https://restcountries.com/v3.1/all?fields=cca2,currencies",
      method: "GET",
      dataType: "json",
    })
      .done(function (data) {
        const countryCurrencyMap = {};
        data.forEach((country) => {
          if (country.cca2 && country.currencies) {
            const currencyCode = Object.keys(country.currencies)[0];
            if (currencyCode) {
              const currencySymbol =
                country.currencies[currencyCode].symbol || currencyCode;
              countryCurrencyMap[country.cca2.toUpperCase()] = {
                code: currencyCode,
                symbol: currencySymbol,
              };
            }
          }
        });

        const displayNamesCache = {
          languageNames: new Intl.DisplayNames(["en"], { type: "language" }),
          countryNames: new Intl.DisplayNames(["en"], { type: "region" }),
        };

        // Detect current locale from URL
        const url = window.location.href;
        const localeMatch = url.match(/\/en-(\w{2})\//);
        const currentLocale = localeMatch
          ? `en-${localeMatch[1].toUpperCase()}`
          : null;
        let currentCountryName = "";

        // Build a map of supported locales
        const supportedLocales = {};
        $(".cta4").each(function () {
          const locale = $(this).data("locale");
          if (!locale) return;

          const [lang, country] = locale.split("-");
          if (!supportedLocales[country]) {
            supportedLocales[country] = [];
          }
          supportedLocales[country].push(lang.toLowerCase());

          const { language, country: countryName } = getNames(
            locale,
            displayNamesCache
          );
          $(this)
            .find("[data-locale-name]")
            .text(`${countryName} (${language})`);

          const currency = countryCurrencyMap[country];
          if (currency && currency.symbol) {
            $(this)
              .find("[data-locale-currency]")
              .text(`${currency.code} ${currency.symbol}`);
          } else {
            $(this).find("[data-locale-currency]").text("$");
          }

          // Set the current country name if it matches the current locale
          if (locale === currentLocale) {
            currentCountryName = countryName;
            $(this).removeClass("deselected");
          } else {
            $(this).addClass("deselected");
          }
        });

        // Update elements with data-current-locale to show the current country name
        $("[data-current-locale]").text(currentCountryName);

        // Function to update title and subtitle based on scenario
        function updateTitleSubtitle(
          userCountry,
          userLanguage,
          userCountryName,
          userLanguageName
        ) {
          let title = "";
          let subtitle = "";

          if (supportedLocales[userCountry]) {
            if (supportedLocales[userCountry].includes(userLanguage)) {
              // Scenario 1: Supported Country and Language
              title = "Change Your Region";
              subtitle = `You're viewing the Prezzee Business site in ${userCountryName} (${userLanguageName}). If this isn’t your preferred region, you can switch to another below.`;
            } else {
              // Scenario 2: Supported Country but Unsupported Language
              const availableLanguages = supportedLocales[userCountry].map(
                (lang) => displayNamesCache.languageNames.of(lang)
              );
              title = "Change Your Language";
              subtitle = `Prezzee Business is available in ${userCountryName}, but not in ${userLanguageName}. Choose a language for ${userCountryName} below.`;
            }

            // Check if multiple languages are supported for the country
            if (supportedLocales[userCountry].length > 1) {
              const languageNames = supportedLocales[userCountry].map((lang) =>
                displayNamesCache.languageNames.of(lang)
              );
              title = "Choose Your Language";
              subtitle = `Prezzee Business is available in ${languageNames.join(
                " and "
              )}. Select your preferred language below.`;
            }
          } else {
            // Scenario 3: Unsupported Country with Current Country Acknowledgment
            title = "Select Your Location";
            subtitle = `It looks like you’re visiting the Prezzee Business site for ${currentCountryName} from ${userCountryName}. Unfortunately, Prezzee Business isn’t available in ${userCountryName}. Select a different region below.`;
          }

          $("[data-locale-title]").text(title);
          $("[data-locale-subtitle]").text(subtitle);
        }

        // Function to apply locale settings from localStorage
        function applyStoredLocale() {
          const storedLocale = localStorage.getItem("preferredLocale");
          if (
            storedLocale &&
            supportedLocales[
              storedLocale.split("-")[1].toUpperCase()
            ]?.includes(storedLocale.split("-")[0].toLowerCase())
          ) {
            $(".cta4").each(function () {
              if ($(this).data("locale") === storedLocale) {
                $(this).removeClass("deselected");
              } else {
                $(this).addClass("deselected");
              }
            });
            const [lang, country] = storedLocale.split("-");
            const countryName = displayNamesCache.countryNames.of(
              country.toUpperCase()
            );
            const languageName = displayNamesCache.languageNames.of(
              lang.toLowerCase()
            );
            $("[data-current-locale]").text(`${countryName} (${languageName})`);
            return country;
          }
          return null;
        }

        // Apply stored locale if available
        const storedCountry = applyStoredLocale();

        // If no stored locale, detect user location and language
        if (!storedCountry) {
          $.getJSON("https://ipapi.co/json/")
            .done(function (ipData) {
              const userCountry = ipData.country_code.toUpperCase();
              const userCountryName =
                displayNamesCache.countryNames.of(userCountry);
              const userLanguage = navigator.language
                .split("-")[0]
                .toLowerCase();
              const userLanguageName =
                displayNamesCache.languageNames.of(userLanguage);

              // Check if user's country is supported
              const isCountrySupported =
                supportedLocales.hasOwnProperty(userCountry);

              if (isCountrySupported) {
                const isLanguageSupported =
                  supportedLocales[userCountry].includes(userLanguage);

                if (isLanguageSupported) {
                  // Scenario 1: Supported Country and Language
                  updateTitleSubtitle(
                    userCountry,
                    userLanguage,
                    userCountryName,
                    userLanguageName
                  );
                } else {
                  // Scenario 2: Supported Country but Unsupported Language
                  updateTitleSubtitle(
                    userCountry,
                    userLanguage,
                    userCountryName,
                    userLanguageName
                  );
                  // Trigger the localization modal
                  $("#locale-trigger")[0].click();
                }
              } else {
                // Scenario 3: Unsupported Country
                updateTitleSubtitle(
                  userCountry,
                  userLanguage,
                  userCountryName,
                  userLanguageName
                );
                // Trigger the localization modal
                $("#locale-trigger")[0].click();
              }

              // Optionally, store the detected locale if supported
              if (isCountrySupported && isLanguageSupported) {
                const detectedLocale = `${userLanguage}-${userCountry}`;
                localStorage.setItem("preferredLocale", detectedLocale);
              }
            })
            .fail(function () {
              console.error("Failed to fetch user location data.");
              $("[data-locale-title]").text("Select Location");
              $("[data-locale-subtitle]").text(
                "Select a location to explore our services."
              );
            });
        } else {
          // Use stored locale for title and subtitle
          const browserLanguage = navigator.language
            .split("-")[0]
            .toLowerCase();
          const userCountry = storedCountry;
          const userCountryName =
            displayNamesCache.countryNames.of(userCountry);
          const userLanguageName =
            displayNamesCache.languageNames.of(browserLanguage);
          updateTitleSubtitle(
            userCountry,
            browserLanguage,
            userCountryName,
            userLanguageName
          );
        }

        // Handle locale change by user
        $(".locale-cta-link").on("click", function (e) {
          e.preventDefault();
          const selectedLocale = $(this).closest(".cta4").data("locale");
          localStorage.setItem("preferredLocale", selectedLocale);
          window.location.href = $(this).attr("href");
        });
      })
      .fail(function () {
        console.error("Failed to fetch country data for localization.");
        $("[data-locale-title]").text("Select Location");
        $("[data-locale-subtitle]").text(
          "Select a location to explore our services."
        );
      });

    // Handle locale modal close on bg click
    $("#locale-filter-close-bg").click(function () {
      $("#locale-filter-close")[0].click();
    });

    // Handle locale modal open on footer trigger click
    $("#footer-locale-trigger").click(function () {
      $("#locale-trigger")[0].click();
    });
  }
});
