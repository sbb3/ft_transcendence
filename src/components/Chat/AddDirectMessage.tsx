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
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { MdSend } from "react-icons/md";
import { Search2Icon, SearchIcon } from "@chakra-ui/icons";
// import { useAddMessageMutation } from "src/features/messages/messagesApi";
import conversationApi, {
  useCreateConversationMutation,
} from "src/features/conversations/conversationsApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiSlice } from "src/app/api/apiSlice";
import store from "src/app/store";
import { v4 as uuidv4 } from "uuid";
import usersApi from "src/features/users/usersApi";
import { useGetUserByEmailQuery } from "src/features/users/usersApi";
import messagesApi from "src/features/messages/messagesApi";
import { useGetConversationByMembersEmailsQuery } from "src/features/conversations/conversationsApi";
import Loader from "../Utils/Loader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const validationSchema = yup.object().shape({
  email: yup.string().required("email is required").trim(),
  message: yup.string().required("Message is required").trim(),
});

const AddDirectMessage = ({ isOpenDM, onToggleDM }) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state: any) => state.auth.user);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [trigger, { isLoading: isLoadinGetUserByEmail }] =
    usersApi.endpoints.getUserByEmail.useLazyQuery();

  const [
    triggerGetConversationByMembersEmails,
    { isLoading: isLoadingGetConversationByMembersEmails },
  ] = conversationApi.endpoints.getConversationByMembersEmails.useLazyQuery();

  const [createConversation, { isLoading: isCreatingConversation }] =
    useCreateConversationMutation();

  const onSubmit = async (data: any) => {
    console.log("data: ", data);
    let conversationId;
    const { message, email: receiverEmail } = data;

    try {
      if (receiverEmail === currentUser.email)
        throw new Error("You can't send message to yourself");

      const users = await trigger(receiverEmail).unwrap();

      if (users?.length === 0) throw new Error("user not found");

      const to = users[0];

      const conversations = await triggerGetConversationByMembersEmails([
        currentUser.email,
        receiverEmail,
      ]).unwrap();

      if (conversations?.length > 0) {
        const conversation = conversations[0];
        conversationId = conversation.id;
        const msgData = {
          id: uuidv4(),
          conversationId: conversation.id,
          sender: {
            id: currentUser.id,
            email: currentUser.email,
            name: currentUser.name,
          },
          receiver: {
            id: to.id,
            email: to.email,
            name: to.name,
          },
          content: message,
          lastMessageCreatedAt: dayjs().valueOf(),
        };
        store.dispatch(messagesApi.endpoints.addMessage.initiate(msgData));
      } else {
        const newConversationData = {
          conversation: {
            id: uuidv4(),
            name: [currentUser.name, to?.name],
            avatar: to?.avatar,
            members: [currentUser.email, receiverEmail],
            lastMessageContent: message,
            lastMessageCreatedAt: dayjs().valueOf(),
          },
          receiver: to,
        };
        conversationId = newConversationData?.conversation.id;
        await createConversation(newConversationData).unwrap();
      }

      reset({
        email: "",
        message: "",
      });
      onToggleDM();
      navigate(`/chat/conversation/${conversationId}`);
    } catch (error) {
      console.log("error: ", error);
      if (error?.message === "user not found") {
        toast({
          title: "User not found.",
          description:
            "We couldn't find the user you're trying to send message to.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (error?.message === "You can't send message to yourself") {
        toast({
          title: "Nope",
          description: "You can't send message to yourself.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Message not sent.",
          description: "We've not sent your message to the recipient.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpenDM}
        onClose={onToggleDM}
        closeOnEsc={true}
        closeOnOverlayClick={true}
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
          <ModalCloseButton onClick={onToggleDM} />
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
                    bg="pong_bg_secondary"
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
                    _hover={{
                      borderColor: "pong_cl_primary",
                      background: "pong_bg_secondary",
                    }}
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
                    bg="pong_bg_secondary"
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
                    isLoading={
                      isLoadinGetUserByEmail ||
                      isCreatingConversation ||
                      isLoadingGetConversationByMembersEmails
                    }
                    onClick={handleSubmit(onSubmit)}
                    icon={<Icon as={MdSend} />}
                    _hover={{
                      bg: "white",
                      color: "pong_cl_primary",
                    }}
                    isDisabled={
                      isLoadinGetUserByEmail ||
                      isCreatingConversation ||
                      isLoadingGetConversationByMembersEmails
                    }
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
