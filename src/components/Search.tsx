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
import "src/components/Overview/friendsStyles.css";
import { BeatLoader } from "react-spinners";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { faker } from "@faker-js/faker";

{
  /* rollNavigation: when you reach the end of the list, it will roll back to the top */
}

const users = [...Array(30)].map(() => ({
  id: faker.string.uuid(),
  name: faker.internet.userName(),
  avatar: faker.image.avatar(),
}));

const Search = () => {
  const [options, setOptions] = useState<
    { idt: string; name: string; image: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();
  const toast = useToast();

  const fetchOptions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5001/people");
      const data = await response.json();
      console.log("data :", data);
      setOptions(data);
      setIsLoading(false);
    } catch (error) {
      console.log("error :", error);
    }
  };

  useEffect(() => {
    // fetchOptions();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

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
            placeholder="username or email address"
            _placeholder={{
              fontSize: 14,
              letterSpacing: 0.5,
              fontWeight: "light",
              opacity: 0.7,
              color: "gray.500",
            }}
            loadingIcon={<BeatLoader size={8} color="#FF8707" />}
          />
        </InputGroup>

        <AutoCompleteList
          loadingState={<BeatLoader color="#FF8707" />}
          // style={{ backgroundImage: "url('src/assets/img/BlackNoise.png')" }}
          style={{
            borderRadius: "24px",
            border: "1px solid rgba(251, 102, 19, 0.69)",
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
        >
          <ScrollArea.Root className="ScrollAreaRoot">
            <ScrollArea.Viewport className="ScrollAreaViewport">
              {users.map((option, i) => (
                <AutoCompleteItem
                  key={i}
                  value={option}
                  textTransform="capitalize"
                  bg="pong_bg.300"
                  // boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
                  // backdropFilter={"blur(20px)"}
                  // bgImage={`url('src/assets/img/BlackNoise.png')`}
                  // bgSize="cover"
                  // bgRepeat="no-repeat"
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
                    // key={option.id}
                  >
                    <Flex
                      direction="row"
                      gap="3px"
                      align="center"
                      w={"full"}
                      onClick={() => navigate(`/profile/${option.name}`)}
                    >
                      <Avatar
                        size="sm"
                        name={option.name}
                        src={option.image}
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
                        {option.name}
                      </Text>
                    </Flex>
                    {/* <Flex direction='row' gap='6px' mr={}>
										<IconButton size='xs' fontSize="md" bg={'white'} color={'red.500'} borderColor='red.500' borderWidth='1px' borderRadius={8} aria-label='Block friend' icon={<MdBlockFlipped />}
											_hover={{
												bg: "red.500",
												color: "white",
											}}
											onClick={() => {
												console.log('block friend');
												toast({
													title: "Friend blocked.",
													description: "We've blocked your friend.",
													status: "success",
													duration: 2000,
													isClosable: true,
												});
											}}
										/>
										<IconButton size='xs' fontSize="md" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Remove friend' icon={<HiUserRemove />}
											_hover={{
												bg: "white",
												color: "pong_cl_primary",
											}}
											onClick={() => {
												console.log('remove friend');
												toast({
													title: "Friend removed.",
													description: "We've removed your friend.",
													status: "success",
													duration: 2000,
													isClosable: true,
												});
											}}
										/>
										<IconButton size='xs' fontSize="md" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Send game request' icon={<IoGameControllerOutline />}
											_hover={{
												bg: "white",
												color: "pong_cl_primary",
											}}
											onClick={() => {
												console.log('send game request');
												toast({
													title: "Game request sent.",
													description: "We've sent a game request to your friend.",
													status: "success",
													duration: 2000,
													isClosable: true,
												});
											}}
										/>

									</Flex> */}
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
