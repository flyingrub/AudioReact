var container;

var camera, scene, renderer;
var alea = new Alea();

initDisplay();
animate();


document.getElementById('container').onclick = function(event) {
    if (alea.isPlaying) {
        alea.stopSound();
    }  else if (alea.url && !alea.isLoading) {
        alea.playSound();
    }
};

function keyFilter(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        displaySong();
    }
}

function aleaLoadSound(audio) {
    alea.stopSound();
    alea.url = audio
    alea.initAudio();
}

function initDisplay() {
    if (isMob()) {
        document.body.innerHTML += "<div id=mobile><h3>Mobile unsupported for now...</h3><h4>We'll see you on desktop ;)</h4></div>";
        document.getElementById('form').style.display = "none"
    } else {
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 600;

        scene = new THREE.Scene();

        renderer = new THREE.WebGLRenderer();
        renderer.setClearColor( 0x000000 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById('container').appendChild( renderer.domElement );
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

var lineNumber = 3;
var geometry;

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    if (alea.isPlaying) {
        playing()
    } else if (alea.isLoading) {
        loading()
    } else {
        idling()
    }
}

function beat() {
    lineNumber = getRandomInt(3, 9, lineNumber);
}

function playing() {
    alea.detectBeat();

    radius = Math.floor(alea.smoothedBass);
    outer = Math.floor(alea.smoothedVolume) + radius

    if (alea.beat) {
        beat();
        scene.rotation.z += 20;
    } 
    if (alea.beatAmount > 2) {
        alea.beatAmount = alea.beatAmount - 0.4;
        //scene.position.x = getRandomInt( -alea.beatAmount, alea.beatAmount, 0)
        //scene.position.y = getRandomInt( -alea.beatAmount, alea.beatAmount, 0)
        scene.rotation.y = getRandom(-0.1, 0.1, 0);
        scene.rotation.x = getRandom(-0.1, 0.1, 0);
    } else {
        scene.rotation.y = 0;
        scene.rotation.x = 0;
        scene.position.x = 0
        scene.position.y = 0
    }
    geometry = new THREE.RingGeometry( radius, outer , lineNumber);   

    var material = new THREE.MeshDepthMaterial();
    
    var form = new THREE.Mesh( geometry, material );
    scene.add( form );
    renderer.render( scene, camera );
    scene.remove( form );

    geometry.dispose();
    material.dispose();
}

function loading() {
    scene.rotation.z -= 0.05
    
    var geometry = new THREE.RingGeometry( 50, 100 , 3);
    var material = new THREE.MeshDepthMaterial();
    
    var form = new THREE.Mesh( geometry, material );
    scene.add( form );
    renderer.render( scene, camera );
    scene.remove( form );
}

function idling() {
    scene.rotation.z += 0.002
    
    var geometry = new THREE.RingGeometry( 50, 100 , 3);
    var material = new THREE.MeshDepthMaterial();
    
    var form = new THREE.Mesh( geometry, material );
    scene.add( form );
    renderer.render( scene, camera );
    scene.remove( form );
}

function getRandomInt(min, max, not) {
    var rand;
    rand = Math.floor(Math.random() * (max - min)) + min;
    while (rand == not) {
        rand = Math.floor(Math.random() * (max - min)) + min;
    }
    return rand;
}

function getRandom(min, max, not) {
    var rand;
    rand = Math.random() * (max - min) + min;
    while (rand == not) {
        rand = Math.random() * (max - min) + min;
    }
    return rand;
}

window.onresize = function(event) {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

