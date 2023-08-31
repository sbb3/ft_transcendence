import { Box, Button, Flex, HStack, Text, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import useAuth from "src/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useSendLogInMutation } from "src/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "src/features/auth/authSlice";

const Login = () => {
  // const isAuthenticated = useAuth();
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const toast = useToast();

  // const [sendLogIn, { isLoading }] = useSendLogInMutation();

  // useEffect(() => {
  //     if (isAuthenticated)
  //         navigate("/", { replace: true });

  // }, []);

  // const handleClick = async () => {
  //     console.log("clicked");
  //     try {
  //         const { accessToken }: any = await sendLogIn({}).unwrap();
  //         console.log(accessToken);

  //         dispatch(setCredentials({ accessToken }));
  //         navigate("/", { replace: true });
  //     } catch (err: any) {
  //         toast({
  //             title: "Error Login",
  //             description: err.data.message,
  //             status: "error",
  //             duration: 3000,
  //             isClosable: true,
  //         });
  //     }
  // }
  // // TODO: set iSLoading and isSucess and isError

  return (
    <Flex // inner-container - inner box
      pos="relative"
      justify="center"
      align="center"
      w={{ base: "full", md: 750, lg: 972, xl: 1260 }} // full of its parent Box, sm of its parent width, md of 708px, lg of 964px and so
      minH={{ base: 750}}  // todo: scroll bar
      bg="green"
      color={"whiteAlpha.900"}
      backgroundImage="url('src/assets/img/bgp.png')"
        backgroundPosition="center"
        backgroundSize="contain"
        // backgroundSize="cover" 
        backgroundRepeat="no-repeat"
        opacity={0.9}
        >
      {/* <HStack spacing="24px" justify="center" align="center" w="100%" h="100vh">
        <Text fontSize="3xl" fontWeight="bold" color="purple.500"> */}
          {/* change with Link */}
          {/* Card */}
          {/* <Box
            minW='full'
            minH='full'
      backgroundImage="url('src/assets/img/CircleYellow.png')"
      backgroundPosition="center"
      backgroundSize="contain"
      backgroundRepeat="no-repeat"

          >
          <Button
            colorScheme="purple"
            variant="solid"
            size="lg"
            // onClick={handleClick}
            // isLoading={isLoading}
            // isDisabled={isLoading}
          >
            Login
          </Button>

          </Box> */}
        {/* </Text>
      </HStack> */}
    </Flex>
  );
};

export default Login;
