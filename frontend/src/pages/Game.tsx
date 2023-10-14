// import { Flex } from "@chakra-ui/react";
import useTitle from "src/hooks/useTitle";
import { useState, useRef, useEffect } from "react";
import { mPaddle, Ball, Gol} from "./interfaces";
import io, {Socket} from "socket.io-client"
import { allFakers } from "@faker-js/faker";
import { date } from "yup";

// import MessageInput from "./Messageinput";
// import Messages from "./messages";

const Game = () => {
  const [socket , setSocket] = useState<Socket>()
  useTitle("Gamee");
  // const [messages, setMessages] = useState<string[]>([])
  
  useEffect(() => {
    const newsocket = io("http://localhost:3000/play", {
      reconnection: false
    });
    setSocket (newsocket);

  //   // return () => socket.disconnect();
  }, [])
  // const socket = io("http://localhost:3000/play", {
  //   reconnection: false
  // });

  const [mPaddle, setMPaddle] = useState<mPaddle>();
  const [hPaddle, setHPaddle] = useState<mPaddle>();
  const [mGol, setmGole] = useState<Gol>();
  const [hGol, sethGole] = useState<Gol>();
  const [ball, setBall] = useState<Ball>();

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
  // }
useEffect(() => {
    socket?.emit('initMyP');
    socket?.on('myP', (mp) => {
      // console.log (data);
      
      setMPaddle(mp);
    })
    socket?.on('herP', (hp) => {
      // console.log("innnnnnnnnnnnnnnnnnnnn");
      setHPaddle(hp);
    })
    
    socket?.on('myGol', (mg) => {
      // console.log("innnnnnnnnnnnnnnnnnnnn");
      setmGole(mg);
    })
    
    socket?.on('herGol', (hg) => {
      // console.log("innnnnnnnnnnnnnnnnnnnn");
      sethGole(hg);
    })
    
    // socket?.emit('ballMv');
    // socket?.on('bal', (bl) => {
    //   // console.log("innnnnnnnnnnnnnnnnnnnn");
    //   setBall(bl);
    // })
}, [])

useEffect(() => {
    socket?.emit('ballMv');
    socket?.on('bal', (bl) => {
      // console.log("innnnnnnnnnnnnnnnnnnnn");
      setBall(bl);
    })
}, [ball])

function drawRect(ctx, rec) {
  ctx.fillStyle = rec?.color;
  ctx.fillRect(rec?.x, rec?.y, rec?.widthe, rec?.hweight);
}

function drawCircle(ctx, cir : Ball){
  ctx.beginPath();
  ctx.fillStyle = cir?.color;
  ctx.arc(cir?.x,cir?.y,cir?.radius,0,Math.PI*2,false);
  ctx.fill();
  ctx.closePath();
}

function drawtext(ctx,gol){
  ctx.fillStyle = gol?.color;
  ctx.font = "50px serif";
  ctx.fillText(gol?.num,gol?.x,gol?.y);
}
                        
function drawLine(ctx,a,b,c,d,e,f,color){
  ctx.setLineDash([a, b]);
  ctx.strokeStyle = color;
  ctx.strokeRect(c,d,e,f);
}

  // useEffect(() => {

  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   ctx.beginPath();
  //   console.log(ball);
  //   ctx.fillStyle = ball?.color;
  //   ctx.arc(ball?.x,ball?.y,ball?.radius,0,Math.PI*2,false);
  //   ctx.closePath();
  // //   drawCircle(ctx, ball);

  // }, [ball])


                  useEffect(() => {
    // if (!socket)
    // {
    //   console.log("not connected ");
    // }
    // else{

    // console.log(mPaddlee);
                    const canvas = canvasRef.current;
                    const ctx = canvas.getContext("2d");

                    drawRect(ctx, mPaddle);
                    drawRect(ctx, hPaddle);
                    drawCircle(ctx, ball);
                    drawLine(ctx,4,8,512,0,0,576,"white");
                    drawtext(ctx,mGol);
                    drawtext(ctx,hGol);
                    // console.log(ball);
                    // ctx.beginPath();
                    // ctx.fillStyle = ball.color;
                    // ctx.arc(ball.x,ball.y,ball.radius,0,Math.PI*2,false);
                    // ctx.closePath();
                    // ctx.fill();
                    // drawCircle(ctx, ball);
                    // ctx.fillStyle = "orange";
                    // ctx.fillRect(20, 300, 20, 90);

                    // ctx.beginPath();
                    // console.log(ball);
                    // ctx.fillStyle = ball?.color;
                    // ctx.arc(ball?.x,ball?.y,ball?.radius,0,Math.PI*2,false);
                    // ctx.closePath();


                    // ctx.fillStyle = mPaddle?.color;
                    // ctx.fillRect(mPaddle?.x, mPaddle?.y, mPaddle?.widthe, mPaddle?.hweight);

                    // ctx.fillStyle = hPaddle?.color;
                    // ctx.fillRect(hPaddle?.x, hPaddle?.y, hPaddle?.widthe, hPaddle?.hweight);
                    // ctx.fillStyle = mPaddlee?.color;
                    // ctx.fillRect(mPaddlee?.x, mPaddlee?.y, mPaddlee?.widthe, mPaddlee?.hweight);
                  }, [mPaddle, hPaddle, ball, hGol, mGol])



  // function handlKeyUp(){
  //   // if (event.key == "w") {
      // socket.emit("upMyP", mPaddlee);
      // console.log ("keeeeyyyyyyyyyyy");
    // }
      // socket.emit("upMyP", mPaddlee);
  // }

  // socket?.on("afterInit", () => {
  // // 	const canvas = canvasRef.current;
    
	// // 	const mPaddle = canvas.getContext("2d");
  // console.log ("keeeeyyyyyyyyyyy");
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

		// const canvas = canvasRef.current;
    // const ctx = canvas.getContext("2d");
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