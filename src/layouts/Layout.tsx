import { Outlet } from "react-router-dom";
import { Box, Button, Flex } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "src/components/Sidebar";

const Layout = () => {
	console.log("layout");
  return (
    <Flex // outter-container - outter box
      pos="relative"
     justify="center"
	 align="center" 
	  minW="100vw"
      minH="100vh" // !! set it to fixed
      boxSizing="border-box"
      m={0}
      zIndex={-9999}
	  bg="red"
    >
			<Outlet />
    </Flex>
  );
};

export default Layout;

// TODO: search and notification and sidebar
// TODO: set colors in theme.ts
