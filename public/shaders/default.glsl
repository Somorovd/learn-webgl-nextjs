precision mediump float;

attribute vec2 vertPosition;
attribute vec3 vertColor;

varying vec3 fColor;

void main()
{
	fColor = vertColor;
	gl_Position = vec4(vertPosition, 0.0, 1.0);
}

// split

precision mediump float;

varying vec3 fColor;

void main()
{
	gl_FragColor = vec4(fColor, 1.0);
}
