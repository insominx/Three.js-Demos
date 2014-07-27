/**
 * @author insominx
 *
 * parameters = {
 *  fragmentShader: <string>,
 *  vertexShader: <string>,
 *
 *  uniforms: { "parameter1": { type: "f", value: 1.0 }, "parameter2": { type: "i" value2: 2 } },
 *
 *  defines: { "label" : "value" },
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  lights: <bool>,
 *
 *  fog: <bool>
 *
 *  splat1: <THREE.Texture>,
 *  splat2: <THREE.Texture>,
 *  splat3: <THREE.Texture>,
 *  splat4: <THREE.Texture>
 * }
 */

THREE.TerrainMaterial = function ( parameters ) {

    THREE.ShaderMaterial.call( this, parameters );

    // use 1x1 colored textures to alert users that haven't set up the splats
     (function setDefaults(mat)  {
        if ( mat.uniforms.tSplat1 == undefined ) { mat.uniforms.tSplat1 = THREE.ImageUtils.generateDataTexture( 1, 1, new THREE.Color(0xff0000 ) ); }
        if ( mat.uniforms.tSplat2 == undefined ) { mat.uniforms.tSplat2 = THREE.ImageUtils.generateDataTexture( 1, 1, new THREE.Color(0x00ff00 ) ); }
        if ( mat.uniforms.tSplat3 == undefined ) { mat.uniforms.tSplat3 = THREE.ImageUtils.generateDataTexture( 1, 1, new THREE.Color(0x0000ff ) ); }
        if ( mat.uniforms.tSplat4 == undefined ) { mat.uniforms.tSplat4 = THREE.ImageUtils.generateDataTexture( 1, 1, new THREE.Color(0x000000 ) ); }
    })(this);

    this.uniforms.tSplat1.value.wrapS = this.uniforms.tSplat1.value.wrapT = this.uniforms.tSplat2.value.wrapS = this.uniforms.tSplat2.value.wrapT =
        this.uniforms.tSplat3.value.wrapS = this.uniforms.tSplat3.value.wrapT = this.uniforms.tSplat4.value.wrapS = this.uniforms.tSplat4.value.wrapT = THREE.RepeatWrapping;
};

THREE.TerrainMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );

THREE.TerrainMaterial.prototype.clone = function () {

    var material = new THREE.TerrainMaterial();

    THREE.ShaderMaterial.prototype.clone.call( this, material );

    material.splat1 = this.splat1;
    material.splat2 = this.splat2;
    material.splat3 = this.splat3;
    material.splat4 = this.splat4;

    return material;

};
