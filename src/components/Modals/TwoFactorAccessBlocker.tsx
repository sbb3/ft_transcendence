import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@chakra-ui/react";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLottie } from "lottie-react";
import animationData from "src/assets/animations/animation_fingerprint.json";

const pinSchema = yup.object().shape({
  pin: yup
    .string()
    .required("Verification code is required")
    .min(6, "Minimum and Maximum length should be 6")
    .trim(),
});

const style = {
  width: "200px",
  color: "orage",
};

const options = {
  loop: true,
  autoplay: true,
  animationData,
};

const TwoFactorAccessBlocker = () => {
  const navigate = useNavigate();
  const { View } = useLottie(options, style);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(pinSchema),
  });

  useEffect(() => {
    // TODO: check if user has 2FA enabled, if yes, redirect to /settings

    onOpen();
  }, [onOpen]);

  const onSubmit = (data: any) => {
    // TODO: send the pin to the server for verification, if correct, redirect close modal, else show error
    console.log("data: ", data);
    toast({
      title: "2FA activated.",
      description: "You can now login with 2FA.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    reset({
      pin: "",
    });
    // closeModal(false);
    // // TODO: set user profile_complete to true
    // onClose();
  };

  // todo: dont allow user to close the modal if 2FA is not verified or close it and redirect to /login

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />{" "}
      <ModalContent
      // bg="green"
      >
        <ModalHeader>Authenticate Your Account </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack
            mt={0}
            spacing={6}
            //  w={{ base: "full", sm: "full", md: 620 }}
          >
            <Flex justifyContent="center" alignItems="center">
              {View}
            </Flex>

            {/* <VStack spacing={3} w={"full"} align={"center"}>
              <Text fontSize="md" fontWeight="semibold">
                Enter the access code generated by your authenticator app.
              </Text>
            </VStack> */}
            <Box w={"full"}>
              <FormControl isInvalid={!!errors.pin} mt={0} isRequired>
                <FormLabel htmlFor="pin" fontSize="lg">
                  Verification Code
                </FormLabel>
                <Controller
                  name="pin"
                  control={control}
                  defaultValue=""
                  render={({ field: { ref, ...restField } }) => (
                    <PinInput
                      size="lg"
                      {...restField}
                      errorBorderColor="red.300"
                      focusBorderColor="orange.300"
                      onComplete={(value) => {
                        // TODO: send the pin to the server for verification
                        console.log(value);
                      }}
                      isInvalid={!!errors.pin}
                    >
                      <PinInputField ref={ref} />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  )}
                />
                {errors?.pin && (
                  <FormErrorMessage>{errors?.pin?.message}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="orange"
            mr={3}
            // isLoading={isLoading}
            // isLoading={isFetching}
            // isDisabled={isSubmitting}
            cursor="pointer"
            onClick={handleSubmit(onSubmit)}
          >
            Let's go
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TwoFactorAccessBlocker;