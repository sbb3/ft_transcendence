export interface Paddle {
	x: number;
	y: number;
	widthe: number;
	height: number;
	color: string;
}

export interface Ball {
	x: number;
	y: number;
	radius: number;
	speed: number;
	velocityX: number;
	velocityY: number;
	score_my: number,
	score_her: number,
	color: string;
}

export interface canvaState {
	width: number;
	height: number;
}

export interface Room {
	startGame: boolean;
	endGame: boolean;
	id_game: number;
	idFirstPlayer: string;
	id_socket_first: any;
	idSecondPlayer: string;
	id_socket_second: any;
	myPaddle: Paddle;
	herPaddle: Paddle;
	intervalId: any;
	ball: Ball;
	is_empty: boolean;
	canvasState: canvaState;
}
