import {
  Avatar,
  AvatarBadge,
  Box,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Progress,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FiMessageSquare } from "react-icons/fi";
import { AiOutlineUserAdd, AiOutlineUserDelete } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { GoEye } from "react-icons/go";
import { HiOutlineMail } from "react-icons/hi";
import { GiAchievement } from "react-icons/gi";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { badges } from "src/config/data/data";
import { useDispatch, useSelector } from "react-redux";
import usersApi, { useDeleteFriendMutation } from "src/features/users/usersApi";
import { setCurrentUser } from "src/features/users/usersSlice";
import conversationApi, {
  useCreateConversationWithoutMessageMutation,
} from "src/features/conversations/conversationsApi";
import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useSocket from "src/hooks/useSocket";
import store from "src/app/store";
import notificationsApi from "src/features/notifications/notificationsApi";
dayjs.extend(relativeTime);

const Profile = ({ user }) => {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deleteFriend, { isLoading: isDeletingFriend }] =
    useDeleteFriendMutation();

  const [triggerGetCurrentUser, { isLoading: isLoadingGetCurrentUser }] =
    usersApi.useLazyGetCurrentUserQuery();

  const gameWonRate =
    (parseInt(user?.gameWin) /
      (parseInt(user?.gameWin) + parseInt(user?.gameLoss))) *
    100;

  // const [triggerGetCurrentUser, { isLoading: isLoadingGetCurrentUser }] =
  //   usersApi.useLazyGetCurrentUserQuery();

  // useEffect(() => {
  //   const socket = useSocket();
  //   socket.on("friend_accepted", async (data: any) => {
  //     // console.log("incoming friend_accepted: ", data);
  //     // store.dispatch(setCurrentUser(data?.data));
  //     if (data?.data?.id === currentUser?.id) {
  //       try {
  //         // await prefetchUser(currentUser?.id).then((data) => {
  //         //   store.dispatch(setCurrentUser(data?.data));
  //         // });
  //         await triggerGetCurrentUser(currentUser?.id).unwrap();
  //       } catch (error) {
  //         console.log("error: ", error);
  //         toast({
  //           title: "Error",
  //           description: "Error happened while accepting friend request",
  //           status: "error",
  //           duration: 2000,
  //           isClosable: true,
  //         });
  //       }
  //     }
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const [
    triggerGetConversationByMembersEmails,
    { isLoading: isLoadingGetConversationByMembersEmails },
  ] = conversationApi.endpoints.getConversationByMembersEmails.useLazyQuery();

  const [
    createConversationWithoutMessage,
    { isLoading: isLoadingCreateConversationWithoutMessage },
  ] = useCreateConversationWithoutMessageMutation();

  const handleDeleteFriend = async (friendId) => {
    try {
      await deleteFriend({ currentUserId: currentUser?.id, friendId });
      await triggerGetCurrentUser(currentUser?.id);
      // dispatch(
      //   setCurrentUser({
      //     ...currentUser,
      //     friends: currentUser?.friends?.filter(
      //       (friend) => friend !== friendId
      //     ),
      //   })
      // );
      toast({
        title: "Suceess",
        description: "Friend deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error?.data?.message || "Error deleting friend",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSendFriendNotification = async () => {
    if (currentUser?.friends.includes(user?.id)) {
      toast({
        title: "Info",
        description: "He is already your friend",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
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
          id: user?.id,
          email: user?.email,
          name: user?.name,
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
  const handleSendDirectMessage = async () => {
    try {
      const conversations = await triggerGetConversationByMembersEmails([
        currentUser?.email,
        user?.email,
      ]).unwrap();
      let id;
      if (conversations?.length > 0) {
        const conversation = conversations[0];
        id = conversation.id;
        console.log("id->: ", id);
      } else {
        const conversation = {
          id: uuidv4(),
          name: [currentUser?.name, user?.name],
          avatar: [
            { id: currentUser?.id, avatar: currentUser?.avatar },
            { id: user?.id, avatar: user?.avatar },
          ],
          members: [currentUser?.email, user?.email],
          lastMessageContent: "",
          lastMessageCreatedAt: dayjs().valueOf(),
        };
        await createConversationWithoutMessage(conversation).unwrap();
        id = conversation.id;
      }
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

  return (
    <Flex
      w={{ sm: "380px" }}
      h={{ base: "600px" }}
      direction={{ base: "column" }}
      p={4}
      // bg="orange.900"
      borderRadius={24}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
      gap="12px"
      // wrap="wrap"
      // outline="2px solid orange"
    >
      <Stack p={1} direction={{ base: "column" }} spacing="12px">
        <Flex direction="row" gap="28px" align="center">
          <Avatar
            size="xl"
            name={user?.name}
            src={user?.avatar}
            borderColor={
              status === "online"
                ? "green.400"
                : user?.status === "offline"
                ? "gray.300"
                : "red.400"
            }
            borderWidth="3px"
          >
            <AvatarBadge
              boxSize="0.6em"
              border="3px solid white"
              bg={
                user?.status === "online"
                  ? "green.400"
                  : user?.status === "offline"
                  ? "gray.400"
                  : "red.400"
              }
            />
          </Avatar>
          <Flex direction="column" gap="10px" justify="center">
            <Flex direction="row" gap="7px" align="center">
              <Image
                src="/src/assets/svgs/username_pre_svg.svg"
                alt="username pre svg"
                boxSize={5}
              />
              <Text fontSize="lg" fontWeight="medium">
                {user?.username}
              </Text>
            </Flex>
            {/* TODO: hide these buttons when visiting my own profile, do conditional rendering of the username or id of the passed user with the store */}
            {currentUser?.id !== user?.id && (
              <Flex direction="row" gap="14px" align="center">
                <IconButton
                  size="sm"
                  fontSize="lg"
                  bg={"pong_cl_primary"}
                  color={"white"}
                  borderRadius={8}
                  aria-label="Send a message"
                  icon={<FiMessageSquare />}
                  _hover={{ bg: "white", color: "pong_cl_primary" }}
                  onClick={handleSendDirectMessage}
                  isLoading={
                    isLoadingCreateConversationWithoutMessage ||
                    isLoadingGetConversationByMembersEmails
                  }
                />
                {!user?.friends?.includes(currentUser?.id) && (
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
                    // isLoading={
                    //   isLoadingCreateConversationWithoutMessage ||
                    //   isLoadingGetConversationByMembersEmails
                    // }
                  />
                )}
                {user?.friends?.includes(currentUser?.id) && (
                  <>
                    <IconButton
                      size="sm"
                      fontSize="lg"
                      bg={"red.500"}
                      color={"white"}
                      borderRadius={8}
                      aria-label="Send friend request"
                      icon={<AiOutlineUserDelete />}
                      _hover={{ bg: "white", color: "red.500" }}
                      isLoading={isDeletingFriend || isLoadingGetCurrentUser}
                      isDisabled={isDeletingFriend || isLoadingGetCurrentUser}
                      onClick={() => handleDeleteFriend(user?.id)}
                    />
                    <IconButton
                      size="sm"
                      fontSize="lg"
                      bg={"pong_cl_primary"}
                      color={"white"}
                      borderRadius={8}
                      aria-label="Send game request"
                      icon={<IoGameControllerOutline />}
                      _hover={{ bg: "white", color: "pong_cl_primary" }}
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
                    />
                  </>
                )}
              </Flex>
            )}
          </Flex>
        </Flex>
        <Stack direction="column" spacing={1} align="start" w="full">
          <Text fontSize="lg" fontWeight="medium">
            About me
          </Text>
          <Flex direction="row" gap={2} justify="center" align="center">
            <Icon
              ml={2}
              boxSize={5}
              as={HiOutlineMail}
              color="whiteAlpha.600"
            />
            <Stack spacing={1} align="start">
              <Text fontSize="14px" fontWeight="medium" color="whiteAlpha.600">
                Email
              </Text>
              <Text fontSize="12px" fontWeight="light" color="pong_cl_primary">
                {user?.email}
              </Text>
            </Stack>
          </Flex>
          <Flex direction="row" gap={4} align="center">
            <Flex direction={"column"} gap={1}>
              <Text fontSize="14px" fontWeight="medium" color="whiteAlpha.600">
                Login 42
              </Text>
              <Text fontSize="12px" fontWeight="medium" color="whiteAlpha.400">
                {user?.username}
              </Text>
            </Flex>
            <Flex direction={"column"} gap={1}>
              <Text fontSize="14px" fontWeight="medium" color="whiteAlpha.600">
                Campus
              </Text>
              <Text fontSize="12px" fontWeight="medium" color="whiteAlpha.400">
                {user?.campus}
              </Text>
            </Flex>
          </Flex>
        </Stack>
      </Stack>
      <Stack p={1} direction={{ base: "column" }} spacing="9px">
        <Flex direction="column" w="100%" h="100%" gap={2} align="center">
          <Flex direction="row" align="center" gap={1}>
            <Icon boxSize="22px" as={GiAchievement} color="white" />
            <Text fontSize="20px" fontWeight="semibold" color="whiteAlpha.900">
              Achievements
            </Text>
          </Flex>
          {/* TODO: scroll area on y-axis */}
          <ScrollArea.Root className="ScrollAreaRoot">
            <ScrollArea.Viewport className="ScrollAreaViewport">
              <Flex
                gap={4}
                direction="row"
                w="100%"
                h="100%"
                p={2}
                justify="start"
                align={"center"}
                // overflowX="hidden"
              >
                {badges.map((badge, index) => (
                  <Image
                    key={index}
                    src={`/${badge.link}`}
                    alt={badge.alt}
                    boxSize={10}
                  />
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
        </Flex>
        <Flex
          direction="column"
          w="100%"
          h="100%"
          p={2}
          gap={1}
          justify="flex-start"
        >
          <Text fontSize="16px" fontWeight="medium" color="whiteAlpha.900">
            Rank
          </Text>

          <Flex
            direction="row"
            justify="space-between"
            bg="pong_bg.200"
            boxShadow={"0px 4px 24px -1px rgba(0, 0, 0, 0.25)"}
            // bg={"rgba(51, 51, 51, 0)"}
            opacity="90%"
            borderRadius="40px"
            align="center"
            pl={"10px"}
            pr="10px"
            pt={1}
            pb={1}
          >
            <Flex direction="row" gap={3} align="center">
              <Text fontSize="13px" fontWeight="regular" color="whiteAlpha.900">
                {user?.rank}
              </Text>
              <Avatar size="sm" name={user?.name} src={user?.avatar} />
              <Text fontSize="13px" fontWeight="regular" color="whiteAlpha.900">
                {user?.name}
              </Text>
            </Flex>
            <Text fontSize="13px" fontWeight="semibold" color="pong_cl_primary">
              {user?.level}
            </Text>
          </Flex>
        </Flex>
        <Flex direction="row" w="100%" h="100%" gap={4} justify="center">
          <Box>
            <CircularProgress
              value={parseInt(gameWonRate.toFixed(0))}
              color="orange.400"
              size="130px"
              thickness="10px"
              capIsRound
            >
              <CircularProgressLabel fontSize="xl">
                <Stack direction="column" align="center" spacing={0}>
                  <Text
                    fontSize="14px"
                    fontWeight="medium"
                    color="whiteAlpha.700"
                  >
                    Winrate
                  </Text>
                  <Text
                    fontSize="20px"
                    fontWeight="semibold"
                    color="whiteAlpha.900"
                  >
                    {gameWonRate.toFixed(0)}%
                  </Text>
                  <Text
                    fontSize="10px"
                    fontWeight="regular"
                    color="whiteAlpha.600"
                  >
                    {user?.gameWin} W {user?.gameLoss} L
                  </Text>
                </Stack>
              </CircularProgressLabel>
            </CircularProgress>
          </Box>
          <Box>
            <CircularProgress
              // isIndeterminate
              max={10} //TODO: 10 games, dynamic value, MaxGames per level to get to the next level and new rank and achievements
              value={5} // 5 games played
              aria-valuenow={50}
              color="orange.400"
              size="130px"
              thickness="10px"
              capIsRound
            >
              <CircularProgressLabel fontSize="xl">
                <Stack direction="column" align="center" spacing={0}>
                  <Text
                    fontSize="14px"
                    fontWeight="medium"
                    color="whiteAlpha.700"
                  >
                    Played
                  </Text>
                  <Text
                    fontSize="20px"
                    fontWeight="semibold"
                    color="whiteAlpha.900"
                  >
                    {parseInt(user?.gameWin) + parseInt(user?.gameLoss)}
                  </Text>
                  <Text
                    fontSize="10px"
                    fontWeight="regular"
                    color="whiteAlpha.600"
                  >
                    game
                  </Text>
                </Stack>
              </CircularProgressLabel>
            </CircularProgress>
          </Box>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default Profile;