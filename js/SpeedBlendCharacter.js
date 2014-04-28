/**
 * @author Michael Guerrero / http://realitymeltdown.com
 */

//==============================================================================
THREE.SpeedBlendCharacter = function () {

  var self = this;

  this.animations = {};
  this.boneHelpers = [];
  this.weightSchedule = [];
  this.warpSchedule = [];

  this.speed = 0;

  this.idle = null;
  this.walk = null;
  this.run = null;

  // ---------------------------------------------------------------------------
  this.load = function(url, loadedCB) {

    var loader = new THREE.JSONLoader();
    loader.load( url, function( geometry, materials ) {

      var originalMaterial = materials[ 0 ];

      originalMaterial.skinning = true;
      originalMaterial.transparent = true;
      originalMaterial.alphaTest = 0.75;

      THREE.SkinnedMesh.call( self, geometry, originalMaterial );

      for ( var i = 0; i < geometry.animations.length; ++i ) {

        THREE.AnimationHandler.add( geometry.animations[ i ] );

        // Create the animation object and set a default weight
        var animName = geometry.animations[ i ].name;
        self.animations[ animName ] = new THREE.Animation( self, animName );

      }

      self.idle = self.animations[ 'idle' ];
      self.walk = self.animations[ 'walk' ];
      self.run = self.animations[ 'run' ];

      self.setSpeed( 0 );

      self.skeletonHelper = new THREE.SkeletonHelper( self );
      self.skeletonHelper.update();
      self.add( self.skeletonHelper );

      self.showSkeleton( true );

      // Loading is complete, fire the callback
      loadedCB && loadedCB();

    } );

  };

  // ---------------------------------------------------------------------------
  this.setSpeed = function( speed ) {

    this.speed = speed;

    if ( speed < 0.5 ) {

      var idleWeight = 1 - speed / 0.5;
      var walkWeight = speed / 0.5;

      if ( !self.idle.isPlaying )
        self.idle.play( 0 );

      if ( !self.walk.isPlaying )
        self.walk.play( 0 );

      self.idle.weight = idleWeight;
      self.walk.weight = walkWeight;

      if ( self.run.isPlaying ) {
        self.run.stop();
        self.run.weight = 0;
        self.walk.timeScale = 1;
      }

    } else {

      var walkWeight = 1 - ( speed - 0.5 ) / 0.5;
      var runWeight = ( speed - 0.5 ) / 0.5;

      if ( !self.run.isPlaying ) {

        var progress = self.walk.currentTime / self.walk.data.length;
        self.run.play( progress * self.run.data.length );

      }

      self.walk.weight = walkWeight;
      self.run.weight = runWeight;

      var walkToRunRatio = self.walk.data.length / self.run.data.length;
      var runToWalkRatio = self.run.data.length / self.walk.data.length;

      // scale from each time proportionally to the other animation

      self.walk.timeScale = walkWeight + walkToRunRatio * runWeight;
      self.run.timeScale = runWeight + runToWalkRatio * walkWeight;

      if ( self.idle.isPlaying ) {

        self.idle.stop();
        self.idle.weight = 0;

      }

    }

    //this.skeleton.resetWeights();

  };

  // ---------------------------------------------------------------------------
  this.updateSkeletonHelper = function() {

    this.skeletonHelper.update();

  };


  // ---------------------------------------------------------------------------
  this.pauseAll = function() {

    for ( var a in this.animations ) {

      if ( this.animations[ a ].isPlaying ) {

        this.animations[ a ].pause();

      }

    }

  };

  // ---------------------------------------------------------------------------
  this.unPauseAll = function() {

    for ( var a in this.animations ) {

      if ( this.animations[ a ].isPlaying && this.animations[ a ].isPaused ) {

        this.animations[ a ].pause();

      }

    }

  };


  // ---------------------------------------------------------------------------
  this.showSkeleton = function( shouldShow ) {

    this.skeletonHelper.visible = shouldShow;

  }

  // ---------------------------------------------------------------------------
  this.showModel = function( boolean ) {

    this.visible = boolean;

  }

};

//==============================================================================
THREE.SpeedBlendCharacter.prototype = Object.create( THREE.SkinnedMesh.prototype );

THREE.SpeedBlendCharacter.prototype.getForward = ( function() {

  var forward = new THREE.Vector3();

  return function() {

    // pull the character's forward basis vector out of the matrix
    forward.set(
      -this.matrix.elements[ 8 ],
      -this.matrix.elements[ 9 ],
      -this.matrix.elements[ 10 ]
    );

    return forward;
  }
} )();

