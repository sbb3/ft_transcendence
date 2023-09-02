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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />{" "}
      <ModalContent
      // bg="green"
      >
        <ModalHeader>Two Factor Authentication Activation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack
            mt={0}
            spacing={4}
            //  w={{ base: "full", sm: "full", md: 620 }}
          >
            <Box>
              <Image
                src="src/assets/svgs/2fa_activation.svg"
                alt="Two Factor Authentication Activation"
                borderRadius={20}
                w="350px"
                h="350px"
              />
            </Box>

            <VStack spacing={3} w={"full"} align={"center"}>
              <Text fontSize="md" fontWeight="semibold">
                Scan QR Code with your 2-factor auth App to verify this device
              </Text>
              {/* white background */}
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
            </VStack>
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
            Activate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TwoFactorActivation;
