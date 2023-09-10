import { Avatar, AvatarBadge, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { FaHashtag } from "react-icons/fa";

const ChatContentHeader = ({
  channelData: channel,
  conversation,
  toggleDrawer,
  type,
}) => {
  return (
    <Flex
      w={"full"}
      justify="start"
      align="center"
      // bg={"red.400"}
      h={20}
      borderRadius={6}
      p={4}
      gap={3}
      //   alignSelf={"stretch"}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
      bg={"rgba(51, 51, 51, 0.9)"}
    >
      {type === "DM" ? (
        <Flex
          direction="row"
          gap={4}
          align="center"
          justify={"start"}
          w="full"
          onClick={toggleDrawer}
        >
          <Avatar
            size="lg"
            name="Brad Pitt"
            src="https://64.media.tumblr.com/a566eec40d22d9989a6fd1e819b347ee/37a863925050913a-a5/s1280x1920/1360367c6057b4cd40ea8105d74580fbcc177fc8.jpg"
            borderColor="green.400"
            borderWidth="3px"
          >
            <AvatarBadge
              boxSize="0.6em"
              border="3px solid white"
              bg={"green.400"}
            />
          </Avatar>
          <Stack direction="column" spacing={1} align="start">
            <Text fontSize="18px" fontWeight="semibold" color="whiteAlpha.900">
              {conversation.name}
            </Text>
            <Text fontSize="14px" fontWeight="medium" color="green.300">
              {conversation.status}
            </Text>
          </Stack>
        </Flex>
      ) : (
        <Stack direction="row" spacing={1} align="center" justify={"center"}>
          <Icon as={FaHashtag} boxSize="20px" color="whiteAlpha.900" />
          <Text fontSize="18px" fontWeight="semibold" color="whiteAlpha.900">
            {channel.name}
          </Text>
        </Stack>
      )}
    </Flex>
  );
};

export default ChatContentHeader;
