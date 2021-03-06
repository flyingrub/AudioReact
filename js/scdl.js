const cID = "95a4c0ef214f2a4a0852142807b54b35"
const cID2 = "02gUJC0hH2ct1EGOcYXQIzRFU91c72Ea"

var scAPI;
var playingTrackList;
var loadedTrackList;

function scdlInit() {
    scAPI = new ScAPI(cID);
}

function ScAPI(clientId) {
    const apiURL = "https://api.soundcloud.com"
    this.clientId = clientId

    this.get = function (endpoint, parameter, callback) {
        if (endpoint === undefined || parameter === undefined) {
            console.warn("no endpoint or function specified")
            return
        }

        if (parameter && {}.toString.call(parameter) === '[object Function]') {
            callback = parameter
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
            if (callback !== undefined){
                callback(req.response)
            }
        }
        req.onerror = function(e) {
            console.warn(e)
        }
        req.send();
    }
}

function TrackList(tracks) {
    this.tracks = tracks;
    this.currentTrackPos;
    this.currentTrack;
    this.currentUser;
    this.playFrom;
}

function getUsers(search, callback) {
    changeUrl("/search/" + search + "/users", search);
    scAPI.get('/users', { q: search, limit: 200 }, function(users) {
        callback(users);
    });
}

function getTracks(search, callback) {
    changeUrl("/search/" + search + "/tracks", search);
    scAPI.get('/tracks', { q: search, limit: 200 }, function(tracks) {
        loadedTrackList = new TrackList(tracks);
        loadedTrackList.playFrom = "search results"
        callback(tracks);
    });
}

function getUser(userId, callback) {
    scAPI.get("/users/" + userId, { limit: 200 }, function(user) {
        currentUser = user;
        callback(user);
    });
}

function getUserFav(userId, callback) {
    changeUrl("/users/" + userId + "/favorites", userId);
    scAPI.get("/users/" + userId + "/favorites", { limit: 200 }, function(tracks) {
        loadedTrackList = new TrackList(tracks);
        loadedTrackList.playFrom = currentUser.username + "\'s likes"
        callback(tracks);
    });
}

function getUserTracks(userId, callback) {
    changeUrl("/users/" + userId + "/tracks", userId);
    scAPI.get("/users/" + userId + "/tracks", { limit: 200 }, function(tracks) {
        loadedTrackList = new TrackList(tracks);
        loadedTrackList.playFrom = currentUser.username + "\'s tracks"
        callback(tracks);
    });
}

function getUserPlaylists(userId, callback) {
    changeUrl("/users/" + userId + "/playlists", userId);
    scAPI.get("/users/" + userId + "/playlists", { limit: 200 }, function(playlists) {
        callback(playlists);
    });
}

function getPlaylist(id, callback) {
    changeUrl("/playlists/" + id, id);
    scAPI.get("/playlists/" + id, { limit: 200 }, function(playlist) {
        loadedTrackList = new TrackList(playlist.tracks);
        loadedTrackList.playFrom = playlist.title;
        callback(playlist.tracks);
    });
}

function playFromNewTrackList(count) {
    playingTrackList = loadedTrackList;
    playFromTrackList(count);
}

function playFromTrackList(count) {
    currentTrack = playingTrackList.currentTrack;
    if (currentTrack && document.getElementById("title-" + currentTrack.id)) {
        document.getElementById("title-" + currentTrack.id).className = "track-title";
    }

    playingTrackList.currentTrack = playingTrackList.tracks[count];
    playingTrackList.currentTrackPos = count;

    currentTrack = playingTrackList.currentTrack;
    changeUrl("/track/" + currentTrack.id, currentTrack.id);

    trackHtml = document.getElementById("title-" + currentTrack.id);
    if(trackHtml) {
        trackHtml.className += " selected-track";
    }
    
    if (currentTrack.streamable) {
        audio.load(currentTrack.stream_url + "?client_id=" + cID)
    }
    playToggle.pause();
    updateCurrentTrack(currentTrack, playingTrackList.playFrom);
}

function playNextFromTracklist() {
    if (playingTrackList) {
        playFromTrackList(playingTrackList.currentTrackPos + 1);
    }
    playToggle.pause();
}

function playPreviousFromTracklist() {
    if (playingTrackList) {
        playFromTrackList(playingTrackList.currentTrackPos - 1);
    }
    playToggle.pause();
}

function playFromId(id){
    changeUrl("/track/" + id, id);

    scAPI.get('/tracks/' + id, function(track) {
        loadedTrackList = new TrackList([track]);
        playingTrackList  = new TrackList([track]);
        if (track.streamable) {
            audio.load(track.stream_url + "?client_id=" + cID)
            playToggle.pause();
            updateCurrentTrack(playingTrackList.tracks[0], "a single track");
        }
    });
}

function changeUrl(path, id) {
    var stateObj = { id: id, search: document.getElementById("search").value };
    history.pushState(stateObj, id, path);
}
