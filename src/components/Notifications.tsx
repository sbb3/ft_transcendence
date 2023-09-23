import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import { FaBell, FaCheck } from "react-icons/fa";
import notificationsApi, {
  useGetNotificationsQuery,
} from "src/features/notifications/notificationsApi";
import Loader from "./Utils/Loader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useLocation, useNavigate } from "react-router-dom";
import store from "src/app/store";
import { useDeleteNotificationMutation } from "src/features/notifications/notificationsApi";
import { CloseIcon } from "@chakra-ui/icons";
import usersApi, { useAddFriendMutation } from "src/features/users/usersApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentUser,
  updateCurrentUser,
} from "src/features/users/usersSlice";
dayjs.extend(relativeTime);

// TODO: backend should dispatch the notification to the user that is receiving the notification only not everyone
function Notifications() {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  // console.log("location: ", location);
  const {
    data: notifications,
    isLoading,
    refetch,
  } = useGetNotificationsQuery({
    subscribe: true,
    refetchOnMountOrArgChange: true,
  });

  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();

  const [addFriend, { isLoading: isAddingFriend }] = useAddFriendMutation();

  const [triggerGetCurrentUser, { isLoading: isLoadingGetCurrentUser }] =
    usersApi.useLazyGetCurrentUserQuery();

  const handleMessageNotification = async ({
    notificationId,
    conversationId,
  }: {
    notificationId: string;
    conversationId: string;
  }) => {
    try {
      await deleteNotification(notificationId).unwrap();
      refetch();
      navigate(`/chat/conversation/${conversationId}`);
    } catch (error) {
      console.log("error deleting notification: ", error);
    }
  };
  // TODO: check IN THE BACK if the user is already a friend,
  const handleAcceptFriendRequest = async ({ id, sender }) => {
    if (currentUser?.friends.includes(sender?.id)) {
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
      await deleteNotification(id).unwrap();
      await addFriend({
        currentUserId: currentUser?.id,
        friendId: sender?.id,
      }).unwrap();
      refetch();
      await triggerGetCurrentUser(currentUser?.id).unwrap();
      // or
      // dispatch(
      //   setCurrentUser({
      //     ...currentUser,
      //     friends: [...currentUser?.friends, sender.id],
      //   })
      // );
      toast({
        title: "Success",
        description: "Friend request accepted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.log("error accepting friend request: ", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Error accepting friend request",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const handleRejectFriendRequest = async ({
    notificationId,
  }: {
    notificationId: string;
  }) => {
    try {
      await deleteNotification(notificationId).unwrap();
      refetch();
      toast({
        title: "Success",
        description: "Friend request rejected",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.log("error rejecting friend request: ", error);
      toast({
        title: "Error",
        description: "Error rejecting friend request",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box position="relative">
      <Menu placement={"bottom-end"}>
        <MenuButton
          as={IconButton}
          css={css`
            position: relative !important;
          `}
          py={"2"}
          colorScheme={"gray"}
          aria-label={"Notifications"}
          size="md"
          fontSize="lg"
          bg={"pong_cl_primary"}
          color={"white"}
          borderRadius={"50%"}
          icon={
            <>
              <FaBell color={"gray.750"} />
              <Box
                as={"span"}
                position={"absolute"}
                top={"2px"}
                right={"6px"}
                fontSize={"0.7rem"}
                zIndex={9999}
                p={"1px"}
              >
                {
                  notifications?.filter(
                    (notification) =>
                      notification?.receiver?.id === currentUser?.id
                  ).length
                }
              </Box>
            </>
          }
          _hover={{
            bg: "white",
            color: "pong_cl_primary",
          }}
          _active={{
            bg: "white",
            color: "pong_cl_primary",
          }}
        />
        <MenuList
          // bg={"pong_cl.200"}
          bg={"transparent"}
          opacity={0}
          color={"whiteAlpha.900"}
          // fontSize={"md"}
          // fontWeight={"medium"}
          border={"1px solid rgba(251, 102, 19, 0.2)"}
        >
          {isLoading ? (
            <MenuItem minH="40px" bg={"transparent"}>
              <Loader size="sm" />
            </MenuItem>
          ) : notifications?.length > 0 ? (
            notifications
              .slice()
              .sort((a, b) => dayjs(b?.createdAt).diff(dayjs(a?.createdAt))) // in descending order from the newest to the oldest
              .map((notification) =>
                notification?.type === "message" &&
                notification?.receiver?.id === currentUser?.id ? (
                  <MenuItem
                    key={notification?.id}
                    as={Flex}
                    justify={"space-between"}
                    align={"center"}
                    gap={4}
                    minH="40px"
                    bg={"transparent"}
                    cursor={"pointer"}
                    onClick={() => {
                      handleMessageNotification({
                        notificationId: notification?.id,
                        conversationId: notification?.conversationId,
                      });
                    }}
                  >
                    <span>
                      New message from {""}
                      {notification?.sender?.name}
                    </span>
                    <Text
                      as={"span"}
                      color={"whiteAlpha.800"}
                      fontSize={"0.7rem"}
                      ml={"auto"}
                    >
                      {dayjs(notification?.createdAt).fromNow()}
                    </Text>
                  </MenuItem>
                ) : notification?.type === "friendRequest" &&
                  notification?.receiver?.id === currentUser?.id ? (
                  <MenuItem
                    key={notification?.id}
                    as={Flex}
                    justify={"space-between"}
                    align={"center"}
                    gap={4}
                    minH="40px"
                    bg={"transparent"}
                    cursor={"pointer"}
                  >
                    <Stack
                      direction={"column"}
                      align={"start"}
                      justify={"center"}
                      spacing={1}
                    >
                      <span>
                        Friend request from {""}
                        {notification?.sender?.name}
                      </span>
                      <Text
                        as={"span"}
                        color={"whiteAlpha.800"}
                        fontSize={"0.7rem"}
                      >
                        {dayjs(notification?.createdAt).fromNow()}
                      </Text>
                    </Stack>
                    <Flex
                      direction={"row"}
                      align={"center"}
                      justify={"center"}
                      gap={1.5}
                    >
                      <IconButton
                        aria-label={"Reject friend request"}
                        isRound
                        bg={"red.400"}
                        fontSize={"2rem"}
                        size={"md"}
                        color={"white"}
                        icon={<Icon boxSize={"14px"} as={CloseIcon} />}
                        isLoading={isDeleting}
                        isDisabled={isDeleting}
                        _hover={{
                          bg: "white",
                          color: "red.600",
                        }}
                        onClick={() => {
                          handleRejectFriendRequest({
                            notificationId: notification?.id,
                          });
                        }}
                      />
                      <IconButton
                        aria-label={"Accept friend request"}
                        isRound
                        bg={"green.500"}
                        size={"md"}
                        color={"white"}
                        icon={<Icon as={FaCheck} />}
                        isLoading={
                          isAddingFriend ||
                          isDeleting ||
                          isLoadingGetCurrentUser
                        }
                        isDisabled={
                          isAddingFriend ||
                          isDeleting ||
                          isLoadingGetCurrentUser
                        }
                        _hover={{
                          bg: "white",
                          color: "green.500",
                        }}
                        onClick={() => {
                          handleAcceptFriendRequest(notification);
                        }}
                      />
                    </Flex>
                  </MenuItem>
                ) : notification?.type === "gameRequest" &&
                  notification?.receiver?.id === currentUser?.id ? (
                  <MenuItem
                    key={notification?.id}
                    as={Flex}
                    justify={"space-between"}
                    align={"center"}
                    gap={4}
                    minH="40px"
                    bg={"transparent"}
                    cursor={"pointer"}
                    onClick={() => {
                      // TODO: delete notification from the list and db
                    }}
                  >
                    <span>
                      New friend request from {""}
                      {notification?.sender?.name}
                    </span>
                    <Text
                      as={"span"}
                      color={"gray.500"}
                      fontSize={"0.7rem"}
                      ml={"auto"}
                    >
                      {dayjs(notification?.createdAt).fromNow()}
                    </Text>
                  </MenuItem>
                ) : null
              )
          ) : (
            <MenuItem minH="40px" bg={"transparent"}>
              <span>No notifications yet</span>
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Box>
  );
}

export default Notifications;
