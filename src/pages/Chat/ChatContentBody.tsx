import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbarChatBody.css";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ChatRightModal from "./ChatRightModal";

const ChatContentBody = ({
  messages = [],
  toggleDrawer,
  error,
  isDrawerOpen,
  receiverUser = null,
}) => {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const messagesRef = useRef(null);

  const scrollToBottom = () => {
    messagesRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messagesRef.current) {
      scrollToBottom();
    }
    return () => {
      scrollToBottom();
    };
  }, [messages]);

  return (
    <Stack
      justify={"start"}
      w={"full"}
      h={"800px"}
      borderRadius={6}
      p={2}
      spacing={4}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
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
            This conversation is empty 🤔 or does not exist 🤷‍♂️
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
                  gap={1}
                  align="center"
                  justify="start"
                  borderRadius={6}
                  p={1}
                >
                  {message?.sender.email !== currentUser?.email && (
                    <Avatar
                      // size="sm"
                      name={receiverUser?.name}
                      src={receiverUser?.avatar}
                      onClick={toggleDrawer}
                      style={{ width: "36px", height: "36px" }}
                      cursor="pointer"
                    />
                  )}

                  <Flex
                    w="full"
                    align="center"
                    justify={
                      message?.sender.email === currentUser?.email
                        ? "end"
                        : "start"
                    }
                  >
                    <Text
                      fontSize="12px"
                      fontWeight="medium"
                      color="whiteAlpha.900"
                      bg={
                        message?.sender.email === currentUser?.email
                          ? "gray.600"
                          : "gray.700"
                      }
                      maxW={"300px"}
                      p={2}
                      px={2}
                      mx={1}
                      textAlign={
                        message?.sender.email === currentUser?.email
                          ? "right"
                          : "left"
                      }
                    >
                      {message?.content}
                    </Text>
                  </Flex>
                  {isDrawerOpen && message?.sender.id !== currentUser?.id && (
                    <ChatRightModal
                      participantUserId={
                        message?.sender?.id !== currentUser?.id
                          ? message?.sender?.id
                          : message?.receiver?.id
                      }
                      isOpen={isDrawerOpen}
                      toggleDrawer={toggleDrawer}
                    />
                  )}
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
    </Stack>
  );
};

export default ChatContentBody;
