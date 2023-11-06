import { Logger, Controller } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import path from 'path';
import { Server, Socket } from 'socket.io';
import { Paddle, Ball, canvaState } from "./game.interface";
// import { creatGame } from './game.entity';
import { GameService } from './game.service';


// export function athorPaddel(paddle:Paddle, canva:canvaState) {


//     paddle.x = canva.width - paddle.widthe;
//     paddle.y = ;
//     return paddle;
// }

export function mouvePaddle(myp: Paddle, mouseY, canva: canvaState) {
	myp.y = mouseY - myp.height / 2
	if (myp.y + myp.height > canva.height)
		myp.y = canva.height - myp.height
	if (myp.y < 0)
		myp.y = 0
	return myp;
}

export function bootPaddel(paddle: Paddle, canva: canvaState, ball: Ball, mode: string) {
	paddle.y += ball.y - (paddle.y + paddle.height / 2);
	if (paddle.y + paddle.height > canva.height)
		paddle.y = canva.height - paddle.height
	if (paddle.y < 0)
		paddle.y = 0
	return paddle
}

export function restBall(ball: Ball, canva: canvaState) {
	ball.x = canva.width / 2,
		ball.y = canva.height / 2,
		ball.radius = 10,
		ball.speed = 2.5,

		ball.velocityX = 0,
		ball.velocityY = 0,
		ball.score_my = ball.score_my,
		ball.score_her = ball.score_her,
		ball.color = "white",
		ball.angl = setRandomDirection()
	return ball;
}


export function update(ball: Ball, canva: canvaState, myp: Paddle, herp: Paddle, mode: string) {


	if (ball.velocityX == 0 && ball.velocityY == 0) {
		ball.velocityX = Math.cos(ball.angl);
		ball.velocityY = Math.sin(ball.angl);
	}
	ball.x += ball.velocityX * ball.speed;
	ball.y += ball.velocityY * ball.speed;

	let player = (ball.x < canva.width / 2) ? myp : herp;

	if (ball.y + ball.radius > canva.height || ball.y - ball.radius < 0) {
		// console.log('colision  wall');
		ball.velocityY = -ball.velocityY;
		// if (player === myp)
		//     ball.velocityX += 2;
		// else
		//     ball.velocityX -= 2;
	}

	else if ((ball.x - ball.radius < (myp.x + myp.widthe)) && ((ball.y + ball.radius) < myp.y || (ball.y - ball.radius) > (myp.y + myp.height))) {
		// console.log("score her");
		ball.score_her++;
		ball = restBall(ball, canva);
		myp.height = 100;
	}
	else if ((ball.x + ball.radius > herp.x) && ((ball.y + ball.radius) < herp.y || (ball.y - ball.radius) > (herp.y + herp.height))) {
		// console.log("score my");
		ball.score_my++;
		ball = restBall(ball, canva);
		myp.height = 100;

	}

	else if ((player == herp) && (ball.x + ball.radius > player.x)) {
		let center = ((ball.y - (player.y + player.height / 2)) / (player.height / 2));
		// let angl = center * (Math.PI / 3);
		// if (angl > Math.PI / 3)
		// 	angl = Math.PI / 3;
		ball.velocityX *= -1;
		// ball.velocityY *= -1;
		// console.log('colision  her');
		// ball.velocityX = -0.5;
		if (mode === "normal")
			ball.speed += 1;
		else if (mode === "hard") {
			ball.speed += 1;
			myp.height -= 5;
			if (myp.height < 30)
				myp.height = 30;
		}
		else if (mode === "easy")
			ball.speed += 0.1;
	}
	else if ((player == myp) && (ball.x - ball.radius < player.x + player.widthe)) {
		let center = ((ball.y - (player.y + player.height / 2)) / (player.height / 2));
		// let angl = center * (Math.PI / 3);
		ball.velocityX *= -1;
		// ball.velocityY *= -1;
		// ball.velocityX *= -0.5;
		// console.log('colision  my');

		if (mode === "normal")
			ball.speed += 1;
		else if (mode === "hard") {
			console.log("harddddddddddddddddddddddddddd");
			ball.speed += 1;
			myp.height -= 5;
			if (myp.height < 30)
				myp.height = 30;
		}
		else if (mode === "easy")
			ball.speed += 0.1;
	}

	return ball;
}

export function setRandomDirection() {
	let randomAngleToRight1 = giveRandomNumberBetween(Math.PI / 6, Math.PI / 4);
	let randomAngleToRight2 = giveRandomNumberBetween(11 * Math.PI / 6, 7 * Math.PI / 4);
	let randomAngleToLeft1 = giveRandomNumberBetween(5 * Math.PI / 6, 3 * Math.PI / 4);
	let randomAngleToLeft2 = giveRandomNumberBetween(7 * Math.PI / 6, 5 * Math.PI / 4);
	let leftRandom = (Math.ceil(Math.random() * 10) % 2 == 1) ? randomAngleToLeft1 : randomAngleToLeft2;
	let rightRandom = (Math.ceil(Math.random() * 10) % 2 == 1) ? randomAngleToRight1 : randomAngleToRight2;
	let randomAngle = (Math.ceil(Math.random() * 10) % 2 == 1) ? leftRandom : rightRandom;


	return randomAngle
}

function giveRandomNumberBetween(min: number, max: number): number {
	return (Math.random() * (max - min) + min);
}