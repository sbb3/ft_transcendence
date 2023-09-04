import { Avatar, AvatarBadge, AvatarGroup, Box, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { MdLeaderboard } from 'react-icons/md';
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "./recentGamesStyles.css";
import { createIcon } from "@chakra-ui/react";
// import { createIcon } from '@chakra-ui/icons';

export const RankIcon = createIcon({
    displayName: 'RankIcon',
    viewBox: '0 0 20 24', // Set the viewBox to match the original SVG
    path: (
        <g clipPath="url(#clip0_2343_641)">
            <path
                d="M15.25 0.375H4.75C2.33369 0.375 0.375 2.33369 0.375 4.75V15.25C0.375 17.6663 2.33369 19.625 4.75 19.625H15.25C17.6663 19.625 19.625 17.6663 19.625 15.25V4.75C19.625 2.33369 17.6663 0.375 15.25 0.375Z"
                fill="#FD3C4F"
            />
            <path
                opacity="0.3"
                d="M10 24C14.8325 24 18.75 23.4124 18.75 22.6875C18.75 21.9626 14.8325 21.375 10 21.375C5.16751 21.375 1.25 21.9626 1.25 22.6875C1.25 23.4124 5.16751 24 10 24Z"
                fill="#FD3C4F"
            />
            <path
                opacity="0.3"
                d="M9.5625 2.5625C10.7704 2.5625 11.75 1.58337 11.75 0.375H4.75C2.33369 0.375 0.375 2.33369 0.375 4.75V14.375C1.58294 14.375 2.5625 13.3959 2.5625 12.1875V4.75C2.5625 3.54381 3.54381 2.5625 4.75 2.5625H9.5625Z"
                fill="white"
            />
            <path
                opacity="0.15"
                d="M19.625 15.25V5.625C18.4171 5.625 17.4375 6.60412 17.4375 7.8125V15.25C17.4375 16.4562 16.4562 17.4375 15.25 17.4375H10.4375C9.22956 17.4375 8.25 18.4166 8.25 19.625H15.25C17.6663 19.625 19.625 17.6663 19.625 15.25Z"
                fill="#FD3C4F"
            />
            <path
                d="M2.125 5.40625C1.76231 5.40625 1.46875 5.11269 1.46875 4.75C1.46875 2.9405 2.9405 1.46875 4.75 1.46875C5.11269 1.46875 5.40625 1.76231 5.40625 2.125C5.40625 2.48769 5.11269 2.78125 4.75 2.78125C3.66456 2.78125 2.78125 3.66456 2.78125 4.75C2.78125 5.11269 2.48769 5.40625 2.125 5.40625Z"
                fill="white"
            />
            <path
                d="M10.3916 13.6029L7.46994 15.139C6.77431 15.5047 5.961 14.9137 6.09356 14.1389L6.65138 10.8852L4.28756 8.5813C3.7245 8.03267 4.03513 7.0763 4.813 6.96342L8.07938 6.48873L9.54019 3.52861C9.888 2.8238 10.8934 2.8238 11.2416 3.52861L12.7024 6.48873L15.9688 6.96342C16.7467 7.0763 17.0573 8.03267 16.4943 8.5813L14.1304 10.8856L14.6883 14.1393C14.8212 14.9141 14.0079 15.5052 13.3119 15.1394L10.3916 13.6029Z"
                fill="#FFCE29"
            />
        </g>
    ),
});

// generate the same leaderboardData with random names and image urls, except remove the score
const leaderboardData = [
    {
        rank: "1",
        name: "Anas Douib",
        image: "https://anasdouib.me/images/picture.webp",
    },
    {
        rank: "2",
        name: "Dan Abramov",
        image: "https://bit.ly/dan-abramov",
    },
    {
        rank: "3",
        name: "Prosper Otemuyiwa",
        image: "https://bit.ly/prosper-baba",
    },
    {
        rank: "4",
        name: "code-beast",
        image: "https://bit.ly/code-beast",
    },
    {
        rank: "5",
        name: "Ryan Florence",
        image: "https://bit.ly/ryan-florence",
    },
    {
        rank: "6",
        name: "Kent C. Dodds",
        image: "https://bit.ly/kent-c-dodds",
    },
    {
        rank: "7",
        name: "prosper-baba",
        image: "https://bit.ly/prosper-baba",
    },
    {
        rank: "8",
        name: "prosper-baba",
        image: "https://bit.ly/code-beast",
    },
    {
        rank: "9",
        name: "Ryan Florence",
        image: "https://bit.ly/ryan-florence",
    },
    {
        rank: "10",
        name: "Ryan Florence",
        image: "https://bit.ly/kent-c-dodds",
    },
    {
        rank: "11",
        name: "Ryan Florence",
        image: "https://bit.ly/prosper-baba",
    },
    {
        rank: "12",
        name: "Ryan Florence",
        image: "https://bit.ly/code-beast",
    },
    {
        rank: "13",
        name: "Ryan Florence",
        image: "https://bit.ly/ryan-florence",
    },
    {
        rank: "14",
        name: "Ryan Florence",
        image: "https://bit.ly/kent-c-dodds",
    },
    {
        rank: "15",
        name: "Ryan Florence",
        image: "https://bit.ly/prosper-baba",
    },
    {
        rank: "16",
        name: "Ryan Florence",
        image: "https://bit.ly/code-beast",
    },
    {
        rank: "17",
];


const Card = ({ person }) => {
    const { rank, name, image } = person;

    return (
        <Flex direction='row' justify='space-between' borderRadius='22px'
            align='center'
            gap={2}
            pl={2}
            pr={2}
            w='220px'
            h='40px'
            bgColor={(rank == '1') ? '#FFCA28' : ((rank == '2') ? '#F4F4F4' : ((rank == '3') ? '#FF8228' : 'rgba(255, 255, 255, 0.2)'))}
        >
            <Flex direction='row' gap={3} align='center'
                pl={2}
                pr={2}
            >
                <Text fontSize='12px' fontWeight='bold' color='#312244' >
                    {rank}
                </Text>
                <Avatar size="sm" name={name} src={image} />
                <Text fontSize='14px' fontWeight='medium' color='#312244'>
                    {name}
                </Text>
            </Flex>
            <RankIcon boxSize={6} />


        </Flex >
    );
};


const Leaderboard = () => {
    return (
        <Stack
            // outline="2px solid yellow"
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
            w={{ base: "310px", md: "310px", lg: "310px", xl: "310px" }}

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
            <Flex direction="row" align="center" justify="space-evenly" gap={1.5}>
                <Stack direction="column" spacing={4} align="center">
                    <Avatar
                        size="lg"
                        name={'Anas Douib'}
                        src={'https://anasdouib.me/images/picture.webp'}
                        borderColor={"white"}
                        borderWidth="2px"
                    // borderRadius="0px"
                    >
                        <AvatarBadge boxSize="0.9em" border='3px solid #312244' bg={"white"}
                            position="absolute"
                            bottom={"-15%"}
                            left={"25%"}
                            translateY={"50%"}


                        >
                            <Text fontSize="10px" fontWeight="bold" color="#312244">
                                {'1'}
                            </Text>
                        </AvatarBadge>

                    </Avatar>
                    <Flex direction="column" align="center" justify="center" gap={0}>

                        <Text fontSize="12px" fontWeight="semibold" color="whiteAlpha.800">
                            {'Anas Douib'}
                        </Text>
                        <Text fontSize="10px" fontWeight="light" color="whiteAlpha.600">
                            {'Level 3'}
                        </Text>
                    </Flex>
                </Stack>
                <Stack direction="column" spacing={4} align="center">
                    <Avatar
                        size="lg"
                        name={'Anas Douib'}
                        src={'https://anasdouib.me/images/picture.webp'}
                        borderColor={"white"}
                        borderWidth="2px"
                    // borderRadius="0px"
                    >
                        <AvatarBadge boxSize="0.9em" border='3px solid #312244' bg={"white"}
                            position="absolute"
                            bottom={"-15%"}
                            left={"25%"}
                            translateY={"50%"}


                        >
                            <Text fontSize="10px" fontWeight="bold" color="#312244">
                                {'1'}
                            </Text>
                        </AvatarBadge>

                    </Avatar>
                    <Flex direction="column" align="center" justify="center" gap={0}>

                        <Text fontSize="12px" fontWeight="semibold" color="whiteAlpha.800">
                            {'Anas Douib'}
                        </Text>
                        <Text fontSize="10px" fontWeight="light" color="whiteAlpha.600">
                            {'Level 3'}
                        </Text>
                    </Flex>
                </Stack>
                <Stack direction="column" spacing={4} align="center">
                    <Avatar
                        size="lg"
                        name={'Anas Douib'}
                        src={'https://anasdouib.me/images/picture.webp'}
                        borderColor={"white"}
                        borderWidth="2px"
                    // borderRadius="0px"
                    >
                        <AvatarBadge boxSize="0.9em" border='3px solid #312244' bg={"white"}
                            position="absolute"
                            bottom={"-15%"}
                            left={"25%"}
                            translateY={"50%"}


                        >
                            <Text fontSize="10px" fontWeight="bold" color="#312244">
                                {'1'}
                            </Text>
                        </AvatarBadge>

                    </Avatar>
                    <Flex direction="column" align="center" justify="center" gap={0}>

                        <Text fontSize="12px" fontWeight="semibold" color="whiteAlpha.800">
                            {'Anas Douib'}
                        </Text>
                        <Text fontSize="10px" fontWeight="light" color="whiteAlpha.600">
                            {'Level 3'}
                        </Text>
                    </Flex>
                </Stack>
            </Flex >
            <Box w="100%" h="100%" borderRadius="xl" p={2} mb={0} overflow="hidden"
            // outline="2px solid red"
            >
                <ScrollArea.Root className="ScrollAreaRoot">
                    <ScrollArea.Viewport className="ScrollAreaViewport">
                        <Stack
                            // p={2}
                            id="scrollableStack"
                            gap={"12px"}
                            justify="center"
                            align="center"
                            wrap="wrap"
                            overflow="hidden"
                            outline="2px solid red"
                        // mr={2}
                        >
                            {leaderboardData.map((person, i) => (
                                <Card key={i} person={person} />
                            ))}
                        </Stack>
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
        </Stack >
    );
};

export default Leaderboard;