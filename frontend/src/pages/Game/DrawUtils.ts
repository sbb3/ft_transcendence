import { Ball } from "./interfaces";

export function drawEventRect(ctx, myrec, herrec, canvaS) {

	ctx.clearRect(0, 0, 600, 400);
	ctx.fillStyle = myrec?.color;
	ctx.fillRect(myrec?.x, myrec?.y, myrec?.widthe, myrec?.height);


	ctx.fillStyle = herrec?.color;
	ctx.fillRect(herrec?.x, herrec?.y, herrec?.widthe, herrec?.height);
	// if (rec?.x === 0) 
	// 	width = rec?.widthe / 4;
	// else 
	// 	width =(3 * canvaS?.width) / 4;
	// drawtext(ctx, rec?.score, width, canvaS?.height / 5, "white");
}


export function drawRect(ctx, rec) {

	// ctx.clearRect(0, 0, 600, 400);
	ctx.fillStyle = rec?.color;
	ctx.fillRect(rec?.x, rec?.y, rec?.widthe, rec?.height);
}

export function drawEnd(canvas) {
	let ctx = canvas.current.getContext("2d");
	if (!ctx) return;
	ctx.clearRect(0, 0, 600, 400);

	ctx.fillStyle = 'red';
	ctx.font = '30px Arial';
	ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);

}

export function drawCircle(ctx, cir: Ball) {
	// ctx.clearRect(0, 0, 600, 400);
	// console.log("cir", cir);

	ctx.fillStyle = cir?.color;
	ctx.beginPath();
	ctx.arc(cir?.x, cir?.y, cir?.radius, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fill();
}

export function drawtext(ctx, num, x, y, color) {
	ctx.fillStyle = color;
	ctx.font = "40px fantasy";
	ctx.fillText(num, x, y);
}

export function drawLine(ctx, a, b, c, d, e, f, color) {
	ctx.setLineDash([a, b]);
	ctx.strokeStyle = color;
	ctx.strokeRect(c, d, e, f);
}

export function draw(canvas, ball, mPaddle, hPaddle, canvaS) {


	const ctx = canvas.current.getContext("2d");
	if (!ctx) return;
	ctx.clearRect(0, 0, 600, 400);
	// console.log("balllllllllllllllllllllllll", ball);

	drawCircle(ctx, ball);
	drawRect(ctx, mPaddle);
	drawRect(ctx, hPaddle);

	drawLine(ctx, 4, 8, canvaS?.width / 2, 0, 0, 576, "white");

}
