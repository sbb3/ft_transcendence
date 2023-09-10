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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { MdSend } from "react-icons/md";
import ChatContentFooter from "./ChatContentFooter";
import ChatContentHeader from "./ChatContentHeader";
import ChatContentBody from "./ChatContentBody";
import { useImmer } from "use-immer";

import msgs from "src/config/data/messages.js";
import { faker } from "@faker-js/faker";
import ChatRightModal from "./ChatRightModal";

// const msgs = [...Array(30)].map(() => ({
//   id: faker.string.uuid(),
//   sender: "other" || "me",
//   content: faker.lorem.sentence(),
//   avatar: "https://64.media.tumblr.com/a566eec40d22d9989a6fd1e819b347ee/37a863925050913a-a5/s1280x1920/1360367c6057b4cd40ea8105d74580fbcc177fc8.jpg",
// }));

const ChatContent = ({ type, conversation, channelData, isContentOpen }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen((prevState) => !prevState);
  const toast = useToast();
  const [messages, setMessages] = useImmer(msgs);

  let content;

  const onSubmit = (message: any) => {
    // console.log("message: ", message);
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

  if (!isContentOpen) {
    content = (
      <Stack
        // ml={2}
        // bg={"gray.400"}
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
      <>
        <Stack
          // ml={2}
          // bg={"gray"}
          justify="start"
          align="center"
          w={"full"}
          // h={"1000px"}
          h={"full"}
          borderRightRadius={26}
          spacing={1}
          pl={{ base: 1 }}
        >
          <ChatContentHeader
            channelData={channelData}
            conversation={conversation}
            toggleDrawer={toggleDrawer}
            type={type}
          />
          <ChatContentBody messages={messages} toggleDrawer={toggleDrawer} />
          <ChatContentFooter onSubmit={onSubmit} setMessages={setMessages} />
        </Stack>
        <ChatRightModal
          conversation={conversation}
          isOpen={isDrawerOpen}
          toggleDrawer={toggleDrawer}
        />
      </>
    );
  }
  return (
    <Flex
      //   direction="row"
      // bg={"pong_bg_secondary"}
      pos="relative"
      alignSelf={"stretch"}
      justify="center"
      // align="center"
      p={0}
      borderRightRadius={6}
      flex={1}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
      //   gap={6}
    >
      {content}
    </Flex>
  );
};

export default ChatContent;
