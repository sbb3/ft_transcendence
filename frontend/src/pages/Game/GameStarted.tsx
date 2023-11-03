import { Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTitle from "src/hooks/useTitle";
import { Ball, Paddle, canvaState } from "./interfaces";
import io, { Socket } from "socket.io-client";
import { draw, } from "./DrawUtils";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";

// import { useHistory } from 'react-router-dom';


const GameStarted = ({ gameData = {} }) => {
  useTitle("Game");
  const toast = useToast();
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bool, setBool] = useState<boolean>(true);


  const [socket, setSocket] = useState<Socket>();
  const [mPaddle, setMPaddle] = useState<Paddle>();
  const [hPaddle, setHPaddle] = useState<Paddle>();
  // const [gameEnded, setGameEnded] = useState(false);

  const [ball, setBall] = useState<Ball>();
  const [canvaS, setCanvaS] = useState<canvaState>();

  const mvBallEvent = (bl: Ball) => {
    setBall(bl);
  }

  const gameOverEvent = (id: number) => {
    // socket?.emit('endGame', {
    //   room: gameData?.room,
    //   player_id: currentUser?.id,
    //   game_id: gameData?.id,
    // });
    if (id === currentUser?.id) {
      toast({
        title: "You win",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "You lose",
        description: "You lose",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    socket?.close();
    // setTimeout(() => {
    navigate("/game", {
      replace: true,
    })
    // } , 300);
  };

  const mvPaddleEvent = (paddle: Paddle) => {
    if (paddle.x === 0)
      setMPaddle(paddle);
    else
      setHPaddle(paddle);
  }

  useEffect(() => {
    const newsocket = io("http://localhost:3000/play", {
      reconnection: false,
    });

    setSocket(newsocket);
    const beforeTimeEvent = () => {
      toast({
        title: "Your opponent left the game",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      // socket?.close();
      // setTimeout(() => {
      navigate("/game", {
        replace: true,
      })
      // } , 300);
    }

    newsocket?.on("befforTime", beforeTimeEvent);
    // newsocket?.on("mvPaddle", mvPaddleEvent);

    return () => {
      if (canvasRef?.current)
        canvasRef?.current?.removeEventListener("mousemove", eventPaddel);
      newsocket?.off("befforTime", beforeTimeEvent);
      newsocket?.off("initMyP", initPaddleSocket);
      newsocket?.off("mvBall", mvBallEvent);
      newsocket?.off("gameOver", gameOverEvent);
      newsocket?.off("mvPaddle", mvPaddleEvent);
      newsocket?.close();
    };
  }, []);

  // useEffect(() => {
  //   if (location.pathname !== "/game/*") {
  //     // The route has changed from '/game' to some other route.
  //     // You can perform actions here.
  //     console.log("Player changed the route.");
  //     socket?.on("disconnect", () => {
  //       socket?.close();
  //       console.log("disconnect");
  //     } );
  //     // socket?.colose();
  //   }
  // }, [location]);

  const [int, setInt] = useState(false);

  const initPaddleSocket = (canvaS: canvaState, ball: Ball, mPaddle: Paddle, hPaddle: Paddle) => {
    setCanvaS(canvaS);
    setBall(ball);
    setMPaddle(mPaddle);
    setHPaddle(hPaddle);
  }

  useEffect(() => {
    if (!int && socket) {
      setInt(true);
      // console.log("Room here + ", gameData?.room);
      socket?.emit("initMyP", gameData?.room, currentUser?.id, gameData?.id);
      // console.log("Here init paddle")
      socket?.on("initMyP", initPaddleSocket);
      draw(canvasRef, ball, mPaddle, hPaddle, canvaS);
    }
  }, [socket]);


  const mvBootPaddle = (paddle: Paddle) => {
    setHPaddle(paddle);
  };


  const [gol, setGol] = useState<boolean>(false);

  useEffect(() => {
    if (!gol && ball && mPaddle && hPaddle && canvaS) {
      setGol(true);
      socket?.emit("mvBall", {
        room: gameData?.room,
        player_id: currentUser?.id,
        game_id: gameData?.id,
      });
      // socket?.emit("mvBall", gameData?.room, currentUser?.id, gameData?.id);
      socket?.on("mvBall", mvBallEvent);

      // console.log("currentUser?.id :", currentUser?.id);
      // console.log("scooooooooooooooooooooooooore", ball.score_my, ball.score_her);
      socket?.on("gameOver", gameOverEvent);
    }

    // console.log('ball', ball);
    draw(canvasRef, ball, mPaddle, hPaddle, canvaS);
  }, [socket, ball, mPaddle, hPaddle, canvaS, int]);



  const eventPaddel = (event) => {
    let rect = canvasRef.current.getBoundingClientRect();
    const num = event.clientY - rect.top;
    setBool(false);

    // console.log(socket);
    socket?.emit("mvPaddle", {
      num: num,
      room: gameData?.room,
      id: currentUser?.id,
    });
    console.log("Mv paddle here");
    socket?.on("mvPaddle", mvPaddleEvent);
  }


  useEffect(() => {
    if (canvasRef.current && bool) {
      canvasRef.current.addEventListener("mousemove", eventPaddel);
    }

  }, [socket, mPaddle, hPaddle, canvasRef, bool, int]);







  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d');

  //   // Add your drawing logic here


  //   // Start an animation loop to continuously update the Canvas
  //   // function animate() {
  //   //   drawEnd();
  //   //   requestAnimationFrame(animate);
  //   // }

  //   // animate();
  // }, [gameEnded]);



  // Handle game ending and draw something on the Canvas when the game ends
  // function handleGameEnd() {
  //   // Add your game-ending logic here
  //   setGameEnded(true);
  // }





  return (
    <canvas
      ref={canvasRef}
      width="600"
      height="400"
    // onClick={(e) => {
    //   alert("player stop the game");
    // }}
    />
  );
};

export default GameStarted;

