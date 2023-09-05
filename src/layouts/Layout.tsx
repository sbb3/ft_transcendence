import { Outlet } from "react-router-dom";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "src/components/Sidebar";
import { useEffect, useState } from "react";
import DetailsFormModal from "src/components/DetailsFormModal";
import TwoFactorActivation from "src/components/Modals/TwoFactorActivation";
import TwoFactorAccessBlocker from "src/components/Modals/TwoFactorAccessBlocker";

const Layout = () => {
  // const { alreadyUser } = useSelector((state: any) => state.user);

  const [shouldOpenDetailsModal, setShouldOpenDetailsModal] = useState(false);

  return (
    <Flex
      pos="relative"
      justify="center"
      align="center"
      boxSizing="border-box"
      m={0}
      bg="teal.700"
      color={"whiteAlpha.900"}
      w="100%"

    // h="100vh"
    >
      <Flex // !! inner-container - inner box
        pos="relative"
        w={{ base: "full", sm: "460px", md: "720px", lg: 880, xl: 1250, }}
      // h={{ base: "full", md: 650, lg: 750, xl: 850 }}
      // h={{ base: "full", }}
      // overflow="auto"
      // wrap={"wrap"}
      // outline="2px solid red"
      >
        <Box w="150px" h={'900px'} bg="purple.400"
          display={{ base: "none", lg: "flex" }}
          outline="2px solid yellow"
          mt={2}
          mb={2}

        >
          <Sidebar />
        </Box>
        <Flex direction={"column"}
          w='full'
          // overflow="auto"
          // flex={1}
          wrap={"wrap"}
        // TODO: add circle bg here  
        // width={{ base: "full", sm: 380, md: 748, lg: 972, xl: 1290 }}
        // outline="2px solid green"
        // p={2}

        >
          {/* <Header /> */}
          <Flex
            // direction={{ base: "column", md: "row" }}
            w='full'

            // justify="center" align="center"
            // outline="2px solid white"
            p={2}
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
