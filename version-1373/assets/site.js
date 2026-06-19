(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  if (slides.length > 1) {
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5200);
  }

  const scopes = Array.from(document.querySelectorAll('.filter-scope'));
  scopes.forEach((scope) => {
    const input = scope.querySelector('.search-input');
    const cards = Array.from(scope.querySelectorAll('.movie-card'));
    const buttons = Array.from(scope.querySelectorAll('[data-filter]'));
    let active = 'all';

    const apply = () => {
      const query = input ? input.value.trim().toLowerCase() : '';
      cards.forEach((card) => {
        const text = card.getAttribute('data-search') || '';
        const type = card.getAttribute('data-type') || '';
        const region = card.getAttribute('data-region') || '';
        const matchedText = !query || text.includes(query);
        const matchedFilter = active === 'all' || type === active || region === active;
        card.classList.toggle('hidden-card', !(matchedText && matchedFilter));
      });
    };

    if (input) {
      input.addEventListener('input', apply);
    }

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        active = button.getAttribute('data-filter') || 'all';
        buttons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        apply();
      });
    });
  });

  const player = document.querySelector('[data-player]');
  if (player) {
    const video = player.querySelector('video');
    const source = video ? video.querySelector('source') : null;
    const overlay = player.querySelector('.player-overlay');
    const button = player.querySelector('.play-button');
    const streamUrl = source ? source.getAttribute('src') : '';
    let ready = false;

    const attach = () => {
      if (!video || !streamUrl || ready) {
        return;
      }
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    };

    const play = () => {
      attach();
      if (video) {
        video.play().then(() => {
          if (overlay) {
            overlay.classList.add('hidden');
          }
        }).catch(() => {
          if (overlay) {
            overlay.classList.remove('hidden');
          }
        });
      }
    };

    if (button) {
      button.addEventListener('click', play);
    }
    if (overlay) {
      overlay.addEventListener('click', play);
    }
    if (video) {
      video.addEventListener('play', () => {
        if (overlay) {
          overlay.classList.add('hidden');
        }
      });
      video.addEventListener('pause', () => {
        if (overlay) {
          overlay.classList.remove('hidden');
        }
      });
    }
  }
})();
