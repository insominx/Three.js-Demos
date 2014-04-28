THREE.ShaderLib['skeleton-debug'] = {

    uniforms: THREE.UniformsUtils.merge( [

        THREE.UniformsLib[ "fog" ],
        THREE.UniformsLib[ "common" ],
        {
            "ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
            "emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
            "wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },
            "boneToHighlight" : { type: "i", value: 0 }
        }

    ] ),

    vertexShader: [

        "#define LAMBERT",

        "uniform int boneToHighlight;",
        "varying float selectedBoneInfluence;",

        THREE.ShaderChunk[ "map_pars_vertex" ],
        THREE.ShaderChunk[ "skinning_pars_vertex" ],


        "void main() {",

            THREE.ShaderChunk[ "map_vertex" ],

            THREE.ShaderChunk[ "skinbase_vertex" ],
            THREE.ShaderChunk[ "skinnormal_vertex" ],
            THREE.ShaderChunk[ "defaultnormal_vertex" ],

            THREE.ShaderChunk[ "skinning_vertex" ],
            THREE.ShaderChunk[ "default_vertex" ],

            THREE.ShaderChunk[ "worldpos_vertex" ],

            "if ( int( skinIndex.x ) == boneToHighlight )",
            "   selectedBoneInfluence = skinWeight.x;",
            "else if ( int( skinIndex.y ) == boneToHighlight )",
            "   selectedBoneInfluence = skinWeight.y;",
            "else if ( int( skinIndex.z ) == boneToHighlight )",
            "   selectedBoneInfluence = skinWeight.z;",
            "else if ( int( skinIndex.w ) == boneToHighlight )",
            "   selectedBoneInfluence = skinWeight.w;",

        "}"

    ].join("\n"),

    fragmentShader: [

        "uniform vec3 diffuse;",
        "uniform float opacity;",

        "varying float selectedBoneInfluence;",

        THREE.ShaderChunk[ "map_pars_fragment" ],
        THREE.ShaderChunk[ "fog_pars_fragment" ],

        "void main() {",

        "   gl_FragColor = vec4( diffuse, opacity );",

                THREE.ShaderChunk[ "map_fragment" ],
                THREE.ShaderChunk[ "fog_fragment" ],

        "   if ( selectedBoneInfluence > 0.0 ) { ",

                // hue
                "float angle = (1.0 - selectedBoneInfluence) * 2.355;",
                "float s = sin(angle), c = cos(angle);",
                "vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;",
                "gl_FragColor.rgb = weights.xyz;",

                // saturation
                "float average = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;",
                "gl_FragColor.rgb += (average - gl_FragColor.rgb) * (1.0 - 1.0 / (1.001 - 1.0));",
            "}",


        "}"

    ].join("\n")
}