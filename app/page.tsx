"use client";

import { loadShaders } from "./util/shader-util";
import { useEffect, useRef } from "react";
import { glMatrix, mat4 } from "gl-matrix";
import Image from "next/image";

const Home = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const texRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		(async () => {
			if (!canvasRef.current || !texRef.current) return;
			const gl = canvasRef.current.getContext("webgl");
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
					"Error: vertex shader could not compile\n",
					gl.getShaderInfoLog(vertexShader)
				);
				return;
			}
			if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
				console.log(
					"Error: fragment shader could not compile\n",
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
				// X, Y, Z,			R, G, B, 		U, V
				// Top
				-1.0, 1.0, -1.0, 0.5, 0.5, 0.5, 0.0, 0.0,

				-1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 0.0, 1.0,

				1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0,

				1.0, 1.0, -1.0, 0.5, 0.5, 0.5, 1.0, 0.0,

				// Left
				-1.0, 1.0, 1.0, 0.75, 0.25, 0.5, 0.0, 1.0,

				-1.0, -1.0, 1.0, 0.75, 0.25, 0.5, 0.0, 0.0,

				-1.0, -1.0, -1.0, 0.75, 0.25, 0.5, 1.0, 0.0,

				-1.0, 1.0, -1.0, 0.75, 0.25, 0.5, 1.0, 1.0,

				// Right
				1.0, 1.0, 1.0, 0.25, 0.25, 0.75, 1.0, 1.0,

				1.0, -1.0, 1.0, 0.25, 0.25, 0.75, 1.0, 0.0,

				1.0, -1.0, -1.0, 0.25, 0.25, 0.75, 0.0, 0.0,

				1.0, 1.0, -1.0, 0.25, 0.25, 0.75, 0.0, 1.0,

				// Front
				1.0, 1.0, 1.0, 1.0, 0.0, 0.15, 1.0, 1.0,

				1.0, -1.0, 1.0, 1.0, 0.0, 0.15, 1.0, 0.0,

				-1.0, -1.0, 1.0, 1.0, 0.0, 0.15, 0.0, 0.0,

				-1.0, 1.0, 1.0, 1.0, 0.0, 0.15, 0.0, 1.0,

				// Back
				1.0, 1.0, -1.0, 0.0, 1.0, 0.15, 0.0, 0.0,

				1.0, -1.0, -1.0, 0.0, 1.0, 0.15, 0.0, 1.0,

				-1.0, -1.0, -1.0, 0.0, 1.0, 0.15, 1.0, 1.0,

				-1.0, 1.0, -1.0, 0.0, 1.0, 0.15, 1.0, 0.0,

				// Bottom
				-1.0, -1.0, -1.0, 0.5, 0.5, 1.0, 1.0, 1.0,

				-1.0, -1.0, 1.0, 0.5, 0.5, 1.0, 1.0, 0.0,

				1.0, -1.0, 1.0, 0.5, 0.5, 1.0, 0.0, 0.0,

				1.0, -1.0, -1.0, 0.5, 0.5, 1.0, 0.0, 1.0,
			];

			const indicies = [
				// Top
				0, 1, 2, 0, 2, 3,

				// Left
				5, 4, 6, 6, 4, 7,

				// Right
				8, 9, 10, 8, 10, 11,

				// Front
				13, 12, 14, 15, 14, 12,

				// Back
				16, 17, 18, 16, 18, 19,

				// Bottom
				21, 20, 22, 22, 20, 23,
			];

			// Vertex Buffer Object (VBO) to store the vertex data
			const vertBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertBuffer);
			gl.bufferData(
				gl.ARRAY_BUFFER,
				new Float32Array(vertices),
				gl.STATIC_DRAW
			);

			// Element Buffer Object(EBO) to store the indicies
			const indexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(
				gl.ELEMENT_ARRAY_BUFFER,
				new Uint16Array(indicies),
				gl.STATIC_DRAW
			);

			const posAttribLocation = gl.getAttribLocation(program, "vertPosition");
			gl.vertexAttribPointer(
				// location
				posAttribLocation,
				// number of elements per attrib
				3,
				// size of elements
				gl.FLOAT,
				// normalized
				false,
				// size of each vertex
				8 * Float32Array.BYTES_PER_ELEMENT,
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
				8 * Float32Array.BYTES_PER_ELEMENT,
				// offset from vertex beginning to this attrib
				3 * Float32Array.BYTES_PER_ELEMENT
			);
			gl.enableVertexAttribArray(colorAttribLocation);

			const texAttribLocation = gl.getAttribLocation(program, "texCoord");
			gl.vertexAttribPointer(
				// location
				texAttribLocation,
				// number of elements per attrib
				2,
				// size of elements
				gl.FLOAT,
				// normalized
				false,
				// size of each vertex
				8 * Float32Array.BYTES_PER_ELEMENT,
				// offset from vertex beginning to this attrib
				6 * Float32Array.BYTES_PER_ELEMENT
			);
			gl.enableVertexAttribArray(texAttribLocation);

			const texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texImage2D(
				gl.TEXTURE_2D,
				0,
				gl.RGB,
				gl.RGB,
				gl.UNSIGNED_BYTE,
				texRef.current
			);
			gl.bindTexture(gl.TEXTURE_2D, null);

			// need to use program before you can get uniforms
			gl.useProgram(program);

			const uWorldMatLocation = gl.getUniformLocation(program, "uWorldMat");
			const uViewMatrixLocation = gl.getUniformLocation(program, "uViewMat");
			const uProjMatrixLocation = gl.getUniformLocation(program, "uProjMat");

			const worldMatrix = new Float32Array(16);
			const viewMatrix = new Float32Array(16);
			const projMatrix = new Float32Array(16);
			mat4.identity(worldMatrix);
			mat4.lookAt(viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
			mat4.perspective(
				projMatrix,
				glMatrix.toRadian(45),
				canvasRef.current.width / canvasRef.current.height,
				0.1,
				1000.0
			);

			gl.uniformMatrix4fv(uWorldMatLocation, false, worldMatrix);
			gl.uniformMatrix4fv(uViewMatrixLocation, false, viewMatrix);
			gl.uniformMatrix4fv(uProjMatrixLocation, false, projMatrix);

			const identityMatrix = new Float32Array(16);
			const xAxisRotation = new Float32Array(16);
			const yAxisRotation = new Float32Array(16);
			mat4.identity(identityMatrix);

			let angle = 0;

			gl.clearColor(0.75, 0.85, 0.8, 1.0);
			gl.enable(gl.DEPTH_TEST);
			gl.enable(gl.CULL_FACE);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.activeTexture(gl.TEXTURE0);

			let timeStart = performance.now();
			const loop = () => {
				let timeEnd = performance.now();
				let dt = (timeEnd - timeStart) / 1000;
				let fps = 1.0 / dt;
				timeStart = timeEnd;
				// console.log(fps);

				angle = (10 * performance.now()) / 1000 / (2 * Math.PI);
				mat4.rotate(yAxisRotation, identityMatrix, angle, [0, 1, 0]);
				mat4.rotate(xAxisRotation, identityMatrix, angle / 2, [1, 0, 0]);
				mat4.mul(worldMatrix, xAxisRotation, yAxisRotation);
				gl.uniformMatrix4fv(uWorldMatLocation, false, worldMatrix);

				gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
				gl.drawElements(gl.TRIANGLES, indicies.length, gl.UNSIGNED_SHORT, 0);
				requestAnimationFrame(loop);
			};

			requestAnimationFrame(loop);
		})();
	}, []);

	return (
		<div>
			<canvas ref={canvasRef} width={800} height={600}></canvas>
			<Image
				ref={texRef}
				src={"/images/crate.jpg"}
				width={200}
				height={200}
				alt="crate texture"
			/>
		</div>
	);
};

export default Home;
