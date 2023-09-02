import {
  Box,
  Button,
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
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef } from "react";

import { Icon, InputGroup } from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const TwoFactorActivation = ({ closeModal }) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    // resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const onSubmit = (data: any) => {
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
            mt={8}
            spacing={10}
            //  w={{ base: "full", sm: "full", md: 620 }}
          >
            <Box>
              <Image
                src="src/assets/svgs/2fa_activation.svg"
                alt="Two Factor Authentication Activation"
                borderRadius={20}
              />
            </Box>

            <VStack spacing={6} w={"full"}>
              <FormControl isInvalid={!!errors.pin} mt={6} isRequired>
                <FormLabel htmlFor="pin" fontSize="lg">
                  Verification Code
                </FormLabel>
                <HStack>
                  <PinInput size="sm" otp manageFocus>
                    <PinInputField {...(register("pin"), { required: true })} />
                    <PinInputField {...register("pin")} />
                    <PinInputField {...register("pin")} />
                    <PinInputField {...register("pin")} />
                    <PinInputField {...register("pin")} />
                    <PinInputField {...register("pin")} />
                  </PinInput>
                </HStack>

                {errors?.pin && (
                  <FormErrorMessage>{errors?.pin?.message}</FormErrorMessage>
                )}
              </FormControl>
            </VStack>
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
