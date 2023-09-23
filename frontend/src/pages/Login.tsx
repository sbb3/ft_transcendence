import {
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect } from "react";
import useAuth from "src/hooks/useAuth";
import { useNavigate, Navigate } from "react-router-dom";
import { useSendLogInMutation } from "src/features/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "src/features/auth/authSlice";
import { motion } from "framer-motion";
import { css } from "@emotion/react";
import "/src/styles/loginButton.css";
import Loader from "src/components/Utils/Loader";
import TwoFactorAccessBlocker from "src/components/Modals/TwoFactorAccessBlocker";
import DetailsFormModal from "src/components/DetailsFormModal";

const MotionBox = motion(Box);

const Login = () => {
  const dispatch = useDispatch();
  const isAlreadyUser = !true;
  const is2FAEnabled = !true;
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });
  // const is2FAEnabled = useSelector((state: any) => state.auth.user.is2FAEnabled);
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  // const [sendLogIn, { isLoading, isSuccess, isError }] = useSendLogInMutation();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const handleClick = async () => {
    try {
      // await sendLogIn({}).unwrap();
      // dispatch(setLogin({ accessToken: "randomValue", user: "anas" })); // !! just for testing

      if (isAlreadyUser) {
        // onOpen();
        console.log("isAlreadyUser: ", isAlreadyUser);
        // console.log("isOpen: ", isOpen);
      } else if (is2FAEnabled) {
        // onOpen();
        // console.log("is2FAEnabled: ", is2FAEnabled);
        // console.log("isOpen: ", isOpen);
      } else {
        // navigate("/", { replace: true });
      }
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

  // if (isLoading) return <Loader />;

  // if (isSuccess) return <Navigate to="/" replace={true} />;

  return (
    // TODO: !!! modfiy the width and height of the container
    <Flex
      pos="relative"
      justify="center"
      align="center"
      w={{ base: "full", md: 750, lg: 972, xl: 1260 }}
      minH={{ base: 750 }}
      bg="pong_bg_primary"
      // color={"whiteAlpha.900"}
    >
      {!isAlreadyUser && (
        <DetailsFormModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
      )}

      {is2FAEnabled && (
        <TwoFactorAccessBlocker
          isOpen={true}
          onClose={onClose}
          onOpen={onOpen}
        />
      )}
      <MotionBox
        pos="absolute"
        w={{ base: "300px", sm: "400px", md: "550px" }}
        h={{ base: "300px", sm: "400px", md: "550px" }}
        bgImage="url('src/assets/img/cropped_circle_pong.png')"
        bgPosition="center"
        bgSize="contain"
        bgRepeat="no-repeat"
        bgBlendMode="lighten"
        // animate={{ rotate: 360 }}
        // transition={{ ease: "linear", duration: 5, repeat: Infinity }}
        opacity={0.9}
      />
      <VStack
        pos="relative"
        justify="center"
        align="center"
        // w={{ base: "200px", sm: "300px", md: "400px" }}
        // h={{ base: "90px", sm: "120px", md: "168px" }}
        borderRadius={{ base: "15px", sm: "25px", md: "40px" }}
        border="1px solid rgba(251, 102, 19, 0.1)"
        boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
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
