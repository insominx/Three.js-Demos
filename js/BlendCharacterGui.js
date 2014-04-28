/**
 * @author Michael Guerrero / http://realitymeltdown.com
 */

function BlendCharacterGui( animations ) {

	var controls = {

		gui: null,
		"Lock Camera": false,
		"Show Model": true,
		"Show Skeleton": true,
		"Time Scale": 1.0,
		"Step Size": 0.016,
		"Crossfade Time": 3.5,
		"Bone Influence": '',
		"Anim 1": '',
		"Weight 1": 0.33,
		"Anim 2": '',
		"Weight 2": 0.33,
		"Anim 3": '',
		"Weight 3": 0.33

	};

	var animations = animations;

	// -------------------------------------------------------------------------
	this.shouldShowSkeleton = function() {

		return controls['Show Skeleton'];

	};

	// -------------------------------------------------------------------------
	this.getTimeScale = function() {

		return controls['Time Scale'];

	};

	// -------------------------------------------------------------------------
	this.update = function() {

		controls[ 'Weight 1'] = animations[ controls[ 'Anim 1' ] ].weight;
		controls[ 'Weight 2'] = animations[ controls[ 'Anim 2' ] ].weight;
		controls[ 'Weight 3'] = animations[ controls[ 'Anim 3' ] ].weight;

	};

	// -------------------------------------------------------------------------
	var init = function() {

		controls.gui = new dat.GUI();

		var settings = controls.gui.addFolder( 'Settings' );
		var playback = controls.gui.addFolder( 'Playback' );
		var blending = controls.gui.addFolder( 'Blend Tuning' );

		var bones = [];
		var skeleton = animations[ Object.keys( animations )[ 0 ] ].root.skeleton;
		for (var i = 0; i < skeleton.bones.length; ++i ) {
			bones.push( skeleton.bones[ i ].name );
		}

		settings.add( controls, "Lock Camera" ).onChange( controls.lockCameraChanged );
		settings.add( controls, "Show Model" ).onChange( controls.showModelChanged );
		settings.add( controls, "Show Skeleton" ).onChange( controls.showSkeletonChanged );
		settings.add( controls, "Time Scale", 0, 1, 0.01 );
		settings.add( controls, "Step Size", 0.01, 0.1, 0.01 );
		settings.add( controls, "Crossfade Time", 0.1, 6.0, 0.05 );
		settings.add( controls, "Bone Influence", bones ).onChange( controls.boneInfluenceChanged );

		// These controls execute functions
		playback.add( controls, "start" );
		playback.add( controls, "pause" );
		playback.add( controls, "step" );
		playback.add( controls, "crossfade 1 to 2" );
		playback.add( controls, "crossfade 2 to 3" );
		playback.add( controls, "warp 2 to 3" );

		var nameList = Object.keys(animations);
		controls[ "Anim 1" ] = nameList[0];
		controls[ "Anim 2" ] = nameList[1] || 'none';
		controls[ "Anim 3" ] = nameList[2] || 'none';

		blending.add( controls, "Anim 1", nameList ).onChange( controls.stop );
		blending.add( controls, "Anim 2", nameList ).onChange( controls.stop );
		blending.add( controls, "Anim 3", nameList ).onChange( controls.stop );
		blending.add( controls, "Weight 1", 0, 1, 0.01).listen().onChange( controls.weight );
		blending.add( controls, "Weight 2", 0, 1, 0.01).listen().onChange( controls.weight );
		blending.add( controls, "Weight 3", 0, 1, 0.01).listen().onChange( controls.weight );

		settings.open();
		playback.open();
		blending.open();

	}

	// -------------------------------------------------------------------------
	var getAnimationData = function() {

		return {

			detail: {

				anims: [ controls["Anim 1"],
								 controls["Anim 2"],
								 controls["Anim 3"] ],

				weights: [ controls['Weight 1'],
									 controls['Weight 2'],
									 controls['Weight 3'] ]
			}

		};
	}

	// -------------------------------------------------------------------------
	controls.start = function() {

		var startEvent = new CustomEvent( 'start-animation', getAnimationData() );
		window.dispatchEvent(startEvent);

	};

	// -------------------------------------------------------------------------
	controls.stop = function() {

		var stopEvent = new CustomEvent( 'stop-animation' );
		window.dispatchEvent( stopEvent );

	};

	// -------------------------------------------------------------------------
	controls.pause = function() {

		var pauseEvent = new CustomEvent( 'pause-animation' );
		window.dispatchEvent( pauseEvent );

	};

	// -------------------------------------------------------------------------
	controls.step = function() {

		var stepData = { detail: { stepSize: controls['Step Size'] } };
		window.dispatchEvent( new CustomEvent('step-animation', stepData ));

	};

	// -------------------------------------------------------------------------
	controls.weight = function() {

		// renormalize
		var sum = controls['Weight 1'] + controls['Weight 2'] + controls['Weight 3'];
		controls['Weight 1'] /= sum;
		controls['Weight 2'] /= sum;
		controls['Weight 3'] /= sum;

		var weightEvent = new CustomEvent( 'weight-animation', getAnimationData() );
		window.dispatchEvent(weightEvent);
	};

	// -------------------------------------------------------------------------
	controls.crossfade = function( from, to ) {

		var fadeData = getAnimationData();
		fadeData.detail.from = controls[from];
		fadeData.detail.to = controls[to];
		fadeData.detail.time = controls[ "Crossfade Time" ];

		window.dispatchEvent( new CustomEvent( 'crossfade', fadeData ) );
	}

	// -------------------------------------------------------------------------
	controls.warp = function( from, to ) {

		var warpData = getAnimationData();
		warpData.detail.from = controls[from];
		warpData.detail.to = controls[to];
		warpData.detail.time = controls[ "Crossfade Time" ];

		window.dispatchEvent( new CustomEvent( 'warp', warpData ) );
	}

	// -------------------------------------------------------------------------
	controls['crossfade 1 to 2'] = function() {

		controls.crossfade( 'Anim 1', 'Anim 2' );

	};

	// -------------------------------------------------------------------------
	controls['crossfade 2 to 3'] = function() {

		controls.crossfade( 'Anim 2', 'Anim 3' );

	};

	// -------------------------------------------------------------------------
	controls['warp 2 to 3'] = function() {

		controls.warp( 'Anim 2', 'Anim 3' );

	};

	// -------------------------------------------------------------------------
	controls.lockCameraChanged = function() {

		var data = {
			detail: {
				shouldLock: controls['Lock Camera']
			}
		}

		window.dispatchEvent( new CustomEvent( 'toggle-lock-camera', data ) );
	}

	// -------------------------------------------------------------------------
	controls.showSkeletonChanged = function() {

		var data = {
			detail: {
				shouldShow: controls['Show Skeleton']
			}
		}

		window.dispatchEvent( new CustomEvent( 'toggle-show-skeleton', data ) );
	}

	// -------------------------------------------------------------------------
	controls.showModelChanged = function() {

		var data = {
			detail: {
				shouldShow: controls['Show Model']
			}
		}

		window.dispatchEvent( new CustomEvent( 'toggle-show-model', data ) );
	}

	// -------------------------------------------------------------------------
	controls.boneInfluenceChanged = function() {

		var data = {
			detail: {
				bone: controls['Bone Influence']
			}
		}

		window.dispatchEvent( new CustomEvent( 'change-bone-influence', data ) );
	}


	init.call(this);

}