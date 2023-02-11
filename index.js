var vertexShaderSource = 
`
precision mediump float;

attribute vec2 vertPosition;

void main()
{
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}
`;

var fragmentShaderSource =
`
precision mediump float;

void main()
{
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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
        }
    }



    gl.clearColor(1.0, 0.0, 0.0, 1.0)
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
        return 0
    }
    console.log("Succesfully compiled vertex shader")
    gl.compileShader(fragmentShader)
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    {
        console.error("ERROR: Error while compiling fragment shader", gl.getShaderInfoLog(fragmentShader))
        alert("Could not compile fragment shader")
        return 0
    }
    console.log("Succesfully compiled fragment shader")

    var program = gl.createProgram()
    
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    if (gl.getProgramParameter(program, gl.ATTACHED_SHADERS) != 2) 
    {
        console.error("ERROR: Error while attaching shaders. Attached shaders: ", gl.getProgramParameter(program, gl.ATTACHED_SHADERS))
        alert("Could not attach shaders to program")
    }
    console.log("Attached shaders")

    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) 
    {
        console.error("ERROR: Error while linking program")
        alert("Could not link program")
    }
    console.log("Linked program")
}