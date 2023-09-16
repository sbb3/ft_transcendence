import { Flex } from "@chakra-ui/react";
import useTitle from "src/hooks/useTitle";

const Watch = () => {
  useTitle("Watch Live Games");
  return (
    <Flex
      pos="relative"
      w={"full"}
      h={"full"}
      direction="row"
      justify="center"
      align="center"
      bg="teal.700"
      p={2}
      borderRadius={26}
    >
      <h1>Watch live games</h1>
    </Flex>
  );
};

export default Watch;
