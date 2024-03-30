"use client";

import { loadShaders } from "./util/shader-util";
import { useEffect, useRef } from "react";

const Home = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		(async () => {
			const gl = canvasRef.current?.getContext("webgl");
			if (!gl) return;

			const { vertexSource, fragmentSource } = await loadShaders(
				"default.glsl"
			);
			const vertexShader = gl.createShader(gl.VERTEX_SHADER);
			const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

			if (!vertexShader || !fragmentShader) {
				console.log("GL unable to create vertex or fragment shader");
				return;
			}

			gl.shaderSource(vertexShader, vertexSource);
			gl.shaderSource(fragmentShader, fragmentSource);
			gl.compileShader(vertexShader);
			gl.compileShader(fragmentShader);

			if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
				console.log(
					"Error: vertex shader could not compile",
					gl.getShaderInfoLog(vertexShader)
				);
				return;
			}
			if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
				console.log(
					"Error: fragment shader could not compile",
					gl.getShaderInfoLog(fragmentShader)
				);
				return;
			}

			const program = gl.createProgram();

			if (!program) {
				console.log("GL unable to create program");
				return;
			}

			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);
			gl.linkProgram(program);

			if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
				console.log(
					"Error: Program could not be linked",
					gl.getProgramInfoLog(program)
				);
				return;
			}

			const vertices = [
				0.0, 0.5, 1.0, 0.0, 0.0, -0.5, -0.5, 0.0, 1.0, 0.0, 0.5, -0.5, 0.0, 0.0,
				1.0,
			];
			const vertBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array(vertices),
				gl.STATIC_DRAW
			);

			const posAttribLocation = gl.getAttribLocation(program, "vertPosition");
			gl.vertexAttribPointer(
				// location
				posAttribLocation,
				// number of elements per attrib
				2,
				// size of elements
				gl.FLOAT,
				// normalized
				false,
				// size of each vertex
				5 * Float32Array.BYTES_PER_ELEMENT,
				// offset from vertex beginning to this attrib
				0
			);
			gl.enableVertexAttribArray(posAttribLocation);
			const colorAttribLocation = gl.getAttribLocation(program, "vertColor");
			gl.vertexAttribPointer(
				// location
				colorAttribLocation,
				// number of elements per attrib
				3,
				// size of elements
				gl.FLOAT,
				// normalized
				false,
				// size of each vertex
				5 * Float32Array.BYTES_PER_ELEMENT,
				// offset from vertex beginning to this attrib
				2 * Float32Array.BYTES_PER_ELEMENT
			);
			gl.enableVertexAttribArray(colorAttribLocation);

			gl.useProgram(program);
			gl.clearColor(0.75, 0.85, 0.8, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.drawArrays(gl.TRIANGLES, 0, 3);
		})();
	}, []);

	return <canvas ref={canvasRef} width={800} height={600}></canvas>;
};

export default Home;
