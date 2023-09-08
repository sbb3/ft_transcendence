import { Avatar, Flex, Stack, Text } from "@chakra-ui/react";

const ChatContentBody = ({ messages }) => {
  return (
    <Stack
      w={"full"}
      h={"full"}
      //   bg={"red.400"}
      borderRadius={6}
      p={2}
      overflowY="auto"
      spacing={4}
    >
      {messages.map((message) => (
        <Flex
          direction="row"
          w="full"
          //   h="full"
          gap={1}
          align="center"
          justify="start"
          //   bg={"teal.300"}
          borderRadius={6}
          //   border="1px solid white"
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
    </Stack>
  );
};

export default ChatContentBody;
