import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "./scrollbar.css";
import { useEffect, useRef } from "react";

const ChatContentBody = ({ messages }) => {
  const messagesRef = useRef(null);

  const scrollToBottom = () => {
    messagesRef?.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    // console.log("messagesRef.current", messagesRef.current);
    if (messagesRef.current) {
      scrollToBottom();
    }
    return () => {
      scrollToBottom();
    }
  }, [messages]);

  return (
    <Stack
      w={"full"}
      h={"800px"}
      //   bg={"red.400"}
      borderRadius={6}
      p={2}
      spacing={4}
      border="1px solid rgba(251, 102, 19, 0.69)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      {/* scroll to the end */}
      <ScrollArea.Root className="ScrollAreaRoot">
        <ScrollArea.Viewport className="ScrollAreaViewport"
        >

          {messages.map((message) => (
            <Flex
              key={message.id}
              direction="row"
              w="full"
              //   h="full"
              gap={1}
              align="center"
              justify="start"
              //   bg={"teal.300"}
              borderRadius={6}
              //   border="1px solid white"
              p={1}
            >
              {message.sender === "other" ? (
                <Avatar
                  size="lg"
                  name={message.sender}
                  src={message.avatar}
                  borderColor="green.400"
                  borderWidth="3px"
                />
              ) : null}

              <Flex
                // bg={"green.400"}
                w="full"
                align="center"
                justify={message.sender === "me" ? "end" : "start"}
              >
                <Text
                  fontSize="12px"
                  fontWeight="medium"
                  color="whiteAlpha.900"
                  bg={message.sender === "me" ? "gray.600" : "gray.700"}
                  //   minW="300px"
                  maxW={"300px"}
                  p={2}
                  px={2}
                  mx={1}
                  textAlign={message.sender === "me" ? "right" : "left"}
                >
                  {message.content}
                </Text>
              </Flex>
            </Flex>
          ))}
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
    </Stack>
  );
};

export default ChatContentBody;
