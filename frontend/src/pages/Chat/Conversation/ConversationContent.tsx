import { Flex, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ChatContentFooter from "../ChatContentFooter";
import ChatContentHeader from "../ChatContentHeader";
import ChatContentBody from "../ChatContentBody";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "src/components/Utils/Loader";
import { useAddMessageMutation } from "src/features/messages/messagesApi";
import conversationApi, {
  useGetConversationQuery,
} from "src/features/conversations/conversationsApi";
import { useGetUserByEmailQuery } from "src/features/users/usersApi";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { setCurrentConversationId } from "src/features/conversations/conversationsSlice";
import store from "src/app/store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface IChatReceiver {
  id: number;
  name: string;
  email: string;
  password: string;
}

const ConversationContent = () => {
  const dispatch = useDispatch();
  // const [receiver, setReceiver] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [skip, setSkip] = useState(true);
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const navigate = useNavigate();
  const { isOpen: isProfileDrawerOpen, onToggle: toggleProfileDrawer } =
    useDisclosure();
  const toast = useToast();
  const { id } = useParams();

  const {
    data: conversations,
    isLoading: isLoadingConversation,
    isFetching: isFetchingConversation,
    isError: errorGettingConversation,
  } = useGetConversationQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: receiverUser = {} as any,
    isLoading: isLoadinGetUserByEmail,
    isFetching: isFetchingGetUserByEmail,
    isError: errorGettingReceiver,
  } = useGetUserByEmailQuery(receiverEmail, {
    skip,
  });

  const [addMessage, { isLoading: isAdding }] = useAddMessageMutation();

  useEffect(() => {
    if (conversations?.length > 0) {
      dispatch(setCurrentConversationId(id));
    }

    return () => {
      dispatch(setCurrentConversationId(""));
    };
  }, [conversations, dispatch]);

  useEffect(() => {
    if (conversations?.length > 0) {
      const receiverEmail = conversations[0].members.filter(
        (m) => m !== currentUser?.email
      )[0];
      const senderEmail = conversations[0].members.filter(
        (m) => m === currentUser?.email
      )[0];
      if (
        currentUser?.email === senderEmail ||
        currentUser?.email === receiverEmail
      ) {
        console.log("allowed");
        setReceiverEmail(receiverEmail);
        setSkip(false);
      } else {
        console.log("not allowed");
        toast({
          title: "Conversation not found.",
          description: "We couldn't find the conversation.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        navigate("/chat");
      }
    } else if (conversations?.length === 0) {
      navigate("/chat", { replace: true });
    }
  }, [conversations]);

  // useEffect(() => {
  //   if (receiverUser) {
  //     setReceiver(receiverUser);
  //   }
  // }, [receiverUser]);

  const onSendMessage = async (data: any) => {
    const { message } = data;
    // const receiver = receiverUser;
    try {
      const msgData = {
        id: uuidv4(),
        conversationId: id,
        sender: currentUser?.id,
        receiver: receiverUser?.id,
        content: message,
        lastMessageCreatedAt: dayjs().valueOf(),
      };
      const conversation = conversations[0];
      if (conversation.id) {
        await addMessage(msgData).unwrap();
      } else {
        navigate("/chat", { replace: true });
      }
    } catch (error) {
      console.log("error: ", error);
      toast({
        title: "Message not sent.",
        description:
          error?.data?.message ||
          "We've not sent your message to the recipient.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      navigate("/chat", { replace: true });
    }
  };

  if (errorGettingConversation) {
    toast({
      title: "Conversation not found.",
      description: "We couldn't find the conversation.",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }

  if (errorGettingReceiver) {
    toast({
      title: "Receiver not found.",
      description: "We couldn't find the receiver.",
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  }
  return (
    <Flex
      pos="relative"
      alignSelf={"stretch"}
      justify="center"
      p={0}
      borderRightRadius={6}
      flex={1}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <Stack
        justify="start"
        align="center"
        w={"full"}
        h={"full"}
        borderRightRadius={26}
        spacing={1}
        pl={{ base: 1 }}
      >
        {isLoadingConversation ||
        isFetchingConversation ||
        isLoadinGetUserByEmail ||
        isFetchingGetUserByEmail ? (
          <Flex
            justify="center"
            align="center"
            h="100%"
            w="100%"
            color="white"
            fontSize="xl"
            fontWeight="semibold"
          >
            <Loader />
          </Flex>
        ) : conversations?.length > 0 ? (
          <>
            <ChatContentHeader
              toggleProfileDrawer={toggleProfileDrawer}
              type={"DM"}
              receiverUser={receiverUser}
            />
            <ChatContentBody
              conversationId={id}
              toggleProfileDrawer={toggleProfileDrawer}
              isProfileDrawerOpen={isProfileDrawerOpen}
              receiverUser={receiverUser}
            />
            <ChatContentFooter
              onSendMessage={onSendMessage}
              isLoading={isAdding}
            />
          </>
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
              Conversation not found.
            </Text>
          </Flex>
        )}
      </Stack>
    </Flex>
  );
};

export default ConversationContent;
