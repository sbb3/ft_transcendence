import { Avatar, Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { GiGamepadCross } from "react-icons/gi";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { useNavigate } from "react-router-dom";
import { useGetUserRecentGamesQuery } from "src/features/game/gameApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface RecentGamesProps {
  user: {
    id: number;
    name: string;
    username: string;
    avatar: string;
    recentGames: {
      id: number;
      player: {
        id: number;
        name: string;
        username: string;
        avatar: string;
        score: number;
      };
      opponent: {
        id: number;
        name: string;
        username: string;
        avatar: string;
        score: number;
      };
      date: string;
      status: string;
      winStatus: string;
      createdAt: number;
    }[];
  };
}

const RecentGames = ({ user }: RecentGamesProps) => {
  // const { data: recentGames, isLoading, isFetching, isError, error } = useGetUserRecentGamesQuery(currentUser?.id);
  // const { recentGames } = user;
  const navigate = useNavigate();

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
      <Box w="100%" h="100%" borderRadius="xl" p={1} mb={2} overflow="hidden">
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
            >
              {user?.recentGames?.length > 0 ? (
                user?.recentGames
                  .slice()
                  ?.sort((a, b) =>
                    dayjs(a.createdAt).isBefore(dayjs(b.createdAt)) ? 1 : -1
                  )
                  ?.map(({ id, player, opponent, date, status, winStatus }) => (
                    <>
                      <Flex
                        key={id}
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
                        // borderStyle="dashed"
                        p={2}
                      >
                        <Stack direction="column" spacing={2} align="center">
                          <Avatar
                            size="lg"
                            name={player?.name}
                            src={player?.avatar}
                            borderRadius="15px"
                          />
                          <Text
                            fontSize="12px"
                            fontWeight="medium"
                            color="whiteAlpha.800"
                          >
                            {player?.name}
                          </Text>
                        </Stack>
                        <Stack direction="column" spacing={0.5} align="center">
                          <Text
                            fontSize="10px"
                            fontWeight="normal"
                            color="gray.400"
                          >
                            {dayjs(date).fromNow()}
                          </Text>
                          <Text
                            fontSize="20px"
                            fontWeight="semibold"
                            color="whiteAlpha.900"
                          >
                            {`${player?.score} - ${opponent?.score}`}
                          </Text>
                          <Text
                            fontSize="13px"
                            fontWeight="semibold"
                            color="pong_cl_primary"
                          >
                            {status}
                          </Text>
                        </Stack>
                        <Stack direction="column" spacing={2} align="center">
                          <Avatar
                            size="lg"
                            name={opponent?.name}
                            src={opponent?.avatar}
                            borderRadius="15px"
                            cursor={"pointer"}
                            onClick={() =>
                              navigate(`/profile/${opponent?.username}`)
                            }
                          />
                          <Text
                            fontSize="12px"
                            fontWeight="medium"
                            color="whiteAlpha.800"
                          >
                            {opponent?.name}
                          </Text>
                        </Stack>
                      </Flex>
                    </>
                  ))
              ) : (
                <Text
                  fontSize="12px"
                  fontWeight="medium"
                  color="whiteAlpha.800"
                >
                  No games played
                </Text>
              )}
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
