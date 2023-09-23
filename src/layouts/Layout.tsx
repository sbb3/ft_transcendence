import { Outlet } from "react-router-dom";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "src/components/Sidebar";
import { useEffect, useState } from "react";
import DetailsFormModal from "src/components/DetailsFormModal";
import TwoFactorActivation from "src/components/Modals/TwoFactorActivation";
import TwoFactorAccessBlocker from "src/components/Modals/TwoFactorAccessBlocker";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Layout = () => {
  const [shouldOpenDetailsModal, setShouldOpenDetailsModal] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    // <Flex
    //   pos="relative"
    //   // justify="center"
    //   // align="center"
    //   bg="teal.700"
    //   color={"whiteAlpha.900"}
    // // w="100%"

    // // h="100vh"
    // >
    // <Box
    //   w={{ base: "full", sm: "460px", md: "740px", lg: 880, xl: 1150 }}
    //   minH={{ base: "full", md: 650, lg: 750, xl: 950 }}
    // >
    <Flex // !! inner-container - inner box
      w={{ base: "full", sm: "460px", md: "740px", lg: 880, xl: 1150 }}
      // minH={{ base: "full", md: 650, lg: 750, xl: 950 }}
      // h={{ base: 800 }}
      // h="100vh"
      h="full"
      // w="full"
      gap={1}
      borderRadius={24}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      color={"whiteAlpha.900"}
      justify="center"
      align="start"
      // h={{ base: "full", md: 650, lg: 750, xl: 850 }}
      // h={{ base: "full", }}
      // overflow="auto"
      // wrap={"wrap"}
      // bg="orange"
      // mb={2}
      p={2}
      alignItems={"stretch"}
    >
      <Sidebar />
      <Flex
        direction={"column"}
        w="full"
        // overflow="auto"
        // flex={1}
        wrap={"wrap"}
        // TODO: add circle bg here
        // width={{ base: "full", sm: 380, md: 748, lg: 972, xl: 1290 }}
        // outline="2px solid green"
        // p={2}
        borderRadius={40}
        // justify="space-evenly"
        justify="center"
        align="center"
        // mt={1}
        // zIndex={-3}
        // outline="2px solid green"
        // bg="green"
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
          // animate={{ rotate: 360 }}
          // transition={{ ease: "linear", duration: 5, repeat: Infinity }}
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
          // alignItems={"stretch"}
          // justifyItems={"stretch"}
          // outline="2px solid white"
          p={2}
          // zIndex={-1}
          // bg="yellow"
          // overflow={"auto"}
        >
          {shouldOpenDetailsModal ? (
            // <DetailsFormModal closeModal={setShouldOpenDetailsModa l} />
            // <TwoFactorActivation closeModal={setShouldOpenDetailsModal} />
            <TwoFactorAccessBlocker />
          ) : (
            <Outlet />
          )}
        </Flex>
      </Flex>
    </Flex>
    // </Box>
    // </Flex >
  );
};

export default Layout;

// TODO: search and notification and sidebar
// TODO: set colors in theme.ts
