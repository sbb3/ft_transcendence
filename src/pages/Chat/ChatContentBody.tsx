import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbarChatBody.css";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const ChatContentBody = ({ messages, toggleDrawer, error }) => {
  const { email: currentUserEmail } = useSelector(
    (state: any) => state.auth.user
  );
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

  return (
    <Stack
      id="ChatContentBodyStack"
      // direction={"column-reverse"}
      justify={"start"}
      w={"full"}
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
            {messages?.map((message) => (
              <Flex
                id="first_flex"
                key={message?.id}
                direction="row"
                w="full"
                //   h="full"
                gap={1}
                align="center"
                justify="start"
                // bg={"teal.300"}
                borderRadius={6}
                //   border="1px solid white"
                p={1}
              >
                {/* {message?.sender === "other" ? (
                  <Avatar
                    size="lg"
                    name={message?.sender}
                    src={message?.avatar}
                    borderColor="green.400"
                    borderWidth="3px"
                    onClick={toggleDrawer} // TODO: send the user data to the drawer
                  />
                ) : null} */}

                <Flex
                  // bg={"green.400"}
                  w="full"
                  align="center"
                  justify={
                    message?.sender.email === currentUserEmail ? "end" : "start"
                  }
                >
                  <Text
                    fontSize="12px"
                    fontWeight="medium"
                    color="whiteAlpha.900"
                    bg={
                      message?.sender.email === currentUserEmail
                        ? "gray.600"
                        : "gray.700"
                    }
                    //   minW="300px"
                    maxW={"300px"}
                    p={2}
                    px={2}
                    mx={1}
                    textAlign={
                      message?.sender.email === currentUserEmail
                        ? "right"
                        : "left"
                    }
                  >
                    {message?.content}
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
      )}
    </Stack>
  );
};

export default ChatContentBody;
