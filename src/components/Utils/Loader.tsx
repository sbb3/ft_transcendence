import { HStack, Spinner } from "@chakra-ui/react";

function Loader() {
    return (
        <HStack justifyContent={"center"} mt={4}>
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="purple.500"
                size="xl"
            />
        </HStack>
    );
}

export default Loader;