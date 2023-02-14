export var vertexShader = 
`
percision mediump float;

attribute vec3 vertexPos;
attribute vec3 vertexColor;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;

varying vec3 fragColor;

void main() {
    fragolor = vertexColor;
    gl_Position = mProj * mView * mWorld * vec4(vertexPos, 1.0);
}
`;
