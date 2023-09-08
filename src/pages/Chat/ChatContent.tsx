import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  Textarea,
  Toast,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { MdSend } from "react-icons/md";
import ChatContentFooter from "./ChatContentFooter";
import ChatContentHeader from "./ChatContentHeader";
import ChatContentBody from "./ChatContentBody";
import { useImmer } from "use-immer";

const ChatContent = ({ toggleContent, isContentOpen }) => {
  const toast = useToast();
  const [messages, setMessages] = useImmer([
    {
      id: 1,
      sender: "me",
      content: "Hello there!",
      avatar: "https://anasdouib.me/images/picture.webp",
    },
    {
      id: 2,
      sender: "other",
      content: "Hi, how are you?",
      avatar:
        "https://64.media.tumblr.com/a566eec40d22d9989a6fd1e819b347ee/37a863925050913a-a5/s1280x1920/1360367c6057b4cd40ea8105d74580fbcc177fc8.jpg",
    },
    {
      id: 3,
      sender: "me",
      content: "I'm fine, thanks!",
      avatar: "https://anasdouib.me/images/picture.webp",
    },
    {
      id: 4,
      sender: "other",
      content: "Good to hear that!",
      avatar:
        "https://64.media.tumblr.com/a566eec40d22d9989a6fd1e819b347ee/37a863925050913a-a5/s1280x1920/1360367c6057b4cd40ea8105d74580fbcc177fc8.jpg",
    },
  ]);

  let content;

  const onSubmit = (message: any) => {
    console.log("message: ", message);
    setMessages((draft) => {
      draft.push({
        id: draft.length + 1,
        sender: "me",
        content: message.message,
        avatar: "https://anasdouib.me/images/picture.webp",
      });
    });
    // toast({
    //   title: "Message sent.",
    //   description: "We've sent your message to the recipient.",
    //   status: "success",
    //   duration: 2000,
    //   isClosable: true,
    // });
  };

  if (isContentOpen) {
    content = (
      <Stack
        // ml={2}
        bg={"gray.400"}
        justify="center"
        align="center"
        w={"full"}
        h={"full"}
        // borderRadius={20}
        borderRightRadius={20}
        spacing={6}
        p={{ base: 2, sm: 4, md: 8, lg: 12 }}
      >
        <Flex justify="center" align="center">
          <Image
            src="src/assets/svgs/messaging_girl.svg"
            alt="Messaging girl"
            borderRadius={20}
            // w="320px"
            // h="300px"
          />
        </Flex>
        <Stack spacing={2} align={"start"} justify={"center"}>
          <Box
            fontSize={{
              base: "24px",
              md: "28px",
              lg: "32px",
            }}
            fontWeight="semibold"
          >
            Choose
          </Box>
          <Box
            fontSize={{
              base: "24px",
              md: "28px",
              lg: "32px",
            }}
            fontWeight="semibold"
            color={"whiteAlpha.900"}
          >
            a{" "}
            <Text
              as="span"
              fontSize={{
                base: "24px",
                md: "28px",
                lg: "32px",
              }}
              fontWeight={"extrabold"}
              color={"pong_cl_primary"}
            >
              Channel
            </Text>{" "}
            or{" "}
            <Text
              as="span"
              fontSize={{
                base: "24px",
                md: "28px",
                lg: "32px",
              }}
              fontWeight={"extrabold"}
              color={"pong_cl_primary"}
            >
              DM
            </Text>{" "}
            to start
          </Box>
          <Box
            fontSize={{
              base: "24px",
              md: "28px",
              lg: "32px",
            }}
            fontWeight="semibold"
            color={"whiteAlpha.900"}
          >
            from the left panel
          </Box>
        </Stack>
      </Stack>
    );
  } else {
    content = (
      <Stack
        // ml={2}
        // bg={"gray"}
        justify="start"
        align="center"
        w={"full"}
        h={"full"}
        borderRightRadius={26}
        spacing={1}
        pl={{ base: 1 }}
      >
        <ChatContentHeader />
        <ChatContentBody messages={messages} />
        <ChatContentFooter onSubmit={onSubmit} setMessages={setMessages} />
      </Stack>
    );
  }
  return (
    <Flex
      //   direction="row"
      bg={"pong_bg_secondary"}
      pos="relative"
      alignSelf={"stretch"}
      justify="center"
      // align="center"
      p={0}
      borderRightRadius={26}
      flex={1}
      //   gap={6}
    >
      {content}
    </Flex>
  );
};

export default ChatContent;
