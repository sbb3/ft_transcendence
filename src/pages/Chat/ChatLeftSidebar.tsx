import { Flex, Text } from "@chakra-ui/react";
import "src/styles/scrollbar.css";
import SearchDMsChannels from "./SearchDMsChannels";
import Divider from "src/components/Divider";
import { useNavigate } from "react-router-dom";
import Channels from "./Channels";
import Conversations from "./Conversations";

// TODO: useRef to focus on chat input when opening chat or clicking on a user
const ChatLeftSidebar = ({}) => {
  const navigate = useNavigate();

  return (
    <Flex
      direction={"column"}
      w={{ base: "full", md: "330px" }}
      h="full"
      // bg="pong_bg_primary"
      borderLeftRadius={26}
      borderRightRadius={{ base: 26, md: 0 }}
      p={{ base: 4, md: 6 }}
      // flex={{ base: "1", md: "0" }}
      gap={{ base: 2, sm: 3, md: 4 }}
      // borderRadius={24}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <Text m={"0 auto"} color="whiteAlpha.900" fontSize="xl" fontWeight="bold">
        Chat
      </Text>
      <Divider color="orange" />
      <SearchDMsChannels />
      <Divider color="orange" />
      <Channels />
      <Divider mt={4} color="orange" />
      <Conversations />
    </Flex>
  );
};

export default ChatLeftSidebar;
