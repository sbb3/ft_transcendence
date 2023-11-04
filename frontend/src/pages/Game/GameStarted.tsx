import { Button, Image } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useTitle from "src/hooks/useTitle";
import { Ball, Paddle, canvaState } from "./interfaces";
import io, { Socket } from "socket.io-client";
import { draw, } from "./DrawUtils";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";

const GameStarted = ({ gameData = {}, handleGameEnded }) => {
  useTitle("Game");
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const toast = useToast();
  const [gameResult, setGameResult] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [int, setInt] = useState(false);
  const [bool, setBool] = useState<boolean>(true);
  const [gol, setGol] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket>();
  const [mPaddle, setMPaddle] = useState<Paddle>();
  const [hPaddle, setHPaddle] = useState<Paddle>();
  const [ball, setBall] = useState<Ball>();
  const [canvaS, setCanvaS] = useState<canvaState>();

  const mvBallEvent = (bl: Ball) => {
    setBall(bl);
  }

  const gameOverEvent = (id: number) => {
    if (id === currentUser?.id) {
      setGameResult("Win");
      toast({
        title: "You win",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setGameResult("Lose");
      toast({
        title: "You lose",
        description: "You lose",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    // handleGameEnded();
    socket?.close();
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
      setGameResult("Win");
    }

    // newsocket?.on("befforTime", beforeTimeEvent);
    // newsocket?.on("mvPaddle", mvPaddleEvent);


    return () => {
      if (canvasRef?.current)
        canvasRef?.current?.removeEventListener("mousemove", eventPaddel);
      newsocket?.off("initMyP", initPaddleSocket);
      newsocket?.off("mvBall", mvBallEvent);
      newsocket?.off("gameOver", gameOverEvent);
      newsocket?.off("mvPaddle", mvPaddleEvent);
      newsocket?.close();
    };
  }, []);


  const initPaddleSocket = (canvaS: canvaState, ball: Ball, mPaddle: Paddle, hPaddle: Paddle) => {
    setCanvaS(canvaS);
    setBall(ball);
    setMPaddle(mPaddle);
    setHPaddle(hPaddle);
  }

  useEffect(() => {
    if (!int && socket) {
      setInt(true);
      socket?.emit("initMyP", gameData?.room, currentUser?.id, gameData?.id);
      socket?.on("initMyP", initPaddleSocket);
      if (canvasRef.current && bool)
        canvasRef.current.addEventListener("mousemove", eventPaddel);
      draw(canvasRef, ball, mPaddle, hPaddle, canvaS);
    }
  }, [socket, mPaddle, hPaddle, canvasRef, bool, int]);



  useEffect(() => {
    if (!gol && ball && mPaddle && hPaddle && canvaS) {
      setGol(true);
      socket?.emit("mvBall", {
        room: gameData?.room,
        player_id: currentUser?.id,
        game_id: gameData?.id,
      });
      socket?.on("mvBall", mvBallEvent);
      socket?.on("gameOver", gameOverEvent);
    }
    draw(canvasRef, ball, mPaddle, hPaddle, canvaS);
  }, [socket, ball, mPaddle, hPaddle, canvaS, int]);


  const eventPaddel = (event) => {
    let rect = canvasRef.current.getBoundingClientRect();
    const num = event.clientY - rect.top;
    setBool(false);

    console.log("I just emitted a mvPAddle event");
    console.log("Socket : " + socket);
    socket?.emit("mvPaddle", {
      num: num,
      room: location.state.game.room,
      id: currentUser?.id,
    });
    socket?.on("mvPaddle", (paddle: Paddle) => {
      if (paddle.x === 0) {
        // console.log("I just emitted a mvBootPaddle event");
        setMPaddle(paddle);
      }
      else {
        setHPaddle(paddle);

      }
    });
  }

  let content;

  if (gameResult === "Win") {
    content = (
      <>
        <Image
          src="/assets/img/winner.webp"
          alt="You Win"
        />

        <Button
          fontSize={{ base: "sm", sm: "md", md: "lg" }}
          fontWeight="medium"
          color="whiteAlpha.900"
          textTransform={"uppercase"}
          borderRadius={5}
          colorScheme="orange"
          onClick={handleGameEnded}
        >
          Play again
        </Button>
      </>
    );
  } else if (gameResult === "Lose") {
    content = (
      <>
        <Image
          src="/assets/img/gameover.webp"
          alt="You Lost"
          w="150px"
          h="150px"
        />
        <Button
          fontSize={{ base: "sm", sm: "md", md: "lg" }}
          fontWeight="medium"
          color="whiteAlpha.900"
          textTransform={"uppercase"}
          borderRadius={5}
          colorScheme="orange"
          onClick={handleGameEnded}
        >
          Play again
        </Button>
      </>
    );
  }


  return (
    <>
      {content}
      <canvas
        ref={canvasRef}
        width={600}
        height={400}

      />
    </>
  );
};

export default GameStarted;

