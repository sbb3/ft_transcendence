// import { useState, useRef, useEffect , React} from "react";


// const canvasRef = useRef(null);
// export const canvas = canvasRef.current;
// export const ctx = canvas.getContext("2d");

export interface Paddle {
    x: number;
    y: number;
    widthe: number;
    height: number;
    color: string;
    score:number;
}


export interface canvaState {
    width : number;
    height : number;
}

export interface Ball {
    x: number;
    y: number;
    radius: number;
    speed: number;
    velocityX: number;
    velocityY: number;
    color : string;
}

// export interface allE {
//     B: Ball;
//     hP: hPaddle;
//     mP: mPaddle;
// }

export interface Gol {
    num: string;
    x: number;
    y: number;
    color: string;
}

// export interface Ball {
//     x: 512;
//     y: 288;
//     radius: 10;
//     speed: 5;
//     velocityX: 5;
//     velocityY: 5;
//     color : "WHITE";
// }

// export interface hPaddle {
//     x: 984;
//     y: 140;
//     widthe: 20;
//     height: 90;
//     color: "green";
//     score:0;
// }

// export interface mPaddle {
//     x: 20;
//     y: 300;
//     widthe: 20;
//     height: 90;
//     color: "orange";
//     score:0;
// }
