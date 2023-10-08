import { Avatar, Flex, Text } from "@chakra-ui/react";
import ChatRightModal from "./ChatRightModal";

const ConversationMessage = ({
  message,
  currentUser,
  receiverUser,
  toggleProfileDrawer,
}) => {
  return (
    <Flex
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
              ? "gray.700"
              : "gray.800"
          }
          maxW={"300px"}
          p={2}
          px={2}
          mx={1}
          textAlign={
            message?.sender.email === currentUser?.email ? "right" : "left"
          }
          borderRadius={6}
        >
          {message?.content}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ConversationMessage;
