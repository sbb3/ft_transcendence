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
import useSocket from "src/hooks/useSocket";
import { useNavigate } from "react-router-dom";
import { setMatchmakingLoading } from "src/features/game/gameSlice";
import { Controller, useForm } from "react-hook-form";
import io from "socket.io-client";

const Game = () => {
  useTitle("Game");
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const navigate = useNavigate();
  // const { matchmakingLoading } = useSelector((state: any) => state?.game);
  // const {
  //   register,
  //   handleSubmit,
  //   control,
  //   formState: { errors },
  //   reset,
  // } = useForm({});
  // // const socket = useSocket();
  // useEffect(() => {
  //   console.log("game page");
  //   const socket = useSocket();

  //   socket.on("found_opponent", (data) => {
  //     console.log("socket connected found_opponent : ", socket?.id);
  //     dispatch(setMatchmakingLoading(false));
  //     console.log("found opponent: ", data);
  //     navigate(`${data?.data?.id}`, {
  //       state: { game: data?.data },
  //     });
  //   });

  //   return () => {
  //     console.log("game page unmounted");
  //     socket.disconnect();
  //     // matchmakingSocket?.disconnect();
  //   };
  // }, []);

  // const handleMatchmaking = async (data: any) => {
  //   console.log("matchmaking data: ", data);
  //   dispatch(setMatchmakingLoading(true));
  //   // socket = useSocket();
  //   const socket = useSocket();
  //   socket.on("connect", () => {
  //     socket.on("disconnect", () => {
  //       console.log("socket disconnected join_queue");
  //     });
  //     console.log("socket connected join_queue : ", socket?.id);
  //     socket.emit("join_queue", {
  //       userId: currentUser?.id,
  //       username: currentUser?.username,
  //       socketId: socket?.id,
  //     });
  //   });
  //   // socket.disconnect();
  //   reset({
  //     gameMode: "normal",
  //   });
  // };

  const handlelOpez = async (data: any) => {
    console.log("loopez: ");
    const socket = io(import.meta.env.VITE_SERVER_SOCKET_URL as string, {
      transports: ["websocket"],
      reconnection: false,
      // reconnection: true,
      // reconnectionAttempts: 10,
      // reconnectionDelay: 1000,
      // upgrade: false,
      // rejectUnauthorized: false,
    });
    socket.on("connect", () => {
      console.log("connected");
      socket.on("disconnect", () => {
        console.log("socket disconnected join_queue");
      });
      socket.emit("test", {
        data: "lopez",
      });
    });
    // socket.disconnect();
    // reset({
    //   gameMode: "normal",
    // });
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
      >
        <Stack align={"center"} justify={"center"} spacing={{ base: 2, md: 4 }}>
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
            Challenge your friends or find an opponent online
          </Text>
        </Stack>
        <Stack spacing={6} justify={"start"} align={"start"}>
          {/* <FormControl isInvalid={!!errors.gameMode} mt={0}>
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
          </FormControl> */}
          {/* <Button
            colorScheme="orange"
            onClick={handleSubmit(handleMatchmaking)}
            isDisabled={matchmakingLoading}
            isLoading={matchmakingLoading}
            loadingText="Finding an opponent"
          >
            Start Matchmaking
          </Button> */}
          <Button onClick={handlelOpez} loadingText="Finding an opponent">
            lopez
          </Button>
        </Stack>
      </VStack>
    </Flex>
  );
};

export default Game;
