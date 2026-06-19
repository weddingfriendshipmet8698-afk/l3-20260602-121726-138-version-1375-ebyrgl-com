(function () {
  var toggle = document.querySelector('[data-mobile-toggle]');
  var nav = document.querySelector('[data-mobile-nav]');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length > 0) {
    var current = 0;
    var show = function (index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });
    window.setInterval(function () {
      show((current + 1) % slides.length);
    }, 5000);
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
  panels.forEach(function (panel) {
    var target = panel.getAttribute('data-filter-panel');
    var grid = document.querySelector('[data-grid="' + target + '"]');
    if (!grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
    var input = panel.querySelector('[data-search-input]');
    var year = panel.querySelector('[data-year-filter]');
    var region = panel.querySelector('[data-region-filter]');
    var count = document.querySelector('[data-count="' + target + '"]');
    var apply = function () {
      var query = input ? input.value.trim().toLowerCase() : '';
      var yearValue = year ? year.value : '';
      var regionValue = region ? region.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-region')).toLowerCase();
        var matchQuery = !query || haystack.indexOf(query) !== -1;
        var matchYear = !yearValue || card.getAttribute('data-year') === yearValue;
        var matchRegion = !regionValue || card.getAttribute('data-region') === regionValue;
        var ok = matchQuery && matchYear && matchRegion;
        card.classList.toggle('hidden-by-filter', !ok);
        if (ok) {
          visible += 1;
        }
      });
      if (count) {
        count.textContent = String(visible);
      }
    };
    [input, year, region].forEach(function (el) {
      if (el) {
        el.addEventListener('input', apply);
        el.addEventListener('change', apply);
      }
    });
    apply();
  });
})();
