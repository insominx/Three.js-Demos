
function createNoisePlaneData( noiseGen, width, height, scale ) {

  var data = new Uint8Array( 3 * width * height );

  for ( var y = 0; y < height; ++y ) {

    for ( var x = 0; x < width; ++x ) {

      var i = 3 * ( y * width + x );
      var value =( noiseGen.noise( y * scale, x * scale ) + 1 ) / 2;
      data[ i ] = data[ i + 1] = data[ i + 2] = value * 255;

    }

  }

  return data;

}

function createHeatMapTexture( heightData, width, height ) {

  var heatColor = new THREE.Color();
  var heatData = new Uint8Array( 3 * width * height );

  for ( var y = 0; y < height; ++y ) {

    for ( var x = 0; x < width; ++x ) {

      var i = 3 * ( y * width + x );
      var value = heightData[ i ] / 255;
      heatColor.setHSL( 0.66 - value * 0.66, 1, 0.5 );
      heatData[ i ] = heatColor.r * 255;
      heatData[ i + 1] = heatColor.g * 255;
      heatData[ i + 2] = heatColor.b * 255;

    }

  }

  var heatTexture = new THREE.DataTexture( heatData, width, height, THREE.RGBFormat );
  heatTexture.needsUpdate = true;

  return heatTexture;

}
