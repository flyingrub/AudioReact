const cID = "95a4c0ef214f2a4a0852142807b54b35"
const cID2 = "02gUJC0hH2ct1EGOcYXQIzRFU91c72Ea"

var latestSongId;
var scAPI;

initSC();

function initSC(){
    scAPI = new ScAPI(cID)
    param = window.location.hash.replace('#','');
    if (param.search("user:") != -1) {
        displayUserFav(param.replace("user:",''));
    } else if (param.search("song:") != -1) {
        playThisSCsong(param.replace("song:",''))
    }
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

function displaySongs() {
    var search = document.getElementById("search").value

    document.getElementById("spinner").style.visibility = "visible"
    scAPI.get('/tracks', { q: search, limit: 200 }, function(tracks) {
        slideout.open();
        document.getElementById("result").innerHTML = "";
        for (var track of tracks) {
            document.getElementById("result").innerHTML += "<p id="+track.id + " onclick=playThisSCsong("+ track.id +") >"+track.title+"</p>"
        }
        document.getElementById("spinner").style.visibility = "hidden"
    });
}

function displayUsers() {
    var search = document.getElementById("search").value

    document.getElementById("spinner").style.visibility = "visible"
    scAPI.get('/users', { q: search, limit: 200 }, function(users) {
        slideout.open();
        document.getElementById("result").innerHTML = "";
        for (var user of users) {
            document.getElementById("result").innerHTML += "<p id="+user.id + " onclick=displayUserFav("+ user.id +") >"+user.username+"</p>"
        }
        document.getElementById("spinner").style.visibility = "hidden"
    });
}

function displayUserFav(id) {
    changeUrl("user:" + id);
    
    scAPI.get("/users/" + id + "/favorites", { limit: 200 }, function(tracks) {
        slideout.open();
        document.getElementById("result").innerHTML = "";
        for (var track of tracks) {
            document.getElementById("result").innerHTML += "<p id="+track.id + " onclick=playThisSCsong("+ track.id +") >"+track.title+"</p>"
        }
    });
}

function playThisSCsong(id){
    latestSongId = id;
    changeUrl("song:" + id);
    slideout.close();
    scAPI.get('/tracks/' + id, function(track) {
        if (track.streamable) {
            aleaLoadSound(track.stream_url + "?client_id=" + cID)
        }
    });
}

function unPlayableSong() {
    slideout.open();
    if (document.getElementById(latestSongId)) {
        var song = document.getElementById(latestSongId).innerHTML
        document.getElementById("notification").style.visibility = "visible"
        document.getElementById("notification").innerHTML = "<p>"+ song + " is unplayable... <em>Blame soundcloud.</em></p>";   
    } else {
        document.getElementById("notification").style.visibility = "visible"
        document.getElementById("notification").innerHTML = "<p>This song is unplayable... <em>Blame soundcloud.</em></p>"; 
    }

}

function changeUrl(id) {
    var stateObj = { id: id, song: document.getElementById("search").value };
    history.pushState(stateObj, id, "#"+id);
}