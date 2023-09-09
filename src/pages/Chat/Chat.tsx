import { Flex } from "@chakra-ui/react";

import { useState } from "react";
import useTitle from "src/hooks/useTitle";
import ChatRightModal from "./ChatRightModal";
import ChatLeftSidebar from "./ChatLeftSidebar";
import ChatContent from "./ChatContent";

const Chat = () => {
  useTitle("Chat");
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen((prevState) => !prevState);
  const toggleContent = () => setIsContentOpen(!isContentOpen);
  return (
    <Flex
      pos="relative"
      direction={{ base: "column", md: "row" }}
      w={"full"}
      h={"full"}
      justify={{ base: "center", md: "start" }}
      align="center"
      // bg="orange.700"
      // p={2}
      borderRadius={26}
    // gap={2}
    >
      <ChatLeftSidebar
        toggleContent={toggleContent}
        toggleDrawer={toggleDrawer}
      />
      <ChatContent
        toggleContent={toggleContent}
        isContentOpen={isContentOpen}
      />
      <ChatRightModal isOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
    </Flex>
  );
};

export default Chat;
