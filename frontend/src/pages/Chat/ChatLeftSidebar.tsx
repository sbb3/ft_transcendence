import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  CloseButton,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import SearchDMsChannels from "./SearchDMsChannels";
import Divider from "src/components/Divider";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FiHash, FiInfo, FiPlus, FiSearch } from "react-icons/fi";
import { BsPersonPlus } from "react-icons/bs";
import channels from "src/config/data/channels";
import conversations from "src/config/data/conversations";
import CreateChannel from "src/components/Chat/CreateChannel";
import { useState } from "react";
import ChannelInfoAbout from "src/components/Chat/ChannelInfoAbout";
import AddDirectMessage from "src/components/Chat/AddDirectMessage";
import SearchForChannel from "src/components/Chat/SearchForChannel";
import { useNavigate } from "react-router-dom";
import Channels from "./Channels";
import Conversations from "./Conversations";

// TODO: useRef to focus on chat input when opening chat or clicking on a user
const ChatLeftSidebar = ({
  setType,
  setConversation,
  setChannelData,
  toggleContent,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [isChannelInfoOpen, setIsChannelInfoOpen] = useState(false);
  const [isAddDirectMessageOpen, setIsAddDirectMessageOpen] = useState(false);
  const [isSearchForChannelOpen, setIsSearchForChannelOpen] = useState(false);
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
      {isCreateChannelOpen && (
        <CreateChannel
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          setIsCreateChannelOpen={setIsCreateChannelOpen}
        />
      )}

      {isChannelInfoOpen && (
        <ChannelInfoAbout
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          setIsChannelInfoOpen={setIsChannelInfoOpen}
        />
      )}

      {isAddDirectMessageOpen && (
        <AddDirectMessage
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          setIsAddDirectMessageOpen={setIsAddDirectMessageOpen}
        />
      )}

      {isSearchForChannelOpen && (
        <SearchForChannel
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          setIsSearchForChannelOpen={setIsSearchForChannelOpen}
        />
      )}

      <Text m={"0 auto"} color="whiteAlpha.900" fontSize="xl" fontWeight="bold">
        Chat
      </Text>
      <Divider color="orange" />
      <SearchDMsChannels />
      <Divider color="orange" />
      {/* <Channels
        setType={setType}
        setChannelData={setChannelData}
        toggleContent={toggleContent}
        setIsSearchForChannelOpen={setIsSearchForChannelOpen}
        setIsChannelInfoOpen={setIsChannelInfoOpen}
        setIsCreateChannelOpen={setIsCreateChannelOpen}
      /> */}
      <Divider mt={4} color="orange" />
      <Conversations
        setType={setType}
        setConversation={setConversation}
        toggleContent={toggleContent}
        setIsAddDirectMessageOpen={setIsAddDirectMessageOpen}
      />
    </Flex>
  );
};

export default ChatLeftSidebar;
