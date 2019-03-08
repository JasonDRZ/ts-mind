import { doc } from "utils/dom";

// This is the main canvas for mind drawing.
// Responsible for main canvas’s zoom-in-out.
export class Canvas {
	element: HTMLDivElement = doc.createElement("div");
	// The mind canvas size
	public size: {
		w: 0;
		h: 0;
	};
}
