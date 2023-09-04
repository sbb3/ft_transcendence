import { Box, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { MdLeaderboard } from 'react-icons/md';
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "./recentGamesStyles.css";

const personData = [


const Card = ({ person }) => {

    return (
        <Flex direction='row' justify='space-between' bg='pong_bg.400' opacity='90%' borderRadius='40px'
            align='center' pl={'10px'} pr='10px' pt={1} pb={1}
        >
            <Flex direction='row' gap={3} align='center' >
                <Text fontSize='13px' fontWeight='regular' color='whiteAlpha.900'>
                    1
                </Text>
                <Avatar size="sm" name="Anas DOuib" src="https://anasdouib.me/images/picture.webp" />
                <Text fontSize='13px' fontWeight='regular' color='whiteAlpha.900'>
                    Anas
                </Text>
            </Flex>
            <Text fontSize='10px' fontWeight='regular' color='pong_cl_primary'>
                103
            </Text>
        </Flex>
    );
};


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
            <Box w="100%" h="100%" borderRadius="xl" p={1} mb={2} overflow="hidden">
                <ScrollArea.Root className="ScrollAreaRoot">
                    <ScrollArea.Viewport className="ScrollAreaViewport">
                        <Flex
                            direction="column"
                            w="100%"
                            h="100%"
                            p={2}
                            gap={"10px"}
                            justify="center"
                            align="center"
                            wrap="wrap"
                            overflow="hidden"
                            mr={2}
                        >
                            {personData.map((person, i) => (
                                <Card key={i} person={person} />
                            ))}
                        </Flex>
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
            </Box>
        </Stack>
    );
};

export default Leaderboard;