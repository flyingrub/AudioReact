var container;
var stats;

var camera, scene, renderer, rgbPass;
var alea = new Alea();

initStat();
if (isMob()) {
    document.body.innerHTML = "<div id=mobile><h3>Mobile unsupported for now...</h3><h4>We'll see you on desktop ;)</h4></div>";
} else {
    initDisplay();
    animate();
}

document.getElementById('container').onclick = function(event) {
    if (alea.isPlaying) {
        alea.stopSound();
    }  else if (alea.url && !alea.isLoading) {
        alea.playSound();
    }
};

function aleaLoadSound(audio) {
    alea.stopSound();
    alea.url = audio
    alea.initAudio();
}

function initStat() {
    stats = new Stats();
    stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '20px';
    stats.domElement.style.top = '20px';

    document.body.appendChild( stats.domElement );
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

    // ------ test ----- \\
    scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

    object = new THREE.Object3D();
    scene.add( object );

    var geometry = new THREE.SphereGeometry( 1, 4, 4 );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } );

    scene.add( new THREE.AmbientLight( 0x222222 ) );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    scene.add( new THREE.AmbientLight( 0x222222 ) );

    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    // Post Process

    composer = new THREE.EffectComposer( renderer );
    composer.addPass( new THREE.RenderPass( scene, camera ) );

    //var effect = new THREE.ShaderPass( THREE.DotScreenShader );
    //effect.uniforms[ 'scale' ].value = 4;
    //composer.addPass( effect );

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
        sens = Math.random() >= 0.5
    } 
    if (alea.beatAmount > 0) {
        alea.beatAmount = alea.beatAmount - 0.2;
        if (sens) {
            scene.rotation.z += alea.beatAmount / 300;
        } else {
            scene.rotation.z -= alea.beatAmount / 300;
        }
        rgbPass.uniforms[ 'amount' ].value = alea.beatAmount / 2000 +  0.0015;
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

