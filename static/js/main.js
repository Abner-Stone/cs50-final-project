var Init = function() {
    var canvas = document.getElementById("canvas")
    var gl = canvas.getContext("webgl")
	
	var xRot = document.getElementById("xRot")

    if (!gl)
    {
        console.error("WebGL is not supported on your browser, switching to experimental")
        gl = canvas.getContext("experimental-webgl")
        if(!gl) {
            alert("Your browser does not support WebGL. Current mode: experimental-webgl")
            return 1
        }
    }

    gl.clearColor(0.31, 0.41, 0.55, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

    program = initShaders(gl)

    //
    // WebGL expects the bufferData to be in 32-bit but Javascript stores them as a 64-bit floating-point percision number.
    // Workaround: Convert bufferData into a 32-bit float array.
	// *Create buffer*
	//
	var boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,

		// Left
		-1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		-1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		-1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		-1.0, 1.0, -1.0,   0.75, 0.25, 0.5,

		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,

		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		-1.0, 1.0, 1.0,    1.0, 0.0, 0.15,

		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		-1.0, 1.0, -1.0,    0.0, 1.0, 0.15,

		// Bottom
		-1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		-1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

    var boxVerticesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, boxVerticesBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW)

    var boxIndicesBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndicesBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW)

    var vertexPosLocation = gl.getAttribLocation(program, 'vertexPos')
    var colorPosLocation = gl.getAttribLocation(program, 'vertexColor')

    gl.vertexAttribPointer(vertexPosLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 0)
    gl.vertexAttribPointer(colorPosLocation, 3, gl.FLOAT, gl.FALSE, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT)
    gl.enableVertexAttribArray(vertexPosLocation)
    gl.enableVertexAttribArray(colorPosLocation)

    // Tell OpenGL state machine which program should be active.
	gl.useProgram(program);

	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	glMatrix.mat4.identity(worldMatrix);
	glMatrix.mat4.lookAt(viewMatrix, [0, 0, -8], [0, 0, 0], [0, 1, 0]);
	glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);

	//
	// Main render loop
	//
	var identityMatrix = new Float32Array(16);
	glMatrix.mat4.identity(identityMatrix);
	var angle = 0;
	var loop = function () {
		angle = performance.now() / 1000 / 6 * 2 * Math.PI;
		glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
		glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, angle, [-1, 0, 0]);
		if (xRot.checked) {
			glMatrix.mat4.mul(worldMatrix, identityMatrix, xRotationMatrix)
			gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix)
		}
		else {
			glMatrix.mat4.mul(worldMatrix, yRotationMatrix, identityMatrix);
			gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
		}

        gl.clearColor(0.31, 0.41, 0.55, 1.0);
		gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
		gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
}