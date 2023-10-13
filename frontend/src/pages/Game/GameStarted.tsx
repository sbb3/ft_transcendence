import { Box, Flex, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Loader from "src/components/Utils/Loader";
import { useGetGameByIdQuery } from "src/features/game/gameApi";
const GameStarted = () => {
  const { id } = useParams();
  const {
    data: game,
    isLoading: isLoadingGame,
    isFetching: isFetchingGame,
  } = useGetGameByIdQuery(id);
  return (
    <Flex
      pos="relative"
      w={"full"}
      h={"full"}
      direction="row"
      justify="center"
      align="center"
      bg="cyan.600"
      p={2}
      borderRadius={26}
    >
      {isLoadingGame || isFetchingGame ? (
        <Loader />
      ) : (
        <Box>
          <h1>Play</h1>
          <Text>game id : {game?.id}</Text>
          {/* <Text>game id : {id}</Text> */}
        </Box>
      )}
    </Flex>
  );
};

export default GameStarted;
