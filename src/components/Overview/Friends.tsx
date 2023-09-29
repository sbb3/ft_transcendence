import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Box,
  Flex,
  Icon,
  IconButton,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  Link,
  useToast,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useEffect, useState } from "react";
import { GiThreeFriends } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { useGetFriendsQuery } from "src/features/users/usersApi";

const Friends = ({ user }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const {
    data: friends,
    isLoading: isLoadingFriends,
    isFetching: isFetchingFriends,
  } = useGetFriendsQuery(user?.id);

  useEffect(() => {}, []);
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
        <Icon boxSize="22px" as={GiThreeFriends} color="white" />
        <Text
          fontSize="20px"
          fontWeight="semibold"
          color="whiteAlpha.900"
          letterSpacing={1}
        >
          Friends
        </Text>
      </Flex>
      <Flex direction="column" w="full" gap={2} align="start">
        <Flex direction="row" align="center" gap={2}>
          <Text
            fontSize="14px"
            fontWeight="regular"
            color="whiteAlpha.900"
            letterSpacing={1}
          >
            Friends
          </Text>
          <AvatarGroup size="sm" max={4} color={"pong_bg_primary"}>
            {friends?.map((friend, i) => (
              <Avatar
                bg="pong_bg_secondary"
                p={0.5}
                ml={2}
                key={friend?.id}
                name={friend?.name}
                src={friend?.avatar}
              />
            ))}
          </AvatarGroup>
        </Flex>
      </Flex>

      <Stack position="relative" direction={"column"} height="full">
        <AutoComplete
          rollNavigation
          isLoading={isLoadingFriends || isFetchingFriends}
          openOnFocus
          defaultIsOpen={true}
          listAllValuesOnFocus
          closeOnSelect={false}
          // flip={false}
        >
          <InputGroup w="full">
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon />}
              bg="pong_cl_primary"
              color="white"
              px={2}
              py={1}
              // borderTopLeftRadius="md"
              // borderBottomLeftRadius="md"
              border="1px solid var(--white, #FFF)"
              borderRadius="md"
              cursor="pointer"
            />
            <AutoCompleteInput
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              ml={2}
              flex={1}
              variant="filled"
              bg="pong_bg.400"
              type="text"
              color="white"
              placeholder="Search for a friend"
              _placeholder={{
                fontSize: 14,
                letterSpacing: 0.5,
                fontWeight: "light",
                opacity: 0.7,
                color: "gray.500",
              }}
            />
          </InputGroup>

          <AutoCompleteList
            style={{
              minHeight: "420px",
              width: "100%",
              // borderRadius: "24px",
              border: "1px solid rgba(251, 102, 19, 0.09)",
              boxShadow: "0px 4px 24px -1px rgba(0, 0, 0, 0.35)",
              backdropFilter: "blur(20px)",
              backgroundImage: "url('src/assets/img/BlackNoise.png')",
              bgSize: "cover",
              bgRepeat: "no-repeat",
              backgroundColor: "transparent",
              // backgroundColor: "red",
              position: "absolute",
              display: "block",
              marginTop: "4px",
              overflow: "hidden",
              padding: "0px",
            }}
            closeOnSelect={false}
            p={1}
            mr={2}
          >
            <ScrollArea.Root className="ScrollAreaRoot">
              <ScrollArea.Viewport className="ScrollAreaViewport">
                <Box
                  height={"400"}
                  width={"full"}
                  //  bg="green"
                  mr={4}
                >
                  {friends?.map((friend) => (
                    <AutoCompleteItem
                      // w="150px"
                      key={friend?.id}
                      value={friend?.name}
                      textTransform="capitalize"
                      bg="pong_bg.200"
                      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
                      backdropFilter={"blur(20px)"}
                      bgImage={`url('src/assets/img/BlackNoise.png')`}
                      bgSize="cover"
                      bgRepeat="no-repeat"
                      borderRadius={5}
                      my={1}
                      _hover={{
                        bg: "pong_bg.500",
                      }}
                      _focus={{
                        // bg: "pong_bg.300",
                        backgroundColor: "transparent",
                      }}
                      _selected={{
                        // bg: "pong_bg.300",
                        backgroundColor: "transparent",
                      }}
                      onClick={() => {
                        setQuery("");
                        navigate(`/profile/${friend?.username}`, {
                          state: {
                            friend,
                          },
                        });
                      }}
                    >
                      <Flex
                        direction="row"
                        justify="space-between"
                        align="center"
                        w="full"
                      >
                        <Flex
                          direction="row"
                          gap="3px"
                          align="center"
                          w={"full"}
                        >
                          <Avatar
                            size="sm"
                            name={friend?.name}
                            src={friend?.avatar}
                            borderColor={"green.400"}
                            borderWidth="2px"
                          >
                            <AvatarBadge
                              boxSize="0.9em"
                              border="1px solid white"
                              bg={"green.400"}
                            />
                          </Avatar>
                          <Text
                            color="white"
                            fontSize="14px"
                            fontWeight="medium"
                            ml={2}
                            flex={1}
                          >
                            {friend?.name}
                          </Text>
                        </Flex>
                      </Flex>
                    </AutoCompleteItem>
                  ))}
                </Box>
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
          </AutoCompleteList>
        </AutoComplete>
      </Stack>
    </Stack>
  );
};

export default Friends;