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
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    PinInput,
    PinInputField,
    Radio,
    RadioGroup,
    Stack,
    Text,
    Textarea,
    VStack,
    useDisclosure,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@chakra-ui/react";
import { ReactNode, useEffect, } from "react";
import { useNavigate } from "react-router-dom";

// const schema = yup.object().shape({
// });

const CreateChannel = ({ isOpen, onOpen, onClose }) => {
    const navigate = useNavigate();
    const toast = useToast();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        // resolver: yupResolver(pinSchema),
    });

    useEffect(() => {
        onOpen();
    }, [onOpen]);

    const onSubmit = (data: any) => {
        console.log("data: ", data);
        reset({
            name: "",
            description: "",
            password: "",
            privacy: "",
        });
        // closeModal(false);
        // onClose();
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
                boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
                backdropFilter={"blur(20px)"}
                bgImage={`url('src/assets/img/BlackNoise.png')`}
                bgSize="cover"
                bgRepeat="no-repeat"
                bg="transparent"
            >
                <ModalHeader>Create a New Channel</ModalHeader>
                <ModalCloseButton />
                <ModalBody p={2} borderRadius={40}>
                    <Stack
                        mt={0}
                        spacing={2}
                        //  w={{ base: "full", sm: "full", md: 620 }}
                        align="center"
                        borderRadius={40}
                        pl={3}
                        pr={2}
                    >

                        <FormControl isInvalid={!!errors.name} mt={0} isRequired>
                            <FormLabel htmlFor="name" fontSize="lg">
                                Name
                            </FormLabel>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Channel name"
                                {...register("name")}
                            />
                            <FormErrorMessage>
                                {errors.name && errors.name.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.name} mt={0} isRequired>
                            <FormLabel htmlFor="description" fontSize="lg">
                                Description
                            </FormLabel>
                            <Textarea
                                placeholder="Brief description of the channel's purpose or topic"
                                {...register("description")}
                                resize={"none"}
                                size={"md"}

                            />
                            <FormErrorMessage>
                                {errors.description && errors.description.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.password} mt={0} isRequired>
                            <FormLabel htmlFor="password" fontSize="lg">
                                Password
                            </FormLabel>
                            <Input
                                type="password"
                                placeholder="Channel password (optional)"
                                {...register("password")}
                            />
                            <FormErrorMessage>
                                {errors.password && errors.password.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={!!errors.privacy} mt={0} isRequired>
                            <FormLabel htmlFor="privacy" fontSize="lg">
                                Privacy Settings
                            </FormLabel>
                            <RadioGroup defaultValue="public">
                                <Stack spacing={5} direction="row">
                                    <Radio colorScheme={'orange'} value="public"
                                        {...register("privacy")}
                                    >Public</Radio>
                                    <Radio colorScheme={'orange'} value="private"
                                        {...register("privacy")}
                                    >Private</Radio>
                                </Stack>
                            </RadioGroup>
                            <FormErrorMessage>
                                {errors.privacy && errors.privacy.message}
                            </FormErrorMessage>
                        </FormControl>

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
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};


export default CreateChannel;