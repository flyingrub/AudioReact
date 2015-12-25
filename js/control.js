function PlayToggle() {
    this.style = document.getElementById('play-toggle').style
    this.linePause = document.getElementById('line-pause')
    this.linePlay = document.getElementById('line-play')

    this.play = function () {
        this.style.transform="rotate(+45deg)"
        this.linePlay.style.visibility = "visible"
        this.linePlay.style.stroke = "white"
        this.linePause.style.stroke = "black"
        this.linePause.style.visibility = "hidden"
    }

    this.pause = function () {
        this.linePause.style.visibility = "visible"
        this.style.transform="rotate(0deg)"
        this.linePlay.style.stroke = "black"
        this.linePause.style.stroke ="white"
        this.linePlay.style.visibility = "hidden"
    }
}

var playToggle = new PlayToggle();
playToggle.play();

function togglePlay(event) {
    audio.toggle()
    if (audio.isPlaying) {
        playToggle.pause();
    } else {
        playToggle.play();
    }
}

function onClickProgress(event) {
    bar = document.getElementById("progress-bar");
    newTime = audio.player.duration * ((event.pageX - bar.offsetLeft) / bar.clientWidth);
    audio.player.currentTime = newTime;
}

function updateTimeAudio() {
    document.getElementById("current-time").innerHTML = timeToString(audio.player.currentTime);
    document.getElementById("remaining-time").innerHTML = "- " + timeToString(audio.player.duration -  audio.player.currentTime);
    document.getElementById("progress").style.width = audio.player.currentTime / audio.player.duration  * 100 + "%"
}

function timeToString(time) {
    var totalSec = Math.floor(time);
    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var seconds = totalSec % 60;

    hours = (hours < 10 ? "0" + hours : hours)
    minutes = (minutes < 10 ? "0" + minutes : minutes)
    seconds = (seconds < 10 ? "0" + seconds : seconds)

    var r = (hours == "00" ? "" : hours + ":") + (minutes == "00" ? "0:" : minutes + ":") + seconds;
    return r;
}

function updateCurrentTrack(track, things) {
    document.getElementById('track-info').innerHTML = track.title;
    document.getElementById('playing-from').innerHTML = "Playing from " + things;
    if (things == "a single track") {
        document.getElementById('playing-from').onclick = "";
        document.getElementById('play-previous').style.display = "none"
        document.getElementById('play-next').style.display = "none"
    } else {
        document.getElementById('playing-from').onclick = showCurrentPlaylist;
        document.getElementById('play-previous').removeAttribute("style");
        document.getElementById('play-next').removeAttribute("style");
    }
}
