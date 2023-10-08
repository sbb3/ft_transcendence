import { Flex, Stack, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
const GameLayout = () => {
  return (
    <Stack
      pos="relative"
      w={"full"}
      h={"full"}
      justify="center"
      align="center"
      bg="green.500"
      p={2}
      borderRadius={26}
    >
      {/* <Text
        fontSize={"lg"}
        fontWeight={"bold"}
        color={"white"}
        textAlign={"center"}
        w={"full"}
      >
        Game Layout
      </Text> */}
      <Outlet />
    </Stack>
  );
};

export default GameLayout;
