import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
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
  PinInput,
  PinInputField,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import QRCode from "qrcode";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef, useState } from "react";

import { Icon, InputGroup } from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const pinSchema = yup.object().shape({
  pin: yup
    .string()
    .required("Verification code is required")
    .min(6, "Minimum and Maximum length should be 6")
    .trim(),
});

const TwoFactorActivation = ({ closeModal, otpauth_url }) => {
  console.log("otpauth_url: ", otpauth_url);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const navigate = useNavigate();
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
    // todo: fetch the otpauth_url or base32_secret from the server
    QRCode.toDataURL(otpauth_url)
      .then(setQrCodeUrl)
      .catch((err) => console.error(err));
    onOpen();
  }, [onOpen, otpauth_url]);

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
    // navigate("/settings");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />{" "}
      <ModalContent
        // bg="green"
        borderRadius={40}
        // maxH="350px"
        maxW="400px"
        mt={4}
        border="1px solid rgba(251, 102, 19, 0.3)"
        boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
        backdropFilter={"blur(20px)"}
        bgImage={`url('src/assets/img/BlackNoise.png')`}
        bgSize="cover"
        bgRepeat="no-repeat"
        bg="transparent"
      >
        <ModalBody p={2} borderRadius={40}>
          <Stack
            mt={0}
            spacing={4}
            //  w={{ base: "full", sm: "full", md: 620 }}
            align="center"
            borderRadius={40}
            pl={3}
            pr={2}
          >
            <Flex justify="center" align="center" w="full">
              <Image
                src="src/assets/svgs/2fa_activation.svg"
                alt="Two Factor Authentication Activation"
                borderRadius={20}
                w="320px"
                h="300px"
              />
            </Flex>

            <Stack spacing={3} align={"center"}>
              <Heading fontSize="lg" fontWeight="semibold">
                Two Factor Authentication Activation
              </Heading>
              <Text fontSize="sm" fontWeight="medium" color={"whiteAlpha.700"}>
                Scan QR Code using Google App to verify this device qwqw qwqw
              </Text>
            </Stack>
            <Flex justify="center" align="center" w="full">
              <Image
                src={qrCodeUrl}
                alt="qr code"
                w="240px"
                h="240px"
                // border="1px solid #ccc"
                border="1px solid"
                borderColor="pong_cl_primary"
                borderRadius={20}
                objectFit={"contain"}
              />
            </Flex>
            <Box w={"full"}>
              <FormControl isInvalid={!!errors.pin} mt={0} isRequired>
                <Flex
                  direction={"column"}
                  justify="center"
                  align="start"
                  w="full"
                  // outline="1px solid yellow"
                >
                  <FormLabel
                    htmlFor="pin"
                    fontSize="md"
                    color={"whiteAlpha.700"}
                  >
                    Verification Code
                  </FormLabel>
                  <Controller
                    name="pin"
                    control={control}
                    defaultValue=""
                    render={({ field: { ref, ...restField } }) => (
                      <Flex justify="center" align="center" flex={1} w={"full"}>
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
                      </Flex>
                    )}
                  />
                  {errors?.pin && (
                    <FormErrorMessage>{errors?.pin?.message}</FormErrorMessage>
                  )}
                </Flex>
              </FormControl>
            </Box>
          </Stack>
        </ModalBody>

        <ModalFooter p={3}>
          <Button
            bg={"white"}
            color={"orange.500"}
            letterSpacing={1}
            mr={3}
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            bg={"orange.500"}
            color={"white"}
            mr={3}
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
            Activate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TwoFactorActivation;
