import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Flex,
  InputGroup,
  InputLeftElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { BeatLoader } from "react-spinners";
import { faker } from "@faker-js/faker";
import { useGetUsersQuery } from "src/features/users/usersApi";

// const users = [...Array(30)].map(() => ({
//   id: faker.string.uuid(),
//   name: faker.person.firstName() + " " + faker.person.lastName(),
//   username: faker.internet.userName(),
//   status: faker.helpers.arrayElement(["online", "offline", "in-game"]),
//   avatar: faker.image.avatar(),
//   email: faker.internet.email(),
//   campus: faker.location.city(),
//   gameWin: faker.number.int(50),
//   gameLoss: faker.number.int(40),
//   rank: faker.number.int(100),
//   level: faker.number.int(50),
// }));

const Search = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState("");

  const {
    data: users,
    isLoading,
    isError,
  } = useGetUsersQuery({
    refetchOnMountOrArgChange: true,
  });

  return (
    <Flex
      direction="row"
      align="center"
      justify="center"
      // gap={2}
      // outline="2px solid yellow"
    >
      <AutoComplete
        isLoading={isLoading}
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
            onChange={(e) => setQuery(e.target.value)}
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
            borderRadius: "24px",
            border: "1px solid rgba(251, 102, 19, 0.39)",
            boxShadow: "0px 4px 24px -1px rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(20px)",
            backgroundImage: "url('src/assets/img/BlackNoise.png')",
            bgSize: "cover",
            bgRepeat: "no-repeat",
            backgroundColor: "transparent",
          }}
          closeOnSelect={false}
          p={1}
          mr={2}
          w="full"
        >
          <ScrollArea.Root
            style={{
              width: "100%",
              height: "100px",
            }}
            className="ScrollAreaRoot"
          >
            <ScrollArea.Viewport className="ScrollAreaViewport">
              {users?.map((user, i) => (
                <AutoCompleteItem
                  key={i}
                  value={user.name}
                  textTransform="capitalize"
                  bg="transparent"
                  borderRadius={8}
                  my={1}
                  _hover={{
                    bg: "pong_bg.500",
                  }}
                  _focus={{
                    backgroundColor: "transparent",
                  }}
                  _selected={{
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
                      onClick={() => {
                        setQuery("");
                        navigate(`/profile/${user.name}`, {
                          state: { user },
                        });
                      }}
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
