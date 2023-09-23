import { Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import useTitle from "src/hooks/useTitle";

const Game = () => {
  useTitle("Game");
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
      <h1>Game</h1>
    </Flex>
  );
};

export default Game;
