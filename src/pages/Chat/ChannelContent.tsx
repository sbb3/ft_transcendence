import {
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import ChatContentFooter from "./ChatContentFooter";
import ChatContentHeader from "./ChatContentHeader";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "src/components/Utils/Loader";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGetSingleChannelByNameQuery } from "src/features/channels/channelsApi";
import {
  useGetMessagesByChannelNameQuery,
  useCreateChannelMessageMutation,
} from "src/features/channelMessages/channelMessagesApi";
import ChatContentBody from "./ChatContentBody";
import ChannelContentBody from "./ChannelContentBody";

dayjs.extend(relativeTime);

const ChannelContent = () => {
  const currentUser = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  //   TODO: rename isDrawerOpen isProfileDrawerOpen
  const { isOpen: isDrawerOpen, onToggle: toggleDrawer } = useDisclosure();
  const toast = useToast();
  let { channelname } = useParams();

  const { data: channels, isLoading: isLoadingChannels } =
    useGetSingleChannelByNameQuery(channelname, {
      refetchOnMountOrArgChange: true,
    });

  const {
    data: messages,
    isLoading: isLoadingMessages,
    isError: isErrorGettingMessages,
  } = useGetMessagesByChannelNameQuery(channelname);

  const [createChannelMessage, { isLoading: isCreatingChannelMsg }] =
    useCreateChannelMessageMutation();

  // TODO: loadings and errors
  const onSubmit = async (data: any) => {
    const { message } = data;
    const channel = channels[0];
    const msg = {
      id: uuidv4(),
      channelId: channel.id,
      channelName: channelname,
      //   sender: { id: currentUser.id },
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      receivers: [...channel.members],
      content: message,
      lastMessageCreatedAt: dayjs().valueOf(),
      //   updatedAt: dayjs().format(),
    };

    try {
      createChannelMessage(msg).unwrap();
    } catch (error) {
      console.log("error happened on submit new channel msg: ", error);
      toast({
        title: "Message not sent.",
        description: "Message not sent to the channel.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

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
        // pos="relative"
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
        {isLoadingMessages || isLoadingChannels ? (
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
        ) : channels?.length > 0 ? (
          <>
            <ChatContentHeader
              toggleDrawer={toggleDrawer}
              type={"Channel"}
              channel={channels[0]}
            />
            <ChannelContentBody
              messages={messages}
              toggleDrawer={toggleDrawer}
              isDrawerOpen={isDrawerOpen}
              error={null}
              receiverUser={null}
            />
            <ChatContentFooter
              onSubmit={onSubmit}
              isLoading={isCreatingChannelMsg}
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
              No channel messages yet !
            </Text>
          </Flex>
        )}
      </Stack>
    </Flex>
  );
};

export default ChannelContent;
