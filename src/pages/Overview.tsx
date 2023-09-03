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
    <Box w="full" h="full" bg="teal.300">
      <Flex
        direction={{ base: "column", md: "row" }}
        // align="center"
        justify="flex-start"
        h="full"
        w="full"
        p={2}
        gap={4}
      >
        <Flex direction="column" flex={1} gap={2}>
          <Profile />
          <Flex direction={{ base: 'column', md: 'row' }} w="full" h="full" gap={2}>
            <Friends />
            <RecentGames />
          </Flex>
        </Flex>
        <Flex flex={0.5} h='full' bg="green">
          <Leaderboard />
        </Flex>
      </Flex>
    </Box >
  );
}
export default Overview;

{
  /* <Grid
        //   templateColumns="repeat(3, 1fr 3fr 1fr)"
          templateColumns={{ base: "1fr", md: "1fr 1fr 30%" }}
        //   templateRows="repeat(2, 1fr)"
          templateRows={{ md: "43% 1fr" }}
          gap={2}
          w="100%"
          h="full"
          autoFlow={"column"}
          autoColumns={"1fr"}
        >
          <GridItem
            colSpan={{ base: 1, md: 2 }}
            rowSpan={{ base: 1, md: 1 }}
            bg="red"
          >
            First Column (Top Half)
          </GridItem>

          <GridItem rowSpan={1} bg="black" rowStart={{ base: 2 }} rowEnd={2}>
            First Column (Bottom Half, Left)
          </GridItem>
          <GridItem
            rowSpan={1}
            bg="blue.300"
            rowStart={2}
            rowEnd={2}
            colStart={1}
            colEnd={1}
          >
            First Column (Bottom Half, Right)
          </GridItem>

          <GridItem colSpan={1} rowSpan={2} bg="gray" colStart={3} colEnd={3}>
            Third Column
          </GridItem>
        </Grid> */
}
