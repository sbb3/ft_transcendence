import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Popover,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverTrigger,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  AccordionIcon,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useEffect, useState } from "react";
import { MdGroupAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { useGetAllChannelsQuery } from "src/features/channels/channelsApi";
import { useSelector } from "react-redux";
import { useUpdateChannelMutation } from "src/features/channels/channelsApi";
const SearchForChannel = ({
  isOpenSearchChannel,
  onToggleSearchChannel,
}: {
  isOpenSearchChannel: boolean;
  onToggleSearchChannel: () => void;
}) => {
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState("");
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const toast = useToast();
  const navigate = useNavigate();
  const {
    data: channels,
    isLoading,
    error,
  } = useGetAllChannelsQuery({
    refetchOnMountOrArgChange: true,
  });

  const [updateChannel, { isLoading: isLoadingUpdateChannel }] =
    useUpdateChannelMutation();

  const clearStates = () => {
    setPassword("");
    setShowPasswordInput("");
  };
  const handleJoinChannel = async (channel) => {
    // TODO:  (password === channel.password) must be handled in the backend, add checkPassword query endpoint to channelsApi.tsx
    if (channel?.members?.includes(currentUser?.id)) {
      toast({
        title: "Already a member.",
        description: "You're already a member of this channel.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    if (channel.privacy === "private" && password !== channel.password) {
      toast({
        title: "Wrong password.",
        description: "Please enter the correct password.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    await updateChannel({
      id: channel.id,
      data: {
        members: [...channel.members, currentUser?.id],
      },
    });

    clearStates();
    // onToggleSearchChannel();
    // navigate(`/chat/channels/${channel.name}`);
    toast({
      title: "joined channel.",
      description: "You've joined the channel.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpenSearchChannel}
        onClose={onToggleSearchChannel}
        closeOnEsc={true}
        closeOnOverlayClick={true}
      >
        <ModalOverlay />
        <ModalContent
          borderRadius={40}
          // maxH="350px"
          // maxW={{ base: "full", sm: "350px", md: 450 }}
          maxW={{ base: "350px", lg: "450px" }}
          mt={4}
          border="1px solid rgba(251, 102, 19, 0.3)"
          boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
          backdropFilter={"blur(20px)"}
          bgImage={`url('src/assets/img/BlackNoise.png')`}
          bgSize="cover"
          bgRepeat="no-repeat"
          bg="transparent"
          //   w={{ base: "full", sm: "full", md: 820 }}
        >
          <ModalHeader>Search for a channel</ModalHeader>
          <ModalCloseButton onClick={onToggleSearchChannel} />
          <ModalBody p={2} borderRadius={40}>
            <Stack direction={"column"} p={4}>
              <Stack
                pos="relative"
                direction="column"
                align="start"
                justify="start"
                gap={1.5}
                // bg={"red.400"}
                h={"420px"}
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
                      border: "1px solid rgba(251, 102, 19, 0.39)",
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
                    // p={1}
                    w="full"
                    // outline="2px solid green"
                    // ml={0}
                  >
                    <ScrollArea.Root className="ScrollAreaRoot">
                      <ScrollArea.Viewport className="ScrollAreaViewport">
                        {channels?.length > 0 ? (
                          channels?.map((channel, i) => (
                            <AutoCompleteItem
                              key={channel.id}
                              value={channel.name}
                              textTransform="capitalize"
                              // bg="pong_bg.300"
                              boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
                              backdropFilter={"blur(20px)"}
                              bgImage={`url('src/assets/img/BlackNoise.png')`}
                              bgSize="cover"
                              bgRepeat="no-repeat"
                              borderRadius={5}
                              // my={1}
                              _hover={{
                                bg: "transparent",
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
                                // bg="yellow.400"
                              >
                                <Stack
                                  w="full"
                                  direction="column"
                                  justify={"start"}
                                  align="start"
                                  spacing={1}
                                  // bg="green.400"
                                >
                                  <Flex
                                    w="full"
                                    direction="row"
                                    justify="space-between"
                                    align="center"
                                    gap={3}
                                    // bg="red.400"
                                  >
                                    <Text
                                      color="white"
                                      fontSize="14px"
                                      fontWeight="medium"
                                      ml={2}
                                      flex={1}
                                      // bg="red.500"
                                    >
                                      {channel.name}
                                    </Text>
                                    {!channel?.members?.includes(
                                      currentUser?.id
                                    ) && (
                                      <IconButton
                                        aria-label="Join channel"
                                        size="sm"
                                        fontSize="lg"
                                        bg={"pong_cl_primary"}
                                        color={"white"}
                                        borderColor="red.500"
                                        borderWidth="1px"
                                        borderRadius={8}
                                        icon={<MdGroupAdd />}
                                        _hover={{
                                          bg: "white",
                                          color: "pong_cl_primary",
                                        }}
                                        isLoading={isLoadingUpdateChannel}
                                        // onClick={handleJoinChannel}
                                        onClick={() => {
                                          if (channel.privacy === "public") {
                                            handleJoinChannel(channel);
                                          } else if (
                                            channel.privacy === "private" &&
                                            password === ""
                                          ) {
                                            setShowPasswordInput(channel.id);
                                          } else if (
                                            channel.privacy === "private" &&
                                            password !== ""
                                          ) {
                                            handleJoinChannel(channel);
                                          }
                                        }}
                                      />
                                    )}
                                  </Flex>

                                  <Box
                                    w="full"
                                    display={
                                      channel.privacy === "private" &&
                                      showPasswordInput === channel.id
                                        ? "block"
                                        : "none"
                                    }
                                  >
                                    <Input
                                      id="passowrd"
                                      type="passowrd"
                                      placeholder="Private channel password"
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                      value={password}
                                    />
                                  </Box>
                                </Stack>
                              </Flex>
                            </AutoCompleteItem>
                          ))
                        ) : (
                          <Flex
                            justify="center"
                            align="center"
                            h="100%"
                            w="100%"
                            color="white"
                            fontSize="xl"
                            fontWeight="semibold"
                          >
                            <Text
                              fontSize="md"
                              fontWeight="normal"
                              color="whiteAlpha.500"
                            >
                              No channels yet !
                            </Text>
                          </Flex>
                        )}
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
              onClick={onToggleSearchChannel}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchForChannel;
