////////////////////////////////////////////////////////////////////////////////
// Cylinder creation: add glue code to make point-to-point cylinders
////////////////////////////////////////////////////////////////////////////////

/*global THREE, Coordinates, $, document, window, dat*/

var camera, scene, renderer;
var cameraControls, effectController;
var clock = new THREE.Clock();
var gridX = true;
var gridY = false;
var gridZ = false;
var axes = false;
var ground = false;
var sounds = null;


var lampMesh;
var duration = 10000;
var keyframes = 15, interpolation = duration / keyframes;
var lastKeyframe = 0, currentKeyframe = 0;


function addElements(){

    loader = new THREE.JSONLoader();
    loader.load( 'models/lamp_animated.js', function ( geometry ) {
        mat = new THREE.MeshPhongMaterial( { color: 0x888888, specular: 0x888888, shininess: 20, morphTargets: true } );
        lampMesh = new THREE.Mesh( geometry, mat );
        scene.add( lampMesh );
    } );
    
}


function fillScene() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x808080, 2000, 4000 );

    // LIGHTS
    var ambientLight = new THREE.AmbientLight( 0x222222 );
    var light = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light.position.set( 200, 400, 500 );
    var light2 = new THREE.DirectionalLight( 0xffffff, 1.0 );
    light2.position.set( -500, 250, -200 );

    scene.add(ambientLight);
    scene.add(light);
    scene.add(light2);

    if (ground) {Coordinates.drawGround({size:10000}); }
    if (gridX) { Coordinates.drawGrid({size:10000,scale:0.01});}
    if (gridY) { Coordinates.drawGrid({size:10000,scale:0.01, orientation:"y"});}
    if (gridZ) { Coordinates.drawGrid({size:10000,scale:0.01, orientation:"z"}); }
    if (axes) {Coordinates.drawAllAxes({axisLength:300,axisRadius:2,axisTess:50});}

    addElements();
}


function onWindowResize() {
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;

    renderer.setSize( canvasWidth, canvasHeight );
    camera.aspect = canvasWidth/ canvasHeight;
    camera.updateProjectionMatrix();
}


function init() {
    var canvasWidth = window.innerWidth;
    var canvasHeight = window.innerHeight;
    var canvasRatio = canvasWidth / canvasHeight;

    // RENDERER
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColorHex( 0xAAAAAA, 1.0 );

    var container = document.getElementById('container');
    container.appendChild( renderer.domElement );

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    // EVENTS
    window.addEventListener( 'resize', onWindowResize, false );

    // CAMERA
    camera = new THREE.PerspectiveCamera( 40, canvasRatio, 1, 10000 );
    camera.position.set( 50, 200, 500 );
    // CONTROLS
    cameraControls = new THREE.OrbitAndPanControls(camera, renderer.domElement);
    cameraControls.target.set(0,0,0);
    
    fillScene();


}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

function render() {
    var delta = clock.getDelta();
    cameraControls.update(delta);

    if ( effectController.newGridX !== gridX || effectController.newGridY !== gridY || effectController.newGridZ !== gridZ || effectController.newGround !== ground || effectController.newAxes !== axes)
    {
        gridX = effectController.newGridX;
        gridY = effectController.newGridY;
        gridZ = effectController.newGridZ;
        ground = effectController.newGround;
        axes = effectController.newAxes;

        fillScene();
    }

    if ( lampMesh ) {

                    // Alternate morph targets

                    var time = Date.now() % duration;

                    var keyframe = Math.floor( time / interpolation );

                    if ( keyframe != currentKeyframe ) {

                        lampMesh.morphTargetInfluences[ lastKeyframe ] = 0;
                        lampMesh.morphTargetInfluences[ currentKeyframe ] = 1;
                        lampMesh.morphTargetInfluences[ keyframe ] = 0;

                        lastKeyframe = currentKeyframe;
                        currentKeyframe = keyframe;

                        console.log( lampMesh.morphTargetInfluences );

                    }

                    lampMesh.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
                    lampMesh.morphTargetInfluences[ lastKeyframe ] = 1 - lampMesh.morphTargetInfluences[ keyframe ];
                    

                }
    
    renderer.render(scene, camera);
}



function setupGui() {

    effectController = {
        newGridX: gridX,
        newGridY: gridY,
        newGridZ: gridZ,
        newGround: ground,
        newAxes: axes
    };

    var gui = new dat.GUI();
    var h = gui.addFolder("Grid display");
    h.add( effectController, "newGridX").name("Show XZ grid");
    h.add( effectController, "newGridY" ).name("Show YZ grid");
    h.add( effectController, "newGridZ" ).name("Show XY grid");
    h.add( effectController, "newGround" ).name("Show ground");
    h.add( effectController, "newAxes" ).name("Show axes");
}


init();
setupGui();
animate();