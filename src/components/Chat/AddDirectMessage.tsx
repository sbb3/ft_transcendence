import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useToast,
  Box,
  Icon,
  IconButton,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { MdSend } from "react-icons/md";
import { Search2Icon, SearchIcon } from "@chakra-ui/icons";

const validationSchema = yup.object().shape({
  username: yup.string().required("Username is required").trim(),
  message: yup.string().required("Message is required").trim(),
});

const AddDirectMessage = ({
  isOpen,
  onOpen,
  onClose,
  setIsAddDirectMessageOpen,
}) => {
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
      title: "Message sent.",
      description: "We've sent your message to the user.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    reset({
      username: "",
      message: "",
    });
  };

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setIsAddDirectMessageOpen(false);
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
          maxW={{ base: "350px", lg: "450px" }}
          mt={4}
          border="1px solid rgba(251, 102, 19, 0.3)"
          boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
          backdropFilter={"blur(20px)"}
          bgImage={`url('src/assets/img/BlackNoise.png')`}
          bgSize="cover"
          bgRepeat="no-repeat"
          bg="transparent"
          //   w={{ base: "full", sm: "full", md: 820 }}
        >
          <ModalHeader>Direct messages</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={2} borderRadius={40}>
            <Stack
              mt={0}
              spacing={6}
              //  w={{ base: "full", sm: "full", md: 620 }}
              align="center"
              justify="start"
              borderRadius={40}
              p={6}
            >
              <FormControl isInvalid={!!errors.username} mt={0}>
                <FormLabel htmlFor="username" fontSize="lg">
                  Send DM
                </FormLabel>
                <InputGroup>
                  <InputRightElement
                    pointerEvents="none"
                    children={<Search2Icon />}
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
                  <Input
                    {...register("username")}
                    mr={2}
                    flex={1}
                    variant="filled"
                    bg="pong_bg.400"
                    type="text"
                    color="white"
                    placeholder="Username to send message to"
                    //   _placeholder={{
                    //     fontSize: 14,
                    //     letterSpacing: 0.5,
                    //     fontWeight: "light",
                    //     opacity: 0.7,
                    //     color: "gray.500",
                    //   }}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>

              <Box
                w={"full"}
                // bg={"gray.400"}
                borderRadius={6}
                mb={2}
                // px={2}
              >
                <InputGroup
                  w={"full"}
                  gap={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Input
                    type="text"
                    variant="filled"
                    bg="#F9F9F9"
                    w={"full"}
                    placeholder="Say Hi!"
                    {...register("message")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(onSubmit)();
                        reset({
                          message: "",
                        });
                      }
                    }}
                    borderColor={"pong_cl_primary"}
                    _hover={{
                      borderColor: "pong_cl_primary",
                    }}
                  />
                  <IconButton
                    aria-label="Send message"
                    color={"white"}
                    bg={"pong_cl_primary"}
                    size={"md"}
                    isRound
                    isLoading={isSubmitting}
                    onClick={() => {
                      handleSubmit(onSubmit)();
                      reset({
                        message: "",
                      });
                    }}
                    icon={<Icon as={MdSend} />}
                    _hover={{
                      bg: "white",
                      color: "pong_cl_primary",
                    }}
                    isDisabled={isSubmitting}
                  />
                </InputGroup>
              </Box>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddDirectMessage;
