import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useGetConversationsQuery } from "src/features/conversations/conversationsApi";
import { useSelector } from "react-redux";

// id: 1,
//     name: "Brad Pitt",
//     avatar:
//     lastMessage: "Hey, how are you?",
//     lastMessageDate: "11:11",
//     unreadMessages: 2,
//     status: "online",

const Conversations = ({
  setType,
  setConversation,
  toggleContent,
  setIsAddDirectMessageOpen,
}) => {
  const { email: currentUserEmail } = useSelector(
    (state: any) => state?.auth?.user
  );
  // console.log("currentUserEmail: ", currentUserEmail);
  const navigate = useNavigate();
  const { data: conversations, isLoading } = useGetConversationsQuery(
    currentUserEmail
    // {
    //   refetchOnMountOrArgChange: true,
    // }
  );

  return (
    <>
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
                      {conversations?.map((conversation, index) => (
                        <MenuItem
                          key={index}
                          bg={"trasparent"}
                          borderRadius={"6px"}
                          _focus={{ bg: "pong_bg.200" }}
                          _hover={{ bg: "pong_bg.200" }}
                          _selected={{ bg: "pong_bg.200" }}
                          onClick={() => {
                            toggleContent(true);
                            // setConversation(conversation);
                            // setType("DM");
                            navigate(`/chat/conversation/${conversation.id}`);
                          }}
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
                                name={conversation.title}
                                src={conversation.avatar}
                                borderColor="green.400"
                                borderWidth="3px"
                              >
                                <AvatarBadge
                                  boxSize="0.7em"
                                  border="2px solid white"
                                  bg={"green.400"}
                                  position="absolute"
                                  bottom={"-15%"}
                                  right={"0%"}
                                  translateY={"50%"}
                                >
                                  {/* <Text
                                      fontSize="8px"
                                      fontWeight="bold"
                                      color="white"
                                    >
                                      {conversation.unreadMessages}
                                    </Text> */}
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
                                  {conversation.title}
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
                                  {conversation.lastMessageContent}
                                </Text>
                                {/* <Text
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
                                  </Text> */}
                              </Stack>
                            </Flex>
                            {/* <CloseButton size="sm" color="white" /> */}
                          </Flex>
                        </MenuItem>
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
            icon={<FiPlus />}
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
    </>
  );
};

export default Conversations;
