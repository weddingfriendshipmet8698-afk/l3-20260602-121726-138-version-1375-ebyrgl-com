(function () {
  var mobileToggle = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('is-missing');
    }, { once: true });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var heroIndex = 0;
  var heroTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('active', slideIndex === heroIndex);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('active', dotIndex === heroIndex);
    });
  }

  function startHeroTimer() {
    if (heroTimer) {
      clearInterval(heroTimer);
    }

    heroTimer = setInterval(function () {
      showSlide(heroIndex + 1);
    }, 5200);
  }

  if (slides.length) {
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')));
        startHeroTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(heroIndex - 1);
        startHeroTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(heroIndex + 1);
        startHeroTimer();
      });
    }

    startHeroTimer();
  }

  function normalizeText(value) {
    return String(value || '').toLowerCase().trim();
  }

  function updateMovieFilters() {
    var searchInput = document.querySelector('[data-movie-search]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var query = normalizeText(searchInput && searchInput.value);
    var yearValue = yearSelect ? yearSelect.value : '';
    var cards = document.querySelectorAll('[data-movie-list] [data-title]');

    cards.forEach(function (card) {
      var haystack = normalizeText([
        card.getAttribute('data-title'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-category'),
        card.getAttribute('data-year')
      ].join(' '));
      var year = Number(card.getAttribute('data-year')) || 0;
      var queryMatch = !query || haystack.indexOf(query) !== -1;
      var yearMatch = true;

      if (yearValue === 'older') {
        yearMatch = year < 2020;
      } else if (yearValue) {
        yearMatch = String(year) === yearValue;
      }

      card.classList.toggle('is-hidden-by-filter', !(queryMatch && yearMatch));
    });
  }

  var searchInput = document.querySelector('[data-movie-search]');
  var yearSelect = document.querySelector('[data-year-filter]');

  if (searchInput) {
    searchInput.addEventListener('input', updateMovieFilters);
  }

  if (yearSelect) {
    yearSelect.addEventListener('change', updateMovieFilters);
  }

  function attachStream(video, stream, button) {
    if (!video || !stream) {
      return;
    }

    if (button) {
      button.disabled = true;
    }

    var playVideo = function () {
      var result = video.play();

      if (result && typeof result.catch === 'function') {
        result.catch(function () {
          if (button) {
            button.disabled = false;
          }
        });
      }
    };

    if (window.Hls && window.Hls.isSupported()) {
      if (video._hlsPlayer) {
        video._hlsPlayer.destroy();
      }

      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });

      video._hlsPlayer = hls;
      hls.loadSource(stream);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          hls.destroy();
          video.src = stream;
          playVideo();
        }
      });
      return;
    }

    video.src = stream;
    playVideo();
  }

  document.querySelectorAll('.play-now').forEach(function (button) {
    button.addEventListener('click', function () {
      var video = document.querySelector(button.getAttribute('data-target'));
      var stream = button.getAttribute('data-stream');
      attachStream(video, stream, button);
    });
  });

  document.querySelectorAll('.js-hls-player').forEach(function (video) {
    video.addEventListener('click', function () {
      var button = document.querySelector('.play-now[data-target="#' + video.id + '"]');
      if (button && video.paused && !video.currentSrc) {
        button.click();
      }
    });
  });
})();
