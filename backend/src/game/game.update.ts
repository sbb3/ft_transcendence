import { Logger, Controller, ConsoleLogger } from '@nestjs/common';
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

export function bootPaddel(paddle: Paddle, canva: canvaState, ball: Ball) {
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
		ball.speed = 0.1,
		ball.velocityX = 0,
		ball.velocityY = 0,
		ball.score_my = ball.score_my,
		ball.score_her = ball.score_her,
		ball.color = "white",
		ball.angle = Math.PI + 1
	return ball;
}

// export function collision(myp : Paddle, ball : Ball ) {

//     if ((ball.y + ball.radius < myp.y) || (ball.y - ball.radius > myp.y + myp.height))
//         return 1;
//     if ((ball.x + ball.radius > myp.x) || ball.x - ball.radius < myp.x + myp.widthe)
//         return 2;
//     return 0;
//     // return ((myp.x < ball.x + ball.radius) && (myp.x > ball.y + ball.radius) && (myp.x + myp.widthe > ball.x - ball.radius) && (myp.y + myp.height > ball.y - ball.radius))
// }

export function update(ball: Ball, canva: canvaState, myp: Paddle, herp: Paddle) {
	if (ball.velocityX == 0 && ball.velocityY == 0) {
		let newAngle = randomAngle();

		ball.velocityX = Math.cos(newAngle);
		ball.velocityY = Math.sin(newAngle);
	}
	let rightCollision = (ball.y >= herp.y && ball.y <= herp.y + herp.height);
	let leftCollision = (ball.y >= myp.y && ball.y <= myp.y + myp.height);

	// Collision on Y axis
	if (ball.y + ball.radius >= canva.height || ball.y - ball.radius <= 0)
		ball.velocityY *= -1;

	// Collision on X axis + Goal check
	if (rightCollision && (ball.x + ball.radius >= herp.x)) {
		ball.velocityX *= -1;
	}
	else if (leftCollision && (ball.x - ball.radius <= myp.widthe)) {
		ball.velocityX *= -1;
	}
	else if (ball.x + ball.radius >= herp.x) {
		ball = restBall(ball, canva);
		ball.score_my++;
		return ball;
	}
	else if (ball.x - ball.radius <= myp.widthe) {
		ball = restBall(ball, canva);
		ball.score_her++;
		return ball;
	}

	ball.x += (ball.velocityX * 5);
	ball.y += (ball.velocityY * 5);
	// console.log(randomAngle());
	return ball;
}

// Generate a random angle
export function randomAngle() {
	let randomAngleToRight1 = giveRandomNumberBetween(0.48, 0.50);
	let randomAngleToRight2 = giveRandomNumberBetween(6.05, 6.2);
	let randomAngleToLeft1 = giveRandomNumberBetween(2.6, 2.5);
	let randomAngleToLeft2 = giveRandomNumberBetween(3.55, 3.7);
	let rightRandom = (Math.ceil(Math.random() * 10) % 2 == 1) ? randomAngleToRight1 : randomAngleToRight2;
	let leftRandom = (Math.ceil(Math.random() * 10) % 2 == 1) ? randomAngleToLeft1 : randomAngleToLeft2;

	return ((Math.ceil(Math.random() * 10) % 2 == 1) ? rightRandom : leftRandom);
}

export function giveRandomNumberBetween(min, max) {
	return Math.random() * (max - min) + min;
}