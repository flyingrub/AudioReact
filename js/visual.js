var stats;
var camera, scene, renderer, rgbPass;


function visualInit() {
    console.log("init visual");
    initStat();
    initDisplay();
    animate();
}

function initStat() {
    stats = new Stats();
    stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '20px';
    stats.domElement.style.bottom = '20px';
    stats.domElement.style.display = "none";

    document.body.appendChild( stats.domElement );
}

function initDisplay() {
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 600;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor( 0x000000 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.getElementById('container').appendChild( renderer.domElement );

    renderer.domElement.setAttribute("tabindex", "1"); // so that it can focus
    renderer.domElement.setAttribute("onkeypress", "canvasKeyfilter(event)");

    // Post Process

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    rgbPass = new THREE.ShaderPass( THREE.RGBShiftShader );
    rgbPass.uniforms[ 'amount' ].value = 0.0005;
    rgbPass.renderToScreen = true;
    composer.addPass( rgbPass );
}

var lineNumber = 3;
var geometry;

function animate() {
    requestAnimationFrame( animate );
    render();
    stats.update();
}

function render() {
    if (audio.isPlaying) {
        playing()
    } else if (audio.isLoading) {
        loading()
    } else {
        idling()
    }
}

function beat() {
    lineNumber = getRandomInt(3, 9, lineNumber);
}

function playing() {
    audio.detectBeat();

    radius = Math.floor(audio.smoothedBass);
    outer = Math.floor(audio.smoothedVolume) + radius

    if (audio.beat) {
        beat();
        scene.rotation.z += 20;
        sens = Math.random() >= 0.5
    }
    if (audio.beatAmount > 0) {
        audio.beatAmount = audio.beatAmount - 0.2;
        if (sens) {
            scene.rotation.z += audio.beatAmount / 300;
        } else {
            scene.rotation.z -= audio.beatAmount / 300;
        }
        rgbPass.uniforms[ 'amount' ].value = audio.beatAmount / 2000 +  0.0015;
    } else {
        scene.rotation.y = 0;
    }
    geometry = new THREE.RingGeometry( radius, outer , lineNumber);

    var material = new THREE.MeshDepthMaterial();

    var form = new THREE.Mesh( geometry, material );
    scene.add( form );
    composer.render();
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
    composer.render();
    scene.remove( form );
}

function idling() {
    scene.rotation.z += 0.002

    var geometry = new THREE.RingGeometry( 50, 100 , 3);
    var material = new THREE.MeshDepthMaterial();

    var form = new THREE.Mesh( geometry, material );
    scene.add( form );
    composer.render();
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
