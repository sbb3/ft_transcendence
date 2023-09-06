import { Box, Button, Flex, Grid, GridItem } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Friends from "src/components/Overview/Friends";
import Leaderboard from "src/components/Overview/Leaderboard";
import Profile from "src/components/Overview/Profile";
import RecentGames from "src/components/Overview/RecentGames";
import useTitle from "src/hooks/useTitle";

function Overview() {
  useTitle("Ping Pong");
  const navigate = useNavigate();
  return (
    <Flex
      w="full"
      h="full"
      direction={{ base: "column", md: "row" }}
      justify={{ base: "center", md: "start" }}
      align={{ base: "center", md: "start" }}
      p={2}
      borderRadius={40}
      gap={4}
      // outline="2px solid yellow"
      wrap={"wrap"}
    >
      <Profile />
      <Friends />
      <Leaderboard />
      <RecentGames />
    </Flex>
  );
}
export default Overview;
