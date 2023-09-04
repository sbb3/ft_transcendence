import { Avatar, AvatarBadge, Box, CircularProgress, CircularProgressLabel, Flex, Heading, Icon, IconButton, Image, Progress, Stack, Text } from "@chakra-ui/react";
import { FiMessageSquare } from "react-icons/fi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { GoEye } from "react-icons/go";
import { HiOutlineMail } from "react-icons/hi";
import { GiAchievement } from "react-icons/gi";
const Profile = () => {
    return (
        <Flex
            direction={{ base: "column" }}
            // bg="orange.900"
            borderRadius={{ base: "15px", sm: "25px", md: "40px" }}
            border="1px solid rgba(251, 102, 19, 0.69)"
            boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
            backdropFilter={"blur(20px)"}
            bgImage={`url('src/assets/img/BlackNoise.png')`}
            bgSize="cover"
            bgRepeat="no-repeat"
            p={2}
            gap='12px'
            wrap='wrap'
            outline="2px solid yellow"
        >
            <Stack p={2}
                direction={{ base: "column" }}
                spacing='12px'
            >
                <Flex direction='row' gap='28px' align='center'>
                    <Avatar size="xl" name="Anas Douib" src="https://anasdouib.me/images/picture.webp" borderColor='green.400' borderWidth='3px'>
                        <AvatarBadge boxSize="0.6em" border='3px solid white' bg={"green.400"} />
                    </Avatar>
                    <Flex direction='column' gap='10px' justify='center'>
                        <Flex direction='row' gap='7px' align='center'>
                            <Image src="src/assets/svgs/username_pre_svg.svg" alt="username pre svg" boxSize={5} />
                            <Text fontSize='lg' fontWeight='medium' >
                                adouib
                            </Text>
                        </Flex>
                        <Flex direction='row' gap='14px'>
                            <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Send a message' icon={<FiMessageSquare />} />
                            <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Send friend request' icon={<AiOutlineUserAdd />} />
                            <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Send game request' icon={<IoGameControllerOutline />} />
                            <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Spectacle' icon={<GoEye />} />
                        </Flex>
                    </Flex>
                </Flex>
                <Stack direction='column' spacing={1} align='start' w='full' >w={'full'}
                    <Text fontSize='lg' fontWeight='medium' >
                        About me
                    </Text>
                    <Flex direction='row' gap={2} justify='center' align='center' >
                        <Icon ml={2} boxSize={5} as={HiOutlineMail} color='whiteAlpha.600' />
                        <Stack spacing={1} align='start'>
                            <Text fontSize='14px' fontWeight='medium' color='whiteAlpha.600'>
                                Email
                            </Text>
                            <Text fontSize='12px' fontWeight='light' color='pong_cl_primary'>
                                adouib@student.1337.ma
                            </Text>
                        </Stack>
                    </Flex>
                    <Flex direction='row' gap={4} align='center' >
                        <Flex direction={'column'} gap={1} >
                            <Text fontSize='14px' fontWeight='medium' color='whiteAlpha.600'>
                                Login 42
                            </Text>
                            <Text fontSize='12px' fontWeight='medium' color='whiteAlpha.400'>
                                adouib
                            </Text>
                        </Flex>
                        <Flex direction={'column'} gap={1} >
                            <Text fontSize='14px' fontWeight='medium' color='whiteAlpha.600'>
                                Campus
                            </Text>
                            <Text fontSize='12px' fontWeight='medium' color='whiteAlpha.400'>
                                1337 BenGuerir
                            </Text>
                        </Flex>
                    </Flex>
                </Stack>
            </Stack >
            <Stack p={2} direction={{ base: "column" }} spacing='12px' >
                <Flex direction='column' w="100%" h="100%" gap={2} align='center'>
                    <Flex direction='row' align='center' gap={1}>
                        <Icon boxSize='22px' as={GiAchievement} color='white' />
                        <Text fontSize='20px' fontWeight='semibold' color='whiteAlpha.900'>
                            Achievements
                        </Text>
                    </Flex>
                    {/* TODO: scroll area on y-axis */}
                    <Flex gap={2}>
                        <Image src="src/assets/svgs/badges/BadgeSilver.svg" alt="Badge" boxSize={10} />
                        <Image src="src/assets/svgs/badges/BadgeSilver.svg" alt="Badge" boxSize={10} />
                        <Image src="src/assets/svgs/badges/BadgeSilver.svg" alt="Badge" boxSize={10} />

                    </Flex>
                </Flex>
                <Flex direction='column' w="100%" h="100%" p={2} gap={1} justify='flex-start'
                >
                    <Text fontSize='16px' fontWeight='medium' color='whiteAlpha.900'>
                        Rank
                    </Text>

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
                </Flex>
                <Flex direction='row' w="100%" h="100%" gap={4} justify='center'>
                    <Box>
                        <CircularProgress value={50} color='orange.400' size='130px' thickness='10px' capIsRound>
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
                        <CircularProgress value={50} color='orange.400' size='130px' thickness='10px' capIsRound>
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