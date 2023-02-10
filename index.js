var vertexShaderSource = 
`
percision mediump float;

attribute vec2 vertPosition;

void main()
{
    gl_Position = vec4(vertPosition, 0.0, 1.0);
}
`;

var fragmentShaderSource =
`
percision mediump float;

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
        console.log("WebGL is not supported on your browser, switching to experimental")
        gl = canvas.getContext("experimental-webgl")
        if(!gl) {
            alert("Your browser does not support WebGL. Current mode: experimental-webgl")
        }
    }



    gl.clearColor(1.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
}