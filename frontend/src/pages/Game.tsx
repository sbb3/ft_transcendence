// import { Flex } from "@chakra-ui/react";
import useTitle from "src/hooks/useTitle";
import { useState, useRef, useEffect , React} from "react";
import { Paddle, Ball, Gol, canvaState} from "./interfaces";
import io, {Socket} from "socket.io-client"
import { allFakers } from "@faker-js/faker";
import { date } from "yup";



let bool = true;
function drawRect(ctx, rec) {
  ctx.fillStyle = rec?.color;
  ctx.fillRect(rec?.x, rec?.y, rec?.widthe, rec?.height);
}

function drawCircle(ctx, cir : Ball){
  // ctx.clearRect(0, 0, canvaS.width, canvaS.height);
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


function draw(ctx, ball, mPaddle, hPaddle, canvaS) {
  // const canvas = canvasRef.current;
  // const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 600, 400)

  drawCircle(ctx, ball);
  drawRect(ctx, mPaddle);
  drawRect(ctx, hPaddle);
  drawLine(ctx,4,8,canvaS?.width/2,0,0,576,"white");
  drawtext(ctx,mPaddle?.score,canvaS?.width/4, canvaS?.height/5, "white");
  drawtext(ctx,hPaddle?.score,3*canvaS?.width/4, canvaS?.height/5, "white");
  // requestAnimationFrame(draw)
  // requestAnimationFrame(() => draw(ctx, ball, mPaddle, hPaddle, canvaS))
}

const Game = () => {
  useTitle("Game");

  const canvasRef = useRef(null);
  
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




  // const v = useRef(mPaddle.current, hPaddle.current, ball.current)

  // draw();

  // const creatSocket = (newsocket : Socket) => {
  //   setSocket (newsocket);
  // }

  
  useEffect (() => {
    const newsocket = io("http://localhost:3000/play", {
      reconnection: false
    });
    setSocket (newsocket);
    // const canvas = canvasRef.current;
    // const ctx = canvas.getContext("2d");
    // return () => {
    //   socket?.close();
    // };
  }, [])

  let int = false
  useEffect(() => {
    if (!int) {
      int = true
      socket?.emit('initMyP');
      socket?.on('canvaState', (cvS, ball, hrp, myp) => {
        setCanvaS(cvS);
        setBall(ball);
        setHPaddle(hrp);
        setMPaddle(myp);
      })
    }
  }, [socket])

  // useEffect(() => {
  //   draw();
  // }, [ball, mPaddle, hPaddle])

  const mvball = (bl : Ball) => {
    setBall(bl);
  }

  const mvBootPaddle = (paddle : Paddle) => {
    setHPaddle(paddle);
  }

  useEffect(() => {
    
    // ctx.clearRect(0, 0, 600, 400)
    // drawLine(ctx,4,8,canvaS?.width/2,0,0,576,"white");
    // drawtext(ctx,mPaddle?.score,canvaS?.width/4, canvaS?.height/5, "white");
    // drawtext(ctx,hPaddle?.score,3*canvaS?.width/4, canvaS?.height/5, "white");
    socket?.emit('mvBall');
    socket?.on('mvBall', mvball);
    // drawCircle(ctx, ball);
    socket?.on('bootPaddel', mvBootPaddle);
    // drawRect(ctx, hPaddle);
    
    return () => {
      socket?.off("mvBall", mvball);
      socket?.off("bootPaddel", mvBootPaddle);
    };

  }, [ball, socket])


  const mvMyPaddel = (paddle : Paddle) => {
    // console.log(paddle.y);
    setMPaddle(paddle);
  }
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    draw(ctx, ball, mPaddle, hPaddle, canvaS);
  }, [socket, ball, mPaddle]) 
  // }, []) 


  const eventPaddel = (event) => {
    let rect = canvasRef.current.getBoundingClientRect();
    const num = event.clientY - rect.top
    bool = false;
    socket?.emit('mvPaddle', num);
    // console.log('nuuuuuuuum',num);
    socket?.on('mvPaddle', mvMyPaddel)
    return () => {
      // socket?.off("mvPaddle", mvMyPaddel);
      canvasRef.current.removeEventListener('mousemove', eventPaddel)
    };
  }


  // const canvas = canvasRef.current;
  useEffect(() => {
    if (bool) 
      canvasRef.current.addEventListener('mousemove', eventPaddel);

  }, [mPaddle, socket])


  // useEffect(() => {



  // }, [mPaddle, hPaddle, ball, hGol, mGol])


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
