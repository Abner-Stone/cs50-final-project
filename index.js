//
// This line of code was pointed out by @polar5631 in a youtube comment.
//
const { mat4 } = glMatrix;

var vertexShaderSource = 
`
precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

varying vec3 fragColor;

void main()
{
    fragColor = vertColor;
    gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
}
`;

var fragmentShaderSource =
`
precision mediump float;

varying vec3 fragColor;

void main()
{
    gl_FragColor = vec4(fragColor, 1.0);
}
`;

var InitGl = function() {
    console.log("Initializing WebGL")

    var canvas = document.getElementById("canvas")
    var gl = canvas.getContext("webgl")

    if (!gl)
    {
        console.error("WebGL is not supported on your browser, switching to experimental")
        gl = canvas.getContext("experimental-webgl")
        if(!gl) {
            alert("Your browser does not support WebGL. Current mode: experimental-webgl")
            return 1
        }
    }



    gl.clearColor(0.0, 1.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragmentShaderSource)

    gl.compileShader(vertexShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    {
        console.error("ERROR: Error while compiling vertex shader", gl.getShaderInfoLog(vertexShader))
        alert("Could not compile vertex shader")
        return 1
    }
    console.log("Succesfully compiled vertex shader")
    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    {
        console.error("ERROR: Error while compiling fragment shader", gl.getShaderInfoLog(fragmentShader))
        alert("Could not compile fragment shader")
        return 1
    }
    console.log("Succesfully compiled fragment shader")

    var program = gl.createProgram()
    
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    if (gl.getProgramParameter(program, gl.ATTACHED_SHADERS) != 2) 
    {
        console.error("ERROR: Error while attaching shaders. Attached shaders: ", gl.getProgramParameter(program, gl.ATTACHED_SHADERS))
        alert("Could not attach shaders to program")
        return 1
    }
    console.log("Attached shaders")

    gl.linkProgram(program)
    console.log("Linked program")

    gl.validateProgram(program)
    console.log("Validated Program")
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) 
    {
        console.error("Could not validate program")
        return 1
    }
    gl.useProgram(program)

    //
    // WebGL expects the bufferData to be in 32-bit but Javascript stores them as a 64-bit floating-point percision number.
    // Workaround: Convert bufferData into a 32-bit float array.
    //
    var triangleVertices = 
    [
        0.0, 0.5, 0.0, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 0.0, 1.0, 1.0,
        0.5, -0.5, 0.0, 0.0, 0.0, 1.0
    ]

    var triangleVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
	    6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
    gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
	    6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    var worldMatLocation = gl.getUniformLocation(program, 'mWorld')
    var viewMatLocation = gl.getUniformLocation(program, 'mView')
    var projMatLocation = gl.getUniformLocation(program, 'projMat')

    var worldMatrix = new Float32Array(16)
    var viewMatrix = new Float32Array(16)
    var projMatrix = new Float32Array(16)

    mat4.identity(worldMatrix)
    mat4.identity(viewMatrix)
    mat4.identity(projMatrix)

    gl.uniformMatrix4fv(worldMatLocation, gl.FALSE, worldMatrix)
    gl.uniformMatrix4fv(viewMatLocation, gl.FALSE, viewMatrix)
    gl.uniformMatrix4fv(projMatLocation, gl.FALSE, projMatrix)

	//
	// Main render loop
	//
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}