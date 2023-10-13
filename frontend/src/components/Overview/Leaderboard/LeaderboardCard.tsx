import { Avatar, Flex, Text } from "@chakra-ui/react";
import "src/styles/scrollbar.css";
import { RankIcon } from "src/assets/icons/icons";
import { useNavigate } from "react-router-dom";

const LeaderboardCard = ({ key, player }) => {
  const { name, username, avatar, rank } = player;
  const navigate = useNavigate();
  return (
    <Flex
      key={key}
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
        rank == "1"
          ? "#FFCA28"
          : rank == "2"
          ? "#F4F4F4"
          : rank == "3"
          ? "#FF8228"
          : "rgba(255, 255, 255, 0.2)"
      }
      onClick={() => navigate(`/profile/${username}`)}
    >
      <Flex direction="row" gap={3} align="center" pl={2} pr={2}>
        <Text fontSize="12px" fontWeight="bold" color="#312244">
          {rank}
        </Text>
        <Avatar size="sm" name={name} src={avatar} />
        <Text fontSize="14px" fontWeight="medium" color="#312244">
          {name}
        </Text>
      </Flex>
      <RankIcon boxSize={6} />
    </Flex>
  );
};
export default LeaderboardCard;
