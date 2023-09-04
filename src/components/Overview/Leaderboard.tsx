import { Box, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { MdLeaderboard } from 'react-icons/md';

const Leaderboard = () => {
    return (
        <Stack
            outline="2px solid yellow"

            p={2}
            direction={{ base: "column" }}
            spacing="12px"
            borderRadius={24}
            border="1px solid rgba(251, 102, 19, 0.69)"
            boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
            backdropFilter={"blur(20px)"}
            bgImage={`url('src/assets/img/BlackNoise.png')`}
            bgSize="cover"
            bgRepeat="no-repeat"
            backgroundColor="#5A5A5A"
        >
            <Flex direction="row" align="center" justify="center" gap={1.5}>
                <Icon boxSize="22px" as={MdLeaderboard} color="white" />
                <Text
                    fontSize="20px"
                    fontWeight="semibold"
                    color="whiteAlpha.900"
                    letterSpacing={1}
                >
                    Leaderboard
                </Text>
            </Flex>
        </Stack>
    );
};

export default Leaderboard;