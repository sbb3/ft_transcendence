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
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { Icon, InputGroup } from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import usersApi from "src/features/users/usersApi";
import { useSelector } from "react-redux";

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
    .test("fileRequired", "File is required", (files) => {
      console.log("files: ", files);
      return files && files?.length > 0;
    })
    .test("fileSize", "Max file size is 3mb!", (files) => {
      return files && files[0]?.size <= 3000000; // 3mb
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

const ProfileDetailsFormModal = ({ isOpen, onToggle }: any) => {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [triggerGetCurrentUser, { isLoading: isLoadingGetCurrentUser }] =
    usersApi.useLazyGetCurrentUserQuery();

  const [checkProfileCompleted] = usersApi.useCheckProfileCompletedMutation();

  const [updateUserSettings] = usersApi.useUpdateUserSettingsMutation();

  const onUpdateProfileDetails = async (data: any) => {
    console.log("onUpdateProfileDetails data: ", data);
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("avatar", data.avatar[0]);
    try {
      // await updateUserSettings({
      //   id: currentUser?.id,
      //   data: formData,
      // }).unwrap();
      // await checkProfileCompleted(currentUser?.id).unwrap();
      onToggle();
      toast({
        title: "Profile updated.",
        description: "Profile updated successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      reset({
        username: "",
        avatar: undefined,
      });
    } catch (error) {
      console.log("error: ", error);
      toast({
        title: "Error.",
        description: error?.data?.message || "Something went wrong.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref, ...rest } = register("avatar");

  return (
    <Modal isOpen={isOpen} onClose={onToggle}>
      <ModalOverlay onClick={onToggle} />
      <ModalContent
        border="1px solid rgba(251, 102, 19, 0.3)"
        boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
        backdropFilter={"blur(20px)"}
        bgImage={`url('src/assets/img/BlackNoise.png')`}
        bgSize="cover"
        bgRepeat="no-repeat"
        bg="transparent"
        minW={{ base: "350px", sm: "450px", md: "700px" }}
      >
        <ModalHeader>Complete your profile</ModalHeader>
        <ModalCloseButton
          color="pong_cl_primary"
          bg={"white"}
          onClick={onToggle}
        />
        <ModalBody borderRadius={40}>
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
                <FormControl isInvalid={!!errors.username} mt={6}>
                  <FormLabel htmlFor="username" fontSize="lg">
                    Username
                  </FormLabel>
                  <Input
                    id="username"
                    type="text"
                    placeholder="username"
                    {...(register("username") as any)}
                  />
                  <FormErrorMessage>
                    {errors.username && errors.username.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.avatar}>
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
                w="full"
                letterSpacing={2}
                colorScheme="orange"
                mr={3}
                isLoading={isLoadingGetCurrentUser}
                isDisabled={isLoadingGetCurrentUser}
                cursor="pointer"
                onClick={handleSubmit(onUpdateProfileDetails)}
              >
                Save
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

export default ProfileDetailsFormModal;
