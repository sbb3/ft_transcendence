// import { Flex } from "@chakra-ui/react";
import useTitle from "src/hooks/useTitle";
import { useState, useRef, useEffect } from "react";
import io, {Socket} from "socket.io-client"

import MessageInput from "./Messageinput";
import Messages from "./messages";

const Game = () => {

  useTitle("Gamee");
  const [messages, setMessages] = useState<string[]>([])
  const socket = io("http://localhost:3000/play");
  const send = (value: string) => {
    socket?.emit("msgToServer", value)
  }

  const messageListener = (message: string) => {
    setMessages([...messages, message])
  }

  socket.on("connect", () => {
    console.log(socket.id); 
  });

  useEffect(() => {
    socket?.on("message", messageListener)
    return () => {
      socket?.off("message", messageListener)
    }
  }, [messageListener])
  
  // const [mPaddle, setMPaddle] = useState(null);
  // const [hPaddle, setHPaddle] = useState(null);
  // const [ball, setBall] = useState(null);

  // const canvasRef = useRef(null);
	// useEffect(() => {
	// 	const canvas = canvasRef.current;
    
	// 	const mPaddle = canvas.getContext("2d");
  //   mPaddle.strokeStyle = "orange";
  //   mPaddle.lineWidth = 3;
  //   mPaddle.strokeRect(20,300,20,90);

  //   const hPaddle = canvas.getContext("2d");
  //   hPaddle.strokeStyle = "green";
  //   hPaddle.strokeRect(984,140,20,90);

  //   const ball = canvas.getContext("2d");
  //   ball.beginPath();
  //   ball.fillStyle = ("yellow");
  //   ball.arc(600, 250, 10, 0, 2 * Math.PI);
  //   ball.fill();
  //   ball.closePath();

  //   const mRes = canvas.getContext("2d");
  //   mRes.strokeStyle = "white";
  //   mRes.font = " 50px serif";
  //   mRes.strokeText(0,256,40);

  //   const hRes2 = canvas.getContext("2d");
  //   hRes2.strokeStyle = "white";
  //   hRes2.font = "50px serif";
  //   hRes2.strokeText(3,768,40);

  //   const line = canvas.getContext("2d");
  //   line.setLineDash([4, 8]);
  //   line.strokeStyle = "white";
  //   line.strokeRect(512,0,0,576);


  //   setBall(ball);
  //   setMPaddle(mPaddle);
  //   setHPaddle(hPaddle);
	// }, []);


  return (
    <>
    {" "}
    <MessageInput send={send} />
    <Messages messages={messages}/>
    </>
    // <div>
    //   <canvas ref={canvasRef}
    //         width="1024"
    //         height="576"
    //         style={{ border: "2px solid blue" }}
    //         />
    // </div>
  );
};

export default Game;
/*
destructing
usestate
useref
useEffect

let i = 0
const [name, setName] = useState("");

*/