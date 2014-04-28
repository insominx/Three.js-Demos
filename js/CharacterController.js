/**
 * @author Michael Guerrero / http://realitymeltdown.com
 */

//==============================================================================
THREE.CharacterController = function ( speedBlendCharacter ) {

  var scope = this;
  var duration = 1;
  var keys = {
    LEFT:  { code: 37, isPressed: false },
    UP:    { code: 38, isPressed: false },
    RIGHT: { code: 39, isPressed: false },
    A:     { code: 65, isPressed: false },
    D:     { code: 68, isPressed: false },
    W:     { code: 87, isPressed: false }
  };

  this.character = speedBlendCharacter;
  this.walkSpeed = 3;
  this.runSpeed = 7;

  // ---------------------------------------------------------------------------
  this.update = function( dt ) {

    var newSpeed = this.character.speed;

    if ( keys.UP.isPressed || keys.W.isPressed )
      newSpeed += dt / duration;
    else
      newSpeed -= dt / duration;

    newSpeed = Math.min( 1, Math.max( newSpeed, 0 ) );

    if ( keys.LEFT.isPressed || keys.A.isPressed )
      this.character.rotation.y += dt * 2;
    else if ( keys.RIGHT.isPressed || keys.D.isPressed )
      this.character.rotation.y -= dt * 2;

    var forward = this.character.getForward();
    var finalSpeed = ( newSpeed > 0.5 ) ? newSpeed * this.runSpeed:  ( newSpeed / 0.5 ) * this.walkSpeed;

    this.character.setSpeed( newSpeed );
    this.character.position.add( forward.multiplyScalar( finalSpeed ) );

  };

  // ---------------------------------------------------------------------------
  var onKeyDown = function( event ) {

    for ( var k in keys ) {

      if ( event.keyCode === keys[ k ].code ) {

        keys[ k ].isPressed = true;

      }

    }

  };

  // ---------------------------------------------------------------------------
  var onKeyUp = function( event ) {

    for ( var k in keys ) {

      if ( event.keyCode === keys[ k ].code ) {

        keys[ k ].isPressed = false;

      }

    }
  };

  // ---------------------------------------------------------------------------
  var onDurationChange = function( event ) {

    duration = event.detail.duration;

  };

  window.addEventListener( 'keydown', onKeyDown, false );
  window.addEventListener( 'keyup', onKeyUp, false );
  window.addEventListener( 'change-duration', onDurationChange, false );


 }