import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Box,
  Flex,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { MdLeaderboard } from "react-icons/md";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { leaderboardData } from "src/config/data/data";
import { CrownIcon, RankIcon } from "src/assets/icons/icons";
import { Navigate, useNavigate } from "react-router-dom";
const Card = ({ person }) => {
  const { rank, name, image } = person;
  const navigate = useNavigate();
  return (
    <Flex
      direction="row"
      justify="space-between"
      borderRadius="22px"
      align="center"
      gap={2}
      // pl={2}
      // pr={2}
      px={2}
      w="220px"
      h="40px"
      bgColor={
        rank == "1"
          ? "#FFCA28"
          : rank == "2"
          ? "#F4F4F4"
          : rank == "3"
          ? "#FF8228"
          : "rgba(255, 255, 255, 0.2)"
      }
      onClick={() => navigate("/profile/username")} // TODO: navigate to the user profile
    >
      <Flex direction="row" gap={3} align="center" pl={2} pr={2}>
        <Text fontSize="12px" fontWeight="bold" color="#312244">
          {rank}
        </Text>
        <Avatar size="sm" name={name} src={image} />
        <Text fontSize="14px" fontWeight="medium" color="#312244">
          {name}
        </Text>
      </Flex>
      <RankIcon boxSize={6} />
    </Flex>
  );
};

const Leaderboard = () => {
  return (
    <Stack
      direction={{ base: "column" }}
      w={{ base: "380px" }}
      h={{ base: "600px" }}
      p={4}
      spacing="12px"
      borderRadius={24}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <Flex direction="row" align="center" justify="center" gap={1.5} mt={0}>
        <Icon boxSize="22px" as={MdLeaderboard} color="white" />
        <Text
          fontSize="20px"
          fontWeight="semibold"
          color="whiteAlpha.900"
          letterSpacing={1}
        >
          Leaderboard
        </Text>
      </Flex>
      <Flex
        direction="row"
        align="center"
        justify="space-evenly"
        gap={1.5}
        mt={16}
      >
        <Stack direction="column" spacing={4} align="center">
          <Avatar
            size="lg"
            name={"Anas Douib"}
            src={"https://anasdouib.me/images/picture.webp"}
            borderColor={"white"}
            borderWidth="4px"
            // borderRadius="0px"
          >
            <AvatarBadge
              boxSize="0.9em"
              border="4px solid #312244"
              bg={"white"}
              position="absolute"
              bottom={"-15%"}
              left={"25%"}
              translateY={"50%"}
            >
              <Text fontSize="10px" fontWeight="bold" color="#312244">
                {"2"}
              </Text>
            </AvatarBadge>
          </Avatar>
          <Flex direction="column" align="center" justify="center" gap={0}>
            <Text fontSize="12px" fontWeight="semibold" color="whiteAlpha.800">
              {"Anas Douib"}
            </Text>
            <Text fontSize="10px" fontWeight="light" color="whiteAlpha.600">
              {"Level 2"}
            </Text>
          </Flex>
        </Stack>
        <Stack direction="column" spacing={4} align="center">
          <Avatar
            size="xl"
            name={"Anas Douib"}
            src={"https://anasdouib.me/images/picture.webp"}
            borderColor={"#FFCA28"}
            borderWidth="4px"
            // borderRadius="0px"
          >
            <Box
              position="absolute"
              top={"-14"}
              // top={"0"}
              translateY={"-50%"}
            >
              <CrownIcon boxSize="75px" />
            </Box>
            <AvatarBadge
              boxSize="0.9em"
              border="5px solid #312244"
              bg={"#FFCA28"}
              position="absolute"
              bottom={"-15%"}
              left={"25%"}
              translateY={"50%"}
            >
              <Text fontSize="10px" fontWeight="bold" color="#312244">
                {"1"}
              </Text>
            </AvatarBadge>
          </Avatar>
          <Flex direction="column" align="center" justify="center" gap={0}>
            <Text fontSize="12px" fontWeight="semibold" color="whiteAlpha.800">
              {"Anas Douib"}
            </Text>
            <Text fontSize="10px" fontWeight="light" color="whiteAlpha.600">
              {"Level 1"}
            </Text>
          </Flex>
        </Stack>
        <Stack direction="column" spacing={4} align="center">
          <Avatar
            size="lg"
            name={"Anas Douib"}
            src={"https://anasdouib.me/images/picture.webp"}
            borderColor={"#FF8228"}
            borderWidth="4px"
            // borderRadius="0px"
          >
            <AvatarBadge
              boxSize="0.9em"
              border="4px solid #312244"
              bg={"#FF8228"}
              position="absolute"
              bottom={"-15%"}
              left={"25%"}
              translateY={"50%"}
            >
              <Text fontSize="10px" fontWeight="bold" color="#312244">
                {"3"}
              </Text>
            </AvatarBadge>
          </Avatar>
          <Flex direction="column" align="center" justify="center" gap={0}>
            <Text fontSize="12px" fontWeight="semibold" color="whiteAlpha.800">
              {"Anas Douib"}
            </Text>
            <Text fontSize="10px" fontWeight="light" color="whiteAlpha.600">
              {"Level 3"}
            </Text>
          </Flex>
        </Stack>
      </Flex>
      <Box
        w="100%"
        h="100%"
        borderRadius="xl"
        p={2}
        mb={0}
        overflow="hidden"
        // outline="2px solid red"
      >
        <ScrollArea.Root className="ScrollAreaRoot">
          <ScrollArea.Viewport className="ScrollAreaViewport">
            <Stack
              // p={2}
              id="scrollableStack"
              gap={"12px"}
              justify="center"
              align="center"
              wrap="wrap"
              overflow="hidden"
              outline="2px solid red"
              // mr={2}
            >
              {leaderboardData.map((person, i) => (
                <Card key={i} person={person} />
              ))}
            </Stack>
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
      </Box>
    </Stack>
  );
};

export default Leaderboard;
