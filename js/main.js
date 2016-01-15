var audio = new Audio();

if (isMob()) {
    document.body.innerHTML = "<div id=mobile><h3>Mobile unsupported for now...</h3><h4>We'll see you on desktop ;)</h4></div>";
    throw new Error("Mobile unsupported for now aborting js execution");
} else {
    var player = document.getElementById('player')
    audio.init(player);
    visualInit()
    audio.load("https://onde.xyz/pbb");
}

function canvasKeyfilter(event) {
    //console.log(event.key, event.keyCode)
    if (event.key) {
        event.preventDefault();
        switch (event.key) {
            case " ":
                audio.toggle();
                break;
            case "f":
                toggleFullScreen();
                break;
        }
    } else if (event.keyCode) { // support old browser like chromium.
        event.preventDefault();
        switch (event.keyCode) {
            case 32:
                audio.toggle();
                break;
            case 102:
                toggleFullScreen();
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
}

function closeAbout() {
    document.getElementById("about").removeAttribute('style');
}

function showNotificationError() {
    document.getElementById("error").style.display = "inline";
}

function hideError() {
    document.getElementById("error").removeAttribute('style');
}
