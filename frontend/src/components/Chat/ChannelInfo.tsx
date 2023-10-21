import {
  Flex,
  Icon,
  IconButton,
  List,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ImExit } from "react-icons/im";
import { AiFillDelete } from "react-icons/ai";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import channelsApi, {
  useDeleteChannelMutation,
} from "src/features/channels/channelsApi";
dayjs.extend(relativeTime);

const ChannelAbout = ({ channel }) => {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);

  const navigate = useNavigate();
  const [deleteChannel, { isLoading: isDeletingChannel }] =
    useDeleteChannelMutation();

  const [LeaveChannel] = channelsApi.useLeaveChannelMutation();

  // TODO: invalidate the cache
  const handleLeaveChannel = async () => {
    try {
      await LeaveChannel({
        channelId: channel?.id,
        channelName: channel?.name,
        memberId: currentUser?.id,
      }).unwrap();
      navigate("/chat", { replace: true });
    } catch (error) {
      console.log("error did not leave channel : ", error);
    }
  };

  // TODO: invalidate the cache
  const handleDeleteChannel = async () => {
    try {
      await deleteChannel({ id: channel?.id, name: channel?.name }).unwrap();
      navigate("/chat", { replace: true });
      console.log("channel got deleted");
    } catch (error) {
      console.log("error: ", error);
      console.log("did not delete channel");
    }
  };

  return (
    <Stack
      mt={0}
      spacing={4}
      //  w={{ base: "full", sm: "full", md: 620 }}
      align="center"
      justify="center"
      borderRadius={40}
      // bg="red"
      // pl={3}
      // pr={2}
      p={2}
    >
      <Stack spacing={1} align="start" w="full">
        <Text fontSize="18px" fontWeight="medium" color="whiteAlpha.600">
          Description
        </Text>
        <Text
          fontSize="14px"
          fontWeight="medium"
          color="whiteAlpha.900"
          ml={2}
          textAlign={"start"}
        >
          {channel?.description}
        </Text>
      </Stack>
      <Stack spacing={2} align="start" w="full">
        <Text fontSize="18px" fontWeight="medium" color="whiteAlpha.600">
          Managed by
        </Text>
        <List spacing={2} flexWrap="wrap" w="full" textAlign={"start"}>
          {channel?.members
            ?.filter((m) => m?.role === "admin" || m?.role === "owner")
            ?.map((m) => (
              <ListItem
                key={m?.id}
                fontSize="14px"
                fontWeight="medium"
                color="pong_cl_primary"
                ml={2}
              >
                {m?.name}
              </ListItem>
            ))}
        </List>
      </Stack>
      <Stack spacing={1} align="start" w="full">
        <Text fontSize="18px" fontWeight="medium" color="whiteAlpha.600">
          Created by
        </Text>
        <Text
          fontSize="14px"
          fontWeight="medium"
          color="pong_cl_primary"
          ml={2}
        >
          {channel?.owner?.name} on{" "}
          {dayjs(channel?.createdAt).format("MMMM DD, YYYY, HH:mm")}
        </Text>
      </Stack>
      <Flex direction="row" align="center" justify="start" w="full" gap={4}>
        <IconButton
          aria-label="Leave channel"
          icon={<Icon as={ImExit} boxSize={6} />}
          colorScheme="red"
          // variant="outline"
          borderRadius={10}
          onClick={handleLeaveChannel}
        />
        {channel?.ownerId === currentUser?.id && (
          <IconButton
            aria-label="Delete channel"
            icon={<Icon as={AiFillDelete} boxSize={6} />}
            colorScheme="red"
            // variant="outline"
            borderRadius={10}
            onClick={handleDeleteChannel}
          />
        )}
      </Flex>
    </Stack>
  );
};

export default ChannelAbout;
