/**
 * @author insominx - Michael Guerrero
 */

THREE.TerrainGeometry = function ( config ) {

    this.width = 2048;
    this.length = 2048;
    this.heightScale = 200.0;
    this.widthSegs = 1000;
    this.lengthSegs = 1000;

    this.bufferGeom = null;
};

THREE.TerrainGeometry.prototype = {

    constructor: THREE.TerrainGeometry,

    //

    createGeometry: function(finishedCallback) {

        // one extra vert across and down compared to rectangles/segs
        var widthVerts = this.widthSegs + 1;
        var lengthVerts = this.lengthSegs + 1;

        var numberOfVerts = widthVerts * lengthVerts;

        // 2 tris per grid rectangle
        var triangles = this.widthSegs * this.lengthSegs * 2;

        this.bufferGeom = new THREE.BufferGeometry();
        this.bufferGeom.dynamic = true;
        this.bufferGeom.attributes = {
            index: {
                itemSize: 1,
                array: new Uint16Array(triangles * 3),
                numItems: triangles * 3
            },
            position: {
                itemSize: 3,
                array: new Float32Array(numberOfVerts * 3),
                numItems: numberOfVerts * 3
            },
            normal: {
                itemSize: 3,
                array: new Float32Array(numberOfVerts * 3),
                numItems: numberOfVerts * 3
            },
            uv: {
                itemSize: 2,
                array: new Float32Array(numberOfVerts * 2),
                numItems: numberOfVerts * 2
            }
        }

        // break geometry into
        // chunks of 21,845 triangles (3 unique vertices per triangle)
        // for indices to fit into 16 bit integer number
        // floor(2^16 / 3) = 21845
        // floor((65535 / 3)) = 21845

        var chunkSize = 21845;
        //chunkSize = 16;

        var indices = this.bufferGeom.attributes.index.array;

        var positions = this.bufferGeom.attributes.position.array;
        var normals = this.bufferGeom.attributes.normal.array;
        var uvs = this.bufferGeom.attributes.uv.array;
        var colors = this.bufferGeom.attributes.color;

        var defaultColor = new THREE.Color(1.0, 0.0, 0.0);

        var startX = -this.width * 0.5;
        var startZ = -this.length * 0.5;
        var tileX = this.width / (widthVerts - 1);
        var tileZ = this.length / (lengthVerts - 1);

        for (var i = 0; i < lengthVerts; ++i) {
            for (var j = 0; j < widthVerts; ++j) {

                var index = (i * widthVerts + j) * 3;

                positions[index + 0] = startX + j * tileX;
                //positions[index + 1] = filled in later from height map;
                positions[index + 2] = startZ + i * tileZ;

                var uvIndex = (i * widthVerts + j) * 2;
                uvs[uvIndex + 0] = j / (widthVerts - 1);
                uvs[uvIndex + 1] = 1.0 - i / (lengthVerts - 1);

                //colors[index + 0] = colors[index + 1] = colors[index + 2] = 1.0;
            }
        }

        this.bufferGeom.offsets = [];

        var lastChunkRow = 0;
        var lastChunkVertStart = 0;

        // For each rectangle, generate its indices
        for (var i = 0; i < this.lengthSegs; ++i) {

            var startVertIndex = i * widthVerts;

            // If we don't have space for another row, close
            // off the chunk and start the next
            if ((startVertIndex - lastChunkVertStart) + widthVerts * 2 > chunkSize) {

                var newChunk = {
                    start: lastChunkRow * this.widthSegs * 6,
                    index: lastChunkVertStart,
                    count: (i - lastChunkRow) * this.widthSegs * 6
                };

                this.bufferGeom.offsets.push(newChunk);

                lastChunkRow = i;
                lastChunkVertStart = startVertIndex;
            }


            for (var j = 0; j < this.widthSegs; ++j) {

                var index = (i * this.widthSegs + j) * 6;
                var vertIndex = (i * widthVerts + j) - lastChunkVertStart;

                indices[index + 0] = vertIndex;
                indices[index + 1] = vertIndex + widthVerts;
                indices[index + 2] = vertIndex + 1;
                indices[index + 3] = vertIndex + 1;
                indices[index + 4] = vertIndex + widthVerts;
                indices[index + 5] = vertIndex + widthVerts + 1;
            }
        }

        var lastChunk = {
            start: lastChunkRow * this.widthSegs * 6,
            index: lastChunkVertStart,
            count: (this.lengthSegs - lastChunkRow) * this.widthSegs * 6
        };

        //this.bufferGeom.offsets.push(lastChunk);
        this.bufferGeom.computeBoundingSphere();

        function bind( scope, fn ) {
            return function () {
                fn.apply( scope, arguments );
                if (finishedCallback != null) {
                    finishedCallback();
                }
            };
        };

        this.terrainHeight = THREE.ImageUtils.loadTexture("textures/terrain/height-test.png", undefined,
        bind(this, this.onTerrainHeightmapLoaded));
    },

    //

    onTerrainHeightmapLoaded: function() {

        var data = this.getHeightImageData().data;

        var mapWidth = this.terrainHeight.image.width;
        var mapHeight = this.terrainHeight.image.height;

        var widthVerts = this.widthSegs + 1;
        var lengthVerts = this.lengthSegs + 1;

        for (var i = 0; i < lengthVerts; ++i) {

            var percentHeight = i / (lengthVerts - 1);

            for (var j = 0; j < widthVerts; ++j) {

                var percentWidth = j / (widthVerts - 1);

                var row = Math.round(percentHeight * (mapHeight - 1));
                var column = Math.round(percentWidth * (mapWidth - 1));

                var rowPixel = row * mapWidth * 4;
                var columnPixel = column * 4;

                var index = rowPixel + columnPixel;

                var vertIndex = (i * widthVerts + j) * 3;

                this.bufferGeom.attributes.position.array[vertIndex + 1] =
                    data[index] * this.heightScale / 255.0;
            }
        }

        this.bufferGeom.computeVertexNormals();
        this.heightData = data;
    },

    //

    getHeightImageData: function () {

        var canvas = document.createElement('canvas');

        //var canvas = document.getElementById('mycanvas');
        var mapWidth = this.terrainHeight.image.width;
        var mapHeight = this.terrainHeight.image.height;

        canvas.width = mapWidth;
        canvas.height = mapHeight;

        var context = canvas.getContext("2d");
        context.drawImage(this.terrainHeight.image, 0, 0);

        return context.getImageData(0, 0, mapWidth, mapHeight);
    },

     //

    getTerrainHeight: function (x, y) {

        var halfWidth = this.width / 2;
        var halfLength = this.length / 2;

        var percentWidth = (x + halfWidth) / this.width;
        var percentLength = (y + halfLength) / this.length;

        var mapWidth = this.terrainHeight.image.width;
        var mapHeight = this.terrainHeight.image.height;

        var preciseRow = percentLength * (mapHeight - 1);
        var preciseCol = percentWidth * (mapWidth - 1);

        var row = Math.round(preciseRow);
        var col = Math.round(preciseCol);

        var rowPixel = row * mapWidth * 4;
        var columnPixel = col * 4;

        var index = rowPixel + columnPixel;

        var dx = preciseRow - row;
        var dy = preciseCol - col;

        // bilinear filter the result
        var q11 = this.heightData[index];
        var q12 = this.heightData[index + 4];
        var q21 = this.heightData[index + mapWidth * 4];
        var q22 = this.heightData[index + (mapWidth + 1) * 4];

        var result =  q11 * (1.0 - dx) * (1.0 - dy) +
                      q21 * dx * (1.0 - dy) +
                      q12 * (1.0 - dx) * dy +
                      q22 * dx * dy;

        return result * this.heightScale / 255.0;
    },

    //

    getTerrainHeightSmoothed: function (x, y) {

        var halfWidth = this.width / 2;
        var halfLength = this.length / 2;

        var percentWidth = (x + halfWidth) / this.width;
        var percentLength = (y + halfLength) / this.length;

        var mapWidth = this.terrainHeight.image.width;
        var mapHeight = this.terrainHeight.image.height;

        var row = Math.round(percentLength * (mapHeight - 1));
        var column = Math.round(percentWidth * (mapWidth - 1));

        var rowPixel = row * mapWidth * 4;
        var columnPixel = column * 4;

        var index = rowPixel + columnPixel;

        var gaussKernel = [0.00296901674395065, 0.013306209891014005, 0.02193823127971504, 0.013306209891014005, 0.00296901674395065,
                           0.013306209891014005, 0.05963429543618023, 0.09832033134884507, 0.05963429543618023, 0.013306209891014005,
                           0.02193823127971504, 0.09832033134884507, 0.16210282163712417, 0.09832033134884507, 0.02193823127971504,
                           0.013306209891014005, 0.05963429543618023, 0.09832033134884507, 0.05963429543618023, 0.013306209891014005,
                           0.00296901674395065, 0.013306209891014005, 0.02193823127971504, 0.013306209891014005, 0.00296901674395065];

        var average = 0.0;

        for (var i = 0; i < 5; ++i) {

            var rowPixel = (row + i - 2) * mapWidth * 4;

            for (var j = 0; j < 5; ++j) {
                average += this.heightData[rowPixel + (column - 2 + j) * 4] * gaussKernel[i * 5 + j];
            }
        }

        return average * this.heightScale / 255.0;
    }
}
