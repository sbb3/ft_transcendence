import { Flex } from "@chakra-ui/react";
import { json, useLocation, useParams } from "react-router-dom";
import Profile from "src/components/Overview/Profile";
import RecentGames from "src/components/Overview/RecentGames";

// TODO: later on, get the username url from the useParams hook, and fetch the user data then pass it to the Profile and RecentGames components
const PlayerProfile = () => {
  const { username } = useParams();
  const location = useLocation();
  const user = location.state.user;
  console.log("user", user);
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
      <Flex direction={{ base: "column", xl: "row" }} gap={4}>
        <Profile user={user} />
        <RecentGames />
      </Flex>
    </Flex>
  );
};

export default PlayerProfile;
