// import { Flex } from "@chakra-ui/react";
import useTitle from "src/hooks/useTitle";
import { useState, useRef, useEffect } from "react";
import { mPaddle, hPaddle, Ball, allE} from "./interfaces";
import io, {Socket} from "socket.io-client"
import { allFakers } from "@faker-js/faker";

// import MessageInput from "./Messageinput";
// import Messages from "./messages";

const Game = () => {

  useTitle("Gamee");
  // const [messages, setMessages] = useState<string[]>([])
  
  // useEffect(() => {
  //   const socket = io("http://localhost:3000/play");

    // return () => socket.disconnect();
  // }, [])
  const socket = io("http://localhost:3000/play");

  const [mPaddlee, setMPaddle] = useState<mPaddle>();
  const [hPaddle, setHPaddle] = useState(null);
  const [ball, setBall] = useState(null);


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

  socket.on("connect", () => {

    console.log(socket.id);
  });

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

  const canvasRef = useRef(null);


  // function drawRect(ctx, rec: mPaddle) {
  //   ctx.fillStyle = rec.color;
  //   ctx.fillRect(rec.x, rec.y, rec.widthe, rec.height);
  //   ctx.fillStyle = rec.color;
  //   ctx.fillRect(rec.x, rec.y, rec.widthe, rec.height);
  // }

  // function drawCircle(ctx, cir : Ball){
  //   ctx.beginPath();
  //   ctx.fillStyle = cir.color;
  //   ctx.arc(cir.x,cir.y,cir.radius,0,Math.PI*2,false);
  //   ctx.closePath();
  //   ctx.fill();
  // }

    function drawRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  function drawCircle(ctx, x, y, r, color){
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
  }

  function drawtext(ctx,text,x,y,color){
    ctx.fillStyle = color;
    ctx.font = "50px serif";
    ctx.fillText(text,x,y);
  }

  function drawLine(ctx,a,b,c,d,e,f,color){
    ctx.setLineDash([a, b]);
    ctx.strokeStyle = color;
    ctx.strokeRect(c,d,e,f);
  }

  // const B = Ball;
  // const Rm = mPaddle;
  // const Rh = mPaddle;

  // socket.on("onKlickOne", all)

	useEffect(() => {
		const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    drawLine(ctx,4,8,512,0,0,576,"white")
    drawRect(ctx, 20, 300, 20, 90, "orange")
    drawRect(ctx, 984, 140, 20, 90, "green")
    drawCircle(ctx, 512, 288, 10, "white")
    // drawRect(ctx, myP);
    // drawRect(ctx,Rh);
    // drawCircle(ctx,B);
    drawtext(ctx,"3",256,40,"white");
    drawtext(ctx,"0",768,40,"white");

    // setBall(ball);
    // setMPaddle(mPaddle);
    // setHPaddle(hPaddle);
	}, []);

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













// import { Flex } from "@chakra-ui/react";
import useTitle from "src/hooks/useTitle";
import { useState, useRef, useEffect , React} from "react";
import { Paddle, Ball, Gol, canvaState} from "./interfaces";
import io, {Socket} from "socket.io-client"
import { allFakers } from "@faker-js/faker";
import { date } from "yup";


const Game = () => {
  useTitle("Game");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // const ctx = ;
  
  
  const [socket , setSocket] = useState<Socket>()
  const [mPaddle, setMPaddle] = useState<Paddle>();
  const [hPaddle, setHPaddle] = useState<Paddle>();
  const [mGol, setmGole] = useState<Gol>();
  const [hGol, sethGole] = useState<Gol>();
  const [ball, setBall] = useState<Ball>();
  const [canvaS, setCanvaS] = useState<canvaState>();
  // const [ctx, setCtx] = useState();
  // setCtx(canvas.getContext("2d"));


  function drawRect(ctx, rec) {
    ctx.fillStyle = rec?.color;
    ctx.fillRect(rec?.x, rec?.y, rec?.widthe, rec?.height);
  }
  
  function drawCircle(ctx, cir : Ball){
    ctx.clearRect(0, 0, canvaS.width, canvaS.height);
    ctx.fillStyle = cir?.color;
    ctx.beginPath();
    ctx.arc(cir?.x,cir?.y,cir?.radius,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
  }
  
  function drawtext(ctx,num, x, y, color){
    ctx.fillStyle = color;
    ctx.font = "40px fantasy";
    ctx.fillText(num,x,y);
  }
                          
  function drawLine(ctx,a,b,c,d,e,f,color){
    ctx.setLineDash([a, b]);
    ctx.strokeStyle = color;
    ctx.strokeRect(c,d,e,f);
  }

  // const creatSocket = (newsocket : Socket) => {
  //   setSocket (newsocket);
  // }

  
  useEffect (() => {
    const newsocket = io("http://localhost:3000/play", {
      reconnection: false
    });
    setSocket (newsocket);
    // return () => {
    //   socket?.close();
    // };
  }, [])


  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");


    // socket?.emit('ballMv');
    // socket?.on('bal', (bl) => {
    //   setBall(bl);
    // })
    // drawCircle(ctx, ball);
 
    socket?.emit('initMyP');
    socket?.on('canvaState', (cvS) => {
      setCanvaS(cvS);
    })
    socket?.on('myP', (mp) => {
      setMPaddle(mp);
    })
    socket?.on('herP', (hp) => {
      setHPaddle(hp);
    })
    socket?.on('myGol', (mg) => {
      setmGole(mg);
    })
    
    socket?.on('herGol', (hg) => {
      sethGole(hg);
    })



    // socket?.emit('mvBall');
    socket?.on('intBall',(bl : Ball) => {
      setBall(bl);
    })
    // socket?.on('bootPaddel', mvBootPaddle)
    // drawRect(ctx, hPaddle);
    
    drawCircle(ctx, ball);
    drawRect(ctx, mPaddle);
    drawRect(ctx, hPaddle);
    drawLine(ctx,4,8,canvaS?.width/2,0,0,576,"white");
    drawtext(ctx,mPaddle?.score,canvaS?.width/4, canvaS?.height/5, "white");
    drawtext(ctx,hPaddle?.score,3*canvaS?.width/4, canvaS?.height/5, "white");
    // return () => {
    //   socket?.off("mvBall", mvball);
    //   socket?.off("bootPaddel", mvBootPaddle);
    // };
  }, [])

  const mvball = (bl : Ball) => {
    setBall(bl);
  }

  const mvBootPaddle = (paddle : Paddle) => {
    setHPaddle(paddle);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    socket?.emit('mvBall');
    socket?.on('mvBall', mvball);
    drawCircle(ctx, ball);
    socket?.on('bootPaddel', mvBootPaddle);
    drawRect(ctx, hPaddle);

    return () => {
      socket?.off("mvBall", mvball);
      socket?.off("bootPaddel", mvBootPaddle);
    };

  }, [ball])

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    canvas.addEventListener('mvMouse', (event) => {
      socket?.emit('mvPaddle', event.clientX);
      socket?.on('mvPaddle', (paddle : Paddle) => {
        setMPaddle(paddle);
      })
      drawRect(ctx, mPaddle);
    });
  }, [mPaddle])


  useEffect(() => {



  }, [mPaddle, hPaddle, ball, hGol, mGol])


  return (
    <>
    <div>
      <canvas ref={canvasRef}
            width="600"
            height="400"
            style={{ border: "2px solid blue" }}
            onClick={e => {
              alert(e.clientX)
            }}
            />
    </div>
    </>

  );
};

export default Game;
