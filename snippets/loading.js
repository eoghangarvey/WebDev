
loader = new THREE.JSONLoader();
    loader.load( 'xxx.js', function ( geometry ) {
    mat = new THREE.MeshPhongMaterial( { color: 0x888888, specular: 0x888888, shininess: 20, morphTargets: true } );
    mesh = new THREE.Mesh( geometry, mat );
    scene.add( mesh );
} );


loader = new THREE.JSONLoader();
loader.load( 'models/WaltHeadLo.js', function ( geometry ) {

	mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial( { overdraw: true } ) );
	scene.add( mesh );

} );