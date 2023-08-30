import { Button, HStack, Text, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import useAuth from "src/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useSendLogInMutation } from "src/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "src/features/auth/authSlice";

const Login = () => {
    const isAuthenticated = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();

    const [sendLogIn, { isLoading }] = useSendLogInMutation();

    useEffect(() => {
        if (isAuthenticated)
            navigate("/", { replace: true });

    }, []);

    const handleClick = async () => {
        console.log("clicked");
        try {
            const { accessToken }: any = await sendLogIn({}).unwrap();
            console.log(accessToken);

            dispatch(setCredentials({ accessToken }));
            navigate("/", { replace: true });
        } catch (err: any) {    
            toast({
                title: "Error Login",
                description: err.data.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }
    return (
        <HStack spacing="24px" justify="center" align="center" w="100%" h="100vh">
            <Text fontSize="3xl" fontWeight="bold" color="purple.500">
                {/* change with Link */}
                <Button
                    colorScheme="purple"
                    variant="solid"
                    size="lg"
                    onClick={handleClick}
                    isLoading={isLoading}
                    isDisabled={isLoading}
                >
                    Login
                </Button>

            </Text>
        </HStack>

    );
};

export default Login;