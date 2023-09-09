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
import "./scrollbar.css";
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

// TODO: useRef to focus on chat input when opening chat or clicking on a user
const ChatLeftSidebar = ({ toggleDrawer, toggleContent }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      border="1px solid rgba(251, 102, 19, 0.69)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <button onClick={toggleContent}>Toggle Content</button>
      <button onClick={toggleDrawer}>Show Drawer</button>
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
      <Stack justify="start" align="start" w="full" gap="0px">
        <Flex direction="row" justify="space-between" align="center" w="full">
          <Flex justify="start" align="center" direction="row" gap="2px">
            <Menu
              gutter={14}
              computePositionOnMount={true}
              defaultIsOpen
              preventOverflow={true}
              boundary="scrollParent"
              closeOnBlur={false}
              strategy="absolute"
              closeOnSelect={false}
              flip={false}
            >
              {({ isOpen }) => (
                <>
                  <MenuButton
                    isActive={isOpen}
                    as={Button}
                    leftIcon={
                      isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />
                    }
                    sx={{
                      "&:hover": {
                        background: "none",
                        boxShadow: "none",
                        border: "none",
                      },
                      "&:active": {
                        background: "none",
                        boxShadow: "none",
                        border: "none",
                      },
                      "&:focus": {
                        background: "none",
                        boxShadow: "none",
                        border: "none",
                      },
                      "&:selected": {
                        background: "none",
                        boxShadow: "none",
                        border: "none",
                      },
                      fontSize: "14px",
                      fontWeight: "semibold",
                      color: "white",
                      padding: "0px",
                      height: "auto",
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    }}
                    _active={{
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    }}
                    _focus={{
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    }}
                    _hover={{
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    }}
                    _selected={{
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    }}
                  >
                    Channels
                  </MenuButton>
                  <MenuList
                    p={0}
                    bg={"trasparent"}
                    w={{ base: "250px", sm: "360px", md: "284px" }}
                    height="250px"
                    borderRadius={"16px"}
                    border={"none"}
                  >
                    <ScrollArea.Root className="ScrollAreaRoot">
                      <ScrollArea.Viewport className="ScrollAreaViewport">
                        {channels.map((channel, index) => (
                          <>
                            <MenuItem
                              key={index}
                              bg={"trasparent"}
                              borderRadius={"6px"}
                              icon={<FiHash />}
                              _focus={{ bg: "pong_bg.200" }}
                              _hover={{ bg: "pong_bg.200" }}
                              _selected={{ bg: "pong_bg.200" }}
                              fontSize={{
                                base: "13px",
                                sm: "14px",
                                md: "15px",
                              }}
                            >
                              {channel.name}
                            </MenuItem>
                            {/* <MenuDivider m={0} /> */}
                          </>
                        ))}
                      </ScrollArea.Viewport>
                      <ScrollArea.Scrollbar
                        className="ScrollAreaScrollbar"
                        orientation="vertical"
                      >
                        <ScrollArea.Thumb className="ScrollAreaThumb" />
                      </ScrollArea.Scrollbar>
                      <ScrollArea.Scrollbar
                        className="ScrollAreaScrollbar"
                        orientation="horizontal"
                      >
                        <ScrollArea.Thumb className="ScrollAreaThumb" />
                      </ScrollArea.Scrollbar>
                      <ScrollArea.Corner className="ScrollAreaCorner" />
                    </ScrollArea.Root>
                  </MenuList>
                </>
              )}
            </Menu>
          </Flex>
          <Flex direction="row" gap="2px" align={"center"} justify="center">
            <IconButton
              size="xs"
              fontSize="lg"
              bg={"pong_bg_secondary"}
              color={"white"}
              borderRadius={8}
              aria-label="Search for a channel"
              icon={<FiSearch />}
              _hover={{ bg: "white", color: "pong_bg_secondary" }}
              onClick={() => {
                setIsSearchForChannelOpen(true);
              }}
            />
            <IconButton
              size="xs"
              fontSize="lg"
              bg={"pong_bg_secondary"}
              color={"white"}
              borderRadius={8}
              aria-label="Channel info"
              icon={<FiInfo />}
              _hover={{ bg: "white", color: "pong_bg_secondary" }}
              onClick={() => {
                setIsChannelInfoOpen(true);
              }}
            />
            <IconButton
              size="xs"
              fontSize="lg"
              bg={"pong_bg_secondary"}
              color={"white"}
              borderRadius={8}
              aria-label="Add a channel"
              icon={<FiPlus />}
              _hover={{ bg: "white", color: "pong_bg_secondary" }}
              onClick={() => {
                setIsCreateChannelOpen(true);
              }}
            />
          </Flex>
        </Flex>
        <Box mt={3} w="full" height="255px"></Box>
      </Stack>
      <Divider mt={4} color="orange" />
      <Flex direction="row" justify="space-between" align="center">
        <Flex justify="start" align="center" direction="row" gap="2px">
          <Menu
            gutter={14}
            computePositionOnMount={true}
            defaultIsOpen
            preventOverflow={true}
            boundary="scrollParent"
            closeOnBlur={false}
            strategy="absolute"
            closeOnSelect={false}
            flip={false}
          >
            {({ isOpen }) => (
              <>
                <MenuButton
                  isActive={isOpen}
                  as={Button}
                  leftIcon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  sx={{
                    "&:hover": {
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    },
                    "&:active": {
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    },
                    "&:focus": {
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    },
                    "&:selected": {
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    },
                    fontSize: "14px",
                    fontWeight: "semibold",
                    color: "white",
                    padding: "0px",
                    height: "auto",
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                  _active={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                  _focus={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                  _hover={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                  _selected={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                >
                  Direct Messages
                </MenuButton>
                <MenuList
                  as={Stack}
                  p={0}
                  bg={"trasparent"}
                  w={{ base: "250px", sm: "360px", md: "284px" }}
                  height="350px"
                  borderRadius={"16px"}
                  spacing={0}
                  border={"none"}
                >
                  <ScrollArea.Root className="ScrollAreaRoot">
                    <ScrollArea.Viewport className="ScrollAreaViewport">
                      {conversations.map((conversation, index) => (
                        <>
                          <MenuItem
                            key={index}
                            bg={"trasparent"}
                            borderRadius={"6px"}
                            _focus={{ bg: "pong_bg.200" }}
                            _hover={{ bg: "pong_bg.200" }}
                            _selected={{ bg: "pong_bg.200" }}
                          >
                            <Flex
                              direction="row"
                              gap="6px"
                              align="center"
                              justify="space-between"
                              w={"full"}
                            >
                              <Flex
                                direction="row"
                                gap="10px"
                                align="center"
                                justify={"start"}
                                w={"full"}
                              >
                                <Avatar
                                  size="md"
                                  name={conversation.name}
                                  src={conversation.avatar}
                                  borderColor="green.400"
                                  borderWidth="3px"
                                >
                                  <AvatarBadge
                                    boxSize="1em"
                                    border="2px solid white"
                                    bg={"green.400"}
                                    position="absolute"
                                    bottom={"-15%"}
                                    right={"0%"}
                                    translateY={"50%"}
                                  >
                                    <Text
                                      fontSize="8px"
                                      fontWeight="bold"
                                      color="white"
                                    >
                                      {conversation.unreadMessages}
                                    </Text>
                                  </AvatarBadge>
                                </Avatar>
                                <Stack
                                  direction="column"
                                  spacing={0}
                                  justify="start"
                                  //   alignContent="stretch"
                                  w="full"
                                >
                                  <Text
                                    fontSize={{
                                      base: "12px",
                                      sm: "14px",
                                      md: "15px",
                                    }}
                                    fontWeight="normal"
                                    alignSelf={"stretch"}
                                    color={"whiteAlpha.900"}
                                    letterSpacing={0}
                                    lineHeight={"auto"}
                                    overflow={"hidden"}
                                    whiteSpace={"nowrap"}
                                    textOverflow={"ellipsis"}
                                  >
                                    {conversation.name}
                                  </Text>
                                  <Text
                                    overflow={"hidden"}
                                    fontSize={{
                                      base: "9px",
                                      sm: "10px",
                                      md: "11px",
                                    }}
                                    fontWeight="regular"
                                    color="whiteAlpha.600"
                                    alignSelf={"stretch"}
                                    whiteSpace={"nowrap"}
                                    textOverflow="ellipsis"
                                  >
                                    {conversation.lastMessage}
                                  </Text>
                                  <Text
                                    overflow={"hidden"}
                                    fontSize={{
                                      base: "8px",
                                      sm: "9px",
                                      md: "9px",
                                    }}
                                    fontWeight="regular"
                                    color="whiteAlpha.600"
                                    alignSelf={"stretch"}
                                    whiteSpace={"nowrap"}
                                    textOverflow="ellipsis"
                                  >
                                    {conversation.lastMessageDate}
                                  </Text>
                                </Stack>
                              </Flex>
                              <CloseButton size="sm" color="white" />
                            </Flex>
                          </MenuItem>
                          {/* <MenuDivider m={0} /> */}
                        </>
                      ))}
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar
                      className="ScrollAreaScrollbar"
                      orientation="vertical"
                    >
                      <ScrollArea.Thumb className="ScrollAreaThumb" />
                    </ScrollArea.Scrollbar>
                    <ScrollArea.Scrollbar
                      className="ScrollAreaScrollbar"
                      orientation="horizontal"
                    >
                      <ScrollArea.Thumb className="ScrollAreaThumb" />
                    </ScrollArea.Scrollbar>
                    <ScrollArea.Corner className="ScrollAreaCorner" />
                  </ScrollArea.Root>
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>
        <Flex direction="row" gap="2px" align={"center"} justify="center">
          <IconButton
            size="xs"
            fontSize="lg"
            bg={"pong_bg_secondary"}
            color={"white"}
            borderRadius={8}
            aria-label="Search for a conversation"
            icon={<BsPersonPlus />}
            _hover={{ bg: "white", color: "pong_bg_secondary" }}
            onClick={() => {
              setIsAddDirectMessageOpen(true);
            }}
          />
        </Flex>
      </Flex>
      <Box
        w="full"
        height="360px"
        //    bg={"red"}
      ></Box>
    </Flex>
  );
};

export default ChatLeftSidebar;
