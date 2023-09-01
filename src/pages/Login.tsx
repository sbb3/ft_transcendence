import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import useAuth from "src/hooks/useAuth";
import { useNavigate, Navigate } from "react-router-dom";
import { useSendLogInMutation } from "src/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setAccessToken } from "src/features/auth/authSlice";
import { motion } from "framer-motion";
import { css } from "@emotion/react";
import "/src/styles/loginButton.css";
import Loader from "src/components/Utils/Loader";

const MotionBox = motion(Box);

const Login = () => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [sendLogIn, { isLoading, isSuccess, isError }] = useSendLogInMutation();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleClick = async () => {
    try {
      await sendLogIn({}).unwrap();
      navigate("/", { replace: true });
    } catch (err: any) {
      toast({
        title: "Error Login",
        description: "An error occured while logging in.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) return <Loader />;

  if (isSuccess) return <Navigate to="/" replace={true} />;

  return (
    <Flex
      pos="relative"
      justify="center"
      align="center"
      w={{ base: "full", md: 750, lg: 972, xl: 1260 }}
      minH={{ base: 750 }}
      bg="#222222"
      // color={"whiteAlpha.900"}
    >
      <MotionBox
        pos="absolute"
        w={{ base: "300px", sm: "400px", md: "550px" }}
        h={{ base: "300px", sm: "400px", md: "550px" }}
        bgImage="url('src/assets/img/cropped_circle_pong.png')"
        bgPosition="center"
        bgSize="contain"
        bgRepeat="no-repeat"
        bgBlendMode="lighten"
        animate={{ rotate: 360 }}
        transition={{ ease: "linear", duration: 5, repeat: Infinity }}
        opacity={0.9}
      />
      <VStack
        pos="relative"
        justify="center"
        align="center"
        // w={{ base: "200px", sm: "300px", md: "400px" }}
        // h={{ base: "90px", sm: "120px", md: "168px" }}
        borderRadius={{ base: "15px", sm: "25px", md: "40px" }}
        border="1px solid rgba(251, 102, 19, 0.69)"
        boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
        backdropFilter={"blur(20px)"}
        bgImage={`url('src/assets/img/BlackNoise.png')`}
        bgSize="cover"
        bgRepeat="no-repeat"
        p={{ base: 5 }}
      >
        <Link color="#000" onClick={handleClick}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          CLICK TO EXPLORE
        </Link>
      </VStack>
    </Flex>
  );
};

export default Login;
