var initShaders = function(gl) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER)
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

    gl.shaderSource(vertexShader, vertexShaderText)
    gl.shaderSource(fragmentShader, fragmentShaderText)

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

    return initProgram(gl, vertexShader, fragmentShader)
}