import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbarChatBody.css";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ChatRightModal from "./ChatRightModal";

const ChannelContentBody = ({
  messages = [],
  toggleDrawer,
  isDrawerOpen,
  error,
  receiverUser = null,
}) => {
  const currentUser = useSelector((state: any) => state.auth.user);
  const messagesRef = useRef(null);

  const scrollToBottom = () => {
    messagesRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // console.log("messagesRef.current", messagesRef.current);
    if (messagesRef.current) {
      scrollToBottom();
    }
    return () => {
      scrollToBottom();
    };
  }, [messages]);

  // console.log("receiverUser", receiverUser);

  return (
    <Stack
      // position="relative"
      id="ChannelContentBodyStack"
      // direction={"column-reverse"}
      justify={"start"}
      w={"full"}
      // h={"full"}
      h={"800px"}
      //   bg={"red.400"}
      borderRadius={6}
      p={2}
      spacing={4}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
      // bg="red.400"
      // onClick={() => {
      //   if (isDrawerOpen) {
      //     toggleDrawer();
      //   }
      // }}
    >
      {error ? (
        <Flex
          justify="center"
          align="center"
          h="100%"
          w="100%"
          color="white"
          fontSize="xl"
          fontWeight="semibold"
        >
          <Text fontSize="xl" fontWeight="normal" color="white">
            This channel does not exist 🤷‍♂️
          </Text>
        </Flex>
      ) : (
        <ScrollArea.Root id="ScrollArea.Root" className="ScrollAreaRoot">
          <ScrollArea.Viewport
            id="ScrollArea.Viewport"
            className="ScrollAreaViewport"
          >
            {messages?.length > 0 ? (
              messages?.map((message) => (
                <Flex
                  id="first_flex"
                  key={message?.id}
                  direction="row"
                  w="full"
                  //   h="full"
                  gap={1}
                  align="center"
                  justify="start"
                  borderRadius={6}
                  //   border="1px solid white"
                  p={1}
                >
                  {message?.sender?.id !== currentUser?.id && (
                    <Avatar
                      // size="sm"
                      name={message?.sender?.name}
                      src={message?.sender?.avatar}
                      // borderColor="green.400"
                      // borderWidth="3px"
                      onClick={toggleDrawer} // TODO: show the user data in the drawer
                      style={{ width: "36px", height: "36px" }}
                      cursor="pointer"
                    />
                  )}
                  <Stack
                    w="full"
                    justify="center"
                    align={
                      message?.sender.id === currentUser.id ? "end" : "start"
                    }
                  >
                    <Text
                      fontSize="12px"
                      fontWeight="medium"
                      color="whiteAlpha.900"
                      bg={
                        message?.sender.id === currentUser.id
                          ? "gray.600"
                          : "gray.700"
                      }
                      //   minW="300px"
                      maxW={"300px"}
                      p={2}
                      px={2}
                      mx={1}
                      textAlign={
                        message?.sender.id === currentUser.id ? "right" : "left"
                      }
                    >
                      {message?.content}
                    </Text>
                  </Stack>
                </Flex>
              ))
            ) : (
              <Flex
                justify="center"
                align="center"
                h="100%"
                w="100%"
                color="white"
                fontSize="xl"
                fontWeight="semibold"
              >
                <Text fontSize="xl" fontWeight="normal" color="white">
                  Start the conversation 🚀
                </Text>
              </Flex>
            )}
            <Box ref={messagesRef} />
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
      )}
      {/* {isDrawerOpen && (
        <ChatRightModal
          receiverUser={receiverUser}
          isOpen={isDrawerOpen}
          toggleDrawer={toggleDrawer}
        />
      )} */}
    </Stack>
  );
};

export default ChannelContentBody;