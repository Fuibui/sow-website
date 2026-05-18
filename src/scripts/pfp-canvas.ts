const CANVAS_SIZE = 32;

export function drawPixelAvatar(img: HTMLImageElement) {
	const canvas = document.getElementById('ascii-canvas');
	if (!(canvas instanceof HTMLCanvasElement)) return;

	const ctx = canvas.getContext('2d');
	if (!ctx) return;

	canvas.width = CANVAS_SIZE;
	canvas.height = CANVAS_SIZE;
	ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
	ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
}

export function setPfpSource(url: string) {
	const img = document.getElementById('pfp-src');
	if (!(img instanceof HTMLImageElement)) return;

	const onLoad = () => drawPixelAvatar(img);
	img.onload = onLoad;

	if (img.src !== url) {
		img.src = url;
	}

	if (img.complete) onLoad();
}

export function initPfpCanvas() {
	const img = document.getElementById('pfp-src');
	if (!(img instanceof HTMLImageElement) || !img.src) return;

	img.onload = () => drawPixelAvatar(img);
	if (img.complete) drawPixelAvatar(img);
}
