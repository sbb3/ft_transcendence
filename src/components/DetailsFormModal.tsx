import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

interface FormData {
  name: string;
  // avatar: 
}

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


const submit = (data) => {
  // console.log(data);

    // reset();
}

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Garbage</ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Continue</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DetailsFormModal;
