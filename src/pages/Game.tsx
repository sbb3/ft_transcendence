import { Button, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTitle from "src/hooks/useTitle";
import useSocket from "src/hooks/useSocket";
import { useNavigate } from "react-router-dom";
import { setMatchmakingLoading } from "src/features/game/gameSlice";

const Game = () => {
  useTitle("Game");
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const { matchmakingLoading } = useSelector((state: any) => state?.game);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("game page");
    const socket = useSocket();
    socket.on("game_accepted", (data: any) => {
      console.log("incoming game state: ", data);
      // setIsGame(true);
      navigate(`/game/${data?.data?.id}`, {
        state: { game: data?.data },
      });
    });

    // socket.on("found_opponent", (data) => {
    //   dispatch(setMatchmakingLoading(false));
    //   console.log("found opponent: ", data);
    //   navigate(`/game/${data?.data?.id}`, {
    //     state: { game: data?.data },
    //   });
    // });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMatchmaking = () => {
    dispatch(setMatchmakingLoading(true));
    const socket = useSocket();
    socket.on("connect", () => {
      console.log("socket connected : ", socket?.id);
      socket.on("disconnect", () => {
        console.log("socket disconnected : ", socket?.id);
        socket.disconnect();
      });
      socket.emit("join_queue", {
        userId: currentUser?.id,
        username: currentUser?.username,
        socketId: socket?.id,
      });
    });
  };

  return (
    <Flex
      pos="relative"
      w={"full"}
      h={"full"}
      direction="row"
      justify="center"
      align="center"
      bg="purple.700"
      p={2}
      borderRadius={26}
    >
      <Button
        colorScheme="orange"
        onClick={handleMatchmaking}
        isDisabled={matchmakingLoading}
        isLoading={matchmakingLoading}
        loadingText="Finding an opponent"
      >
        Start Matchmaking
      </Button>
    </Flex>
  );
};

export default Game;
