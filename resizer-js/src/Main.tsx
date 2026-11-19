import { createSignal, onSettled } from "solid-js";

export default function Main() {
	const [imageLink, setImageLink] = createSignal<{
		blob: Blob;
		link: string | null;
	}>({
		blob: new Blob(),
		link: null,
	});

	const [resizedImageLink, setResizedImageLink] = createSignal<string | null>(
		null,
	);

	const [rangers, setRangers] = createSignal({
		BlurV: 0,
		BrightenV: 0,
	});

	let file!: HTMLInputElement;
	let width!: HTMLInputElement;
	let height!: HTMLInputElement;
	let resizeMode!: HTMLSelectElement;
	let filter!: HTMLSelectElement;
	let imgFormat!: HTMLSelectElement;
	let quality!: HTMLInputElement;

	let loaderDiv!: HTMLDivElement;
	let mainBlock!: HTMLElement;

	let worker: Worker;

	onSettled(() => {
		worker = new Worker(new URL("./worker.js", import.meta.url), {
			type: "module",
		});

		worker.onmessage = (event: MessageEvent<ArrayBuffer | null>) => {
			showLoader(false);

			if (event.data === null) {
				alert("resize failed");
				return;
			}

			const oldUrl = resizedImageLink();

			if (oldUrl) URL.revokeObjectURL(oldUrl);

			const url = URL.createObjectURL(
				new Blob([event.data], {
					type: imgFormat.value,
				}),
			);

			setResizedImageLink(url);
		};

		worker.onerror = () => {
			showLoader(false);
			alert("Worker failed");
		};

		return () => {
			worker.terminate();

			const originalUrl = imageLink().link;
			const resizedUrl = resizedImageLink();

			if (originalUrl) URL.revokeObjectURL(originalUrl);
			if (resizedUrl) URL.revokeObjectURL(resizedUrl);
		};
	});

	async function getBuffer() {
		const selectedFile = file.files?.[0];

		if (!selectedFile) return;

		const buffer = await selectedFile.arrayBuffer();

		const blob = new Blob([buffer], {
			type: selectedFile.type,
		});

		imgFormat.value = selectedFile.type;

		const oldUrl = imageLink().link;

		if (oldUrl) URL.revokeObjectURL(oldUrl);

		setImageLink({
			blob,
			link: URL.createObjectURL(blob),
		});
	}

	function showLoader(value: boolean) {
		if (value) {
			loaderDiv.style.display = "block";
			mainBlock.style.filter = "blur(5px)";
		} else {
			loaderDiv.style.display = "none";
			mainBlock.style.filter = "none";
		}
	}

	async function resizerAdvanceFn() {
		if (!imageLink().link) {
			alert("Please select an image first");
			return;
		}

		showLoader(true);

		try {
			worker.postMessage({
				buf: new Uint8Array(await imageLink().blob.arrayBuffer()),
				w: Number(width.value) || 500,
				h: Number(height.value) || 500,
				rm: resizeMode.value,
				f: filter.value,
				blur: rangers().BlurV,
				bright: rangers().BrightenV,
				format: imgFormat.value,
				q: quality.value
			});
		} catch (error) {
			showLoader(false);
			console.error(error);
			alert("Resize failed");
		}
	}

	function rangeValController(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		const value = Number(target.value);

		if (target.id === "blur") {
			setRangers((prev) => ({
				...prev,
				BlurV: value,
			}));
		} else if (target.id === "brighten") {
			setRangers((prev) => ({
				...prev,
				BrightenV: value,
			}));
		}
	}

	return (
		<>
			<div class="loader" ref={loaderDiv}></div>
			<main class="round" id="main" ref={mainBlock}>
				<div class="fileinput">
					<input type="file" accept="image/*" ref={file} onChange={getBuffer} />
				</div>

				<div class="fileoutput">
					<div>
						<div>
							<div>
								<label for="Width">Width</label>
								<label for="Height">Height</label>
								<label for="Resize_type">Resize type</label>
								<label for="Filters">Filters</label>
								<label for="blur">{`Blur(${rangers().BlurV})`}</label>
								<label for="brighten">{`Bright(${rangers().BrightenV})`}</label>
								<label for="format">Format</label>
								<label for="quality">Quality</label>
							</div>

							<div>
								<input type="number" id="Width" ref={width} />
								<input type="number" id="Height" ref={height} />
								<select id="Resize_type" ref={resizeMode}>
									<option value="resize">resize</option>
									<option value="resize_exact">resize with stretch</option>
									<option value="resize_to_fill">resize with crop</option>
								</select>
								<select id="Filters" ref={filter}>
									<option value="Lanczos3">Lanczos3</option>
									<option value="CatmullRom">CatmullRom</option>
									<option value="Gaussian">Gaussian</option>
									<option value="Nearest">Nearest</option>
									<option value="Triangle">Triangle</option>
								</select>
								<input
									type="range"
									id="blur"
									min="0"
									max="5"
									step="0.1"
									value={rangers().BlurV}
									onChange={rangeValController}
								/>
								<input
									type="range"
									id="brighten"
									min="-50"
									max="50"
									step="5"
									value={rangers().BrightenV}
									onChange={rangeValController}
								/>
								<select id="format" ref={imgFormat}>
									<option value="image/jpeg">JPG</option>
									<option value="image/png">PNG</option>
									<option value="image/webp">WEBP</option>
								</select>
								<input type="number" id="quality" ref={quality} value={90}/>
							</div>
						</div>

						<button type="button" onClick={resizerAdvanceFn}>
							resize
						</button>
					</div>

					<a
						target="_blank"
						rel="noreferrer"
						href={resizedImageLink() ?? undefined}
					>
						<img src={resizedImageLink() ?? ""} alt="" />
					</a>
				</div>
			</main>
		</>
	);
}
