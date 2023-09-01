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
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { useToast } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef } from "react";

import { Icon, InputGroup } from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";

interface FormData {
  username: string;
  avatar: FileList;
}

type FileUploadProps = {
  register: UseFormRegisterReturn;
  accept?: string;
  children?: ReactNode;
};

const FileUpload = (props: FileUploadProps) => {
  const { register, accept, children } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register as {
    ref: (instance: HTMLInputElement | null) => void;
  };

  const handleClick = () => inputRef.current?.click();

  return (
    <InputGroup onClick={handleClick}>
      <Input
        type={"file"}
        hidden
        accept={accept}
        {...rest}
        ref={(e) => {
          ref(e);
          inputRef.current = e;
        }}
      />
      <>{children}</>
    </InputGroup>
  );
};

const DetailsFormModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const onSubmit = (data: any) => {
    console.log("data: ", data);
    toast({
      title: "Profile updated.",
      description: "We've created your account for you.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    reset();
  };

  const validateFile = (files: FileList) => {
    // console.log("files: ", files);
    if (files.length < 1) return "File is required";

    const mb = 1024 * 1024;
    const MAX_FILE_SIZE = 5; // 5mb
    const fileSizeMb = files[0].size / mb;
    if (fileSizeMb > MAX_FILE_SIZE)
      return "Come on! Max file size is 5mb dude!";

    return true;
  };

  // TODO: add validation with yup
  // TODO: add loading state
  // TODO: add error state
  // TODO: add success state
  // TODO: add toast notification and remove toast from onSubmit
  // TODO: upload to cloudinary and save url to db

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />{" "}
      <ModalContent
      // bg="green"
      >
        <ModalHeader>Complete your profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack
            mt={8}
            spacing={10}
            //  w={{ base: "full", sm: "full", md: 620 }}
          >
            <Box>
              <Image
                src="src/assets/svgs/complete_profile.svg"
                alt="profile illustration"
                borderRadius={20}
              />
            </Box>

            <Box w={"full"}>
              <FormControl isInvalid={!!errors.username} mt={6} isRequired>
                <FormLabel htmlFor="username" fontSize="lg">
                  Username
                </FormLabel>
                <Input
                  type="username"
                  id="username"
                  placeholder="username"
                  {...register("username", {
                    required: "This is required",
                    minLength: {
                      value: 3,
                      message: "Minimum length should be 3",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.username && errors.username.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.avatar} isRequired>
                <FormLabel>Avatar</FormLabel>

                <FileUpload
                  accept={"image/*"}
                  register={register("avatar", { validate: validateFile })}
                >
                  <Button leftIcon={<Icon as={FiFile} />}>Upload</Button>
                </FileUpload>

                <FormErrorMessage>
                  {errors.avatar && errors?.avatar.message}
                </FormErrorMessage>
              </FormControl>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="orange"
            mr={3}
            // isLoading={isLoading}
            // isDisabled={isSubmitting}
            cursor="pointer"
            onClick={handleSubmit(onSubmit)}
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailsFormModal;
