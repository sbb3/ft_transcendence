import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Box,
  Flex,
  Icon,
  IconButton,
  Image,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  Link,
  useToast,
  useDisclosure,
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
import { FiMessageSquare } from "react-icons/fi";
import { HiUserRemove } from "react-icons/hi";
import { MdBlockFlipped } from "react-icons/md";
import { IoGameControllerOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { BeatLoader } from "react-spinners";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
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

const Search = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {}, []);

  return (
    <Flex
      direction="row"
      align="center"
      justify="center"
      // gap={2}
      // outline="2px solid yellow"
    >
      <AutoComplete
        // isLoading={isLoading}
        openOnFocus
        listAllValuesOnFocus
        closeOnSelect={true}
        flip={false}
      >
        <InputGroup mr={4}>
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
            borderRadius="50%"
            cursor="pointer"
          />
          <AutoCompleteInput
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            value={query}
            ml={2}
            flex={1}
            variant="filled"
            bg="pong_bg.400"
            type="text"
            color="white"
            placeholder="Search for a player"
            _placeholder={{
              fontSize: 12,
              letterSpacing: 0.5,
              fontWeight: "light",
              opacity: 0.7,
              color: "gray.400",
            }}
            loadingIcon={<BeatLoader size={8} color="#FF8707" />}
          />
        </InputGroup>

        <AutoCompleteList
          loadingState={<BeatLoader color="#FF8707" />}
          // style={{ backgroundImage: "url('src/assets/img/BlackNoise.png')" }}
          style={{
            borderRadius: "8px",
            border: "1px solid rgba(251, 102, 19, 0.69)",
            boxShadow: "0px 4px 24px -1px rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(20px)",
            backgroundImage: "url('src/assets/img/BlackNoise.png')",
            bgSize: "cover",
            bgRepeat: "no-repeat",
            backgroundColor: "#333333",
            // minHeight: "440px",
            display: "block",
            marginTop: "4px",
            padding: "0px",
          }}
          closeOnSelect={false}
          p={1}
          mr={2}
        >
          <ScrollArea.Root
            style={{
              width: "100%",
              height: "100px",
            }}
            className="ScrollAreaRoot"
          >
            <ScrollArea.Viewport className="ScrollAreaViewport">
              {users.map((user, i) => (
                <AutoCompleteItem
                  key={i}
                  value={user.name}
                  textTransform="capitalize"
                  bg="pong_bg.300"
                  borderRadius={8}
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
                    // key={user.id}
                  >
                    <Flex
                      direction="row"
                      gap="3px"
                      align="center"
                      w={"full"}
                      onClick={() =>
                        navigate(`/profile/${user.name}`, {
                          state: { user },
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
                  </Flex>
                </AutoCompleteItem>
              ))}
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
    </Flex>
  );
};

export default Search;
