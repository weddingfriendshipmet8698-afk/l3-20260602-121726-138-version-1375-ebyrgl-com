(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide((current + 1) % slides.length);
      }, 5200);
    }
  }

  var filterScope = document.querySelector('[data-filter-scope]');
  if (filterScope) {
    var textInput = filterScope.querySelector('[data-filter-input]');
    var yearSelect = filterScope.querySelector('[data-year-filter]');
    var typeSelect = filterScope.querySelector('[data-type-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var emptyState = document.querySelector('[data-empty-state]');

    function applyFilter() {
      var keyword = (textInput.value || '').trim().toLowerCase();
      var year = yearSelect.value;
      var type = typeSelect.value;
      var visible = 0;

      cards.forEach(function (card) {
        var title = (card.getAttribute('data-title') || '').toLowerCase();
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var cardRegion = (card.getAttribute('data-region') || '').toLowerCase();
        var matchesKeyword = !keyword || title.indexOf(keyword) > -1 || cardYear.indexOf(keyword) > -1 || cardType.toLowerCase().indexOf(keyword) > -1 || cardRegion.indexOf(keyword) > -1;
        var matchesYear = !year || cardYear === year;
        var matchesType = !type || cardType === type;
        var shouldShow = matchesKeyword && matchesYear && matchesType;
        card.hidden = !shouldShow;
        if (shouldShow) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }
    }

    [textInput, yearSelect, typeSelect].forEach(function (control) {
      control.addEventListener('input', applyFilter);
      control.addEventListener('change', applyFilter);
    });
  }

  var searchForm = document.querySelector('[data-search-form]');
  if (searchForm && window.SITE_MOVIES) {
    var searchInput = searchForm.querySelector('[data-search-input]');
    var results = document.querySelector('[data-search-results]');
    var hint = document.querySelector('[data-search-hint]');
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';

    function createCard(movie) {
      return [
        '<a class="movie-card" href="' + movie.url + '">',
        '<span class="poster-wrap">',
        '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
        '<span class="poster-fade"></span>',
        '<span class="pill top-left">' + escapeHtml(movie.region) + '</span>',
        '<span class="pill top-right">' + movie.year + '</span>',
        '<span class="play-badge">▶</span>',
        '<span class="poster-text"><strong>' + escapeHtml(movie.title) + '</strong><em>' + escapeHtml(movie.genre) + '</em></span>',
        '</span>',
        '<span class="card-copy">',
        '<strong>' + escapeHtml(movie.title) + '</strong>',
        '<small>' + escapeHtml(movie.oneLine) + '</small>',
        '</span>',
        '</a>'
      ].join('');
    }

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"']/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char];
      });
    }

    function runSearch(query) {
      var keyword = (query || '').trim().toLowerCase();
      var matched = window.SITE_MOVIES.filter(function (movie) {
        if (!keyword) {
          return false;
        }
        return movie.searchText.indexOf(keyword) > -1;
      }).slice(0, 120);

      if (!keyword) {
        results.innerHTML = '';
        hint.textContent = '可按片名、类型、地区、年份或标签检索。';
        return;
      }

      if (matched.length === 0) {
        results.innerHTML = '';
        hint.textContent = '没有匹配的影片';
        return;
      }

      results.innerHTML = matched.map(createCard).join('');
      hint.textContent = '匹配结果';
    }

    searchInput.value = initialQuery;
    runSearch(initialQuery);

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var query = searchInput.value || '';
      var nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set('q', query);
      window.history.replaceState({}, '', nextUrl.toString());
      runSearch(query);
    });
  }
})();
