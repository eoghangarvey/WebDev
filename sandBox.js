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

var FLOOR = -250;


function ensureLoop( animation ) {

        for ( var i = 0; i < animation.hierarchy.length; i ++ ) {

            var bone = animation.hierarchy[ i ];

            var first = bone.keys[ 0 ];
            var last = bone.keys[ bone.keys.length - 1 ];

            last.pos = first.pos;
            last.rot = first.rot;
            last.scl = first.scl;

        }

    }


function createScene( geometry, x, y, z, s ) {

    ensureLoop( geometry.animation );
    console.log(geometry);
    geometry.computeBoundingBox();
    var bb = geometry.boundingBox;

    THREE.AnimationHandler.add( geometry.animation );

    for ( var i = 0; i < geometry.materials.length; i ++ ) {

        var m = geometry.materials[ i ];
        m.skinning = true;

        m.wrapAround = true;

        if ( m.uniforms ) {

            m.uniforms.wrapRGB.value.set( 0.75, 0.5, 0.5 );

        }

        if ( m.name === "archvile_hand" ) {

            m.metal = true;
            m.emissive.setRGB( 0.95, 0.95, 0.95 );

            m.polygonOffset = true;
            m.polygonOffsetFactor = -3;
            m.polygonOffsetUnits = 1;

        }

        if ( m.name === "cyberdemon_body" ) {

            m.metal = true;

        }

    }


    var mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial() );
    mesh.position.set( x - 200, y - bb.min.y * s, z );
    mesh.scale.set( s, s, s );
    mesh.rotation.y = Math.PI * -0.5;
    scene.add( mesh );

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    animation = new THREE.Animation( mesh, geometry.animation.name );
    animation.interpolationType = THREE.AnimationHandler.LINEAR;

    animation.play( true, Math.random() * 1 );

}


function addElements(){
    var scale = 5;
    var dy = 15;

    // var loader = new THREE.JSONLoader(),
    //                 callback = function( geometry ) { createScene( geometry,  0, FLOOR, 0, 7 ) };

    // loader.load( "models/imp2.js", function( geometry ) {
    //     createScene( geometry,  -300, FLOOR - dy, -400, scale * 1.05 );
    // } );
    loader = new THREE.JSONLoader();
        loader.load( 'models/waltHeadLo.js', function ( geometry ) {
        var mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial() );
        scene.add( mesh );
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

   //addElements();
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

    //THREE.AnimationHandler.update( delta );
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
addElements();
setupGui();
animate();