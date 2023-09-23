import { Box, Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Friends from "src/components/Overview/Friends";
import Leaderboard from "src/components/Overview/Leaderboard";
import Profile from "src/components/Overview/Profile";
import RecentGames from "src/components/Overview/RecentGames";
import useTitle from "src/hooks/useTitle";

// TODO: later on, get the current user data from the store and pass it down to the Profile and RecentGames components
function Overview() {
  useTitle("Ping Pong");
  const navigate = useNavigate();
  const user = {
    id: "1",
    name: "Anas Douib",
    username: "adouib",
    status: "in-game",
    email: "adouib@student.1337.ma",
    campus: "1337 Benguerir",
    gameWin: "100",
    gameLoss: "50",
    avatar:
      "https://cdn.intra.42.fr/users/59e7850e72615ca476b2dafd852680f4/adouib.jpg",
    rank: "1",
    level: "103",
  };
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
        <Profile user={user} />
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
