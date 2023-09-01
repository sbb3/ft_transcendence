import { Outlet } from "react-router-dom";
import { Box, Flex, useDisclosure } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "src/components/Sidebar";
import { useEffect, useState } from "react";
import DetailsFormModal from "src/components/DetailsFormModal";

const DashboardLayout = () => {
  // const { alreadyUser } = useSelector((state: any) => state.user);

  const [shouldOpenDetailsModal, setShouldOpenDetailsModal] = useState(false);

  return (
    <Box // outter-container - outter box
      pos="relative"
      minW="100vw"
      minH="100vh"
      bg="pong_bg_primary"
      boxSizing="border-box"
      m={0}
    >
      <Flex // inner-container - inner box
        pos="relative"
        justify="center"
        align="center"
        maxW={{ base: "full", md: 748, lg: 972, xl: 1260 }} // full of its parent Box, sm of its parent width, md of 708px, lg of 964px and so
        maxH={{ base: "full", md: 748, lg: 972, xl: 1260 }}
        bg="red"
        color={"whiteAlpha.900"}
      >
        <Flex w="60px" h="100vh" bg="orange">
          <Sidebar />
        </Flex>
        <Flex flex={1} direction={"column"}>
          <Header />
          <Flex flex={1} bg="black">
            {shouldOpenDetailsModal ? (
              <DetailsFormModal closeModal={setShouldOpenDetailsModal} />
            ) : (
              <Outlet />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default DashboardLayout;

// TODO: search and notification and sidebar
// TODO: set colors in theme.ts
