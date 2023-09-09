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
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
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
import { MdBlockFlipped, MdGroupAdd } from "react-icons/md";
import { IoGameControllerOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/pages/Chat/scrollbar.css";
import { faker } from "@faker-js/faker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const channels = [...Array(30)].map(() => ({
  id: faker.string.uuid(),
  name: faker.internet.userName(),
}));

const SearchForChannel = ({
  isOpen,
  onClose,
  onOpen,
  setIsSearchForChannelOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  setIsSearchForChannelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const toast = useToast();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setIsSearchForChannelOpen(false);
      }}
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent
        // bg="green"
        borderRadius={40}
        // maxH="350px"
        // maxW={{ base: "full", sm: "350px", md: 450 }}
        maxW={{ base: "350px", lg: "450px" }}
        mt={4}
        border="1px solid rgba(251, 102, 19, 0.3)"
        boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
        backdropFilter={"blur(20px)"}
        bgImage={`url('src/assets/img/BlackNoise.png')`}
        bgSize="cover"
        bgRepeat="no-repeat"
        bg="transparent"
        //   w={{ base: "full", sm: "full", md: 820 }}
      >
        <ModalHeader>#general</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={2} borderRadius={40}>
          <Stack
            direction={"column"}
            // bg={"red.800"}
            // h={"420px"}
            //   pr={2}
            p={4}
          >
            <Stack
              pos="relative"
              direction="column"
              align="start"
              justify="start"
              gap={1.5}
              //   bg={"red.400"}
              h={"420px"}
              //   pr={2}
            >
              <AutoComplete
                as={Stack}
                rollNavigation
                isLoading={isLoading}
                openOnFocus
                defaultIsOpen={true}
                listAllValuesOnFocus
                closeOnSelect={false}
                flip={false}
              >
                <InputGroup id="inputGroup" mr={4}>
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
                  />
                </InputGroup>
                <AutoCompleteList
                  style={{
                    borderRadius: "24px",
                    border: "1px solid rgba(251, 102, 19, 0.69)",
                    boxShadow: "0px 4px 24px -1px rgba(0, 0, 0, 0.25)",
                    backdropFilter: "blur(20px)",
                    backgroundImage: "url('src/assets/img/BlackNoise.png')",
                    bgSize: "cover",
                    bgRepeat: "no-repeat",
                    backgroundColor: "transparent",
                    position: "absolute",
                    display: "block",
                    marginTop: "8px",
                    // marginRight: "4px",
                    // transform: "translate3d(20px, 40px, 0px)",
                  }}
                  closeOnSelect={false}
                  p={1}
                  mr={2}
                >
                  <ScrollArea.Root className="ScrollAreaRoot">
                    <ScrollArea.Viewport className="ScrollAreaViewport">
                      {channels.map((channel, i) => (
                        <AutoCompleteItem
                          key={i}
                          value={channel.name}
                          textTransform="capitalize"
                          // bg="pong_bg.300"
                          boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
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
                              //   onClick={() => navigate(`/channel/${channel.name}`)}
                            >
                              <Text
                                color="white"
                                fontSize="14px"
                                fontWeight="medium"
                                ml={2}
                                flex={1}
                              >
                                {channel.name}
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
                                aria-label="Join channel"
                                icon={<MdGroupAdd />}
                                _hover={{
                                  bg: "red.500",
                                  color: "white",
                                }}
                                onClick={() => {
                                  console.log("join channel");
                                  toast({
                                    title: "joined channel.",
                                    description: "You've joined the channel.",
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
        </ModalBody>

        <ModalFooter p={2}>
          <Button
            bg={"white"}
            color={"orange.500"}
            letterSpacing={1}
            mr={3}
            onClick={() => {
              onClose();
              setIsSearchForChannelOpen(false);
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SearchForChannel;
