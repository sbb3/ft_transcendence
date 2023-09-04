import { Outlet } from "react-router-dom";
import { Box, Button, Flex } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "src/components/Sidebar";

const Layout = () => (
  <Flex // !! outter-container - outter box
    pos="relative"
    justify="center"
    align="center"
    boxSizing="border-box"
    m={0}
    bg="teal.400"
    color={"whiteAlpha.900"}
    w="100%"
    // h="100vh"
    wrap={"wrap"}

  >
    <Outlet />
  </Flex>

);

export default Layout;

// TODO: search and notification and sidebar
// TODO: set colors in theme.ts
