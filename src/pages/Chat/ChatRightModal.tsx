import {
  Avatar,
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

const iconButtonStyles = [
  {
    label: "Send a message",
    icon: <FiMessageSquare />,
  },
  {
    label: "View profile",
    icon: <HiOutlineUserCircle />,
  },
  {
    label: "Send friend request",
    icon: <AiOutlineUserAdd />,
  },
  {
    label: "Send game request",
    icon: <IoGameControllerOutline />,
  },
  {
    label: "Spectacle",
    icon: <GoEye />,
  },
  {
    label: "Block",
    icon: <MdBlockFlipped />,
  },
];

const ChatRightModal = ({ isOpen, toggleDrawer }) => {
  return (
    <Drawer
      open={isOpen}
      onClose={toggleDrawer}
      direction="right"
      enableOverlay={false}
      duration={0}
      style={{
        position: "absolute",
        width: 250,
        height: "100%",
        marginRight: "1px",
        borderTopRightRadius: "26px",
        borderBottomRightRadius: "26px",
        // padding: "4px",
      }}
    >
      <Stack
        w="full"
        h="full"
        bg="pong_bg_primary"
        p={2}
        spacing={4}
        borderTopRightRadius="26px"
        borderBottomRightRadius="26px"
      >
        <Flex w="full" justify={"space-between"} align={"center"} p={1}>
          <Heading fontSize="md" fontWeight="semibold">
            Chat Profile
          </Heading>
          <CloseButton
            size="sm"
            color="pong_cl_primary"
            bg={"white"}
            borderRadius={"50%"}
            onClick={toggleDrawer}
          />
        </Flex>
        <Flex justify="center" align="center" w="full">
          <Avatar
            boxSize={"160px"}
            name="Anas Douib"
            src="https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            borderColor="green.400"
            borderWidth="3px"
          />
        </Flex>
        <Flex justify="space-around" align="center" w="full" gap={5}>
          <Text
            fontSize="14px"
            fontStyle={"normal"}
            fontWeight="semibold"
            color="whiteAlpha.900"
            lineHeight={"28px"}
            letterSpacing={1}
          >
            Anas Douib
          </Text>
          <Flex justify="center" align="center" gap={1}>
            <Icon
              as={HiOutlineStatusOnline}
              boxSize={"20px"}
              borderRadius={"50%"}
              color={"green.400"}
            />
            <Text fontSize="12px" fontWeight="light" color="whiteAlpha.900">
              online
            </Text>
          </Flex>
        </Flex>
        <Stack direction="column" spacing={1} align="start" w="full">
          <Text fontSize="14px" fontWeight="semibold">
            Contact information
          </Text>
          <Flex direction="row" gap={2} justify="center" align="center">
            <Icon
              ml={2}
              boxSize={5}
              as={HiOutlineMail}
              color="whiteAlpha.600"
            />
            <Stack spacing={1} align="start">
              <Text
                fontSize="12px"
                fontWeight="medium"
                color="whiteAlpha.600"
                w={"full"}
              >
                Email
              </Text>
              <Text fontSize="12px" fontWeight="light" color="pong_cl_primary">
                adouib@student.1337.ma
              </Text>
            </Stack>
          </Flex>
        </Stack>
        <Flex
          direction="row"
          gap="8px"
          // background="rgba(4, 3, 1, 0.08)"
          bg="pong_bg_secondary"
          // borderRadius={4}
          w="full"
          h="40px"
          // bgGradient="linear(to-r, pong_bg_secondary, pong_bg_primary)"
          justify="center"
          align="center"
          // wrap={"wrap"}
        >
          {iconButtonStyles.map(({ icon, label }) => (
            <IconButton
              key={label}
              size="sm"
              fontSize="lg"
              bg={"pong_cl_primary"}
              color={"white"}
              borderRadius={8}
              aria-label={label}
              icon={icon}
              _hover={{ bg: "white", color: "pong_cl_primary" }}
            />
          ))}
        </Flex>
        <Stack direction="column" spacing={2} align="start" w="full">
          <Text fontSize="md" fontWeight="medium">
            About me
          </Text>
          <Stack spacing={4} justify="start">
            <Flex direction={"column"} gap={1}>
              <Text fontSize="14px" fontWeight="medium" color="whiteAlpha.600">
                Login 42
              </Text>
              <Text fontSize="12px" fontWeight="medium" color="whiteAlpha.400">
                adouib
              </Text>
            </Flex>
            <Flex direction={"column"} gap={1}>
              <Text fontSize="14px" fontWeight="medium" color="whiteAlpha.600">
                Intra Profile
              </Text>
              <Link
                as={RouterLink}
                to="https://profile.intra.42.fr/users/adouib"
                isExternal
                fontSize="12px"
                fontWeight="medium"
                color="pong_cl_primary"
              >
                42 Profile <ExternalLinkIcon mx="2px" />
              </Link>
            </Flex>
            <Flex direction={"column"} gap={1}>
              <Text fontSize="14px" fontWeight="medium" color="whiteAlpha.600">
                Campus
              </Text>
              <Text fontSize="12px" fontWeight="medium" color="whiteAlpha.400">
                1337 BenGuerir
              </Text>
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default ChatRightModal;
