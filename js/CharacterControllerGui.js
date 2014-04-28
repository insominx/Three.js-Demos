/**
 * @author Michael Guerrero / http://realitymeltdown.com
 */

function CharacterControllerGui( idleAnim, walkAnim, runAnim ) {

  var controls = {

    gui: null,
    "Lock Camera": false,
    "Show Model": true,
    "Show Skeleton": true,
    "Time Scale": 1.0,
    "Step Size": 0.016,
    "Speed": 0.001,
    "Duration": 2.25

  };

  // -------------------------------------------------------------------------
  this.getTimeScale = function() {

    return controls['Time Scale'];

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
    // var playback = controls.gui.addFolder( 'Playback' );
    // var blending = controls.gui.addFolder( 'Blend Weights' );

    settings.add( controls, "Lock Camera" ).onChange( controls.lockCameraChanged );
    settings.add( controls, "Show Model" ).onChange( controls.showModelChanged );
    settings.add( controls, "Show Skeleton" ).onChange( controls.showSkeletonChanged );
    settings.add( controls, "Time Scale", 0, 1, 0.01 );
    //settings.add( controls, "Step Size", 0.01, 0.1, 0.01 );
    settings.add( controls, "Speed", 0.0, 1.0 ).listen();
    settings.add( controls, "Duration", 0.5, 4.0 ).listen().onChange( controls.durationChanged );

    // These controls execute functions
    //playback.add( controls, "pause" );
    //playback.add( controls, "step" );

    controls.durationChanged();

    settings.open();
    //playback.open();

  }

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
  controls.increaseSpeed = function() {

    var stepData = { detail: { stepSize: controls['Step Size'] } };
    window.dispatchEvent( new CustomEvent( 'increase-speed', stepData ));

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
  controls.durationChanged = function() {

    var data = {
      detail: {
        duration: controls['Duration']
      }
    }

    window.dispatchEvent( new CustomEvent( 'change-duration', data ) );
  }


  init.call(this);

}