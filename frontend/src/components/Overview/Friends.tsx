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
import { Link as RouterLink } from "react-router-dom";
import { HiUserRemove } from "react-icons/hi";
import { MdBlockFlipped } from "react-icons/md";
import { IoGameControllerOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { faker } from "@faker-js/faker";

const users = [...Array(30)].map(() => ({
  id: faker.string.uuid(),
  name: faker.person.firstName() + " " + faker.person.lastName(),
  username: faker.internet.userName(),
  status: faker.helpers.arrayElement(["online", "offline", "in-game"]),
  avatar: faker.image.avatar(),
  email: faker.internet.email(),
  campus: faker.location.city(),
  gameWin: faker.number.int(50),
  gameLoss: faker.number.int(40),
  rank: faker.number.int(100),
  level: faker.number.int(50),
}));

const Friends = () => {
  const navigate = useNavigate();
  const toast = useToast();

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
            {users.map((user, i) => (
              <Avatar
                bg="pong_bg_secondary"
                p={0.5}
                ml={2}
                key={i}
                name={"user.name"}
                src={"https://bit.ly/ryan-florence"}
              />
            ))}
          </AvatarGroup>
        </Flex>
      </Flex>

      <Stack position="relative" direction={"column"} height="full">
        <AutoComplete
          rollNavigation
          // isLoading={isLoading}
          openOnFocus
          defaultIsOpen={true}
          listAllValuesOnFocus
          closeOnSelect={false}
          // flip={false}
          // style={{ overflow: "hidden" }}
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
            // style={{ backgroundImage: "url('src/assets/img/BlackNoise.png')" }}
            style={{
              // borderRadius: "24px",
              border: "1px solid rgba(251, 102, 19, 0.09)",
              boxShadow: "0px 4px 24px -1px rgba(0, 0, 0, 0.35)",
              backdropFilter: "blur(20px)",
              backgroundImage: "url('src/assets/img/BlackNoise.png')",
              bgSize: "cover",
              bgRepeat: "no-repeat",
              backgroundColor: "transparent",
              // backgroundColor: "red",
              minHeight: "440px",
              position: "absolute",
              display: "block",
              marginTop: "4px",
              overflow: "scroll",
              padding: "0px",
            }}
            closeOnSelect={false}
            p={1}
            mr={2}
          >
            <ScrollArea.Root className="ScrollAreaRoot">
              <ScrollArea.Viewport className="ScrollAreaViewport">
                <Box
                  height={"430"}
                  width={"full"}
                  // bg="green"
                  mr={4}
                >
                  {users.map((user, i) => (
                    <AutoCompleteItem
                      key={i}
                      value={user.name}
                      textTransform="capitalize"
                      bg="pong_bg.200"
                      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
                      backdropFilter={"blur(20px)"}
                      bgImage={`url('src/assets/img/BlackNoise.png')`}
                      bgSize="cover"
                      bgRepeat="no-repeat"
                      borderRadius={50}
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
                          onClick={() =>
                            navigate(`/profile/${user.name}`, {
                              state: {
                                user,
                              },
                            })
                          }
                        >
                          <Avatar
                            size="sm"
                            name={user.name}
                            src={user.avatar}
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
                            {user.name}
                          </Text>
                        </Flex>
                        <Flex direction="row" gap="6px" mr={0}>
                          <IconButton
                            size="xs"
                            fontSize="md"
                            bg={"white"}
                            color={"red.500"}
                            borderColor="red.500"
                            borderWidth="1px"
                            borderRadius={8}
                            aria-label="Block friend"
                            icon={<MdBlockFlipped />}
                            _hover={{
                              bg: "red.500",
                              color: "white",
                            }}
                            onClick={() => {
                              console.log("block friend");
                              toast({
                                title: "Friend blocked.",
                                description: "We've blocked your friend.",
                                status: "success",
                                duration: 2000,
                                isClosable: true,
                              });
                            }}
                          />
                          <IconButton
                            size="xs"
                            fontSize="md"
                            bg={"pong_cl_primary"}
                            color={"white"}
                            borderRadius={8}
                            aria-label="Remove friend"
                            icon={<HiUserRemove />}
                            _hover={{
                              bg: "white",
                              color: "pong_cl_primary",
                            }}
                            onClick={() => {
                              console.log("remove friend");
                              toast({
                                title: "Friend removed.",
                                description: "We've removed your friend.",
                                status: "success",
                                duration: 2000,
                                isClosable: true,
                              });
                            }}
                          />
                          <IconButton
                            size="xs"
                            fontSize="md"
                            bg={"pong_cl_primary"}
                            color={"white"}
                            borderRadius={8}
                            aria-label="Send game request"
                            icon={<IoGameControllerOutline />}
                            _hover={{
                              bg: "white",
                              color: "pong_cl_primary",
                            }}
                            onClick={() => {
                              console.log("send game request");
                              toast({
                                title: "Game request sent.",
                                description:
                                  "We've sent a game request to your friend.",
                                status: "success",
                                duration: 2000,
                                isClosable: true,
                              });
                            }}
                          />
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