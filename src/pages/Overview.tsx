import { Box, Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Friends from "src/components/Overview/Friends";
import Leaderboard from "src/components/Overview/Leaderboard";
import Profile from "src/components/Overview/Profile";
import RecentGames from "src/components/Overview/RecentGames";
import useTitle from "src/hooks/useTitle";

// TODO: later on, get the current user data from the store and pass it down to the Profile and RecentGames components
function Overview() {
  useTitle("Ping Pong");
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const navigate = useNavigate();

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
      // outline="2px solid yellow"
      // wrap={"wrap"}
      p={4}
    >
      <Flex direction={{ base: "column", xl: "column" }} gap={4}>
        <Profile user={currentUser} />
        <Leaderboard />
      </Flex>
      <Flex direction={{ base: "column", xl: "column" }} gap={4}>
        <Friends />
        <RecentGames />
      </Flex>
    </Flex>
  );
}
export default Overview;
