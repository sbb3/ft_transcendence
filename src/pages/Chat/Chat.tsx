import { Flex } from "@chakra-ui/react";

import { useState } from "react";
import useTitle from "src/hooks/useTitle";
import ChatRightModal from "./ChatRightModal";
import ChatLeftSidebar from "./ChatLeftSidebar";
import ChatContent from "./ChatContent";

const Chat = () => {
  useTitle("Chat");
  const [isContentOpen, setIsContentOpen] = useState(false);
  const [conversation, setConversation] = useState({});
  const [channelData, setChannelData] = useState({});
  const [type, setType] = useState("");

  const toggleContent = (state) => setIsContentOpen(state);
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
        setType={setType}
        setConversation={setConversation}
        setChannelData={setChannelData}
        toggleContent={toggleContent}
      />
      <ChatContent
        type={type}
        conversation={conversation}
        channelData={channelData}
        isContentOpen={isContentOpen}
      />
    </Flex>
  );
};

export default Chat;
