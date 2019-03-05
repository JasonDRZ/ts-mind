import { canvas } from "./canvas";
import * as file from "./file";
import { ajax } from "./ajax";
import { dom } from "./dom";

export const util = {
	ajax,

	dom,

	canvas,

	file,

	// get random uuid
	uuid() {
		return (
			new Date().getTime().toString(16) +
			Math.random()
				.toString(16)
				.substr(2)
		).substr(2, 16);
	}
};

export default util;
