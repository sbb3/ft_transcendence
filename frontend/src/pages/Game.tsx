// import { Flex } from "@chakra-ui/react";
import useTitle from "src/hooks/useTitle";
import { useState, useRef, useEffect , React} from "react";
import { Paddle, Ball, Gol, canvaState} from "./interfaces";
import io, {Socket} from "socket.io-client"
import { allFakers } from "@faker-js/faker";
import { date } from "yup";


function draw(ctx, mPaddle, hPaddle, canvaS, ball) {
  // console.log(mPaddle);
  // let delta = 0;

  // if (previous.current != 0)
  // {
  //   delta = time - previous.current;
  //   previous.current = time;  
  // }
  // previous.current = time;
  // console.log(delta);
  // const canvas = canvasRef.current;
  // console.log(ball)
  ctx.clearRect(0, 0, 600, 400)
  drawCircle(ctx, ball);
  drawRect(ctx, mPaddle);
  drawRect(ctx, hPaddle);
  drawLine(ctx,4,8,canvaS?.width/2,0,0,576,"white");
  drawtext(ctx,mPaddle?.score,canvaS?.width/4, canvaS?.height/5, "white");
  drawtext(ctx,hPaddle?.score,3*canvaS?.width/4, canvaS?.height/5, "white");
  // requestAnimationFrame(draw)
  // requestAnimationFrame(() => draw(ctx, mPaddle, hPaddle, canvaS, ball))
}

function drawRect(ctx, rec) {
  ctx.fillStyle = rec?.color;
  ctx.fillRect(rec?.x, rec?.y, rec?.widthe, rec?.height);
}

function drawCircle(ctx, cir : Ball){
  // ctx.clearRect(0, 0, canvaS.width, canvaS.height);
  // console.log(cir.speed)
  // console.log(ball?.speed)
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



const Game = () => {
  useTitle("Game");

  // const canvasRef = useRef(null);
  
  // const ctx = ;
  
  
  const canvasRef = useRef(null);
  const [socket , setSocket] = useState<Socket>()
  const [mPaddle, setMPaddle] = useState<Paddle>();
  const [hPaddle, setHPaddle] = useState<Paddle>();
  const [mGol, setmGole] = useState<Gol>();
  const [hGol, sethGole] = useState<Gol>();
  const [ball, setBall] = useState<Ball>();
  const [canvaS, setCanvaS] = useState<canvaState>();
  // const refball = useRef(ball)
  // const refmPaddle = useRef(mPaddle)
  // const refhPaddle = useRef(hPaddle)
  // const refcanvaS = useRef(canvaS)
  // const [ctx, setCtx] = useState();
  // setCtx(canvas.getContext("2d"));

  useEffect (() => {
    const newsocket = io("http://localhost:3000/play", {
      reconnection: false
    });
    setSocket (newsocket);
    // socket.open();
    // newsocket.connect();
    // return(() => {newsocket.disconnect()});
    // console.log('socket init')
  }, [])

  const mvMyPaddel = (paddle : Paddle) => {
    setMPaddle(paddle);
  }
  
  // let initRef = false;

  // useEffect(() => {
  //   // if (!initRef) {
  //   //   initRef = true
  //     refball.current = ball
  //     refmPaddle.current = mPaddle
  //     refhPaddle.current = hPaddle
  //     refcanvaS.current = canvaS
  //   // }
  // }, [ball, mPaddle, hPaddle])


  const eventPaddel = (event) => {
    // console.log("event : ====> ",event.clientX);
    let rect = canvasRef.current.getBoundingClientRect();
    // console.log(rect.top)
    const num = event.clientY - rect.top
    socket?.emit('mvPaddle', num);
    socket?.on('mvPaddle', mvMyPaddel)
    
    // mPaddle.y = event.clientX;
    // drawRect(ctx, mPaddle);
    // return () => {
    //   socket?.off("mvPaddle", mvMyPaddel);
    //   // canvas.removeEventListener('mousemove', eventPaddel)
    // };
  }

  // let check = false
  // let initRef = false;
  


  // const creatSocket = (newsocket : Socket) => {
  //   setSocket (newsocket);
  // }

  
  
  
  useEffect(() => {
      socket?.emit('initMyP');
      console.log('hiiiiiiiii')
      // socket?.on('canvaState', (cvS, mp : Paddle, hp : Paddle) => {
        //   setCanvaS(cvS);
        //   setMPaddle(mp);
        //   setHPaddle(hp);
        // })
        socket?.emit('initMyP');
        socket?.on('canvaState', (cvS) => {
          setCanvaS(cvS);
          console.log('Received data:', cvS);
        })
      // socket?.on('myP', (mp) => {
      //   // console.log (data);
  
      //   setMPaddle(mp);
      // })
      // socket?.on('herP', (hp) => {
      //   // console.log("innnnnnnnnnnnnnnnnnnnn");
      //   setHPaddle(hp);
      // })
  }, [])

  useEffect (() => {
    if (!canvasRef.current) 
      return
    const ctx = canvasRef.current.getContext("2d");
    // draw(ctx, refmPaddle, refhPaddle, refcanvaS, refball)
    draw(ctx, mPaddle, hPaddle, canvaS, ball)
    // console.log('draaaaw')
  }, [])


  const mvball = (bl : Ball) => {
    setBall(bl);
  }

  const mvBootPaddle = (paddle : Paddle) => {
    setHPaddle(paddle);
  }

  useEffect(() => {
    
    socket?.emit('mvBall');
    socket?.on('mvBall', mvball, mvBootPaddle);
    // socket?.on('bootPaddel', mvBootPaddle);
    // return () => {
    //   socket?.off("mvBall", mvball);
    //   socket?.off("bootPaddel", mvBootPaddle);
    // };
    // console.log('move balllllllllll')
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return
    canvasRef.current.addEventListener('mousemove', eventPaddel);
    // return () => {
    //   // socket?.off("mvPaddle", mvMyPaddel);
    //   canvasRef.current.removeEventListener('mousemove', eventPaddel)
    // };
  }, [mPaddle])


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
