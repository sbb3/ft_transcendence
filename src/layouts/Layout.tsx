import { Outlet } from "react-router-dom";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "src/components/Sidebar";
import { useEffect, useState } from "react";
import DetailsFormModal from "src/components/DetailsFormModal";
import TwoFactorActivation from "src/components/Modals/TwoFactorActivation";
import TwoFactorAccessBlocker from "src/components/Modals/TwoFactorAccessBlocker";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Layout = () => {
  // const { alreadyUser } = useSelector((state: any) => state.user);

  const [shouldOpenDetailsModal, setShouldOpenDetailsModal] = useState(false);

  return (
    <Flex
      pos="relative"
      // justify="center"
      // align="center"
      bg="teal.700"
      color={"whiteAlpha.900"}
    // w="100%"

    // h="100vh"
    >
      <Flex // !! inner-container - inner box
        pos="relative"
        w={{ base: "full", sm: "460px", md: "720px", lg: 880, xl: 1250, }}
        gap={1}
        borderRadius={24}
        border="1px solid rgba(251, 102, 19, 0.69)"
        boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
        backdropFilter={"blur(20px)"}
        color={"whiteAlpha.900"}

      // h={{ base: "full", md: 650, lg: 750, xl: 850 }}
      // h={{ base: "full", }}
      // overflow="auto"
      // wrap={"wrap"}
      // outline="2px solid red"
      >
        <Box
          w="150px"
          minH={"full"}
          bg="pong_bg_secondary"
          display={{ base: "none", md: "flex" }}
          // mt={2}
          // mb={2}
          borderRadius={40}
        // outline="2px solid yellow"

        >
          <Sidebar />
        </Box>
        <Flex
          pos="relative"
          direction={"column"}
          w='full'
          // overflow="auto"
          // flex={1}
          wrap={"wrap"}
          // TODO: add circle bg here  
          // width={{ base: "full", sm: 380, md: 748, lg: 972, xl: 1290 }}
          // outline="2px solid green"
          // p={2}
          borderRadius={40}

          justify="center"
          align="center"

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
            // animate={{ rotate: 360 }}
            // transition={{ ease: "linear", duration: 5, repeat: Infinity }}
            opacity={0.9}
          />
          <Header />
          <Flex
            direction={{ base: "column", md: "row" }}
            // w='full'
            // h='full'

            // justify="center" align="center"
            outline="2px solid white"
          // p={2}
          // flex={1}
          // wrap={"wrap"}

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
    </Flex >

  );
};

export default Layout;

// TODO: search and notification and sidebar
// TODO: set colors in theme.ts
