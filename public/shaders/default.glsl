precision mediump float;

attribute vec3 vertPosition;
attribute vec3 vertColor;
attribute vec2 texCoord;

uniform mat4 uWorldMat;
uniform mat4 uViewMat;
uniform mat4 uProjMat;

varying vec3 fColor;
varying vec2 fTexCoord;

void main()
{
	fColor = vertColor;
	fTexCoord = texCoord;
	gl_Position = uProjMat * uViewMat * uWorldMat * vec4(vertPosition, 1.0);
}

// split

precision mediump float;

uniform sampler2D uTex;

varying vec3 fColor;
varying vec2 fTexCoord;

void main()
{
	gl_FragColor = texture2D(uTex, fTexCoord);
	// gl_FragColor = vec4(fColor, 1.0);
}
