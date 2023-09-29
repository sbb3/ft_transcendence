import { Flex } from "@chakra-ui/react";
import { json, useLocation, useParams } from "react-router-dom";
import Profile from "src/components/Overview/Profile";
import RecentGames from "src/components/Overview/RecentGames";
import Loader from "src/components/Utils/Loader";
import { useGetUserByUsernameQuery } from "src/features/users/usersApi";

// TODO: later on, get the username url from the useParams hook, and fetch the user data then pass it to the Profile and RecentGames components
const PlayerProfile = () => {
  const { username } = useParams();
  const {
    data: users,
    isLoading,
    isFetching,
  } = useGetUserByUsernameQuery(username, {
    refetchOnMountOrArgChange: true,
  });
  return (
    <Flex
      w="full"
      h="full"
      direction={{ base: "column", md: "row" }}
      justify={{ base: "start", md: "space-evenly" }}
      align={{ base: "center", md: "start" }}
      // p={2}
      borderRadius={40}
      gap={4}
      p={4}
    >
      {isLoading || isFetching ? (
        <Loader />
      ) : users?.length > 0 ? (
        <Flex direction={{ base: "column", xl: "row" }} gap={4}>
          <Profile user={users[0]} />
          <RecentGames user={users[0]} />
        </Flex>
      ) : (
        <Flex
          justify="center"
          align="center"
          h="100%"
          w="100%"
          color="white"
          fontSize="xl"
          fontWeight="semibold"
        >
          User not found
        </Flex>
      )}
    </Flex>
  );
};

export default PlayerProfile;
