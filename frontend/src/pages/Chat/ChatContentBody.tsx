import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbarChatBody.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ConversationMessage from "./ConversationMessage";
import messagesApi, {
  useGetMessagesByConversationIdQuery,
} from "src/features/messages/messagesApi";
import Loader from "src/components/Utils/Loader";
import store from "src/app/store";
import InfiniteScroll from "react-infinite-scroll-component";
import { Scrollbars } from "rc-scrollbars";
import ChatRightModal from "./ChatRightModal";

const ChatContentBody = ({
  conversationId,
  toggleProfileDrawer,
  isProfileDrawerOpen,
  receiverUser = {} as any,
}) => {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const [page, setPage] = useState(1);

  const {
    data: { messages = [], totalPages = 0 } = {},
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages,
    isError,
    error,
  } = useGetMessagesByConversationIdQuery(conversationId); // add page = 1, limit = 10

  useEffect(() => {
    if (page > 1) {
      store.dispatch(
        messagesApi.endpoints.getMoreMessagesByConversationId.initiate({
          conversationId,
          page,
        })
      );
    }
  }, [page, conversationId]);

  let content;

  if (isLoadingMessages || isFetchingMessages) {
    content = (
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
    );
  } else if (isError) {
    content = (
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
          {error?.data?.message || "Something went wrong 🤷‍♂️"}
        </Text>
      </Flex>
    );
  } else if (messages?.length > 0) {
    content = (
      <InfiniteScroll
        scrollableTarget="scrollableDiv"
        dataLength={messages?.length}
        next={() => setPage((prev) => prev + 1)}
        hasMore={page < totalPages}
        loader={<Loader />}
        inverse={true}
        style={{ display: "flex", flexDirection: "column-reverse" }}
      >
        {messages?.map((message) => (
          <ConversationMessage
            message={message}
            currentUser={currentUser}
            receiverUser={receiverUser}
            toggleProfileDrawer={toggleProfileDrawer}
          />
        ))}
      </InfiniteScroll>
    );
  } else {
    content = (
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
    );
  }

  return (
    <Stack
      position="relative"
      id="scrollableDiv"
      direction="column-reverse"
      overflowY="auto"
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
      {content}

      {isProfileDrawerOpen && (
        <ChatRightModal
          participantUserId={receiverUser?.id}
          isOpen={isProfileDrawerOpen}
          toggleProfileDrawer={toggleProfileDrawer}
        />
      )}
    </Stack>
  );
};

export default ChatContentBody;
