import { Flex } from "@chakra-ui/react";
import useTitle from "src/hooks/useTitle";
import ChatLeftSidebar from "./ChatLeftSidebar";
import { Outlet } from "react-router-dom";

const Chat = () => {
  useTitle("Chat");

  return (
    <Flex
      pos="relative"
      direction={{ base: "column", md: "row" }}
      w={"full"}
      h={"full"}
      justify={{ base: "center", md: "start" }}
      align="center"
      borderRadius={26}
      // bg="orange.700"
      // p={2}
      // gap={2}
    >
      <ChatLeftSidebar />
      <Outlet />
    </Flex>
  );
};

export default Chat;
