import {
  Flex,

} from "@chakra-ui/react";

import { useState } from "react";
import useTitle from "src/hooks/useTitle";
import ChatRightModal from "./ChatRightModal";
import ChatLeftSidebar from "./ChatLeftSidebar";

const Chat = () => {
  useTitle("Chat");
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => setIsOpen((prevState) => !prevState);
  return (
    <Flex
      pos="relative"
      w={"full"}
      h={"full"}
      direction="row"
      justify="start"
      align="center"
      bg="orange.700"
      p={2}
      borderRadius={26}
    >
      <ChatLeftSidebar />
      <button onClick={toggleDrawer}>Show</button>
      <ChatRightModal isOpen={isOpen} toggleDrawer={toggleDrawer} />
    </Flex>
  );
};

export default Chat;
