import { Avatar, Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { GiGamepadCross } from "react-icons/gi";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";

const personData = [
  {
    name: "Anas Douib",
    opponent: "Dan Abramov",
    image: "https://anasdouib.me/images/picture.webp",
    opponentImage: "https://bit.ly/dan-abramov",
    date: "04.09.2023 12:00",
    score: "2 - 0",
    status: "FINISHED",
    winStatus: "win",
  },
  {
    name: "Anas Douib",
    opponent: "Dan Abramov",
    image: "https://anasdouib.me/images/picture.webp",
    opponentImage: "https://bit.ly/dan-abramov",
    date: "04.09.2023 12:00",
    score: "0 - 1",
    status: "FINISHED",
    winStatus: "lost",
  },
  {
    name: "Anas Douib",
    opponent: "Dan Abramov",
    image: "https://anasdouib.me/images/picture.webp",
    opponentImage: "https://bit.ly/dan-abramov",
    date: "04.09.2023 12:00",
    score: "1 - 1",
    status: "FINISHED",
    winStatus: "draw",
  },
  {
    name: "Anas Douib",
    opponent: "Dan Abramov",
    image: "https://anasdouib.me/images/picture.webp",
    opponentImage: "https://bit.ly/dan-abramov",
    date: "04.09.2023 12:00",
    score: "1 - 1",
    status: "FINISHED",
    winStatus: "win",
  },
  {
    name: "Anas Douib",
    opponent: "Dan Abramov",
    image: "https://anasdouib.me/images/picture.webp",
    opponentImage: "https://bit.ly/dan-abramov",
    date: "04.09.2023 12:00",
    score: "1 - 1",
    status: "FINISHED",
    winStatus: "draw",
  },
  {
    name: "Anas Douib",
    opponent: "Dan Abramov",
    image: "https://anasdouib.me/images/picture.webp",
    opponentImage: "https://bit.ly/dan-abramov",
    date: "04.09.2023 12:00",
    score: "1 - 1",
    status: "FINISHED",
    winStatus: "draw",
  },
  {
    name: "Anas Douib",
    opponent: "Dan Abramov",
    image: "https://anasdouib.me/images/picture.webp",
    opponentImage: "https://bit.ly/dan-abramov",
    date: "04.09.2023 12:00",
    score: "1 - 1",
    status: "FINISHED",
    winStatus: "draw",
  },
  {
    name: "Anas Douib",
    opponent: "Dan Abramov",
    image: "https://anasdouib.me/images/picture.webp",
    opponentImage: "https://bit.ly/dan-abramov",
    date: "04.09.2023 12:00",
    score: "1 - 1",
    status: "FINISHED",
    winStatus: "draw",
  },
  {
    name: "Anas Douib",
    opponent: "Dan Abramov",
    image: "https://anasdouib.me/images/picture.webp",
    opponentImage: "https://bit.ly/dan-abramov",
    date: "04.09.2023 12:00",
    score: "1 - 1",
    status: "FINISHED",
    winStatus: "draw",
  },
  {
    name: "Anas Douib",
    opponent: "Dan Abramov",
    image: "https://anasdouib.me/images/picture.webp",
    opponentImage: "https://bit.ly/dan-abramov",
    date: "04.09.2023 12:00",
    score: "1 - 1",
    status: "FINISHED",
    winStatus: "draw",
  },
];

const Card = ({ person }) => {
  const {
    name,
    opponent,
    image,
    opponentImage,
    date,
    score,
    status,
    winStatus,
  } = person;
  return (
    <Flex
      direction="row"
      justify="center"
      align="start"
      gap={"18px"}
      borderColor={
        winStatus === "win"
          ? "green.400"
          : winStatus === "lost"
          ? "red.400"
          : "yellow.400"
      }
      borderWidth="1px"
      borderRadius="15px"
      borderStyle="dashed"
      p={2}
    >
      <Stack direction="column" spacing={2} align="center">
        <Avatar
          size="lg"
          name={name}
          src={image}
          borderColor={"green.400"}
          borderWidth="2px"
          borderRadius="15px"
        />
        <Text fontSize="12px" fontWeight="medium" color="whiteAlpha.800">
          {name}
        </Text>
      </Stack>
      <Stack direction="column" spacing={0.5} align="center">
        <Text fontSize="10px" fontWeight="normal" color="gray.400">
          {date}
        </Text>
        <Text fontSize="20px" fontWeight="semibold" color="whiteAlpha.900">
          {score}
        </Text>
        <Text fontSize="13px" fontWeight="semibold" color="pong_cl_primary">
          {status}
        </Text>
      </Stack>
      <Stack direction="column" spacing={2} align="center">
        <Avatar
          size="lg"
          name={opponent}
          src={opponentImage}
          borderColor={"green.400"}
          borderWidth="2px"
          borderRadius="15px"
        />
        <Text fontSize="12px" fontWeight="medium" color="whiteAlpha.800">
          {opponent}
        </Text>
      </Stack>
    </Flex>
  );
};

const RecentGames = () => {
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
      <Flex direction="row" align="center" justify="center" gap={1.5}>
        <Icon boxSize="22px" as={GiGamepadCross} color="white" />
        <Text
          fontSize="20px"
          fontWeight="semibold"
          color="whiteAlpha.900"
          letterSpacing={1}
        >
          Recent Games
        </Text>
      </Flex>
      <Box
        w="100%"
        h="100%"
        borderRadius="xl"
        p={1}
        mb={2}
        overflow="hidden"
        // outline="2px solid red"
      >
        <ScrollArea.Root className="ScrollAreaRoot">
          <ScrollArea.Viewport className="ScrollAreaViewport">
            <Flex
              direction="column"
              w="100%"
              h="100%"
              p={2}
              gap={"10px"}
              justify="center"
              align="center"
              wrap="wrap"
              overflow="hidden"
              mr={2}
              // outline="2px solid white"
            >
              {personData.map((person, i) => (
                <Card key={i} person={person} />
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
      </Box>
    </Stack>
  );
};

export default RecentGames;
