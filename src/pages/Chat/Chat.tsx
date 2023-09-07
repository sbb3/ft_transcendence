import {
  Avatar,
  Button,
  CloseButton,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useState } from "react";
import useTitle from "src/hooks/useTitle";
import ChatRightModal from "./ChatRightModal";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import {
  HiOutlineMail,
  HiOutlineStatusOnline,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { FiMessageSquare } from "react-icons/fi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { MdBlockFlipped } from "react-icons/md";
import { GoEye } from "react-icons/go";
import { ExternalLinkIcon } from "@chakra-ui/icons";

const Chat = () => {
  useTitle("Chat");
  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  return (
    <Flex
      pos="relative"
      w={"full"}
      h={"full"}
      direction="row"
      justify="center"
      align="center"
      bg="orange.700"
      p={2}
      borderRadius={26}
    >
      <button onClick={toggleDrawer}>Show</button>
      <ChatRightModal isOpen={isOpen} toggleDrawer={toggleDrawer} />
    </Flex>
  );
};

export default Chat;
