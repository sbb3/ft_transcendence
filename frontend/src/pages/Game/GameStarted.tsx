import { Avatar, Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import useTitle from "src/hooks/useTitle";
import { Ball, Paddle, canvaState } from "./interfaces";
import io, { Socket } from "socket.io-client";
import { draw, } from "./DrawUtils";
import { useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";
import store from "src/app/store";
import { setGameEnded } from "src/features/game/gameSlice";

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
  const [currentUserScore, setCurrentUserScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);

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
    // console.log("I just emitted a mvBootPaddle event loooopeeez");
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
    // newsocket?.on("befforTime", beforeTimeEvent);
    newsocket?.on("mvPaddle", mvPaddleEvent);


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
        mode: gameData?.mode,
      });
      socket?.on("mvBall", mvBallEvent);
      socket?.on("mvBootPaddle", (paddle: Paddle) => {
        setHPaddle(paddle);
      });
      socket?.on("gameOver", gameOverEvent);
    }
    setCurrentUserScore(ball?.score_my);
    setOpponentScore(ball?.score_her);
    draw(canvasRef, ball, mPaddle, hPaddle, canvaS);
  }, [socket, ball, mPaddle, hPaddle, canvaS, int]);


  const eventPaddel = (event) => {
    let rect = canvasRef.current.getBoundingClientRect();
    const num = event.clientY - rect.top;
    setBool(false);

    // console.log("I just emitted a mvPAddle event");
    // console.log("Socket : " + socket);
    socket?.emit("mvPaddle", {
      num: num,
      room: gameData.room,
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
          onClick={() => {
            store.dispatch(setGameEnded());
          }}
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
      <Flex
        direction={"column"}
        align="center"
        justify="center"
        w={"full"}
        borderRadius={15}
        p={{ base: 1, md: 1 }}
        background="radial-gradient(circle at 50%, rgb(255, 197, 61) 0%, rgb(255, 94, 7) 100%)"
        boxShadow={"0px 4px 24px -1px rgba(0, 0, 0, 0.35)"}
        gap={0}

      >
        <Flex
          align="center"
          justify="space-around"
          w={"full"}

        >
          <Stack
            direction={{ base: "column", md: "row" }}
            align={"center"}
            justify={"center"}
            spacing={{ base: 1, md: 2 }}
          >
            <Avatar
              size={{ base: "md", md: "lg" }}
              name={gameData?.gameMode === "Bot" ? currentUser?.username : gameData?.players[0]?.username}
              src={gameData?.gameMode === "Bot" ? currentUser?.avatar : gameData?.players[0]?.avatar}
              borderWidth="1px"
            />
            <Text
              fontSize={{ base: "md", md: "md" }}
              fontWeight="bold"
              color="whiteAlpha.900"
              textTransform={"uppercase"}
              textAlign={"center"}
              letterSpacing={1}
              maxW="100px"
              isTruncated
            >
              {gameData?.gameMode === "Bot" ? currentUser?.username : gameData?.players[0]?.username}
            </Text>
          </Stack>
          <Stack
            direction={{ base: "column", md: "row" }}
            align={"center"}
            justify={"center"}
            spacing={{ base: 1, md: 2 }}

          >
            <Avatar
              size={{ base: "md", md: "lg" }}
              name={gameData?.gameMode === "Bot" ? "Bot" : gameData?.players[1]?.username}
              src={gameData?.gameMode === "Bot" ? "/assets/img/bot_avatar.webp" : gameData?.players[1]?.avatar}
              borderWidth="1px"
            />
            <Text
              fontSize={{ base: "md", md: "md" }}
              fontWeight="bold"
              color="whiteAlpha.900"
              textTransform={"uppercase"}
              textAlign={"center"}
              letterSpacing={1}
            >
              {gameData?.gameMode === "Bot" ? "Bot" : gameData?.players[1]?.username}
            </Text>
          </Stack>
        </Flex>
        <Flex
          justify="center"
          align="center"
          wrap="wrap"
        >
          <Text
            fontSize={{ base: "xl", md: "3xl", lg: "4xl" }}
            fontWeight="bold"
            color="whiteAlpha.900"
            textTransform={"uppercase"}
            textAlign={"center"}
            letterSpacing={1}

          >
            {currentUserScore} - {opponentScore}
          </Text>
        </Flex>

      </Flex>
      <Stack
        justify="center"
        zIndex={1}
        align="center"
        pos="relative"
        w={"full"}
        h={"full"}
        borderRadius={15}
        border="1px solid rgba(251, 102, 19, 0.1)"
        boxShadow={"0px 4px 24px -1px rgba(0, 0, 0, 0.35)"}
        backdropFilter={"blur(20px)"}
        // bgImage={`url('https://th.bing.com/th/id/OIG.70xG4FEh.BOmaKZtaYiG')`}
        // background="radial-gradient(circle at 50%, rgb(255, 197, 61) 0%, rgb(255, 94, 7) 100%)"
        bgImage={`url('/assets/img/game_bg_1.jpg')`}
        bgSize="cover"
        bgRepeat="no-repeat"
        bgPos={"center"}
        spacing={{ base: 2, md: 4 }}
      >

        {content}
        <canvas
          ref={canvasRef}
          width={600}
          height={400}

        />
      </Stack>
    </>

  );
};

export default GameStarted;

