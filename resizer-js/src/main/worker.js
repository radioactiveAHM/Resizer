import { resize_advance } from "../core/resizer_core.js";

self.onmessage = (event) => {
	const input = event.data;
	
	const result = resize_advance(
		input.buf,
		input.w,
		input.h,
		input.rm,
		input.f,
		input.blur,
		input.bright,
	);

	self.postMessage(result);
};