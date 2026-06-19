(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mainNav = document.querySelector('[data-main-nav]');

    if (menuButton && mainNav) {
        menuButton.addEventListener('click', function () {
            mainNav.classList.toggle('is-open');
        });
    }

    function setupHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }

        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var next = hero.querySelector('[data-hero-next]');
        var prev = hero.querySelector('[data-hero-prev]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                startTimer();
            });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                startTimer();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
                startTimer();
            });
        });

        startTimer();
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function setupLocalFilter() {
        var wrapper = document.querySelector('[data-local-filter]');
        var list = document.querySelector('[data-filter-list]');
        if (!wrapper || !list) {
            return;
        }

        var input = wrapper.querySelector('[data-filter-input]');
        var count = wrapper.querySelector('[data-filter-count]');
        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

        function apply() {
            var keyword = normalize(input.value);
            var matched = 0;
            cards.forEach(function (card) {
                var text = normalize(card.textContent + ' ' + card.getAttribute('data-title') + ' ' + card.getAttribute('data-year') + ' ' + card.getAttribute('data-genre'));
                var visible = !keyword || text.indexOf(keyword) !== -1;
                card.classList.toggle('is-hidden', !visible);
                if (visible) {
                    matched += 1;
                }
            });
            if (count) {
                count.textContent = matched + ' 部';
            }
        }

        if (input) {
            input.addEventListener('input', apply);
            apply();
        }
    }

    function setupSearchPage() {
        var panel = document.querySelector('[data-search-panel]');
        var list = document.querySelector('[data-search-list]');
        if (!panel || !list) {
            return;
        }

        var input = panel.querySelector('[data-search-input]');
        var categorySelect = panel.querySelector('[data-category-select]');
        var yearSelect = panel.querySelector('[data-year-select]');
        var count = panel.querySelector('[data-search-count]');
        var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');

        if (q && input) {
            input.value = q;
        }

        function apply() {
            var keyword = normalize(input && input.value);
            var category = normalize(categorySelect && categorySelect.value);
            var year = normalize(yearSelect && yearSelect.value);
            var matched = 0;

            cards.forEach(function (card) {
                var text = normalize(card.textContent + ' ' + card.getAttribute('data-title') + ' ' + card.getAttribute('data-genre') + ' ' + card.getAttribute('data-region'));
                var cardCategory = normalize(card.getAttribute('data-category'));
                var cardYear = normalize(card.getAttribute('data-year'));
                var visible = (!keyword || text.indexOf(keyword) !== -1) && (!category || cardCategory === category) && (!year || cardYear === year);
                card.classList.toggle('is-hidden', !visible);
                if (visible) {
                    matched += 1;
                }
            });

            if (count) {
                count.textContent = matched;
            }
        }

        [input, categorySelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });

        apply();
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
        players.forEach(function (box) {
            var video = box.querySelector('video');
            var button = box.querySelector('[data-player-start]');
            var hlsSource = box.getAttribute('data-hls');
            var fallback = box.getAttribute('data-fallback');
            var initialized = false;

            function playFallback() {
                if (!video || !fallback) {
                    return;
                }
                video.src = fallback;
                video.play().catch(function () {});
            }

            function initPlayer() {
                if (!video || initialized) {
                    if (video) {
                        video.play().catch(function () {});
                    }
                    return;
                }
                initialized = true;
                box.classList.add('is-playing');

                if (window.Hls && window.Hls.isSupported() && hlsSource) {
                    var hls = new window.Hls();
                    hls.loadSource(hlsSource);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                    hls.on(window.Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal) {
                            hls.destroy();
                            playFallback();
                        }
                    });
                } else if (video.canPlayType('application/vnd.apple.mpegurl') && hlsSource) {
                    video.src = hlsSource;
                    video.play().catch(function () {
                        playFallback();
                    });
                } else {
                    playFallback();
                }
            }

            if (button) {
                button.addEventListener('click', initPlayer);
            }
        });
    }

    setupHero();
    setupLocalFilter();
    setupSearchPage();
    setupPlayers();
})();
