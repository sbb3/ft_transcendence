import { Outlet } from "react-router-dom";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "src/components/Sidebar";
import { useEffect, useState } from "react";
import DetailsFormModal from "src/components/DetailsFormModal";
import TwoFactorActivation from "src/components/Modals/TwoFactorActivation";
import TwoFactorAccessBlocker from "src/components/Modals/TwoFactorAccessBlocker";

const DashboardLayout = () => {
  // const { alreadyUser } = useSelector((state: any) => state.user);

  const [shouldOpenDetailsModal, setShouldOpenDetailsModal] = useState(false);

  return (
    <Flex // !! inner-container - inner box
      pos="relative"
      w={{ base: "full", md: 748, lg: 972, xl: 1290 }} // full of its parent Box, sm of its parent width, md of 708px, lg of 964px and so
      // h={{ base: "full", md: 650, lg: 750, xl: 750 }}
      // overflow="auto"
      wrap={"wrap"}
    >
      <Flex w="140px" direction="column" bg="purple.400"
        display={{ base: "none", lg: "flex" }}
      >
        <Sidebar />
      </Flex>
      <Flex direction={"column"}
        // overflow="auto"
        flex={1}
        wrap={"wrap"}
      // TODO: add circle bg here  
      >
        <Header />
        <Flex
          direction={{ base: "column", lg: "row" }}
          justify="center" align="center"

        // flex={1}
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
  );
};

export default DashboardLayout;

// TODO: search and notification and sidebar
// TODO: set colors in theme.ts
