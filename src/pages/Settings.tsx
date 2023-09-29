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
  Stack,
  Switch,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { Icon, InputGroup } from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import useTitle from "src/hooks/useTitle";
import TwoFactorActivation from "src/components/Modals/TwoFactorActivation";
import { useSelector } from "react-redux";
import usersApi, {
  useUpdateUserSettingsMutation,
  useDisableOTPMutation,
} from "src/features/users/usersApi";

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

const Settings = () => {
  useTitle("Settings");
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const { isOpen: is2FAModalOpen, onToggle: onToggle2FAModal } = useDisclosure({
    defaultIsOpen: false,
  });
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref, ...rest } = register("avatar");

  const [triggerGetCurrentUser, { isLoading: isLoadingGetCurrentUser }] =
    usersApi.useLazyGetCurrentUserQuery();

  const [updateUserSettings, { isLoading: isUpdating }] =
    useUpdateUserSettingsMutation();

  const [disableOTP, { isLoading: isDisablingOTP }] = useDisableOTPMutation();

  const onUpdateSettings = async (data: any) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("avatar", data.avatar[0]);
    try {
      await updateUserSettings({
        id: currentUser?.id,
        data: formData,
      }).unwrap();
      toast({
        title: "Settings updated.",
        description: "Settings updated successfully.",
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

  const handleDisableOTP = async () => {
    try {
      await disableOTP(currentUser?.id).unwrap(); // refetch currentUser after await onQueryFullfilled to update otp_enabled
      await triggerGetCurrentUser(currentUser?.id);
      // TODO: pass the refetch function in the state to update the currentUser
      toast({
        title: "2FA disabled.",
        description: "You can now login without 2FA.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.log("error: ", error);
      toast({
        title: "Error.",
        description:
          error?.data?.message || "Something went wrong while disabling 2FA.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Stack
      spacing={18}
      direction={{ base: "column-reverse", md: "row" }}
      p={8}
      borderRadius={24}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <Flex flexDirection={"column"} alignItems="start" gap={8}>
        <Heading>Account Settings</Heading>
        <Flex flexDirection={"column"} alignItems="start" gap={2}>
          <FormControl display={"flex"} alignItems={"center"}>
            <FormLabel htmlFor="'2fa" mb={"0"}>
              Turn on 2 steps authentication
            </FormLabel>
            <Switch
              id="2fa"
              colorScheme="orange"
              isChecked={currentUser?.otp_enabled}
              onChange={(e) => {
                if (e.target.checked === true) {
                  onToggle2FAModal();
                }
                if (e.target.checked === false) {
                  handleDisableOTP();
                }
              }}
            />
          </FormControl>
          {is2FAModalOpen && (
            <TwoFactorActivation
              isOpen={is2FAModalOpen}
              onToggle={onToggle2FAModal}
            />
          )}
          <VStack spacing={4} w={"full"}>
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
                    // console.log("e: ", e);
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
          <Flex w={"full"} justify={"flex-end"} align={"center"} mt={8}>
            <Button
              colorScheme="orange"
              mr={3}
              px={8}
              isLoading={
                isUpdating || isDisablingOTP || isLoadingGetCurrentUser
              }
              isDisabled={
                isUpdating || isDisablingOTP || isLoadingGetCurrentUser
              }
              cursor="pointer"
              onClick={handleSubmit(onUpdateSettings)}
            >
              Save
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Box>
        <Image
          src="src/assets/svgs/account_settings.svg"
          alt="profile illustration"
          borderRadius={20}
        />
      </Box>
    </Stack>
  );
};

export default Settings;
