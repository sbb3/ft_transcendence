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
		ball.velocityX = 5,
		ball.velocityY = 5,
		ball.score_my = ball.score_my,
		ball.score_her = ball.score_her,
		ball.color = "white"
	return ball;
}

export function collision(myp: Paddle, ball: Ball) {

	if ((ball.y + ball.radius < myp.y) || (ball.y - ball.radius > myp.y + myp.height))
		return 1
	if ((ball.x + ball.radius > myp.x) || ball.x - ball.radius < myp.x + myp.widthe)
		return 2
	return 0
	// return ((myp.x < ball.x + ball.radius) && (myp.x > ball.y + ball.radius) && (myp.x + myp.widthe > ball.x - ball.radius) && (myp.y + myp.height > ball.y - ball.radius))
}

export function update(ball: Ball, canva: canvaState, myp: Paddle, herp: Paddle) {

	// ball.x += ball.velocityX;
	// ball.y += ball.velocityY;

	// console.log("Ball from back-end : " + ball.x);
	// console.log("Ball from back-end : " + ball.y);
	// // herp.y += ball.y - (herp.y + herp.height / 2) * 0.1;

	// if (ball.y + ball.radius >= canva.height || ball.y - ball.radius <= 0)
	//     ball.velocityY *= -1;
	// // if (ball.x + ball.radius > canva.width || ball.x - ball.radius < 0)
	// //     ball.velocityY *= -1;

	// let player  = (ball.x < canva.width/2) ? myp : herp;
	// if ((player == herp) && (ball.x + ball.radius > player.x)) {
	//     // return ;
	//     let center = ((ball.y - (player.y + player.height / 2)) / (player.height / 2));
	//     let angl = center * (Math.PI/4);
	//     ball.velocityX = -1;
	//     // ball.velocityY =  -1;

	//     // console.log();
	//     // ball.speed += 0.1;
	// }
	// else if ((player == myp) && (ball.x - ball.radius < player.x + player.widthe)) {
	//     let center = ((ball.y - (player.y + player.height / 2)) / (player.height / 2));
	//     let angl = center * (Math.PI/4);
	//     ball.velocityX *= -1;
	//     // ball.velocityY *= -1;
	//     // ball.speed += 0.1;
	// }

	// // Check the position of player (y axis)

	// if (ball.x - ball.radius <= 0) {
	//     console.log("goooooooooooool for hem");
	//     ball = restBall(ball, canva);
	//     ball.score_her++;
	//     // ball.x= canva.width/2;
	//     // ball.y= canva.height/2;

	// }
	// else if (ball.x + ball.radius > herp.x + herp.widthe)
	// {
	//     console.log("goooooooooooool for mey");
	//     ball = restBall(ball, canva);
	//     ball.score_my++;
	// //    ball.x= canva.width/2;
	// //    ball.y= canva.height/2;
	// }


	// return ball;
	ball.x += ball.velocityX;
	ball.y += ball.velocityY;
	// herp.y += ball.y - (herp.y + herp.height / 2) * 0.1;
	if (ball.y + ball.radius > canva.height || ball.y - ball.radius < 0)
		ball.velocityY = -ball.velocityY
	// if (ball.x + ball.radius > canva.width || ball.x - ball.radius < 0)
	//     ball.velocityX = -ball.velocityX
	let player = (ball.x < canva.width / 2) ? myp : herp;



	if ((player == herp) && (ball.x + ball.radius > player.x)) {
		let center = ((ball.y - (player.y + player.height / 2)) / (player.height / 2));
		let angl = center * (Math.PI / 4);
		//check if angl is < then 45 deg and make it == 45 deg
		if (angl > Math.PI / 4)
			angl = Math.PI / 4;

		// ball.velocityX =  (ball.speed * Math.cos(angl)) * -1;
		// ball.velocityY = (ball.speed * Math.sin(angl)) * -1;
		ball.velocityX = -1;
		// ball.speed += 0.1;
	}
	else if ((player == myp) && (ball.x - ball.radius < player.x + player.widthe)) {
		let center = ((ball.y - (player.y + player.height / 2)) / (player.height / 2));
		let angl = center * (Math.PI / 4);
		ball.velocityX *= -1;
		// ball.velocityX =  (ball.speed * Math.cos(angl));
		// ball.velocityY = (ball.speed * Math.sin(angl));
		// ball.speed += 0.1;
	}

	if ((ball.x - ball.radius < (myp.x + myp.widthe)) && (ball.y < myp.y || ball.y > (myp.y + myp.height))) {
		ball.score_her++;
		ball = restBall(ball, canva);
	}
	else if ((ball.x + ball.radius > herp.x) && (ball.y < herp.y || ball.y > (herp.y + herp.height))) {
		ball.score_my++;
		ball = restBall(ball, canva);
	}


	return ball;

}
