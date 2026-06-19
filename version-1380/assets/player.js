(function () {
  var video = document.getElementById('movie-player');
  var startButton = document.querySelector('[data-player-start]');

  if (!video) {
    return;
  }

  var source = video.getAttribute('data-hls') || '';
  var hlsInstance = null;

  function attachSource() {
    if (!source) {
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hlsInstance.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hlsInstance.recoverMediaError();
        } else {
          hlsInstance.destroy();
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else {
      video.src = source;
    }
  }

  function playVideo() {
    attachSource();
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
    if (startButton) {
      startButton.classList.add('is-hidden');
    }
  }

  attachSource();

  if (startButton) {
    startButton.addEventListener('click', playVideo);
  }

  video.addEventListener('play', function () {
    if (startButton) {
      startButton.classList.add('is-hidden');
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
