import { Avatar, AvatarBadge, Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";

const ChatContentHeader = () => {
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
      border="1px solid rgba(251, 102, 19, 0.69)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
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
          Brad Pitt
        </Text>
        <Text fontSize="14px" fontWeight="medium" color="green.300">
          online
        </Text>
      </Stack>
    </Flex>
  );
};

export default ChatContentHeader;
