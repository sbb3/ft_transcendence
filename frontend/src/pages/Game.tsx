// import { Flex } from "@chakra-ui/react";
import useTitle from "src/hooks/useTitle";
import { useState, useRef, useEffect } from "react";
import { mPaddle, hPaddle, Ball, allE} from "./interfaces";
import io, {Socket} from "socket.io-client"
import { allFakers } from "@faker-js/faker";
import { date } from "yup";

// import MessageInput from "./Messageinput";
// import Messages from "./messages";

const Game = () => {
  // const [socket , setSocket] = useState<Socket>()
  useTitle("Gamee");
  // const [messages, setMessages] = useState<string[]>([])
  
  // useEffect(() => {
  //   setSocket (io("http://localhost:3000/play"));

  //   // return () => socket.disconnect();
  // }, [])
  const socket = io("http://localhost:3000/play");

  const [mPaddlee, setMPaddle] = useState<mPaddle>();
  const [hPaddle, setHPaddle] = useState(null);



  const [ball, setBall] = useState(null);

  const canvasRef = useRef(null);

  // const Paddlee = (e) : mPaddle  => {

  // }
  // setMPaddle(Paddlee);
  // window.addEventListener('keydown', mPaddlee);
 
  // const send = (value: string) => {
  //   socket?.emit("msgToServer", value)
  // }

  // const myP = (mp: mPaddle) => {
  //   setMPaddle(mp)
  // }
    

  // const messageListener = (message: string) => {
  //   setMessages([...messages, message])
  // }

  // socket.on("connect", () => {
  //   console.log(socket.id);
  // });

  

  // console.log("innnnnnnnnnnnnnnnnnnnn");
  // socket.on("update", (p: mPaddle) =>{
  //   setMPaddle(p);
  // })


  // socket.emit('initMyp');

  // const inp = (p: mPaddle) => {
  //   console.log("innnnnnnnnnnnnnnnnnnnn");
  //   setMPaddle(p);
  // }

  // socket.on('initMyp', (data) => {
  //   console.log (data);
  //   setMPaddle(data);
  // })
  socket.emit('start');
    // }
  socket.on('initMyp', (data: mPaddle) => {
      console.log (data);
      setMPaddle(data);
  })
  useEffect(() => {
    // if (!socket)
    // {
    //   console.log("not connected ");
    // }
    // else{

    // console.log("innnnnnnnnnnnnnnnnnnnn");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // ctx.fillStyle = "orange";
    // ctx.fillRect(20, 300, 20, 90);
    ctx.fillStyle = mPaddlee?.color;
    // console.log("innnnnnnnnnnnnnnnnnnnn", mPaddlee?.x);
    ctx.fillRect(mPaddlee?.x, mPaddlee?.y, mPaddlee?.widthe, mPaddlee?.hweight);
    // ctx.fillStyle = mPaddlee?.color;
    // ctx.fillRect(mPaddlee?.x, mPaddlee?.y, mPaddlee?.widthe, mPaddlee?.hweight);
  }, [mPaddlee])



  // function handlKeyUp(){
  //   // if (event.key == "w") {
      // socket.emit("upMyP", mPaddlee);
      // console.log ("keeeeyyyyyyyyyyy");
    // }
      // socket.emit("upMyP", mPaddlee);
  // }

  // socket.on("afterInit", () => {
  // // 	const canvas = canvasRef.current;
    
	// // 	const mPaddle = canvas.getContext("2d");
  //   console.log(socket.id); 
  // });
  // afterInit
  // useEffect(() => {
  //   socket?.on("message", messageListener)
  //   return () => {
  //     socket?.off("message", messageListener)
  //   }
  // }, [messageListener])

  //  useEffect(() => {
  //   socket?.on("mvMP", myP)
  //   return () => {
  //     socket?.off("mvMP", myP)
  //   }
  // }, [myP])




  // function drawRect(ctx, rec: mPaddle) {
  //   ctx.fillStyle = rec.color;
  //   ctx.fillRect(rec.x, rec.y, rec.widthe, rec.hweight);
  //   ctx.fillStyle = rec.color;
  //   ctx.fillRect(rec.x, rec.y, rec.widthe, rec.hweight);
  // }

  // function drawCircle(ctx, cir : Ball){
  //   ctx.beginPath();
  //   ctx.fillStyle = cir.color;
  //   ctx.arc(cir.x,cir.y,cir.radius,0,Math.PI*2,false);
  //   ctx.closePath();
  //   ctx.fill();
  // }

  //   function drawRect(ctx, x, y, w, h, color) {
  //   ctx.fillStyle = color;
  //   ctx.fillRect(x, y, w, h);
  //   ctx.fillStyle = color;
  //   ctx.fillRect(x, y, w, h);
  // }

  // function drawCircle(ctx, x, y, r, color){
  //   ctx.beginPath();
  //   ctx.fillStyle = color;
  //   ctx.arc(x,y,r,0,Math.PI*2,false);
  //   ctx.closePath();
  //   ctx.fill();
  // }

  // function drawtext(ctx,text,x,y,color){
  //   ctx.fillStyle = color;
  //   ctx.font = "50px serif";
  //   ctx.fillText(text,x,y);
  // }

  // function drawLine(ctx,a,b,c,d,e,f,color){
  //   ctx.setLineDash([a, b]);
  //   ctx.strokeStyle = color;
  //   ctx.strokeRect(c,d,e,f);
  // }

  // const B = Ball;
  // const Rm = mPaddle;
  // const Rh = mPaddle;

  // socket.on("onKlickOne", all)

	// useEffect(() => {
	// 	const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");

  //   drawLine(ctx,4,8,512,0,0,576,"white")
  //   drawRect(ctx, 20, 300, 20, 90, "orange")
  //   drawRect(ctx, 984, 140, 20, 90, "green")
  //   drawCircle(ctx, 512, 288, 10, "white")
  //   // drawRect(ctx, myP);
  //   // drawRect(ctx,Rh);
  //   // drawCircle(ctx,B);
  //   drawtext(ctx,"3",256,40,"white");
  //   drawtext(ctx,"0",768,40,"white");

  //   // setBall(ball);
  //   // setMPaddle(mPaddle);
  //   // setHPaddle(hPaddle);
	// }, []);


  return (
    // <>
    // {" "}
    // <MessageInput send={send} />
    // <Messages messages={messages}/>
    // </>
    <div>
      <canvas ref={canvasRef}
            width="1024"
            height="576"
            style={{ border: "2px solid blue" }}
            onClick={e => {
              alert(e.clientX)
            }}
            // onKeyUp={handlKeyUp}
            />
    </div>
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