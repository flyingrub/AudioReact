// ELEMENT
function Navbar() {
    this.bar = document.getElementById('navbar');
    this.style = this.bar.style;
    this.mode = "normal"
    this.search = new NavSearch();
    this.result = new Result();

    this.isHidden = function() {
        return this.style.top == "0px";
    }

    this.hide = function () {
        this.style.top = "-4em";
    }

    this.show = function () {
        this.style.top = "0px";
    }

    this.isInNormalMode = function() {
        return this.mode == "normal";
    }

    this.searchMode = function () {
        var childrens = this.bar.childNodes;
        for (var i = 0; i < childrens.length; i++) {
            children = childrens[i];
            if (children.tagName == "SECTION" && children.id != "nav-search") {
                children.style.display = "none"
            }
        }
        this.search.searchMode();
        this.result.show()
        this.mode = "search"
    }

    this.normalMode = function() {
        var childrens = this.bar.childNodes;
        for (var i = 0; i < childrens.length; i++) {
            children = childrens[i];
            if (children.tagName == "SECTION") {
                children.removeAttribute('style');
            }
        }
        this.search.normalMode();
        this.result.hide()
        this.mode = "normal"
    }
}

function NavSearch() {
    this.search = document.getElementById('nav-search');
    this.style = this.search.style;
    this.input = document.getElementById('search');
    this.closeButton = document.getElementById('close-search');

    this.searchMode = function () {
        this.style.borderLeft = "1px solid #616161";
        this.style.margin = "0em 35em";
        this.input.style.marginLeft = "2.5em";
        this.closeButton.style.display = "inline"
    }

    this.normalMode = function() {
        this.search.removeAttribute('style');
        this.input.removeAttribute('style');
        this.closeButton.removeAttribute('style');
    }
}

function Result() {
    this.wrapper = document.getElementById('result-wrapper');
    this.res = document.getElementById('result');
    this.style = this.wrapper.style;

    this.hide = function() {
        this.wrapper.removeAttribute('style');
    }

    this.show = function() {
        this.style.display = "flex";
    }

    this.displayTracks = function() {

    }
}

function LogoNavToggle() {
    this.style = document.getElementById('toggle-nav').style

    this.hide = function () {
        this.style.fill = "black"
    }

    this.show = function () {
        this.style.fill = "white"
    }
}

// *****************
//      EVENT
// *****************
function toggleNav(event) {
    var nav = new Navbar();
    var toggle = new LogoNavToggle();
    if (nav.isHidden()) {
        nav.hide();
        toggle.hide();
    } else {
        nav.show();
        toggle.show();
    }
}

function inputClick(event) {
    var nav = new Navbar();
    if (nav.isInNormalMode()) {
        nav.searchMode();
    }
}

function closeSearch(event) {
    var nav = new Navbar();
    nav.normalMode();
}

function inputKeyFilter(event) {

    if (event.key == 'Enter') {
        event.preventDefault();
        displaySongs();
    } else if (event.keyCode && event.keyCode == 13) { // support old browser like chromium.
        event.preventDefault();
        displaySongs();
    }
}
