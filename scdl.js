
clientId = "95a4c0ef214f2a4a0852142807b54b35"

SC.initialize({
	client_id: clientId,
});

var latestSongId;

function displaySong() {
	var song = document.getElementById("song").value

	SC.get('/tracks', { q: song, limit: 200 }, function(tracks) {
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
	SC.get('/tracks/' + id, function(track) {
		if (track.streamable) {
			try {
				initALea(track.stream_url + "?client_id=" + clientId)
			} catch (e) {
				alert("unplayable song")
			}
			
		}
	});
}

function unPlayableSong() {
	var song = document.getElementById(latestSongId).innerHTML
	document.getElementById("notification").style.visibility = "visible"
	document.getElementById("notification").innerHTML = "<h4>"+ song + " is unplayable...</h4>";
}

document.getElementById('notification').onclick = function(event) {
	document.getElementById("notification").style.visibility = "hidden"
};

function hideResult(event) {
	document.getElementById("hide").style.visibility = "hidden"
	document.getElementById("result").style.visibility = "hidden"
	document.getElementById("result").innerHTML = "";
	event.stopPropagation();
}