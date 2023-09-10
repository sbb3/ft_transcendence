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
import { faker } from "@faker-js/faker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// TODO: add member to channel only if the user is an admin or owner
const members = [...Array(30)].map(() => ({
  id: faker.string.uuid(),
  name: faker.internet.userName(),
  avatar: faker.image.avatar(),
}));

const validationSchema = yup.object().shape({
  username: yup.string().required("Username is required").trim(),
  permissions: yup.string().required("Permissions is required").trim(),
});

const Members = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
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

  const onSubmit = (data: any) => {
    console.log("data: ", data);
    toast({
      title: "Member added.",
      description: "We've added a new member to the channel.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    reset({
      username: "",
      permissions: "member",
    });
  };

  useEffect(() => {}, []);
  return (
    <Stack
      direction={{ base: "column" }}
      spacing="24px"
      w={{ base: "350px", lg: "450px" }}
      h={{ base: "full" }}
      p={{ base: 4, md: 6 }}
      borderRadius={24}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
      // outline="2px solid yellow"
      // borderRadius={24}
      //   bg={"yellow"}
    >
      <Flex direction="row" align="center" justify="center" gap={1.5}>
        <Icon boxSize="22px" as={GiThreeFriends} color="white" />
        <Text
          fontSize="20px"
          fontWeight="semibold"
          color="whiteAlpha.900"
          letterSpacing={1}
        >
          Members
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
            Members
          </Text>
          <AvatarGroup size="sm" max={4} color={"pong_bg_primary"}>
            {members.map((member, i) => (
              <Avatar
                key={i}
                bg="pong_bg_secondary"
                p={0.5}
                ml={2}
                name={member.name}
                src={"https://bit.ly/ryan-florence"}
              />
            ))}
          </AvatarGroup>
        </Flex>
      </Flex>
      <Stack direction="column" justify="start" align="center" spacing={5}>
        <FormControl isInvalid={!!errors.username} mt={0}>
          <FormLabel htmlFor="username" fontSize="lg">
            Add a member
          </FormLabel>
          <Input
            id="username"
            type="text"
            placeholder="username"
            {...register("username")}
          />
          <FormErrorMessage>
            {errors.username && errors.username.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.permissions} mt={0} isRequired>
          <FormLabel htmlFor="permissions" fontSize="lg">
            Member Permissions
          </FormLabel>
          <Controller
            name="permissions"
            control={control}
            defaultValue="member"
            render={({ field }) => (
              <Select
                {...field}
                onChange={(inputValue) => {
                  //   console.log("e: ", inputValue);
                  //   console.log("field: ", field);
                  field.onChange(inputValue);
                  // setIsPrivate(inputValue === "private");
                }}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </Select>
            )}
          />
          <FormErrorMessage>
            {errors.permissions && errors.permissions.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="orange"
          mt={0}
          w="full"
          // isLoading={isLoading}
          // isLoading={isFetching}
          // isDisabled={isSubmitting}
          cursor="pointer"
          onClick={handleSubmit(onSubmit)}
        >
          Add
        </Button>
      </Stack>
      <Stack direction={"column"}>
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
              p={1}
              mr={2}
            >
              <ScrollArea.Root className="ScrollAreaRoot">
                <ScrollArea.Viewport className="ScrollAreaViewport">
                  {members.map((member, i) => (
                    <AutoCompleteItem
                      key={i}
                      value={member}
                      textTransform="capitalize"
                      // bg="pong_bg.300"
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
                          onClick={() => navigate(`/profile/${member.name}`)}
                        >
                          <Avatar
                            size="sm"
                            name={member.name}
                            src={member.avatar}
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
                            {member.name}
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
                            aria-label="Remove member"
                            icon={<HiUserRemove />}
                            _hover={{
                              bg: "red.500",
                              color: "white",
                            }}
                            onClick={() => {
                              console.log("delete member");
                              toast({
                                title: "Member removed.",
                                description: "Member removed from the group.",
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
    </Stack>
  );
};

export default Members;
