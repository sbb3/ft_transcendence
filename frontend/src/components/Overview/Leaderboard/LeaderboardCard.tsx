import { Avatar, Flex, Image, Text } from "@chakra-ui/react";
import "src/styles/scrollbar.css";
import { useNavigate } from "react-router-dom";

interface LeaderboardPlayer {
  id: number;
  name: string;
  username: string;
  avatar: string;
  level: string;
}

interface LeaderboardCardProps {
  player: LeaderboardPlayer;
}

const LeaderboardCard = ({ player }: LeaderboardCardProps) => {
  const { name, username, avatar, level } = player;
  const navigate = useNavigate();
  return (
    <Flex
      key={player?.id}
      direction="row"
      justify="space-between"
      w="220px"
      h="40px"
      px={2}
      gap={2}
      borderRadius="22px"
      align="center"
      cursor={"pointer"}
      bgColor={
        level == "1"
          ? "#FFCA28"
          : level == "2"
            ? "#F4F4F4"
            : level == "3"
              ? "#FF8228"
              : "rgba(255, 255, 255, 0.2)"
      }
      onClick={() => navigate(`/profile/${username}`)}
    >
      <Flex direction="row" gap={3} align="center" pl={2} pr={2}>
        <Text fontSize="12px" fontWeight="bold" color="#312244">
          {level}
        </Text>
        <Avatar size="sm" name={name} src={avatar} />
        <Text fontSize="14px" fontWeight="medium" color="#312244">
          {username}
        </Text>
      </Flex>
      <Image
        src={"/assets/svg/rank_icon.svg"}
        alt="rankIcon"
        boxSize="1.5rem" // 1rem = 16px ,  1.5rem = 24px, 2 rem = 32px
      />
    </Flex>
  );
};
export default LeaderboardCard;
