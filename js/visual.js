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

function animate() {
    requestAnimationFrame( animate );
    render();
}

function render() {
    if (alea.isPlaying) {
        alea.detectBeat();

        var radius = Math.floor(alea.bass/150);

        var outerRadius = Math.floor(alea.volume/100)
        //console.log(radius, outerRadius)

        var beat = radius > 120
        if (beat) {
            scene.rotation.z += 0.01
        }
        var geometry = new THREE.RingGeometry( radius, outerRadius + radius , 3);
        var material = new THREE.MeshDepthMaterial();
        
        var form = new THREE.Mesh( geometry, material );
        scene.add( form );
        renderer.render( scene, camera );
        scene.remove( form );

        geometry.dispose();
        material.dispose();
    } else if (alea.isLoading) {
        scene.rotation.z -= 0.05
        
        var geometry = new THREE.RingGeometry( 50, 100 , 3);
        var material = new THREE.MeshDepthMaterial();
        
        var form = new THREE.Mesh( geometry, material );
        scene.add( form );
        renderer.render( scene, camera );
        scene.remove( form );
    } else {
        scene.rotation.z += 0.002
        
        var geometry = new THREE.RingGeometry( 50, 100 , 3);
        var material = new THREE.MeshDepthMaterial();
        
        var form = new THREE.Mesh( geometry, material );
        scene.add( form );
        renderer.render( scene, camera );
        scene.remove( form );
    }


}

window.onresize = function(event) {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

