import { Outlet } from "react-router-dom";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "src/components/Sidebar";
import { useEffect, useState } from "react";
import DetailsFormModal from "src/components/DetailsFormModal";
import TwoFactorActivation from "src/components/Modals/TwoFactorActivation";

const DashboardLayout = () => {
  // const { alreadyUser } = useSelector((state: any) => state.user);

  const [shouldOpenDetailsModal, setShouldOpenDetailsModal] = useState(true);

  return (
    <Flex // inner-container - inner box
      pos="relative"
      // justify="center"
      // align="center"
      w={{ base: "full", md: 748, lg: 972, xl: 1260 }} // full of its parent Box, sm of its parent width, md of 708px, lg of 964px and so
      h={{ base: "full", md: 650, lg: 750, xl: 1000 }}
      bg="red"
      color={"whiteAlpha.900"}
    >
      <Flex w="60px" bg="orange">
        <Sidebar />
      </Flex>
      <Flex flex={1} direction={"column"}>
        <Header />
        <Flex flex={1} bg="green" justify="center" align="center">
          {shouldOpenDetailsModal ? (
            // <DetailsFormModal closeModal={setShouldOpenDetailsModal} />
            <TwoFactorActivation closeModal={setShouldOpenDetailsModal} />
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
