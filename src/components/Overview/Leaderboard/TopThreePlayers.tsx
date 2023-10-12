import { Avatar, AvatarBadge, Box, Flex, Stack, Text } from "@chakra-ui/react";
import "src/styles/scrollbar.css";
import { CrownIcon } from "src/assets/icons/icons";
import { useNavigate } from "react-router-dom";

const TopThreePlayers = ({ top3Players }) => {
  const navigate = useNavigate();
  const player1 = top3Players?.[0];
  const player2 = top3Players?.[1];
  const player3 = top3Players?.[2];
  return (
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
          name={player2?.name}
          src={player2?.avatar}
          borderColor={"white"}
          borderWidth="4px"
          // borderRadius="0px"
          onClick={() => navigate(`/profile/${player2?.username}`)}
          cursor={"pointer"}
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
            {player2?.name}
          </Text>
          <Text fontSize="10px" fontWeight="light" color="whiteAlpha.600">
            {`Level ${player2?.level}`}
          </Text>
        </Flex>
      </Stack>
      <Stack direction="column" spacing={4} align="center">
        <Avatar
          size="xl"
          name={player1?.name}
          src={"https://anasdouib.me/images/picture.webp"}
          borderColor={"#FFCA28"}
          borderWidth="4px"
          // borderRadius="0px"
          onClick={() => navigate(`/profile/${player1?.username}`)}
          cursor={"pointer"}
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
            {player1?.name}
          </Text>
          <Text fontSize="10px" fontWeight="light" color="whiteAlpha.600">
            {`Level ${player1?.level}`}
          </Text>
        </Flex>
      </Stack>
      <Stack direction="column" spacing={4} align="center">
        <Avatar
          size="lg"
          name={player3?.name}
          src={player3?.avatar}
          borderColor={"#FF8228"}
          borderWidth="4px"
          // borderRadius="0px"
          onClick={() => navigate(`/profile/${player3?.username}`)}
          cursor={"pointer"}
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
            {player3?.name}
          </Text>
          <Text fontSize="10px" fontWeight="light" color="whiteAlpha.600">
            {`Level ${player3?.level}`}
          </Text>
        </Flex>
      </Stack>
    </Flex>
  );
};

export default TopThreePlayers;
