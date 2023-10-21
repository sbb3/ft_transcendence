import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTitle from "src/hooks/useTitle";
import { useNavigate } from "react-router-dom";
import { setMatchmakingLoading } from "src/features/game/gameSlice";
import { Controller, useForm } from "react-hook-form";
import io, { Socket } from "socket.io-client";
import { createSocketClient } from "src/app/socket/client";
import Loader from "src/components/Utils/Loader";
import { useLottie } from "lottie-react";
import animationData from "src/assets/animations/orange_loading_animation.json";

const style = {
  width: "200px",
  color: "orange",
};
const options = {
  loop: true,
  autoplay: true,
  animationData,
};
const Game = () => {
  useTitle("Game");
  const { View } = useLottie(options, style);

  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const accessToken = useSelector((state: any) => state?.auth?.accessToken);
  const navigate = useNavigate();
  const [gameType, setGameType] = useState<"multiplayer" | "bot">("bot");
  const { matchmakingLoading } = useSelector((state: any) => state?.game);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({});

  useEffect(() => {
    console.log("game page");
    const socket = io(
      import.meta.env.VITE_SERVER_MATCHMAKING_SOCKET_URL as string,
      {
        transports: ["websocket"],
        reconnection: false,
        // reconnection: true,
        // reconnectionAttempts: 10,
        // reconnectionDelay: 1000,
        // upgrade: false,
        // rejectUnauthorized: false,
        query: {
          token: accessToken,
        },
      }
    );

    socket.on("start_game", (data) => {
      console.log("socket connected start_game : ", socket?.id);
      dispatch(setMatchmakingLoading(false));
      console.log("found opponent: ", data);
      navigate(`${data?.data?.id}`, {
        // id === -1 -> bot ->
        /*
          else id game,
        */
        state: { game: data?.data },
      });
    });

    return () => {
      console.log("game page unmounted");
      socket.disconnect();
      // matchmakingSocket?.disconnect();
    };
  }, []);

  const handleMatchmaking = async (data: any) => {
    console.log("matchmaking data: ", data);
    console.log("gameType: ", gameType);
    dispatch(setMatchmakingLoading(true));
    const socket = io(
      import.meta.env.VITE_SERVER_MATCHMAKING_SOCKET_URL as string,
      {
        transports: ["websocket"],
        reconnection: false,
        // reconnection: true,
        // reconnectionAttempts: 10,
        // reconnectionDelay: 1000,
        // upgrade: false,
        // rejectUnauthorized: false,
        query: {
          token: accessToken,
        },
      }
    );
    socket.on("connect", () => {
      socket.on("disconnect", () => {
        console.log("socket disconnected join_queue");
      });
      console.log("socket connected join_queue : ", socket?.id);
      socket.emit("join_queue", {
        userId: currentUser?.id,
        // gameType: "multiplayer" | "bot",
        // gameMode: "easy" | "medium" | "hard",
        socketId: socket?.id,
      });
    });
    // socket.disconnect();
    reset({
      gameMode: "normal",
    });
  };

  return (
    <Flex
      pos="relative"
      w={"full"}
      h={"full"}
      direction="column"
      justify="center"
      align="center"
      bg="purple.700"
      p={2}
      borderRadius={26}
      gap={{ base: 4, sm: 6, md: 8 }}
    >
      {matchmakingLoading ? (
        // <Loader />
        <>{View}</>
      ) : (
        <>
          <Flex
            pos="relative"
            w={"full"}
            direction={{ base: "column", sm: "column", md: "row" }}
            justify="center"
            align="center"
            p={2}
            borderRadius={26}
            gap={{ base: 5, sm: 10, md: 15 }}
            bg={"yellow.400"}
          >
            <VStack
              pos="relative"
              justify="center"
              align="center"
              // w={{ base: "200px", sm: "300px", md: "400px" }}
              w={{ base: "600px" }}
              h={{ base: "400px" }}
              borderRadius={{ base: "15px", sm: "25px", md: "40px" }}
              border="1px solid rgba(251, 102, 19, 0.1)"
              boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
              backdropFilter={"blur(20px)"}
              // bgImage={`url('src/assets/img/ai_bot_playing.jpg')`}

              bgSize="cover"
              bgRepeat="no-repeat"
              p={{ base: 5 }}
              spacing={6}
              bg={gameType === "bot" ? "red.500" : "red.400"}
              onClick={() => {
                setGameType("bot");
              }}
              _hover={{
                bg: "red.500",
                cursor: "pointer",
              }}
            >
              <Stack
                align={"center"}
                justify={"center"}
                spacing={{ base: 2, md: 4 }}
              >
                <Text
                  fontSize={{ base: "lg", sm: "lg", md: "2xl" }}
                  fontWeight="bold"
                  color="orange.400"
                  textTransform={"uppercase"}
                  textAlign={"center"}
                >
                  Bot
                </Text>
                <Text
                  fontSize={{ base: "sm", sm: "md", md: "lg" }}
                  fontWeight="medium"
                  color="whiteAlpha.900"
                  textAlign={"center"}
                >
                  Play against a bot
                </Text>
                <FormControl isInvalid={!!errors.gameMode} mt={0}>
                  <FormLabel htmlFor="gameMode" fontSize="lg">
                    Game Mode
                  </FormLabel>
                  <Controller
                    name="gameMode"
                    control={control}
                    defaultValue="normal"
                    render={({ field }) => (
                      <RadioGroup
                        {...field}
                        onChange={(inputValue) => {
                          field.onChange(inputValue);
                        }}
                      >
                        <Stack
                          direction="column"
                          justify={"center"}
                          align={"start"}
                          spacing={1}
                        >
                          <Radio colorScheme={"orange"} value="normal">
                            Normal
                          </Radio>

                          <Radio colorScheme={"orange"} value="hard">
                            Hard
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    )}
                  />
                  <FormErrorMessage>
                    {errors?.gameMode && errors?.gameMode?.message}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </VStack>
            <VStack
              pos="relative"
              justify="center"
              align="center"
              // w={{ base: "200px", sm: "300px", md: "400px" }}
              w={{ base: "600px" }}
              h={{ base: "400px" }}
              borderRadius={{ base: "15px", sm: "25px", md: "40px" }}
              border="1px solid rgba(251, 102, 19, 0.1)"
              boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
              backdropFilter={"blur(20px)"}
              // bgImage={`url('src/assets/img/ai_bot_playing.jpg')`}
              bgSize="cover"
              bgRepeat="no-repeat"
              p={{ base: 5 }}
              spacing={6}
              bg={gameType === "multiplayer" ? "green.500" : "green.400"}
              onClick={() => {
                setGameType("multiplayer");
              }}
              _hover={{
                bg: "green.500",
                cursor: "pointer",
              }}
            >
              <Stack
                align={"center"}
                justify={"center"}
                spacing={{ base: 2, md: 4 }}
              >
                <Text
                  fontSize={{ base: "lg", sm: "lg", md: "2xl" }}
                  fontWeight="bold"
                  color="orange.400"
                  textTransform={"uppercase"}
                  textAlign={"center"}
                >
                  Multiplayer
                </Text>
                <Text
                  fontSize={{ base: "sm", sm: "md", md: "lg" }}
                  fontWeight="medium"
                  color="whiteAlpha.900"
                  textAlign={"center"}
                >
                  Play against another player
                </Text>
              </Stack>
            </VStack>
          </Flex>
          <Button
            colorScheme="orange"
            onClick={handleSubmit(handleMatchmaking)}
            isDisabled={matchmakingLoading}
            isLoading={matchmakingLoading}
            loadingText="Finding an opponent"
          >
            Start Game
          </Button>
        </>
      )}
    </Flex>
  );
};

export default Game;
