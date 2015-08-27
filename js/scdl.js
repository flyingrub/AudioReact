const cID = "95a4c0ef214f2a4a0852142807b54b35"
const cID2 = "02gUJC0hH2ct1EGOcYXQIzRFU91c72Ea"

var scAPI;
var tracklist;
var currentTrackPos;
var currentTrack;

function scdlInit() {
    scAPI = new ScAPI(cID);
}

function ScAPI(clientId) {
    const apiURL = "https://api.soundcloud.com"
    this.clientId = clientId

    this.get = function (endpoint, parameter, call) {
        if (endpoint === undefined || parameter === undefined) {
            console.warn("no endpoint or function specified")
            return
        }

        if (parameter && {}.toString.call(parameter) === '[object Function]') {
            call = parameter
            parameter = undefined
        }

        url = apiURL + endpoint + "?client_id=" + this.clientId

        if (parameter !== undefined) {
            if (parameter.q){
                url = url + "&q=" + parameter.q
            }
            if (parameter.limit) {
                url = url + "&limit=" + parameter.limit
            }
        }

        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.responseType = "json";
        req.onload = function() {
            if (call !== undefined){
                call(req.response)
            }
        }
        req.onerror = function(e) {
            console.warn(e)
        }
        req.send();

    }
}

function getUsers() {
    var search = document.getElementById("search").value

    document.getElementById("spinner").style.visibility = "visible"

    scAPI.get('/users', { q: search, limit: 200 }, function(users) {
        document.getElementById("result").innerHTML = "";
        for (var user of users) {
            document.getElementById("result").innerHTML += "<p id="+user.id + " onclick=getUserFav("+ user.id +") >"+user.username+"</p>"
        }
        document.getElementById("spinner").style.visibility = "hidden"
    });
}

function getSongs() {
    var search = document.getElementById("search").value

    var counter = 0;
    document.getElementById("spinner").style.visibility = "visible"

    scAPI.get('/tracks', { q: search, limit: 200 }, function(tracks) {
        tracklist = tracks;
        document.getElementById("result").innerHTML = "";
        for (var track of tracks) {
            document.getElementById("result").innerHTML += "<p id="+track.id + " onclick=playFromTrackList("+ counter +") >"+track.title+"</p>"
            counter++;
        }
        document.getElementById("spinner").style.visibility = "hidden"
    });
}

function getUserFav(userId) {
    changeUrl("/user/", userId);

    var counter = 0;
    document.getElementById("spinner").style.visibility = "visible"

    scAPI.get("/users/" + userId + "/favorites", { limit: 200 }, function(tracks) {
        tracklist = tracks;
        document.getElementById("result").innerHTML = "";
        for (var track of tracks) {
            document.getElementById("result").innerHTML += "<p id="+track.id + " onclick=playFromTrackList("+ counter +") >"+track.title+"</p>"
            counter++;
        }
        document.getElementById("spinner").style.visibility = "hidden"
    });
}

function playFromTrackList(count) {
    if (currentTrack && document.getElementById(currentTrack.id)) {
        document.getElementById(currentTrack.id).className = ""
    }

    currentTrack = tracklist[count];
    currentTrackPos = count;

    changeUrl("/track/", currentTrack.id);
    document.getElementById(currentTrack.id).className = "selected-track"

    if (currentTrack.streamable) {
;
        audio.load(currentTrack.stream_url + "?client_id=" + cID)
    }
}

function playNextFromTracklist() {
    if (tracklist) {
        playFromTrackList(currentTrackPos + 1);
    }
}

function playPreviousFromTracklist() {
    if (tracklist) {
        playFromTrackList(currentTrackPos - 1);
    }
}

function playFromId(id){
    changeUrl("/track/", id);

    scAPI.get('/tracks/' + id, function(track) {
        currentTrack = track;
        if (track.streamable) {
            audio.load(track.stream_url + "?client_id=" + cID)
        }
    });
}

function changeUrl(path, id) {
    var stateObj = { id: id, search: document.getElementById("search").value };
    history.pushState(stateObj, id, path + id);
}
