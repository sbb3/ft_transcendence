import { Logger } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import path from 'path';
import { Server, Socket } from 'socket.io';
import {Paddle, Ball, Gol, canvaState} from "./game.interface";



export function mouvePaddle(myp : Paddle, mouseY) {
    myp.y = mouseY - myp.height / 2
    return myp;
}

export function bootPaddle(ball : Ball, myp : Paddle) {
    myp.y = ball.y - (myp.y + myp.height / 2) * 0.1;
}

export function restBall(ball : Ball, canva : canvaState) {
    ball.x= canva.width/2,
    ball.y= canva.height/2,
    ball.radius= 10,
    ball.speed= 2,
    ball.velocityX= 2,
    ball.velocityY= 2,
    ball.color ="white"
    return ball;
}

export function collision(myp : Paddle, ball : Ball ) {
    return ((myp.x < ball.x + ball.radius) && (myp.x > ball.y + ball.radius) && (myp.x + myp.widthe > ball.x - ball.radius) && (myp.y + myp.height > ball.y - ball.radius))
}

export function update(ball : Ball, canva : canvaState, myp : Paddle, herp : Paddle) { 

    ball.x += ball.velocityX;
    ball.y +=ball.velocityY;

    // herp.y += ball.y - (herp.y + herp.height / 2) * 0.1;

    if (ball.y + ball.radius > canva.height || ball.y + ball.radius < 0)
        ball.velocityY = -ball.velocityY
    // if (ball.x + ball.radius > canva.width || ball.x - ball.radius < 0)
    //     ball.velocityX = -ball.velocityX

    let player  = (ball.x < canva.width/2) ? myp : herp;
    if (collision(player, ball)) {
        let center = ((ball.y - (player.y + player.height / 2)) / player.height / 2);
        let angl = center * (Math.PI/4);
        let dir = (ball.x < canva.width/2) ? 1 : -1;

        ball.velocityX = ball.speed * Math.cos(angl) * dir;
        ball.velocityY = ball.speed * Math.sin(angl) * dir;

        ball.speed += 0.1;
    }
    if (ball.x - ball.radius < 0) {
        myp.score++;
        ball = restBall(ball, canva);
        
    }
    else if (ball.x + ball.radius > canva.width)
    {
        herp.score++;
        ball = restBall(ball, canva);
    }
    return ball;
}

