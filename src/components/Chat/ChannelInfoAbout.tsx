import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { AiFillDelete } from "react-icons/ai";
import Members from "./Members";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Minimum length should be 3")
    .max(20, "Maximum length should be 20")
    .trim(),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Minimum length should be 10")
    .max(100, "Maximum length should be 100")
    .trim(),
  privacy: yup.string().required("Privacy is required"),
  password: yup.string().when("privacy", {
    is: "private",
    then(schema) {
      return schema
        .required("Password is required")
        .min(6, "Minimum length should be 6")
        .max(20, "Maximum length should be 20")
        .trim();
    },
  }),
});

const ChannelInfoAbout = ({
  isOpen,
  onOpen,
  onClose,
  setIsChannelInfoOpen,
}) => {
  const [isPrivate, setIsPrivate] = useState(false);
  const passRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const onSubmit = (data: any) => {
    console.log("data: ", data);
    reset({
      name: "",
      description: "",
      password: "",
      privacy: "public",
    });
    if (isPrivate) setIsPrivate(false);
    onClose();
    setIsChannelInfoOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setIsChannelInfoOpen(false);
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
          maxW={{ base: "350px", lg: "550px" }}
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
              mt={0}
              spacing={4}
              //  w={{ base: "full", sm: "full", md: 620 }}
              align="center"
              borderRadius={40}
              pl={3}
              pr={2}
              w="full"
            >
              <Flex
                direction="row"
                align="center"
                justify="center"
                mt={4}
                w="full"
              >
                <Tabs
                  variant="soft-rounded"
                  colorScheme="orange"
                  align="center"
                  isFitted
                  isLazy
                  w="full"
                >
                  <TabList>
                    <Tab
                      _selected={{ color: "white", bg: "orange.500" }}
                      _focus={{ boxShadow: "none" }}
                      _hover={{ color: "orange.500", bg: "white" }}
                      borderRadius={40}
                      letterSpacing={1}
                      fontSize="md"
                      fontWeight="bold"
                      px={4}
                      py={2}
                      mr={2}
                    >
                      About
                    </Tab>
                    <Tab
                      _selected={{ color: "white", bg: "orange.500" }}
                      _focus={{ boxShadow: "none" }}
                      _hover={{ color: "orange.500", bg: "white" }}
                      borderRadius={40}
                      letterSpacing={1}
                      fontSize="md"
                      fontWeight="bold"
                      px={4}
                      py={2}
                      mr={2}
                    >
                      Members
                    </Tab>
                    <Tab
                      _selected={{ color: "white", bg: "orange.500" }}
                      _focus={{ boxShadow: "none" }}
                      _hover={{ color: "orange.500", bg: "white" }}
                      borderRadius={40}
                      letterSpacing={1}
                      fontSize="md"
                      fontWeight="bold"
                      px={4}
                      py={2}
                      mr={2}
                    >
                      Settings
                    </Tab>
                  </TabList>
                  <TabPanels
                    //   bg="yellow"
                    p={0}
                  >
                    <TabPanel>
                      <Stack
                        mt={0}
                        spacing={4}
                        //  w={{ base: "full", sm: "full", md: 620 }}
                        align="center"
                        justify="center"
                        borderRadius={40}
                        // bg="red"
                        // pl={3}
                        // pr={2}
                        p={2}
                      >
                        <Stack spacing={1} align="start" w="full">
                          <Text
                            fontSize="18px"
                            fontWeight="medium"
                            color="whiteAlpha.600"
                          >
                            Description
                          </Text>
                          <Text
                            fontSize="14px"
                            fontWeight="medium"
                            color="whiteAlpha.900"
                            ml={2}
                            textAlign={"start"}
                          >
                            A place for general discussions about anything and
                            everything. Feel free to introduce yourself, ask
                            questions, and share your thoughts.
                          </Text>
                        </Stack>
                        <Stack spacing={2} align="start" w="full">
                          <Text
                            fontSize="18px"
                            fontWeight="medium"
                            color="whiteAlpha.600"
                          >
                            Managed by
                          </Text>
                          <List
                            spacing={2}
                            flexWrap="wrap"
                            w="full"
                            textAlign={"start"}
                          >
                            <ListItem ml={2}>larbi</ListItem>
                            <ListItem ml={2}>Imane</ListItem>
                            <ListItem ml={2}>Anas</ListItem>
                          </List>
                        </Stack>
                        <Stack spacing={1} align="start" w="full">
                          <Text
                            fontSize="18px"
                            fontWeight="medium"
                            color="whiteAlpha.600"
                          >
                            Created by
                          </Text>
                          <Text
                            fontSize="14px"
                            fontWeight="medium"
                            color="pong_cl_primary"
                            ml={2}
                          >
                            Anas on August 22, 2023
                          </Text>
                        </Stack>
                        <Flex
                          direction="row"
                          align="center"
                          justify="start"
                          w="full"
                          gap={4}
                        >
                          <IconButton
                            aria-label="Leave channel"
                            icon={<Icon as={ImExit} boxSize={6} />}
                            colorScheme="red"
                            // variant="outline"
                            borderRadius={10}
                          />
                          <IconButton
                            aria-label="Delete channel"
                            icon={<Icon as={AiFillDelete} boxSize={6} />}
                            colorScheme="red"
                            // variant="outline"
                            borderRadius={10}
                          />
                        </Flex>
                      </Stack>
                    </TabPanel>
                    <TabPanel
                    // overflow={"auto"}
                    //  bg={"red.200"}
                    >
                      {/* <Stack
                        mt={0}
                        spacing={4}
                        //  w={{ base: "full", sm: "full", md: 620 }}
                        align="center"
                        justify="center"
                        borderRadius={40}
                        // bg="red"
                        // pl={3}
                        // pr={2}
                        p={2}
                      >
                        lopez
                      </Stack> */}
                      <Members />
                    </TabPanel>
                    <TabPanel>
                      <Stack
                        mt={0}
                        spacing={4}
                        //  w={{ base: "full", sm: "full", md: 620 }}
                        align="center"
                        justify="center"
                        borderRadius={40}
                        // bg="red"
                        // pl={3}
                        // pr={2}
                        p={2}
                      >
                        <FormControl
                          isInvalid={!!errors.name}
                          mt={0}
                          isRequired
                        >
                          <FormLabel htmlFor="name" fontSize="lg">
                            Name
                          </FormLabel>
                          <Input
                            id="name"
                            type="text"
                            placeholder="Channel name"
                            {...register("name")}
                          />
                          {/* {errors?.name && (
                  <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
                )} */}
                          <FormErrorMessage>
                            {errors.name && errors.name.message}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={!!errors.name}
                          mt={0}
                          isRequired
                        >
                          <FormLabel htmlFor="description" fontSize="lg">
                            Description
                          </FormLabel>
                          <Textarea
                            placeholder="Brief description of the channel's purpose or topic"
                            {...register("description")}
                            resize={"none"}
                            size={"md"}
                          />
                          <FormErrorMessage>
                            {errors.description && errors.description.message}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={!!errors.privacy}
                          mt={0}
                          isRequired
                        >
                          <FormLabel htmlFor="privacy" fontSize="lg">
                            Privacy Settings
                          </FormLabel>
                          <Controller
                            name="privacy"
                            control={control}
                            defaultValue="public"
                            render={({ field }) => (
                              <RadioGroup
                                {...field}
                                onChange={(inputValue) => {
                                  //   console.log("e: ", inputValue);
                                  //   console.log("field: ", field);
                                  field.onChange(inputValue);
                                  setIsPrivate(inputValue === "private");
                                }}
                              >
                                <Stack direction="row">
                                  <Radio colorScheme={"orange"} value="public">
                                    Public
                                  </Radio>
                                  <Radio colorScheme={"orange"} value="private">
                                    Private
                                  </Radio>
                                </Stack>
                              </RadioGroup>
                            )}
                          />
                          <FormErrorMessage>
                            {errors.privacy && errors.privacy.message}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={!!errors.password}
                          mt={0}
                          display={isPrivate ? "block" : "none"}
                          ref={passRef}
                          isRequired
                        >
                          <FormLabel htmlFor="password" fontSize="lg">
                            Password
                          </FormLabel>
                          <Input
                            type="password"
                            placeholder="Channel password"
                            {...register("password")}
                          />
                          <FormErrorMessage>
                            {errors.password && errors.password.message}
                          </FormErrorMessage>
                        </FormControl>
                        <Button
                          bg={"orange.500"}
                          color={"white"}
                          mt={3}
                          w={"full"}
                          letterSpacing={1}
                          // isLoading={isLoading}
                          // isLoading={isFetching}
                          // isDisabled={isSubmitting}
                          cursor="pointer"
                          onClick={handleSubmit(onSubmit)}
                          _hover={{
                            bg: "orange.400",
                          }}
                          _active={{
                            bg: "orange.400",
                          }}
                          _focus={{
                            bg: "orange.400",
                            boxShadow: "none",
                          }}
                        >
                          Save
                        </Button>
                      </Stack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Flex>
            </Stack>
          </ModalBody>

          <ModalFooter p={4}>
            <Button
              bg={"white"}
              color={"orange.500"}
              letterSpacing={1}
              mr={3}
              onClick={() => {
                onClose();
                setIsChannelInfoOpen(false);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChannelInfoAbout;
