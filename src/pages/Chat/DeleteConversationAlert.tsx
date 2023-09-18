import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Loader from "src/components/Utils/Loader";
import { useDeleteConversationMutation } from "src/features/conversations/conversationsApi";

const DeleteConversationAlert = ({
  conversationId,
  isOpen,
  onOpen,
  onClose,
  cancelRef,
}) => {
  const navigate = useNavigate();
  const [deleteConversation, { isLoading, isError, isSuccess }] =
    useDeleteConversationMutation();

  //   TODO: delete messages of the conversation also
  const handleDelete = async () => {
    try {
      await deleteConversation(conversationId).unwrap();
      console.log("conversation deleted");
    } catch (error) {
      console.log("error: ", error);
    }

    onClose();
    navigate("/chat", { replace: true });
  };

  //   if (isSuccess) {
  //     onClose();
  //   }

  //   if (isLoading) return <Loader />;

  return (
    <>
      <Button colorScheme="red" onClick={onOpen}>
        Delete Customer
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            border="1px solid rgba(251, 102, 19, 0.3)"
            boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
            backdropFilter={"blur(20px)"}
            bgImage={`url('src/assets/img/BlackNoise.png')`}
            bgSize="cover"
            bgRepeat="no-repeat"
            bg="transparent"
          >
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Conversation
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This will remove the conversation from your inbox
              including all its messages.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteConversationAlert;
