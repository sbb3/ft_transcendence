import { Outlet } from "react-router-dom";
import { Box, Flex, Stack, useDisclosure } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "src/components/Sidebar";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import ProfileDetailsFormModal from "src/components/DetailsFormModal";
import { useEffect } from "react";
import { io } from "socket.io-client";

const MotionBox = motion(Box);

const Layout = () => {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const { onToggle } = useDisclosure();

  return (
    <Flex
      w={{ base: "full", sm: "460px", md: 780, lg: 980, xl: 1250 }}
      // w={{ base: "full", sm: "460px", md: 780, lg: 1200, xl: 1250 }}
      h="full"
      gap={1}
      borderRadius={24}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      color={"whiteAlpha.900"}
      justify="center"
      align="start"
      p={2}
      alignItems={"stretch"}
    >
      <Stack
        w="160px"
        display={{ base: "none", lg: "flex" }}
        justify="start"
        spacing={8}
        pt={4}
        pb={6}
        borderRadius={24}
        bg="pong_bg_secondary"
        border="1px solid rgba(251, 102, 19, 0.1)"
        boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
        backdropFilter={"blur(20px)"}
        bgImage={`url('src/assets/img/BlackNoise.png')`}
        bgSize="cover"
        bgRepeat="no-repeat"
      >
        <Sidebar />
      </Stack>
      <Flex
        direction={"column"}
        w="full"
        wrap={"wrap"}
        borderRadius={40}
        justify="center"
        align="center"
        gap={2}
        p={2}
      >
        {/* <MotionBox
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
          zIndex={-2}
        /> */}
        <Header />
        <Flex
          pos="relative"
          direction={{ base: "row" }}
          w="full"
          flex={1}
          justify="center"
          align="center"
          borderRadius={26}
          p={2}
        >
          {!currentUser?.is_profile_completed ? (
            <ProfileDetailsFormModal isOpen={true} onToggle={onToggle} />
          ) : (
            <Outlet />
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Layout;
