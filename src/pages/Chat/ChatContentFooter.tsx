import { Box, Icon, IconButton, Input, InputGroup } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdSend } from "react-icons/md";

const ChatContentFooter = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({});

  useEffect(() => {
    const message = document.getElementById("message");
    message?.focus();
  }, []);
  return (
    <Box
      w={"full"}
      // bg={"gray.400"}
      borderRadius={6}
      mb={2}
      px={2}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <InputGroup
        w={"full"}
        gap={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Input
          id="message"
          type="text"
          variant="filled"
          // bg="#F9F9F9"
          bg="pong_bg_secondary"
          w={"full"}
          placeholder="Type a message"
          autoFocus
          {...register("message", {
            required: "This is required",
          })}
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
          isLoading={isLoading}
          isDisabled={isSubmitting}
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
        />
      </InputGroup>
    </Box>
  );
};

export default ChatContentFooter;