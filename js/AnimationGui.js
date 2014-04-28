
function AnimationGui( animationList ) {


	var init = function( animationList ) {

		var gui = new dat.GUI();
		gui.domElement.style.cssFloat = 'left';

		var rootFolder = gui.addFolder( 'Animations' );

		for ( var a in animationList ) {

			this.addAnimation( rootFolder, animationList[ a ] );

		}

		rootFolder.open();

	};


	this.addAnimation = function( gui, animation ) {

		var animRoot = gui.addFolder(animation.data.name);

		animRoot.add( animation, "isPlaying" ).listen();
		animRoot.add( animation, "isPaused" ).listen();
		animRoot.add( animation, "loop" ).listen();
		animRoot.add( animation.data, "length" );
		animRoot.add( animation, "currentTime" ).step( 0.01 ).listen();
		animRoot.add( animation, "timeScale" ).step( 0.01 ).listen();
		animRoot.add( animation, "weight" ).step( 0.01 ).listen();

		animRoot.open();

	};

	init.call( this, animationList );
}