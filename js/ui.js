var slideout = new Slideout({
    'panel': document.getElementById('nav'),
    'menu': document.getElementById('drawer'),
    'padding': 300,
    'tolerance': 70
});

// Toggle button
document.querySelector('.toggle-button').addEventListener('click', function() {
    slideout.toggle();
});

function keyFilter(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        displaySongs();
    }
}

document.getElementById('notification').onclick = function(event) {
    document.getElementById("notification").style.visibility = "hidden"
};

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