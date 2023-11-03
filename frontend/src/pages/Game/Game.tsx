import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  useEffect, useRef,
  useState,
} from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import useTitle from "src/hooks/useTitle";
import { useNavigate } from "react-router-dom";
import { setMatchmakingLoading } from "src/features/game/gameSlice";
import { Controller, useForm } from "react-hook-form";
import { createSocketClient } from "src/app/socket/client";
import BarLoader from "react-spinners/BeatLoader";
import GameStarted from "./GameStarted";

interface MatchmakingFormData {
  gameMode: string;
}

const Game = () => {
  useTitle("Game");
  const socket = useRef(null);

  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const navigate = useNavigate();
  const [gameType, setGameType] = useState<"multiplayer" | "bot">("bot");
  const { matchmakingLoading } = useSelector((state: any) => state?.game);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameData, setGameData] = useState<any>({});

  const {
    // register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({});

  useEffect(() => {
    socket.current = createSocketClient({
      api_url: import.meta.env.VITE_SERVER_MATCHMAKING_SOCKET_URL as string,
    });

    const startGameEvent = (data) => {
      console.log("start_game: ", data);
      if (data.gameInfo.players?.includes(currentUser?.id)) {
        dispatch(setMatchmakingLoading(false));
        setGameStarted(true);
        setGameData(data?.gameInfo);
      }
    }

    socket?.current?.on("start_game", startGameEvent);

    return () => {
      socket?.current?.off("start_game", startGameEvent);
      socket?.current?.disconnect();
      dispatch(setMatchmakingLoading(false));
      setGameStarted(false);
      setGameData({});

    };
  }, [navigate, dispatch, currentUser?.id]);

  // const handleMatchmaking = async (data: MatchmakingFormData) => {
  const handleMatchmaking = async (data: any) => {
    console.log("data : ", data);
    console.log("gameType : ", gameType);
    dispatch(setMatchmakingLoading(true));
    socket?.current?.emit("join_queue", {
      userId: currentUser?.id,
      gameType,
      gameMode: data?.gameMode,
      socketId: socket?.current?.id,
    });
    reset({
      gameMode: "normal",
    });
  };

  let content;

  if (matchmakingLoading) {
    content = (
      <>
        <Stack
          justify="center"
          align="center"
          w={"full"}
          h={"full"}
        >
          <BarLoader color={"#fbbf13"} loading={true} size={20} />
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold"
            color="whiteAlpha.900"
            textTransform={"uppercase"}
            textAlign={"center"}
            letterSpacing={1}
          >
            Finding an opponent
          </Text>
        </Stack>
      </>
    )
  }
  else if (gameStarted) {
    content = (
      <Box
        pos="relative"
        w={"full"}
        h={"full"}
        bg="purple.500"
        zIndex={1}
      >
        <GameStarted gameData={gameData} />
      </Box>

    );
  } else {
    content = (
      <>

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
            justify={"start"}
            spacing={{ base: 2, md: 4 }}
            outline="2px solid rgba(251, 102, 19, 0.1)"
            borderRadius={15}
            p={{ base: 1, md: 2 }}
            boxShadow={"0px 4px 24px -1px rgba(0, 0, 0, 0.35)"}
            h={{ base: "full" }}
            w={{ base: "full" }}

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
              boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
              backdropFilter={"blur(20px)"}
              bgImage={`url('assets/img/bot.webp')`}
              bgSize="cover"
              bgRepeat="no-repeat"
              bgPos={"center"}
              opacity={gameType === "bot" ? 1 : 0.5}
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
              </FormControl>
            </Stack>
          </Stack>

          <Stack
            align={"center"}
            justify={"start"}
            spacing={{ base: 2, md: 4 }}
            outline="2px solid rgba(251, 102, 19, 0.1)"
            borderRadius={15}
            p={{ base: 1, md: 2 }}
            boxShadow={"0px 4px 24px -1px rgba(0, 0, 0, 0.35)"}
            h={{ base: "full" }}
            w={{ base: "full" }}
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
              bgImage={`url('assets/img/multiplayer.webp')`}
              bgSize="cover"
              bgPos={"center"}
              bgRepeat="no-repeat"
              opacity={gameType === "multiplayer" ? 1 : 0.5}
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
    )
  }


  return (
    <Flex
      pos="relative"
      w={"full"}
      h={"full"}
      direction="column"
      justify="start"
      align="center"
      p={gameStarted ? 0 : 2}
      borderRadius={26}
      gap={{ base: 4, sm: 6, md: 8 }}
    >
      {content}
    </Flex>
  );
};

export default Game;
