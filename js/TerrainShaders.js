
var terrainUniforms = {
    tAlphaMap: { type: "t", value: null },
    tSplat1: { type: "t", value: null },
    tSplat2: { type: "t", value: null },
    tSplat3: { type: "t", value: null },
    tSplat4: { type: "t", value: null },
    uSplat1Repeat: { type: "v2", value: new THREE.Vector2(100.0, 100.0) },
    uSplat2Repeat: { type: "v2", value: new THREE.Vector2(800.0, 600.0) },
    uSplat3Repeat: { type: "v2", value: new THREE.Vector2(1000.0, 1000.0) },
    uSplat4Repeat: { type: "v2", value: new THREE.Vector2(100.0, 100.0) },
    shininess: { type: "f", value: 32.0 },
    specularStrength: { type: "f", value: 0.2 }
};

terrainUniforms = THREE.UniformsUtils.merge([
    terrainUniforms,
    THREE.UniformsLib[ "fog" ],
    THREE.UniformsLib[ "lights" ]
]);

var terrainVertexShader = [

"attribute vec4 tangent;",

"uniform vec2 uSplat1Repeat;",
"uniform vec2 uSplat2Repeat;",
"uniform vec2 uSplat3Repeat;",
"uniform vec2 uSplat4Repeat;",

"varying vec3 vViewPosition;",
"varying vec3 vNormal;",

"varying vec2 vUv;",
"varying vec2 vUvSplat1;",
"varying vec2 vUvSplat2;",
"varying vec2 vUvSplat3;",
"varying vec2 vUvSplat4;",

"void main() {",

    THREE.ShaderChunk[ "default_vertex" ],
"    vViewPosition = -mvPosition.xyz;",

"    vUv = uv;",

"    // Allow for tiling of the uv coords",
"    vUvSplat1 = uv * uSplat1Repeat;",
"    vUvSplat2 = uv * uSplat2Repeat;",
"    vUvSplat3 = uv * uSplat3Repeat;",
"    vUvSplat4 = uv * uSplat4Repeat;",

"    vNormal = normalize( normalMatrix * normal );",

"}"].join("\n");


var terrainFragShader = [

"uniform samplerCube tCube;",
"uniform sampler2D tAlphaMap;",
"uniform sampler2D tSplat1, tSplat2, tSplat3, tSplat4;",
"uniform sampler2D tNormal;",
"uniform float time;",
"uniform vec2 uOffset;",

"uniform vec3 ambient;",
"uniform vec3 diffuse;",
"uniform vec3 specular;",

"uniform float shininess;",
"uniform float specularStrength;",

THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
THREE.ShaderChunk[ "fog_pars_fragment" ],

"varying vec2 vUv;",
"varying vec2 vUvSplat1;",
"varying vec2 vUvSplat2;",
"varying vec2 vUvSplat3;",
"varying vec2 vUvSplat4;",

"void main() {",

"    vec4 splat1 = texture2D(tSplat1, vUvSplat1);",
"    vec4 splat2 = texture2D(tSplat2, vUvSplat2);",
"    vec4 splat3 = texture2D(tSplat3, vUvSplat3);",
"    vec4 splat4 = texture2D(tSplat4, vUvSplat4);",
"    vec4 alphaMap = texture2D(tAlphaMap, vUv);",

"    gl_FragColor = splat1 * alphaMap.r + splat2 * alphaMap.g +",
"        splat3 * alphaMap.b + splat4 * alphaMap.a;",

    "vec3 normal = normalize(vNormal);",
    "vec3 viewPosition = normalize( vViewPosition );",

    "vec3 dirDiffuse  = vec3( 0.0 );",
    "vec3 dirSpecular = vec3( 0.0 );" ,

    "vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ 0 ], 0.0 );",
    "vec3 dirVector = normalize( lDirection.xyz );",

    // diffuse

    "float dotProduct = dot( normal, dirVector );",
    "float dirDiffuseWeight = pow(dotProduct * 0.5 + 0.5, 1.5); // curved half lambert",

    "//dirDiffuse  += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;",
    "dirDiffuse +=  dirDiffuseWeight;",

    // specular

    "vec3 dirHalfVector = normalize( dirVector + viewPosition );",
    "float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );",
    "float dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );",

    "dirSpecular += specular * directionalLightColor[ 0 ] * dirSpecularWeight * dirDiffuseWeight;",

    "vec3 totalDiffuse = dirDiffuse;",
    "vec3 totalSpecular = dirSpecular;",

    "gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * ambient ) + totalSpecular;",
    //"gl_FragColor.xyz = vec3(vUv.x, vUv.y, 0.0);",
    //THREE.ShaderChunk["fog_fragment"],
"}",
].join("\n");
