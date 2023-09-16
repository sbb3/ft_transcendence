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
// import { useAddMessageMutation } from "src/features/messages/messagesApi";
import { useCreateConversationMutation } from "src/features/conversations/conversationsApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiSlice } from "src/app/api/apiSlice";
import store from "src/app/store";
import { v4 as uuidv4 } from "uuid";
import usersApi from "src/features/users/usersApi";
import { useGetUserByEmailQuery } from "src/features/users/usersApi";
import messagesApi from "src/features/messages/messagesApi";

const validationSchema = yup.object().shape({
  email: yup.string().required("email is required").trim(),
  message: yup.string().required("Message is required").trim(),
});

const AddDirectMessage = ({
  isOpen,
  onOpen,
  onClose,
  setIsAddDirectMessageOpen,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.auth.user);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  const [trigger, { data: receiver, isLoading, error }] = usersApi.endpoints.getUserByEmail.useLazyQuery();

  // const [addMessage, { isLoading, error }] = useAddMessageMutation();
  const [createConversation, { isLoading: isCreating, error: error2 }] =
    useCreateConversationMutation();
  const onSubmit = async (data: any) => {
    // console.log("data: ", data);
    const { message, email: receiverEmail } = data;

    try {
      const receiverUser = await trigger(receiverEmail).unwrap();
      const to = receiverUser[0];
      // console.log("to: ", to);

      const data = {
        conversation: {
          id: uuidv4(),
          title: to?.name,
          members: [currentUser.email, receiverEmail],
          content: message,
        },
        receiver: to,
      };
      await createConversation(data).unwrap();

      toast({
        title: "Message sent.",
        description: "We've sent your message to the user.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      // console.log("result: ", result);
      onClose();
      setIsAddDirectMessageOpen(false);
      // const conversationId = result?.data?.id;
      // console.log("conversationId: ", conversationId);
      // navigate(`/chat/conversation/${data?.conversation.id}`, {
      //   state: data?.conversation,
      // });
    } catch (error) {
      console.log("error232323: ", error);
      toast({
        title: "Message didn't send.",
        description: "We couldn't send your message to the user.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }

    // reset({
    //   email: "",
    //   message: "",
    // });
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
              <FormControl isInvalid={!!errors.email} mt={0}>
                <FormLabel htmlFor="email" fontSize="lg">
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
                    {...register("email")}
                    mr={2}
                    flex={1}
                    variant="filled"
                    bg="pong_bg.400"
                    type="text"
                    color="white"
                    placeholder="email to send message to"
                  // onChange={(e) => {

                  // }}
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
                  {errors.email && errors.email.message}
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
