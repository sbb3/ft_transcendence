import {
  Avatar,
  CloseButton,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import {
  HiOutlineMail,
  HiOutlineStatusOnline,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { FiMessageSquare } from "react-icons/fi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { MdBlockFlipped } from "react-icons/md";
import { GoEye } from "react-icons/go";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import usersApi, { useGetUserByIdQuery } from "src/features/users/usersApi";
import Loader from "src/components/Utils/Loader";
import conversationApi from "src/features/conversations/conversationsApi";
import { v4 as uuidv4 } from "uuid";
import { useCreateConversationWithoutMessageMutation } from "src/features/conversations/conversationsApi";
import { useSelector } from "react-redux";

import notificationsApi from "src/features/notifications/notificationsApi";
import store from "src/app/store";
import { setCurrentUser } from "src/features/users/usersSlice";
import { useEffect, useReducer } from "react";
import useSocket from "src/hooks/useSocket";
import { CgUnblock } from "react-icons/cg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// const iconButtonStyles = [
//   {
//     label: "Send a message",
//     icon: <FiMessageSquare />,
//     to: "/chat/conversation",
//   },
//   {
//     label: "View profile",
//     icon: <HiOutlineUserCircle />,
//     to: "/profile",
//   },
//   {
//     label: "Send friend request",
//     icon: <AiOutlineUserAdd />,
//   },
//   {
//     label: "Send game request",
//     icon: <IoGameControllerOutline />,
//   },
//   {
//     label: "Spectacle",
//     icon: <GoEye />,
//   },
//   {
//     label: "Block",
//     icon: <MdBlockFlipped />,
//   },
// ];

const ChatRightModal = ({ participantUserId, isOpen, toggleDrawer, refetchCurrentUser }) => {
  console.log("participantUserId: ", participantUserId);
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const prefetchUser = usersApi.usePrefetch("getCurrentUser", {
    force: true,
  });
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const navigate = useNavigate();
  const toast = useToast();

  const [triggerGetCurrentUser, { isLoading: isLoadingGetCurrentUser }] =
    usersApi.useLazyGetCurrentUserQuery();

  useEffect(() => {
    const socket = useSocket();
    socket.on("friend_accepted", async (data: any) => {
      // console.log("incoming friend_accepted: ", data);
      // store.dispatch(setCurrentUser(data?.data));
      if (data?.data?.id === currentUser?.id) {
        try {
          // await prefetchUser(currentUser?.id).then((data) => {
          //   store.dispatch(setCurrentUser(data?.data));
          // });
          await triggerGetCurrentUser(currentUser?.id).unwrap();
        } catch (error) {
          console.log("error: ", error);
          toast({
            title: "Error",
            description: "Error happened while accepting friend request",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const { data: participantUser, isLoading: isLoadingParticipantUser } =
    useGetUserByIdQuery(participantUserId, {
      refetchOnMountOrArgChange: true,
    });

  const [
    triggerGetConversationByMembersEmails,
    { isLoading: isLoadingGetConversationByMembersEmails },
  ] = conversationApi.endpoints.getConversationByMembersEmails.useLazyQuery();

  const [
    createConversationWithoutMessage,
    { isLoading: isLoadingCreateConversationWithoutMessage },
  ] = useCreateConversationWithoutMessageMutation();

  const [blockUser] = usersApi.useBlockUserMutation();

  const [unblockUser] = usersApi.useUnblockUserMutation();

  if (isLoadingParticipantUser) return <Loader />;

  // console.log("participantUser: ", participantUser);
  // console.log("currentUser: ", currentUser);

  const handleSendDirectMessage = async () => {
    try {
      const conversations = await triggerGetConversationByMembersEmails([
        currentUser?.email,
        participantUser?.email,
      ]).unwrap();
      let id;
      if (conversations?.length > 0) {
        const conversation = conversations[0];
        id = conversation.id;
        console.log("id->: ", id);
      } else {
        const conversation = {
          id: uuidv4(),
          name: [currentUser?.name, participantUser?.name],
          avatar: [
            { id: currentUser?.id, avatar: currentUser?.avatar },
            { id: participantUser?.id, avatar: participantUser?.avatar },
          ],
          members: [currentUser?.email, participantUser?.email],
          lastMessageContent: "",
          lastMessageCreatedAt: dayjs().valueOf(),
        };
        await createConversationWithoutMessage(conversation).unwrap();
        id = conversation.id;
      }
      toggleDrawer();
      navigate(`/chat/conversation/${id}`);
    } catch (error) {
      console.log("error: ", error);
      toast({
        title: "Error",
        description: "Error happened while opening the conversation",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleSendFriendNotification = async () => {
    if (currentUser?.friends.includes(participantUser?.id)) {
      toast({
        title: "Info",
        description: "He is already your friend",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      // re-render the component
      toggleDrawer();
      return;
    }
    try {
      const notification = {
        id: uuidv4(),
        type: "friendRequest",
        sender: {
          id: currentUser?.id,
          email: currentUser?.email,
          name: currentUser?.name,
        },
        receiver: {
          id: participantUser?.id,
          email: participantUser?.email,
          name: participantUser?.name,
        },
        createdAt: dayjs().valueOf(),
      };
      store.dispatch(
        await notificationsApi.endpoints.sendNotification.initiate(notification)
      );
      toast({
        title: "Friend request sent",
        description: "Friend request sent successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      toggleDrawer();
    } catch (error) {
      console.log("error accepting friend request: ", error);
      console.log("error: ", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Error happened",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  // TODO: handle the case when the user send a game request to a user who already have a game request from him
  // TODO: listen for game request accepted socket.io event (oppoent accepted)
  // TODO: cannot send a game request to a opponent who is already playing a game
  // TODO: possible to send a direct game request only to a friend, not all
  // TODO: later, think about other  possible cases
  const handleSendGameChallengeNotification = async () => {
    try {
      const notification = {
        id: uuidv4(),
        type: "gameRequest",
        sender: {
          id: currentUser?.id,
          email: currentUser?.email,
          name: currentUser?.name,
        },
        receiver: {
          id: participantUser?.id,
          email: participantUser?.email,
          name: participantUser?.name,
        },
        createdAt: dayjs().valueOf(),
      };
      store.dispatch(
        await notificationsApi.endpoints.sendNotification.initiate(notification)
      );
      toast({
        title: "Game request sent",
        description: "Game request sent successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      toggleDrawer();
    } catch (error) {
      console.log("error: ", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Error happened",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleUnBlockUser = async () => {
    try {
      await unblockUser({
        id: currentUser?.id,
        blockedUserId: participantUser?.id,
      }).unwrap();

      // await triggerGetCurrentUser(currentUser?.id).unwrap();
      // await prefetchUser(currentUser?.id).then((data) => {
      //   store.dispatch(setCurrentUser(data?.data));
      // }
      // );
      toast({
        title: "User unblocked",
        description: "User unblocked successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      toggleDrawer();
      refetchCurrentUser();
    } catch (error) {
      console.log("error: ", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Error happened",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  const handleBlockUser = async () => {
    try {
      await blockUser({
        id: currentUser?.id,
        blockedUserId: participantUser?.id,
      }).unwrap();
      // await triggerGetCurrentUser(currentUser?.id).unwrap();
      // await prefetchUser(currentUser?.id).then((data) => {
      //   store.dispatch(setCurrentUser(data?.data));
      // }
      // );
      toast({
        title: "User blocked",
        description: "User blocked successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      toggleDrawer();
      refetchCurrentUser();
    } catch (error) {
      console.log("error: ", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Error happened",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Drawer
      open={isOpen}
      onClose={toggleDrawer}
      direction="right"
      enableOverlay={false}
      duration={0}
      style={{
        position: "absolute",
        width: 250,
        height: "100%",
        marginRight: "1px",
        borderTopRightRadius: "26px",
        borderBottomRightRadius: "26px",
        backgroundColor: "rgba(51, 51, 51, 0.9)",
        // padding: "4px",
      }}
      closeOnEsc={true}

    >
      <Stack
        w="full"
        h="full"
        // bg="pong_bg_primary"
        p={2}
        spacing={4}
        borderTopRightRadius="26px"
        borderBottomRightRadius="26px"
      >
        <Flex w="full" justify={"space-between"} align={"center"} p={1}>
          <Heading fontSize="md" fontWeight="semibold">
            Chat Profile
          </Heading>
          <CloseButton
            size="sm"
            color="pong_cl_primary"
            bg={"white"}
            borderRadius={"50%"}
            onClick={toggleDrawer}
          />
        </Flex>
        <Flex justify="center" align="center" w="full">
          <Avatar
            boxSize={"160px"}
            name="Anas Douib"
            src="https://images.unsplash.com/photo-1601933973783-43cf8a7d4c5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            borderColor="green.400"
            borderWidth="3px"
          />
        </Flex>
        <Flex justify="space-around" align="center" w="full" gap={5}>
          <Text
            fontSize="14px"
            fontStyle={"normal"}
            fontWeight="semibold"
            color="whiteAlpha.900"
            lineHeight={"28px"}
            letterSpacing={1}
          >
            {participantUser?.name}
          </Text>
          <Flex justify="center" align="center" gap={1}>
            <Icon
              as={HiOutlineStatusOnline}
              boxSize={"20px"}
              borderRadius={"50%"}
              color={"green.400"}
            />
            <Text fontSize="12px" fontWeight="light" color="whiteAlpha.900">
              {/* {participantUser?.status} */}
              online
            </Text>
          </Flex>
        </Flex>
        <Stack direction="column" spacing={1} align="start" w="full">
          <Text fontSize="14px" fontWeight="semibold">
            Contact information
          </Text>
          <Flex direction="row" gap={2} justify="center" align="center">
            <Icon
              ml={2}
              boxSize={5}
              as={HiOutlineMail}
              color="whiteAlpha.600"
            />
            <Stack spacing={1} align="start">
              <Text
                fontSize="12px"
                fontWeight="medium"
                color="whiteAlpha.600"
                w={"full"}
              >
                Email
              </Text>
              <Text fontSize="12px" fontWeight="light" color="pong_cl_primary">
                {participantUser?.email}
              </Text>
            </Stack>
          </Flex>
        </Stack>
        <Flex
          direction="row"
          gap="8px"
          // background="rgba(4, 3, 1, 0.08)"
          bg="pong_bg_secondary"
          // borderRadius={4}
          w="full"
          h="40px"
          // bgGradient="linear(to-r, pong_bg_secondary, pong_bg_primary)"
          justify="center"
          align="center"
          borderRadius={8}
        // wrap={"wrap"}
        >
          <IconButton
            // key={label}
            size="sm"
            fontSize="lg"
            bg={"pong_cl_primary"}
            color={"white"}
            borderRadius={8}
            aria-label="Send a message"
            // aria-label={label}
            icon={<FiMessageSquare />}
            // icon={icon}
            _hover={{ bg: "white", color: "pong_cl_primary" }}
            onClick={handleSendDirectMessage}
            isLoading={
              isLoadingGetConversationByMembersEmails ||
              isLoadingCreateConversationWithoutMessage ||
              isLoadingGetCurrentUser
            }
            _disabled={
              isLoadingGetConversationByMembersEmails ||
              isLoadingCreateConversationWithoutMessage ||
              isLoadingGetCurrentUser
            }
          />
          <IconButton
            size="sm"
            fontSize="lg"
            bg={"pong_cl_primary"}
            color={"white"}
            borderRadius={8}
            aria-label="View profile"
            icon={<HiOutlineUserCircle />}
            _hover={{ bg: "white", color: "pong_cl_primary" }}
            onClick={() => {
              toggleDrawer();
              navigate(`/profile/${participantUser?.username}`); // TODO: change to id or username
            }}
          />
          {!participantUser?.friends.includes(currentUser?.id) && (
            <IconButton
              size="sm"
              fontSize="lg"
              bg={"pong_cl_primary"}
              color={"white"}
              borderRadius={8}
              aria-label="Send friend request"
              icon={<AiOutlineUserAdd />}
              _hover={{ bg: "white", color: "pong_cl_primary" }}
              onClick={handleSendFriendNotification}
            />
          )}
          <IconButton
            size="sm"
            fontSize="lg"
            bg={"pong_cl_primary"}
            color={"white"}
            borderRadius={8}
            aria-label="Send game request"
            icon={<IoGameControllerOutline />}
            _hover={{ bg: "white", color: "pong_cl_primary" }}
            onClick={handleSendGameChallengeNotification}
          />
          <IconButton
            size="sm"
            fontSize="lg"
            bg={"pong_cl_primary"}
            color={"white"}
            borderRadius={8}
            aria-label="Spectacle"
            icon={<GoEye />}
            _hover={{ bg: "white", color: "pong_cl_primary" }}
            onClick={() => {
              // TODO: Spectacle
              toggleDrawer();
            }}
          />
          {
            currentUser?.blockedUsers.includes(participantUser?.id) ? (
              <IconButton
                size="sm"
                fontSize="lg"
                bg={"green.500"}
                color={"white"}
                borderRadius={8}
                aria-label="Block"
                icon={<CgUnblock />
                }
                _hover={{ bg: "white", color: "green.500" }}
                onClick={handleUnBlockUser}
              />
            ) : (
              <IconButton
                size="sm"
                fontSize="lg"
                bg={"pong_cl_primary"}
                color={"white"}
                borderRadius={8}
                aria-label="Block"
                icon={
                  <MdBlockFlipped />
                }
                _hover={{ bg: "white", color: "pong_cl_primary" }}
                onClick={handleBlockUser}
              />

            )
          }
        </Flex>
        <Stack direction="column" spacing={2} align="start" w="full">
          <Text fontSize="md" fontWeight="medium">
            About me
          </Text>
          <Stack spacing={4} justify="start">
            <Flex direction={"column"} gap={1}>
              <Text fontSize="14px" fontWeight="medium" color="whiteAlpha.600">
                Login 42
              </Text>
              <Text fontSize="12px" fontWeight="medium" color="whiteAlpha.400">
                adouib
              </Text>
            </Flex>
            <Flex direction={"column"} gap={1}>
              <Text fontSize="14px" fontWeight="medium" color="whiteAlpha.600">
                Intra Profile
              </Text>
              <Link
                as={RouterLink}
                to="https://profile.intra.42.fr/users/adouib"
                isExternal
                fontSize="12px"
                fontWeight="medium"
                color="pong_cl_primary"
              >
                42 Profile <ExternalLinkIcon mx="2px" />
              </Link>
            </Flex>
            <Flex direction={"column"} gap={1}>
              <Text fontSize="14px" fontWeight="medium" color="whiteAlpha.600">
                Campus
              </Text>
              <Text fontSize="12px" fontWeight="medium" color="whiteAlpha.400">
                1337 BenGuerir
              </Text>
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default ChatRightModal;
