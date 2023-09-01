import { HStack, Spinner } from "@chakra-ui/react";

function Loader() {
    return (
        <HStack justify={"center"} mt={4}>
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="pong_cl_primary"
                size="xl"
            />
        </HStack>
    );
}

export default Loader;