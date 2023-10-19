// import { Flex } from "@chakra-ui/react";
import useTitle from "src/hooks/useTitle";
import { useState, useRef, useEffect , React} from "react";
import { Paddle, Ball, Gol, canvaState} from "./interfaces";
import io, {Socket} from "socket.io-client"
import { allFakers } from "@faker-js/faker";
import { date } from "yup";


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



  // const v = useRef(mPaddle.current, hPaddle.current, ball.current)
  function draw() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 600, 400)

    drawCircle(ctx, ball);
    drawRect(ctx, mPaddle);
    drawRect(ctx, hPaddle);
    drawLine(ctx,4,8,canvaS?.width/2,0,0,576,"white");
    drawtext(ctx,mPaddle?.score,canvaS?.width/4, canvaS?.height/5, "white");
    drawtext(ctx,hPaddle?.score,3*canvaS?.width/4, canvaS?.height/5, "white");
    // requestAnimationFrame(draw)
  }
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


  useEffect(() => {
    // const canvas = canvasRef.current;
    // const ctx = canvas.getContext("2d");


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


    draw();
    // socket?.emit('mvBall');
    socket?.on('intBall',(bl : Ball) => {
      setBall(bl);
    })
    // draw();
    // socket?.on('bootPaddel', mvBootPaddle)
    // drawRect(ctx, hPaddle);
    
    // drawCircle(ctx, ball);
    // drawRect(ctx, mPaddle);
    // drawRect(ctx, hPaddle);
    // drawLine(ctx,4,8,canvaS?.width/2,0,0,576,"white");
    // drawtext(ctx,mPaddle?.score,canvaS?.width/4, canvaS?.height/5, "white");
    // drawtext(ctx,hPaddle?.score,3*canvaS?.width/4, canvaS?.height/5, "white");
    // return () => {
    //   socket?.off("mvBall", mvball);
    //   socket?.off("bootPaddel", mvBootPaddle);
    // };
  }, [])

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
    // const canvas = canvasRef.current;
    // const ctx = canvas.getContext("2d");
    // ctx.clearRect(0, 0, 600, 400)
    // drawLine(ctx,4,8,canvaS?.width/2,0,0,576,"white");
    // drawtext(ctx,mPaddle?.score,canvaS?.width/4, canvaS?.height/5, "white");
    // drawtext(ctx,hPaddle?.score,3*canvaS?.width/4, canvaS?.height/5, "white");
    socket?.emit('mvBall');
    socket?.on('mvBall', mvball);
    // drawCircle(ctx, ball);
    socket?.on('bootPaddel', mvBootPaddle);
    // drawRect(ctx, hPaddle);
    draw();
    return () => {
      socket?.off("mvBall", mvball);
      socket?.off("bootPaddel", mvBootPaddle);
    };

  }, [ball])

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 600, 400)
    canvas.addEventListener('mvMouse', (event) => {
      console.log("hfddfdfs",event.clientX);
      socket?.emit('mvPaddle', event.clientX);
      socket?.on('mvPaddle', (paddle : Paddle) => {
        setMPaddle(paddle);
      })
      draw();
      // drawRect(ctx, mPaddle);
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
