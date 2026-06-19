function initMoviePlayer(videoUrl, videoId) {
    var video = document.getElementById(videoId || "movie-video");
    var layer = document.querySelector("[data-player-layer]");
    var started = false;

    function start() {
        if (!video || started) {
            return;
        }
        started = true;
        if (layer) {
            layer.classList.add("is-hidden");
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = videoUrl;
            video.play();
            return;
        }

        if (window.Hls && Hls.isSupported()) {
            var hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
            return;
        }

        video.src = videoUrl;
        video.play();
    }

    if (layer) {
        layer.addEventListener("click", start);
    }
    if (video) {
        video.addEventListener("click", start);
    }
}
