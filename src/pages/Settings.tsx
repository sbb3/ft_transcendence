import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Switch,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef, useState } from "react";

import { Icon, InputGroup } from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import useTitle from "src/hooks/useTitle";

// TODO: export validationSchema to a separate file
const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Minimum length should be 3")
    .max(20, "Maximum length should be 20")
    .trim(),
  avatar: yup
    .mixed()
    .required("Avatar is required")
    // .test("fileRequired", "File is required", (value) => {
    //   return value && value[0]?.length > 0;
    // })
    .test("fileSize", "Come on dude! Max file size is 5mb!", (value) => {
      return value && value[0]?.size <= 2000000;
    })
    .test("fileFormat", "Only jpg, jpeg, png are accepted", (value) => {
      return (
        value &&
        (value[0]?.type === "image/jpg" ||
          value[0]?.type === "image/jpeg" ||
          value[0]?.type === "image/png")
      );
    }),
});

const Settings = () => {
  useTitle("Settings");
  const [otp_enabled, setOtp_enabled] = useState<boolean>(false);
  const navigate = useNavigate();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: any) => {
    console.log("data: ", data);
    toast({
      title: "Settings updated.",
      description: "We've updated your settings.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    reset({
      username: "",
      avatar: undefined,
    });
    // closeModal(false);
    // // TODO: set user profile_complete to true
    // onClose();
    navigate("/play");
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref, ...rest } = register("avatar");

  return (
    <>
      <Stack spacing={8} direction="column">
        <Box>
          <Image
            src="src/assets/svgs/account_settings.svg"
            alt="profile illustration"
            borderRadius={20}
          />
        </Box>
        <Flex flexDirection={"column"} alignItems="start">
          <Heading>Account Settings</Heading>
          <Flex flexDirection={"column"} alignItems="start">
            <FormControl display={"flex"} alignItems={"center"}>
              <FormLabel htmlFor="'2fa" mb={"0"}>
                Turn on 2 steps authentication
              </FormLabel>
              <Switch
                id="2fa"
                colorScheme="orange"
                isChecked={otp_enabled}
                onChange={() => {
                  //  TODO: set user otp_enabled to true or false in db
                  //   TODO: update the user otp_enabled state in redux, by dispatching an action or invalidate the user query cache and refetch it
                  if (otp_enabled) {
                    console.log("otp_enabled: ", otp_enabled, "set to false");
                    // TODO: set user otp_enabled to false in db, then remove the already generated secret key from db,, refetch the user query
                    setOtp_enabled(false);
                  } else {
                    console.log("otp_enabled: ", otp_enabled, "set to true");
                    // TODO: set user otp_enabled to true in db, THEN generate a secret key and save it in db, then the modal, then show a QR code to the user
                    setOtp_enabled(true);
                  }
                }}
              />
            </FormControl>
            <VStack spacing={6} w={"full"}>
              <FormControl isInvalid={!!errors.username} mt={6} isRequired>
                <FormLabel htmlFor="username" fontSize="lg">
                  Username
                </FormLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  {...register("username", {
                    required: "This is required",
                    minLength: {
                      value: 3,
                      message: "Minimum length should be 3",
                    },
                    maxLength: {
                      value: 20,
                      message: "Maximum length should be 20",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.avatar} isRequired>
                <FormLabel htmlFor="avatar" fontSize="lg">
                  Avatar
                </FormLabel>
                <InputGroup onClick={() => inputRef.current?.click()}>
                  <Input
                    id="avatar"
                    type="file"
                    hidden
                    accept="image/*"
                    {...rest}
                    ref={(e) => {
                      ref(e);
                      inputRef.current = e;
                    }}
                  />
                  <Button leftIcon={<Icon as={FiFile} />}>Upload</Button>
                </InputGroup>

                <FormErrorMessage>
                  {errors.avatar && errors?.avatar.message}
                </FormErrorMessage>
              </FormControl>
            </VStack>
          </Flex>
        </Flex>
      </Stack>
    </>
  );
};

export default Settings;
