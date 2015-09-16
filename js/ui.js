// ELEMENT
function Navbar() {
    this.bar = document.getElementById('navbar');
    this.style = this.bar.style;
    this.mode = "normal"
    this.search = new NavSearch();

    this.isHidden = function() {
        return this.style.top != "0px";
    }

    this.hide = function () {
        this.style.top = "-4em";
        this.normalMode();
    }

    this.show = function () {
        this.style.top = "0px";
    }

    this.isInNormalMode = function() {
        return this.mode == "normal";
    }

    this.searchMode = function () {
        for (var i = 0; i < this.bar.childNodes.length; ++i) {
          var children = this.bar.childNodes[i];
          if (children.tagName == "SECTION" && children.id != "nav-search") {
              children.style.display = "none"
          }
        }
        this.search.searchMode();
        res.show()
        this.mode = "search"
    }

    this.normalMode = function() {
        for (var i = 0; i < this.bar.childNodes.length; ++i) {
            var children = this.bar.childNodes[i];
            if (children.tagName == "SECTION") {
                children.removeAttribute('style');
            }
        }
        this.search.normalMode();
        res.hide()
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
        this.style.margin = "0em 25%";
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
    ser = this;
    this.wrapper = document.getElementById('result-wrapper');
    this.style = this.wrapper.style;

    this.isHidden = function() {
        return this.style.display != "flex";
    }

    this.hide = function() {
        this.wrapper.removeAttribute('style');
    }

    this.show = function() {
        this.style.display = "flex";
    }

    this.search = function(tracks) {
        document.getElementById('result-header').innerHTML = searchHeaderToHtml();
        document.getElementById("get-tracks").onclick = function(){
            document.getElementById('get-tracks').className = "header-selected";
            document.getElementById("get-artists").className = "";
            getTracks(document.getElementById("search").value, ser.displayTracks);
        };
        document.getElementById("get-artists").onclick = function(){
            document.getElementById('get-tracks').className = "";
            document.getElementById("get-artists").className = "header-selected";
            getUsers(document.getElementById("search").value, ser.displayUsers)
        };
        ser.displayTracks(tracks);
    }

    function searchHeaderToHtml() {
        var search = document.getElementById("search").value
        track = "<p id=\"get-tracks\" class=\"header-selected\" >TRACKS</p>"
        artist = "<p id=\"get-artists\" >USERS</p>"
        return track + artist;
    }

    this.displayTracks = function(tracks) {
        var content = "";
        var counter = 0;
        if (tracks.length == 0) {
            content += noResultToHtml("tracks")
        }
        for (var track of tracks) {
            content += trackToHtml(track, counter);
            counter++;
        }
        document.getElementById('result-data').innerHTML = content;
    }

    function noResultToHtml(type) {
        first = "<div id=no-result>No "+ type + " found...</div>"
        br = "</br>"
        end = "Check the spelling, or try a different search.</div>"
        return first;
    }

    function trackToHtml(track, counter) {
        begin = "<div id=element-"+track.id + " class=\"result-element\">"
        title = "<p class=\"track-title\" id=title-"+track.id+" onclick=playFromNewTrackList("+ counter +") >"+track.title+"</p>"
        artist = "<p class=\"track-artist\" id=artist-"+ track.user_id + " onclick=showUser("+ track.user_id +") >by "+track.user.username+"</p>"
        end = "</div>"
        return begin + title + artist + end;
    }

    this.displayUsers = function(users) {
        var content = "";
        if (users.length == 0) {
            content += noResultToHtml("users")
        }
        for (var user of users) {
            content += userToHtml(user);
        }
        document.getElementById('result-data').innerHTML = content;
    }

    function userToHtml(user) {
        begin = "<div id=element-"+user.id + " class=\"result-element\">"
        username = "<p class=\"user-name\" id=title-"+user.id+" onclick=showUser("+ user.id +") >"+user.username+"</p>"
        followers = "<p class=\"user-followers\" id=artist-"+user.id + " onclick=showUser("+ user.id +") >"+user.followers_count+" followers</p>"
        end = "</div>"
        return begin + username + followers + end;
    }

    this.displayPlaylists = function(playlists) {
        var content = "";
        if (playlists.length == 0) {
            content += noResultToHtml("playlists")
        }
        for (var playlist of playlists) {
            content += playlistToHtml(playlist);
        }
        document.getElementById('result-data').innerHTML = content;
    }

    function playlistToHtml(playlist) {
        begin = "<div id=element-"+playlist.id + " class=\"result-element\">"
        title = "<p class=\"track-title\" id=title-"+playlist.id+" onclick=showPlaylist("+ playlist.id +") >"+playlist.title+"</p>"
        artist = "<p class=\"track-artist\" id=artist-"+ playlist.user_id + " onclick=showUser("+ playlist.user_id +") >by "+playlist.user.username+"</p>"
        end = "</div>"
        return begin + title + artist + end;
    }

    this.user = function(user) {
        document.getElementById('result-header').innerHTML = userHeaderToHtml(user.username);
        document.getElementById("get-fav").onclick = function(){
            document.getElementById('get-fav').className = "header-selected";
            document.getElementById("get-tracks").className = "";
            document.getElementById("get-playlist").className = "";
            getUserFav(user.id, ser.displayTracks);
        };
        document.getElementById("get-tracks").onclick = function(){
            document.getElementById('get-fav').className = "";
            document.getElementById("get-tracks").className = "header-selected";
            document.getElementById("get-playlist").className = "";
            getUserTracks(user.id, ser.displayTracks);
        };
        document.getElementById("get-playlist").onclick = function(){
            document.getElementById('get-fav').className = "";
            document.getElementById("get-tracks").className = "";
            document.getElementById("get-playlist").className = "header-selected";
            getUserPlaylists(user.id, ser.displayPlaylists);
        };
        getUserFav(user.id, ser.displayTracks);
    }

    function userHeaderToHtml(name) {
        title = "<h4 id=\"title\" >"+ name +"</h4>"
        favorites = "<p id=\"get-fav\" class=\"header-selected\" >FAVORITES</p>"
        tracks = "<p id=\"get-tracks\" >TRACKS</p>"
        playlist = "<p id=\"get-playlist\" >PLAYLIST</p>"
        return title + favorites + tracks + playlist;
    }
}

function LogoNavToggle() {
    this.style = document.getElementById('toggle-nav').style

    this.hide = function () {
        this.style.fill = "black"
        this.style.transform="rotate(0deg)"
    }

    this.show = function () {
        this.style.fill = "white"
        this.style.transform="rotate(180deg)"
    }
}

var nav = new Navbar();
var toggle = new LogoNavToggle();
var res = new Result();

// *****************
//      EVENT
// *****************
function toggleNav(event) {
    if (nav.isHidden()) {
        nav.show();
        toggle.show();
    } else {
        nav.hide();
        toggle.hide();
    }
}

function inputClick(event) {
    if (nav.isInNormalMode()) {
        nav.searchMode();
        getTracks(document.getElementById("search").value, res.search);
    }
}

function closeSearch(event) {
    nav.hide();
    toggle.hide();
}

function showUser(id) {
    getUser(id, res.user);
}

function showPlaylist(id) {
    getPlaylist(id, res.displayTracks)
}

function showCurrentPlaylist() {
    console.log("testtt");
    if (nav.isInNormalMode()) {
        nav.searchMode();
    }
    res.show();
}

function inputKeyFilter(event) {
    var search = document.getElementById("search").value
    if (event.key == 'Enter') {
        event.preventDefault();
        getTracks(search, res.search);
    } else if (event.keyCode && event.keyCode == 13) { // support old browser like chromium.
        event.preventDefault();
        getTracks(search, res.search);
    }
}
