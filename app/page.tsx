"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const Home = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [gl, setGL] = useState<WebGL2RenderingContext | null>(null);

	useEffect(() => {
		setGL(canvasRef.current?.getContext?.("webgl2") ?? null);
	}, [canvasRef.current]);

	if (!gl) {
		return <p>Unable to start WebGL</p>;
	}

	gl.clearColor(0.75, 0.85, 0.8, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	return (
		<div>
			<canvas
				ref={canvasRef}
				width={600}
				height={600}
				className="border-[1px] border-black"
			></canvas>
			<i>Display text</i>
		</div>
	);
};

export default Home;
