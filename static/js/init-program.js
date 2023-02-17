var initProgram = function(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)

    gl.linkProgram(program)
    gl.validateProgram(program)
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.log("Invalid program")
        alert("Could not create webgl program")
        return 1
    }
    else if (gl.getProgramParameter(program, gl.ATTACHED_SHADERS) != 2) {
        console.log("Could not attach shaders")
        alert("Shaders were not added to program")
        return 1
    }

    return program;
}