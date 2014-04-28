/**
 * @author Michael Guerrero / http://realitymeltdown.com
 */

function SpeedBlendGui( idleAnim, walkAnim, runAnim ) {

  var controls = {

    gui: null,
    "Lock Camera": false,
    "Show Model": true,
    "Show Skeleton": true,
    "Time Scale": 1.0,
    "Step Size": 0.016,
    "Speed": 0.001,
    "Auto Period": 6.0

  };

  var idleAnim = idleAnim;
  var walkAnim = walkAnim;
  var runAnim = runAnim;

  // -------------------------------------------------------------------------
  this.shouldShowBones = function() {

    return controls['Show Skeleton'];

  };

  // -------------------------------------------------------------------------
  this.getTimeScale = function() {

    return controls['Time Scale'];

  };

  // -------------------------------------------------------------------------
  this.getAutoPeriod = function() {

    return controls['Auto Period'];

  };

  // -------------------------------------------------------------------------
  this.setSpeed = function( newSpeed ) {

    controls[ 'Speed' ] = newSpeed;

  }

  // -------------------------------------------------------------------------
  this.getSpeed = function( newSpeed ) {

    return controls[ 'Speed' ];

  }

  // -------------------------------------------------------------------------
  var init = function() {

    controls.gui = new dat.GUI();

    var settings = controls.gui.addFolder( 'Settings' );
    var playback = controls.gui.addFolder( 'Playback' );
    var blending = controls.gui.addFolder( 'Blend Weights' );

    settings.add( controls, "Lock Camera" ).onChange( controls.lockCameraChanged );
    settings.add( controls, "Show Model" ).onChange( controls.showModelChanged );
    settings.add( controls, "Show Skeleton" ).onChange( controls.showSkeletonChanged );
    settings.add( controls, "Time Scale", 0, 1, 0.01 );
    settings.add( controls, "Step Size", 0.01, 0.1, 0.01 );
    settings.add( controls, "Speed", 0.0, 1.0 ).listen().onChange( controls.speedChanged );
    settings.add( controls, "Auto Period", 1.0, 10.0 ).listen();

    // These controls execute functions
    playback.add( controls, "pause" );
    playback.add( controls, "step" );
    playback.add( controls, "autoSpeed" );
    playback.add( controls, "increaseSpeed" );
    playback.add( controls, "reduceSpeed" );
    //playback.add( controls, "forceUpdate" );

    blending.add( idleAnim, "weight", idleAnim.weight ).step( 0.01 ).listen();
    blending.add( walkAnim, "weight", walkAnim.weight ).step( 0.01 ).listen();
    blending.add( runAnim, "weight", runAnim.weight ).step( 0.01 ).listen();

    settings.open();
    playback.open();
    blending.open();

  }

  // -------------------------------------------------------------------------
  var getAnimationData = function() {

    return {

      detail: {

        anims: [ 'idle', 'walk', 'run' ],

        weights: [ controls['idle'],
               controls['walk'],
               controls['run'] ]
      }

    };
  }

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
  controls.autoSpeed = function() {

    window.dispatchEvent( new CustomEvent( 'toggle-autospeed' ));

  };

  // -------------------------------------------------------------------------
  controls.increaseSpeed = function() {

    var stepData = { detail: { stepSize: controls['Step Size'] } };
    window.dispatchEvent( new CustomEvent( 'increase-speed', stepData ));

  };

  // -------------------------------------------------------------------------
  controls.reduceSpeed = function() {

    var stepData = { detail: { stepSize: -controls['Step Size'] } };
    window.dispatchEvent( new CustomEvent( 'decrease-speed', stepData ));

  };

  // -------------------------------------------------------------------------
  controls.forceUpdate = function() {

    THREE.AnimationHandler.update( 0 );

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
  controls.speedChanged = function() {

    var data = { detail: { speed: controls[ 'Speed' ] } };
    window.dispatchEvent( new CustomEvent( 'change-speed', data ) );

  }


  init.call(this);

}