import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef } from "react";

import { Icon, InputGroup } from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface FormData {
  username: string;
  avatar: FileList;
}

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

const DetailsFormModal = ({ isOpen, onClose, onOpen }: any) => {
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

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const onSubmit = (data: any) => {
    console.log("data: ", data);
    toast({
      title: "Profile updated.",
      description: "We've created your account for you.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    reset({
      username: "",
      avatar: undefined,
    });
    // TODO: set user profile_complete to true
    onClose();
    navigate("/");
  };

  // TODO: add validation with yup
  // TODO: add loading state
  // TODO: add error state
  // TODO: add success state
  // TODO: add toast notification and remove toast from onSubmit
  // TODO: upload to cloudinary and save url to db
  // TODO: change color scheme

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref, ...rest } = register("avatar");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />{" "}
      <ModalContent
        // mt={4}
        border="1px solid rgba(251, 102, 19, 0.3)"
        boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
        backdropFilter={"blur(20px)"}
        bgImage={`url('src/assets/img/BlackNoise.png')`}
        bgSize="cover"
        bgRepeat="no-repeat"
        bg="transparent"
        minW={{ base: "350px", sm: "450px", md: "700px" }}
      >
        <ModalHeader>Complete your profile</ModalHeader>
        <ModalCloseButton color="pong_cl_primary" bg={"white"} />
        <ModalBody
          // p={2}
          borderRadius={40}
          // maxH="350px"
          // maxW="400px"
        >
          <Stack
            direction={{ base: "column-reverse", md: "row" }}
            align={{ base: "center", md: "flex-start" }}
            justify="center"
            mt={4}
            spacing={{ base: 4, md: 8 }}
          >
            <Stack
              mt={{ base: 0, md: 4 }}
              spacing={8}
              w={{ base: "full", md: "350px" }}
              align="center"
              justify="center"
            >
              <Stack
                spacing={4}
                w="full"
                h="full"
                align="start"
                justify="start"
              >
                <FormControl isInvalid={!!errors.username} mt={6} isRequired>
                  <FormLabel htmlFor="username" fontSize="lg">
                    Username
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
              </Stack>
              <Button
                colorScheme="orange"
                mr={3}
                // isLoading={isLoading}
                // isLoading={isFetching}
                // isDisabled={isSubmitting}
                cursor="pointer"
                onClick={handleSubmit(onSubmit)}
              >
                Continue
              </Button>
            </Stack>
            <Box>
              <Image
                boxSize={{ base: "300px", md: "350px" }}
                src="src/assets/svgs/complete_profile.svg"
                alt="profile illustration"
                borderRadius={20}
              />
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DetailsFormModal;
