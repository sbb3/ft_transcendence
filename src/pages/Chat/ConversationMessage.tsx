import { Avatar, Flex, Text } from "@chakra-ui/react";
import ChatRightModal from "./ChatRightModal";

const ConversationMessage = ({
  message,
  currentUser,
  receiverUser,
  toggleProfileDrawer,
  isProfileDrawerOpen,
}) => {
  return (
    <Flex
      id="first_flex"
      key={message?.id}
      direction="row"
      w="full"
      gap={1}
      align="center"
      justify="start"
      borderRadius={6}
      p={1}
    >
      {message?.sender.email !== currentUser?.email && (
        <Avatar
          name={receiverUser?.name}
          src={receiverUser?.avatar}
          onClick={toggleProfileDrawer}
          style={{ width: "36px", height: "36px" }}
          cursor="pointer"
        />
      )}

      <Flex
        w="full"
        align="center"
        justify={message?.sender.email === currentUser?.email ? "end" : "start"}
      >
        <Text
          fontSize="12px"
          fontWeight="medium"
          color="whiteAlpha.900"
          bg={
            message?.sender.email === currentUser?.email
              ? "gray.600"
              : "gray.700"
          }
          maxW={"300px"}
          p={2}
          px={2}
          mx={1}
          textAlign={
            message?.sender.email === currentUser?.email ? "right" : "left"
          }
        >
          {message?.content}
        </Text>
      </Flex>
      {isProfileDrawerOpen && message?.sender.id !== currentUser?.id && (
        <ChatRightModal
          participantUserId={
            message?.sender?.id !== currentUser?.id
              ? message?.sender?.id
              : message?.receiver?.id
          }
          isOpen={isProfileDrawerOpen}
          toggleProfileDrawer={toggleProfileDrawer}
        />
      )}
    </Flex>
  );
};

export default ConversationMessage;
