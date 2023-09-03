import { Avatar, AvatarBadge, Box, CircularProgress, CircularProgressLabel, Flex, Heading, Icon, IconButton, Image, Progress, Stack, Text } from "@chakra-ui/react";
import { FiMessageSquare } from "react-icons/fi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { GoEye } from "react-icons/go";
import { HiOutlineMail } from "react-icons/hi";
import { GrAchievement } from "react-icons/gr";
const Profile = () => {
    return (
        <Flex
            direction={{ base: "column", md: "row" }}
            bg="orange.900"
            p={2}
            gap={3}
            w='full'
        // wrap='wrap'
        >
            <Stack p={2}
                direction={{ base: "column" }}
                spacing='20px'
                // w='full'
                flex={1}
            >
                <Flex direction='row' gap='28px' align='center'>
                    <Avatar size="lg" name="Anas Douib" src="https://anasdouib.me/images/picture.webp">
                        <AvatarBadge boxSize="0.8em" border='3px solid white' bg="green.500" />
                    </Avatar>
                    <Flex direction='column' gap='10px' justify='center'>
                        <Heading size='md' fontWeight='medium' color='whiteAlpha.900'>
                            adouib
                        </Heading>
                        <Flex direction='row' gap='14px'>
                            <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Send a message' icon={<FiMessageSquare />} />
                            <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Send friend request' icon={<AiOutlineUserAdd />} />
                            <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Send game request' icon={<IoGameControllerOutline />} />
                            <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Spectacle' icon={<GoEye />} />
                        </Flex>
                    </Flex>
                </Flex>
                <Stack direction='column' spacing='10px' align='start' w='full' >
                    <Text>
                        About me
                    </Text>
                    <Flex direction='row' gap={4} justify='center' w='full' >
                        <Icon boxSize={5} m='auto 0' as={HiOutlineMail} />
                        <Stack spacing={1} align='start'>
                            <Text>
                                Email
                            </Text>
                            <Text>
                                adouib@student.1337.ma
                            </Text>
                        </Stack>
                    </Flex>
                    <Flex direction='row' gap={4} align='center' >
                        <Flex direction={'column'} gap={1} >
                            <Text>
                                Login 42
                            </Text>
                            <Text>
                                adouib
                            </Text>
                        </Flex>
                        <Flex direction={'column'} gap={1} >
                            <Text>
                                Campus
                            </Text>
                            <Text>
                                1337 BenGuerir
                            </Text>
                        </Flex>
                    </Flex>
                </Stack>
            </Stack >
            <Stack p={2} direction={{ base: "column" }} spacing='10px' flex={1}>
                <Flex direction='column' w="100%" h="100%" gap={2}>
                    <Flex>
                        <Icon boxSize='16px' as={GrAchievement} color='red.200' />
                        <Text>
                            Achievements
                        </Text>
                    </Flex>
                    <Flex gap={1}>
                        <Image src="src/assets/svgs/badges/BadgeSilver.svg" alt="Badge" boxSize={8} />
                        <Image src="src/assets/svgs/badges/BadgeSilver.svg" alt="Badge" boxSize={8} />
                        <Image src="src/assets/svgs/badges/BadgeSilver.svg" alt="Badge" boxSize={8} />

                    </Flex>
                </Flex>
                <Flex direction='column' w="100%" h="100%" p={2}>
                    <Text>
                        Rank
                    </Text>
                    <Flex direction='row' justify='space-between'>
                        <Flex>
                            <Text>
                                1
                            </Text>
                            <Avatar size="sm" name="Anas DOuib" src="https://anasdouib.me/images/picture.webp" />
                        </Flex>
                        <Text>
                            Score
                        </Text>
                    </Flex>
                </Flex>
                <Flex direction='row' w="100%" h="100%" gap={2}>
                    <Box>
                        <CircularProgress value={50} color='orange.400' size='180px' thickness='10px' capIsRound>
                            <CircularProgressLabel fontSize='xl'>
                                <Stack direction='column' align='center' spacing={0}>
                                    <Text fontSize='14px' fontWeight='medium' color='whiteAlpha.700'>
                                        Winrate
                                    </Text>
                                    <Text fontSize='20px' fontWeight='semibold' color='whiteAlpha.900'>
                                        50%
                                    </Text>
                                    <Text fontSize='10px' fontWeight='regular' color='whiteAlpha.600'>
                                        141 W 141 L
                                    </Text>
                                </Stack>
                            </CircularProgressLabel>
                        </CircularProgress>
                    </Box>
                    <Box>
                        <CircularProgress value={50} color='orange.400' size='180px' thickness='10px' capIsRound>
                            <CircularProgressLabel fontSize='xl'>
                                <Stack direction='column' align='center' spacing={0}>
                                    <Text fontSize='14px' fontWeight='medium' color='whiteAlpha.700'>
                                        Played
                                    </Text>
                                    <Text fontSize='20px' fontWeight='semibold' color='whiteAlpha.900'>
                                        282
                                    </Text>
                                    <Text fontSize='10px' fontWeight='regular' color='whiteAlpha.600'>
                                        game
                                    </Text>
                                </Stack>
                            </CircularProgressLabel>
                        </CircularProgress>
                    </Box>
                </Flex>
            </Stack >
        </Flex >
    );
};

export default Profile;