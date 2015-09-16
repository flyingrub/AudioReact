var audio = new Audio();

if (isMob()) {
    document.body.innerHTML = "<div id=mobile><h3>Mobile unsupported for now...</h3><h4>We'll see you on desktop ;)</h4></div>";
    throw new Error("Mobile unsupported for now aborting js execution");
} else {
    var player = document.getElementById('player')
    audio.init(player);
    visualInit()
    scdlInit();
    parseUrl();
}

function canvasKeyfilter(event) {
    //console.log(event.key, event.keyCode)
    if (event.key) {
        event.preventDefault();
        switch (event.key) {
            case " ":
                togglePlay();
                break;
            case "f":
                toggleFullScreen();
                break;
            case "ArrowDown":

                break;
            case "ArrowUp":

                break;
            case "ArrowLeft":
                playPreviousFromTracklist();
                break;
            case "ArrowRight":
                playNextFromTracklist();
                break;
        }
    } else if (event.keyCode) { // support old browser like chromium.
        event.preventDefault();
        switch (event.keyCode) {
            case 32:
                togglePlay();
                break;
            case 102:
                toggleFullScreen();
                break;
            case 40:

                break;
            case 38:

                break;
            case 37:
                playPreviousFromTracklist();
                break;
            case 39:
                playNextFromTracklist();
                break;
        }
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
        case "users":
            nav.show();
            nav.searchMode();
            getUser(url[2], res.user);
            switch (url[3]) {
                case "tracks":
                    break;
                case "playlists":
                    document.getElementById('get-fav').className = "";
                    document.getElementById("get-tracks").className = "";
                    document.getElementById("get-playlist").className = "header-selected";
                    getUserPlaylists(url[2], ser.displayPlaylists);
                    break;
            }
            break;
        case "track":
            playFromId(url[2]);
            break;
        case "search":
            nav.show();
            nav.searchMode();
            getTracks(search, res.search);
            switch (url[2]) {
                case "users":
                    document.getElementById('get-tracks').className = "";
                    document.getElementById("get-artists").className = "header-selected";
                    getUsers(document.getElementById("search").value, ser.displayUsers);
                    break;
            }
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

function showAbout() {
    document.getElementById("about").style.display = "inline";
    nav.hide();
    toggle.hide();
}

function closeAbout() {
    document.getElementById("about").removeAttribute('style');
}

function showNotificationError() {
    playToggle.play();
    document.getElementById("error").style.display = "inline";
}

function hideError (argument) {
    document.getElementById("error").removeAttribute('style');
}
