/**
 * @author insominx - Michael Guerrero
 */

THREE.TerrainControls = function ( camera, terrainGeometry, heightAboveTerrain, moveSpeed ) {

	this.enabled = false;
	this.hat = heightAboveTerrain;
	this.moveSpeed = moveSpeed || 3.0;

	var controls = this;

	// first person controls will be rooted with raw as a parent, with pitch as a child
	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var isMouseDown = false;
	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var lastHeight = 0.0;

	var PI_2 = Math.PI / 2;

	//

	var onMouseDown = function ( event ) { isMouseDown = true; }
	var onMouseUp = function ( event ) { isMouseDown = false; }

	//

	var onMouseMove = function ( event ) {

		// Only rotate when the mouse id won
		if (isMouseDown) {
			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			yawObject.rotation.y -= movementX * 0.002;
			pitchObject.rotation.x -= movementY * 0.002;

			pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
		}
	};

	//

	var onMouseWheel = function( e ) {
		var e = window.event || e
		var delta = e.wheelDelta || -e.detail * 30.0;
		 controls.hat -= delta * 0.1;
	}

	//

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;
		}
	};

	//

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // a
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;
		}
	};

	//

	this.getObject = function () {

		return yawObject;
	};

	//

	this.getYaw = function () {
		return yawObject.rotation.y;
	}

	//

	this.getPitch = function() {
		return pitchObject.rotation.x;
	}

	//

	this.getPosition = function() {
		return pitchObject.matrixWorld.getPosition();
	}

	//

	this.update = function ( delta ) {

		var movement = this.moveSpeed * delta;

		if ( moveForward ) { yawObject.translateZ( -movement ); }
		if ( moveBackward ) { yawObject.translateZ( movement ); }
		if ( moveLeft ) { yawObject.translateX( -movement ); }
		if ( moveRight ) { yawObject.translateX( movement ); }

		var terrainHeight = terrainGeometry.getTerrainHeight( yawObject.position.x, yawObject.position.z);
		var newHeight =  terrainHeight + this.hat;

		delta = Math.min( delta * this.moveSpeed, 1.0 );

		// smoothly transition to the current height but no lower than the actual terrain height
		yawObject.position.y = lastHeight + ( newHeight - lastHeight ) * delta;
		yawObject.position.y = Math.max( yawObject.position.y, terrainHeight + this.hat * 0.25 );

		lastHeight = yawObject.position.y;
	};

	document.addEventListener( 'mousedown', onMouseDown, false );
	document.addEventListener( 'mouseup', onMouseUp, false );
	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'mousewheel', onMouseWheel, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	// for firefox (shame on you ff)
	document.addEventListener("DOMMouseScroll", onMouseWheel, false);
};
