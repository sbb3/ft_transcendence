import { CloseIcon } from "@chakra-ui/icons";
import {
    Avatar,
    Box,
    Collapse,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Icon,
    IconButton,
    Link,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from '@chakra-ui/icons'

import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import { GoEye } from "react-icons/go";
import { HiOutlineMail, HiOutlineStatusOnline, HiOutlineUserCircle } from "react-icons/hi";
import { IoGameControllerOutline } from "react-icons/io5";
import { MdBlockFlipped } from "react-icons/md";

const ChatRightModal = ({ setIsOpen }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        onOpen();
    }, [onOpen]);

    return (
        <Drawer
            autoFocus={false}
            size="md"
            isOpen={isOpen}
            placement="right"
            onClose={() => { setIsOpen(false); onClose(); }}
        >
            <DrawerOverlay>
                <DrawerContent
                    // bg="pong_bg_primary"
                    bg="red.400"
                    borderRadius={40}
                    border="1px solid rgba(251, 102, 19, 0.69)"
                    p={2}
                >
                    <DrawerHeader
                        borderBottom={'2px solid yellow'}
                    >Chat Profile</DrawerHeader>
                    <DrawerCloseButton bg={'green.400'} boxSize={'38px'} mr={4} />

                    <DrawerBody borderRadius={40} p={0}>
                        <Stack
                            // mt={4}
                            spacing={5}
                            //  w={{ base: "full", sm: "full", md: 620 }}
                            align="center"
                            borderRadius={40}
                            // pl={3}
                            // pr={2}
                            p={4}
                            outline="2px solid orange"
                        >
                            <Flex justify="center" align="center" w="full">
                                <Avatar boxSize={'240px'} name="Anas Douib" src="https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" borderColor='green.400' borderWidth='3px' />
                            </Flex>
                            <Flex justify="space-around" align="center" w="full" gap={5}>
                                <Text
                                    fontSize="16px"
                                    fontStyle={"normal"}
                                    fontWeight="semibold"
                                    color="whiteAlpha.900"
                                    lineHeight={"28px"}
                                    letterSpacing={1}
                                >
                                    Anas Douib
                                </Text>
                                <Flex justify="center" align="center" gap={1}>

                                    <Icon
                                        as={HiOutlineStatusOnline}
                                        boxSize={"20px"}
                                        borderRadius={"50%"}
                                        color={"green.400"}
                                    />
                                    <Text fontSize="14px" fontWeight="light" color="whiteAlpha.900">
                                        online
                                    </Text>
                                </Flex>
                            </Flex>
                            <Stack direction='column' spacing={1} align='start' w='full' >
                                <Text fontSize='16px' fontWeight='semibold' >
                                    Contact information
                                </Text>
                                <Flex direction='row' gap={2} justify='center' align='center' >
                                    <Icon ml={2} boxSize={5} as={HiOutlineMail} color='whiteAlpha.600' />
                                    <Stack spacing={1} align='start'>
                                        <Text fontSize='14px' fontWeight='medium' color='whiteAlpha.600' w={'full'}>
                                            Email
                                        </Text>
                                        <Text fontSize='12px' fontWeight='medium' color='pong_cl_primary'>
                                            adouib@student.1337.ma
                                        </Text>
                                    </Stack>
                                </Flex>
                            </Stack>
                            <Flex direction='row' gap='14px'
                                background="rgba(4, 3, 1, 0.08)"
                            >
                                <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Send a message' icon={<FiMessageSquare />}
                                    _hover={{ bg: 'white', color: 'pong_cl_primary' }}
                                />
                                <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Send friend request' icon={<HiOutlineUserCircle />} _hover={{ bg: 'white', color: 'pong_cl_primary' }} />
                                <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Send friend request' icon={<AiOutlineUserAdd />} _hover={{ bg: 'white', color: 'pong_cl_primary' }} />
                                <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Send game request' icon={<IoGameControllerOutline />} _hover={{ bg: 'white', color: 'pong_cl_primary' }} />
                                <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Spectacle' icon={<GoEye />} _hover={{ bg: 'white', color: 'pong_cl_primary' }} />
                                <IconButton size='sm' fontSize="lg" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Spectacle' icon={<MdBlockFlipped />} _hover={{ bg: 'white', color: 'pong_cl_primary' }} />
                            </Flex>
                            <Stack direction='column' spacing={1} align='start' w='full' >
                                <Text fontSize='lg' fontWeight='medium' >
                                    About me
                                </Text>
                                <Stack spacing={4} justify='start' >
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
                                            Intra Profile
                                        </Text>
                                        <Link as={RouterLink} to='https://profile.intra.42.fr/users/adouib' isExternal fontSize='12px' fontWeight='medium' color='pong_cl_primary'
                                        >
                                            42 Profile <ExternalLinkIcon mx="2px" />
                                        </Link>
                                    </Flex>
                                    <Flex direction={'column'} gap={1} >
                                        <Text fontSize='14px' fontWeight='medium' color='whiteAlpha.600'>
                                            Campus
                                        </Text>
                                        <Text fontSize='12px' fontWeight='medium' color='whiteAlpha.400'>
                                            1337 BenGuerir
                                        </Text>
                                    </Flex>
                                </Stack>
                            </Stack>
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    );
};

export default ChatRightModal;