var slideout = new Slideout({
    'panel': document.getElementById('nav'),
    'menu': document.getElementById('drawer'),
    'padding': 300,
    'tolerance': 70
});

document.querySelector('.toggle-button').addEventListener('click', function() {
    slideout.toggle();
});

document.getElementById('notification').onclick = function(event) {
    document.getElementById("notification").style.visibility = "hidden"
};

parseUrl();

function inputKeyFilter(event) {
    if (event.key == 'Enter') {
        event.preventDefault();
        displaySongs();
    } else if (event.keyCode && event.keyCode == 13) { // support old browser like chromium.
        event.preventDefault();
        displaySongs();
    }
}

function canvasKeyfilter(event) {
    //console.log(event.key, event.keyCode)
    if (event.key && event.key == 'f') {
        event.preventDefault();
        toggleFullScreen();
    } else if (event.keyCode && event.keyCode == 102) { // support old browser like chromium.
        event.preventDefault();
        toggleFullScreen();
    }
}

function isMob() {
    if( navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)
    ){
        return true;
    } else {
        return false;
    }
}

function parseUrl() {
    url = window.location.pathname.split("/");
    console.log(url)
    switch (url[1]) {
        case "user":
            displayUserFav(url[2]);
            break;
        case "track":
            playThisSCsong(url[2]);
            break;
    }
}

function toggleFullScreen() {
    container = document.getElementById('container');
    if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.mozRequestFullScreen) {
          container.mozRequestFullScreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
    }
}
