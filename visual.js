var container;

var camera, scene, renderer;
alea = new Alea();

initDisplay();
animate();


document.getElementById('container').onclick = function(event) {
    if (alea.isPlaying) {
        alea.audioSource.stop();
        alea.isPlaying = false;
    } else if (alea.audioContext !== undefined) {
        alea.playSound();
        alea.isPlaying = true;
    }  else if (alea.file && !alea.loading && alea.audioContext === undefined) {
        alea.initAudio();
    }
};

function keyFilter(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
        displaySong();
    }
}

function initALea(audio) {
    if (alea.isPlaying) {
        alea.audioSource.stop();
        alea.isPlaying = false;
    }
    alea.file = audio
    alea.initAudio();
}

function initDisplay() {
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 600;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0x000000 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('container').appendChild( renderer.domElement );
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
        console.log(radius, outerRadius)

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

