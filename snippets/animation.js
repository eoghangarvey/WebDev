if ( mesh ) {

					// Alternate morph targets

					var time = Date.now() % duration;

					var keyframe = Math.floor( time / interpolation );

					if ( keyframe != currentKeyframe ) {

						mesh.morphTargetInfluences[ lastKeyframe ] = 0;
						mesh.morphTargetInfluences[ currentKeyframe ] = 1;
						mesh.morphTargetInfluences[ keyframe ] = 0;

						lastKeyframe = currentKeyframe;
						currentKeyframe = keyframe;

						// console.log( mesh.morphTargetInfluences );

					}

					mesh.morphTargetInfluences[ keyframe ] = ( time % interpolation ) / interpolation;
					mesh.morphTargetInfluences[ lastKeyframe ] = 1 - mesh.morphTargetInfluences[ keyframe ];

				}