import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useTitle from "src/hooks/useTitle";
import { useNavigate } from "react-router-dom";
import { setMatchmakingLoading } from "src/features/game/gameSlice";
import { Controller, useForm } from "react-hook-form";
import io from "socket.io-client";
import Loader from "src/components/Utils/Loader";
import { Player } from "@lottiefiles/react-lottie-player";

const Game = () => {
  useTitle("Game");
  const playerRef = useRef(null);

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
    const socket = io(
      import.meta.env.VITE_SERVER_MATCHMAKING_SOCKET_URL as string,
      {
        transports: ["websocket"],
        reconnection: false,
        query: {
          token: accessToken,
        },
      }
    );

    socket.on("found_opponent", (data) => {
      console.log("socket connected start_game : ", socket?.id);
      dispatch(setMatchmakingLoading(false));
      playerRef?.current?.stop();
      navigate(`${data?.data?.id}`, {
        state: { game: data?.data },
      });
    });

    return () => {
      socket.disconnect();
      dispatch(setMatchmakingLoading(false));
      playerRef?.current?.stop();
    };
  }, []);

  const handleMatchmaking = async (data: any) => {
    dispatch(setMatchmakingLoading(true));
    const socket = io(
      import.meta.env.VITE_SERVER_MATCHMAKING_SOCKET_URL as string,
      {
        transports: ["websocket"],
        reconnection: false,
        query: {
          token: accessToken,
        },
      }
    );
    socket.on("connect", () => {
      socket.emit("join_queue", {
        userId: currentUser?.id,
        gameType,
        gameMode: data?.gameMode,
        socketId: socket?.id,
      });
    });
    socket.disconnect();
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
      p={2}
      borderRadius={26}
      gap={{ base: 4, sm: 6, md: 8 }}
    >
      {matchmakingLoading ? (
        // <Loader />
        <>
          <Player
            ref={playerRef}
            autoplay
            loop
            src="src/assets/animations/orange_loading_animation.json"
            style={{ height: "200px", width: "200px", color: "orange" }}
          />
        </>
      ) : (
        <>
          <Flex
            justify="space-around"
            align="center"
            w={"full"}
            borderRadius={15}
            p={{ base: 1, md: 2 }}
            // gap={{ base: 4, sm: 6, md: 8 }}
            // bg="pong_bg.300"
            bg="pong_cl.500"
            boxShadow={"0px 4px 24px -1px rgba(0, 0, 0, 0.35)"}
          >
            <Stack
              align={"center"}
              justify={"center"}
              spacing={{ base: 1, md: 2 }}
            >
              <Avatar
                size={{ base: "md", md: "lg" }}
                // name={user?.name}
                // src={user?.avatar}
                borderWidth="1px"
              />
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                color="whiteAlpha.900"
                textTransform={"uppercase"}
                textAlign={"center"}
                letterSpacing={1}
              >
                {/* {user?.name} */} sbb3
              </Text>
            </Stack>
            <Stack
              align={"center"}
              justify={"center"}
              spacing={{ base: 1, md: 2 }}
            >
              <Avatar
                size={{ base: "md", md: "lg" }}
                // name={user?.name}
                // src={user?.avatar}
                borderWidth="1px"
              />
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="bold"
                color="whiteAlpha.900"
                textTransform={"uppercase"}
                textAlign={"center"}
                letterSpacing={1}
              >
                {/* {user?.name} */} lopez
              </Text>
            </Stack>
          </Flex>
          <Flex
            pos="relative"
            w={"full"}
            direction={{ base: "column", sm: "column", md: "row" }}
            justify="center"
            align="start"
            p={2}
            borderRadius={26}
            gap={{ base: 2, sm: 6, md: 15 }}
          >
            <Stack
              align={"center"}
              justify={"center"}
              spacing={{ base: 2, md: 4 }}
            >
              <VStack
                pos="relative"
                justify="center"
                align="center"
                w={{
                  base: "full",
                  sm: "350px",
                  md: "350px",
                  lg: "380px",
                  xl: "500px",
                }}
                // w={{ base: "600px" }}
                h={{ base: "400px" }}
                borderRadius={{ base: "15px", sm: "20px", md: "30px" }}
                border="1px solid rgba(251, 102, 19, 0.1)"
                boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
                backdropFilter={"blur(20px)"}
                // bgImage={`url('src/assets/img/bot.jpg')`}
                bgImage={`url('src/assets/img/bot1.jpg')`}
                bgSize="cover"
                bgRepeat="no-repeat"
                bgPos={"center"}
                opacity={gameType === "bot" ? 0.5 : 1}
                p={{ base: 5 }}
                spacing={6}
                onClick={() => {
                  setGameType("bot");
                }}
              ></VStack>

              <Stack
                align={"center"}
                justify={"center"}
                spacing={{ base: 2, md: 4 }}
                onClick={() => {
                  setGameType("bot");
                }}
              >
                <Text
                  fontSize={{ base: "lg", sm: "lg", md: "3xl" }}
                  fontWeight="bold"
                  color="orange.400"
                  textTransform={"uppercase"}
                  textAlign={"center"}
                >
                  Bot
                </Text>
                {/* <Text
                  fontSize={{ base: "sm", sm: "md", md: "lg" }}
                  fontWeight="medium"
                  color="whiteAlpha.900"
                  textAlign={"center"}
                >
                  Play against a bot
                </Text> */}
                <FormControl
                  as={Stack}
                  justify="center"
                  align="start"
                  isInvalid={!!errors.gameMode}
                  gap={{ base: 2, sm: 2, md: 4 }}
                >
                  <FormLabel
                    htmlFor="gameMode"
                    fontSize="lg"
                    fontWeight="semibold"
                    color="whiteAlpha.800"
                    textTransform={"uppercase"}
                    m={0}
                  >
                    Game mode
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
                          direction="row"
                          justify={"start"}
                          align={"center"}
                          spacing={4}
                          m={0}
                        >
                          <Radio colorScheme={"orange"} value="normal">
                            <Text
                              fontSize={{ base: "sm", sm: "md", md: "lg" }}
                              fontWeight="medium"
                              color="whiteAlpha.800"
                              textAlign={"center"}
                            >
                              Normal
                            </Text>
                          </Radio>

                          <Radio colorScheme={"orange"} value="medium">
                            <Text
                              fontSize={{ base: "sm", sm: "md", md: "lg" }}
                              fontWeight="medium"
                              color="whiteAlpha.800"
                              textAlign={"center"}
                            >
                              Medium
                            </Text>
                          </Radio>
                          <Radio colorScheme={"orange"} value="hard">
                            <Text
                              fontSize={{ base: "sm", sm: "md", md: "lg" }}
                              fontWeight="medium"
                              color="whiteAlpha.800"
                              textAlign={"center"}
                            >
                              Hard
                            </Text>
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
            </Stack>

            <Stack
              align={"center"}
              justify={"center"}
              spacing={{ base: 2, md: 4 }}
            >
              <VStack
                pos="relative"
                justify="center"
                align="center"
                w={{
                  base: "full",
                  sm: "350px",
                  md: "350px",
                  lg: "380px",
                  xl: "500px",
                }}
                h={{ base: "400px" }}
                borderRadius={{ base: "15px", sm: "20px", md: "30px" }}
                border="1px solid rgba(251, 102, 19, 0.1)"
                boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.45)"
                backdropFilter={"blur(20px)"}
                // bgImage={`url('src/assets/img/multiplayer.jpg')`}
                bgImage={`url('src/assets/img/multiplayer1.jpg')`}
                bgSize="cover"
                bgPos={"center"}
                bgRepeat="no-repeat"
                opacity={gameType === "multiplayer" ? 0.5 : 1}
                p={{ base: 5 }}
                spacing={6}
                onClick={() => {
                  setGameType("multiplayer");
                }}
              ></VStack>
              <Stack
                align={"center"}
                justify={"center"}
                spacing={{ base: 2, md: 4 }}
                onClick={() => {
                  setGameType("multiplayer");
                }}
              >
                <Text
                  fontSize={{ base: "lg", sm: "lg", md: "3xl" }}
                  fontWeight="bold"
                  color="orange.400"
                  textTransform={"uppercase"}
                  textAlign={"center"}
                >
                  Multiplayer
                </Text>
                {/* <Text
                  fontSize={{ base: "sm", sm: "md", md: "lg" }}
                  fontWeight="medium"
                  color="whiteAlpha.900"
                  textAlign={"center"}
                >
                  Play against another player
                </Text> */}
              </Stack>
            </Stack>
          </Flex>
          <Button
            fontSize={{ base: "sm", sm: "md", md: "lg" }}
            fontWeight="medium"
            color="whiteAlpha.900"
            textTransform={"uppercase"}
            borderRadius={5}
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
