(function () {
    var header = document.querySelector(".site-header");
    var nav = document.querySelector(".site-nav");
    var toggle = document.querySelector(".nav-toggle");

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 18) {
            header.classList.add("is-solid");
        } else {
            header.classList.remove("is-solid");
        }
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader);

    if (toggle && nav) {
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".spotlight-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".spotlight-dots button"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".spotlight-card[data-slide-card]"));
    var copies = Array.prototype.slice.call(document.querySelectorAll(".spotlight-copy-panel[data-slide-copy]"));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("is-active", i === current);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === current);
        });
        cards.forEach(function (card, i) {
            card.style.display = i === current ? "" : "none";
        });
        copies.forEach(function (copy, i) {
            copy.classList.toggle("is-active", i === current);
        });
    }

    if (slides.length) {
        showSlide(0);
        dots.forEach(function (dot, i) {
            dot.addEventListener("click", function () {
                showSlide(i);
            });
        });
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));
    var filterBars = Array.prototype.slice.call(document.querySelectorAll("[data-filter-bar]"));

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function applyFilters(scope) {
        var root = scope || document;
        var input = root.querySelector("[data-search-input]") || document.querySelector("[data-search-input]");
        var type = root.querySelector("[data-filter-type]");
        var region = root.querySelector("[data-filter-region]");
        var year = root.querySelector("[data-filter-year]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card[data-title]"));
        var empty = document.querySelector("[data-no-result]");
        var q = normalize(input ? input.value : "");
        var selectedType = normalize(type ? type.value : "");
        var selectedRegion = normalize(region ? region.value : "");
        var selectedYear = normalize(year ? year.value : "");
        var shown = 0;

        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute("data-title"),
                card.getAttribute("data-region"),
                card.getAttribute("data-type"),
                card.getAttribute("data-year"),
                card.getAttribute("data-genre"),
                card.getAttribute("data-tags")
            ].join(" "));
            var ok = true;

            if (q && haystack.indexOf(q) === -1) {
                ok = false;
            }
            if (selectedType && normalize(card.getAttribute("data-type")) !== selectedType) {
                ok = false;
            }
            if (selectedRegion && normalize(card.getAttribute("data-region")) !== selectedRegion) {
                ok = false;
            }
            if (selectedYear && normalize(card.getAttribute("data-year")) !== selectedYear) {
                ok = false;
            }

            card.style.display = ok ? "" : "none";
            if (ok) {
                shown += 1;
            }
        });

        if (empty) {
            empty.classList.toggle("is-visible", shown === 0);
        }
    }

    searchInputs.forEach(function (input) {
        input.addEventListener("input", function () {
            applyFilters(input.closest("[data-filter-bar]") || document);
        });
    });

    filterBars.forEach(function (bar) {
        Array.prototype.slice.call(bar.querySelectorAll("select")).forEach(function (select) {
            select.addEventListener("change", function () {
                applyFilters(bar);
            });
        });
    });
})();
