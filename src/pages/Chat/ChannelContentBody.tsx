import { Avatar, Box, Flex, Stack, Text } from "@chakra-ui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbarChatBody.css";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChatRightModal from "./ChatRightModal";
import usersApi from "src/features/users/usersApi";

const ChannelContentBody = ({
  messages = [],
  toggleDrawer,
  isDrawerOpen,
  error = null,
  receiverUser = null,
}) => {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const messagesRef = useRef(null);
  const [participantUserId, setParticipantUserId] = useState(null);

  const scrollToBottom = () => {
    messagesRef?.current?.scrollIntoView({ behavior: "smooth" });
  };


  const [triggerGetCurrentUser, { isLoading: isLoadingGetCurrentUser }] =
    usersApi.useLazyGetCurrentUserQuery();


  useEffect(() => {
    // console.log("messagesRef.current", messagesRef.current);
    if (messagesRef.current) {
      scrollToBottom();
    }
    return () => {
      scrollToBottom();
    };
  }, [messages]);

  const refetchCurrentUser = async () => {
    // const result = await usersApi.endpoints.getCurrentUser.initiate(undefined, {
    //   force: true,
    // } as any);
    // if (result?.data) {
    //   // dispatch(setCurrentUser(result?.data));
    // }
    try {
      await triggerGetCurrentUser(currentUser?.id).unwrap();

    } catch (error) {
      console.log("error: ", error);
    }
  }

  return (
    <Stack
      // position="relative"
      id="ChannelContentBodyStack"
      // direction={"column-reverse"}
      justify={"start"}
      w={"full"}
      // h={"full"}
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
    // onClick={() => {
    //   if (isDrawerOpen) {
    //     toggleDrawer();
    //   }
    // }}
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
            This channel does not exist 🤷‍♂️
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
                  //   h="full"
                  gap={1}
                  align="center"
                  justify="start"
                  borderRadius={6}
                  //   border="1px solid white"
                  p={1}
                  // display={
                  //   currentUser?.blockedUsers?.includes(message?.sender?.id)
                  //     ? "none"
                  //     : "flex"
                  // }
                  filter={
                    currentUser?.blockedUsers?.includes(message?.sender?.id)
                      ? "blur(6px)"
                      : "none"
                  }
                >
                  {message?.sender?.id !== currentUser?.id && (
                    <Avatar
                      // size="sm"
                      name={message?.sender?.name}
                      src={message?.sender?.avatar}
                      // borderColor="green.400"
                      // borderWidth="3px"
                      style={{ width: "36px", height: "36px" }}
                      cursor="pointer"
                      onClick={() => {
                        setParticipantUserId(message?.sender?.id);
                        toggleDrawer()
                      }} // TODO: show the user data in the drawer
                    />
                  )}
                  <Stack
                    w="full"
                    justify="center"
                    align={
                      message?.sender.id === currentUser?.id ? "end" : "start"
                    }
                  >
                    <Text
                      fontSize="12px"
                      fontWeight="medium"
                      color="whiteAlpha.900"
                      bg={
                        message?.sender.id === currentUser?.id
                          ? "gray.600"
                          : "gray.700"
                      }
                      //   minW="300px"
                      maxW={"300px"}
                      p={2}
                      px={2}
                      mx={1}
                      textAlign={
                        message?.sender.id === currentUser?.id
                          ? "right"
                          : "left"
                      }
                    >
                      {message?.content}
                    </Text>
                  </Stack>
                  {/* {isDrawerOpen && message?.sender.id !== currentUser?.id &&
                    participantUserId === message?.sender?.id &&
                    (
                      <ChatRightModal
                        participantUserId={message?.sender?.id}
                        isOpen={isDrawerOpen}
                        toggleDrawer={toggleDrawer}
                      />
                    )} */}
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
      {isDrawerOpen && participantUserId !== currentUser?.id &&
        (
          <ChatRightModal
            participantUserId={participantUserId}
            isOpen={isDrawerOpen}
            toggleDrawer={toggleDrawer}
            refetchCurrentUser={refetchCurrentUser}
          />
        )}
    </Stack>
  );
};

export default ChannelContentBody;
