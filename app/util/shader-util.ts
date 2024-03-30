export type ShaderSource = {
	vertexSource: string;
	fragmentSource: string;
};

export const loadShaders = async (filename: string): Promise<ShaderSource> => {
	const source = { vertexSource: "", fragmentSource: "" };

	const res = await fetch(`/shaders/${filename}`);
	if (!res.ok) {
		console.log(`Could not fetch shader '${filename}'`);
		return source;
	}

	const parts = (await res.text()).split("split");
	if (parts.length !== 2) {
		console.log(`${filename} could not be split into vertex and fragment`);
	}

	source.vertexSource = parts[0];
	source.fragmentSource = parts[1];
	return source;
};
