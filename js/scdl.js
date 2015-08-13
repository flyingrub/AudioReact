const cID = "95a4c0ef214f2a4a0852142807b54b35"

var latestSongId;
var scAPI;

initSC();

function initSC(){
    scAPI = new ScAPI(cID)
    id = window.location.hash.replace('#','');
    if (id) {
        playThisSCsong(id);
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
        req.onerror = function() {
            alert("error with scAPI");
        }
        req.send();

    }
}

function displaySong() {
    var song = document.getElementById("song").value

    scAPI.get('/tracks', { q: song, limit: 200 }, function(tracks) {
        document.getElementById("result").style.visibility = "visible";
        document.getElementById("result").innerHTML = "";
        for (var track of tracks) {
            document.getElementById("result").innerHTML += "<p id="+track.id + " onclick=playThisSCsong("+ track.id +") >"+track.title+"</p>"
        }
        document.getElementById("hide").style.visibility = "visible"
    });
}

function playThisSCsong(id){
    latestSongId = id;
    changeUrl(id);
    scAPI.get('/tracks/' + id, function(track) {
        if (track.streamable) {
            aleaLoadSound(track.stream_url + "?client_id=" + cID)
        }
    });
}

function unPlayableSong() {
    if (document.getElementById(latestSongId)) {
        var song = document.getElementById(latestSongId).innerHTML
        document.getElementById("notification").style.visibility = "visible"
        document.getElementById("notification").innerHTML = "<p>"+ song + " is unplayable... <em>Blame soundcloud.</em></p>";   
    } else {
        document.getElementById("notification").style.visibility = "visible"
        document.getElementById("notification").innerHTML = "<p>This song is unplayable... <em>Blame soundcloud.</em></p>"; 
    }

}

document.getElementById('notification').onclick = function(event) {
    document.getElementById("notification").style.visibility = "hidden"
};

function hideResult(event) {
    document.getElementById("hide").style.visibility = "hidden"
    document.getElementById("result").style.visibility = "hidden"
    document.getElementById("result").innerHTML = "";
    //event.stopPropagation();
}

function changeUrl(id) {
    var stateObj = { id: id, song: document.getElementById("song").value };
    history.pushState(stateObj, id, "#"+id);
}