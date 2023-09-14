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
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdSend } from "react-icons/md";
import ChatContentFooter from "./ChatContentFooter";
import ChatContentHeader from "./ChatContentHeader";
import ChatContentBody from "./ChatContentBody";
import { useImmer } from "use-immer";

import msgs from "src/config/data/messages.js";
import { faker } from "@faker-js/faker";
import ChatRightModal from "./ChatRightModal";
import { useGetMessagesByConversationIdQuery } from "src/features/messages/messagesApi";
import { useLocation, useParams } from "react-router-dom";
import Loader from "src/components/Utils/Loader";
import { useAddMessageMutation } from "src/features/messages/messagesApi";
import { useGetConversationQuery } from "src/features/conversations/conversationsApi";
import { useGetUserByEmailQuery } from "src/features/users/usersApi";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
// const msgs = [...Array(30)].map(() => ({
//   id: faker.string.uuid(),
//   sender: "other" || "me",
//   content: faker.lorem.sentence(),
//   avatar: "https://64.media.tumblr.com/a566eec40d22d9989a6fd1e819b347ee/37a863925050913a-a5/s1280x1920/1360367c6057b4cd40ea8105d74580fbcc177fc8.jpg",
// }));

interface IChatReceiver {
  id: number;
  name: string;
  email: string;
  password: string;
}

const ChatContent = () => {
  const [receiverName, setReceiverName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [skip, setSkip] = useState(true);
  const currentUser = useSelector((state: any) => state.auth.user);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const toggleDrawer = () => setIsDrawerOpen((prevState) => !prevState);
  const toast = useToast();
  let { id } = useParams();
  const {
    data: conversations,
    isLoading: isLoadingConversation,
    isError: isErrorGettingConversation,
    error: errorGettingConversation,
  } = useGetConversationQuery(id);

  const {
    data: receiversData,
    isLoading: isLoadinGetUserByEmail,
    error: errorGettingReceiver,
  } = useGetUserByEmailQuery(receiverEmail, {
    skip,
  });

  useEffect(() => {
    if (conversations?.length > 0) {
      const receiverEmail = conversations[0].members.filter(
        (m) => m !== currentUser.email
      )[0];
      setReceiverEmail(receiverEmail);
      setSkip(false);
    }
  }, [conversations]);

  useEffect(() => {
    if (receiversData?.length > 0) {
      setReceiverName(receiversData[0].name);
    }
  }, [receiversData]);

  const [addMessage, { isLoading: isAdding, error: error2 }] =
    useAddMessageMutation();

  const {
    data: messages,
    isLoading: isLoadingMessages,
    isError: isErrorGettingMessages,
    error: errorGettingMessages,
  } = useGetMessagesByConversationIdQuery(id);

  // const receiver = users?.find((u) => u.id === receiverId);

  // TODO: loadings and errors

  const onSubmit = async (data: any) => {
    // console.log("data: ", data);
    const { message } = data;
    const receiver = receiversData[0] as IChatReceiver;
    // console.log("receiver: ", receiver);
    // fetch receiver user to get its info
    try {
      await addMessage({
        id: uuidv4(),
        conversationId: id,
        sender: {
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name,
        },
        receiver: {
          id: receiver.id,
          email: receiver.email,
          name: receiver.name,
        },
        content: message,
      }).unwrap();
    } catch (error) {
      console.log("error: ", error);
      toast({
        title: "Message not sent.",
        description: "We've not sent your message to the recipient.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (isLoadingMessages || isLoadingConversation || isLoadinGetUserByEmail)
    return <Loader />;

  if (errorGettingConversation) {
    toast({
      title: "Conversation not found.",
      description: "We couldn't find the conversation.",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
    // return null;
    // navigate("/chat");
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
          toggleDrawer={toggleDrawer}
          // type={type}
          type={"DM"}
          receiverName={receiverName}
        />
        <ChatContentBody
          messages={messages}
          toggleDrawer={toggleDrawer}
          error={errorGettingMessages}
        />
        <ChatContentFooter onSubmit={onSubmit} />
      </Stack>
      {/* <ChatRightModal
        conversation={conversation}
        isOpen={isDrawerOpen}
        toggleDrawer={toggleDrawer}
      /> */}
    </Flex>
  );
};

export default ChatContent;
