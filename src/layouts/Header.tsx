import { Box, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, IconButton, useDisclosure } from "@chakra-ui/react";
import Search from "src/components/Search";
import Notifications from "src/components/Notifications";
import { HamburgerIcon } from "@chakra-ui/icons";
import Sidebar from "src/components/Sidebar";
import React from "react";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  return (
    <Flex
      direction='row' justify='space-between' align='center' w='full'
      p={2}
      // ml={1}
      // bg="pong_bg_secondary"
      // outline="2px solid yellow"
      bg="pong_bg_secondary"
      borderRadius={24}
      border="1px solid rgba(251, 102, 19, 0.69)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <IconButton
        onClick={onOpen}
        // ref={btnRef}
        size='xs' fontSize="md" bg={'pong_cl_primary'} color={'white'} borderRadius={8} aria-label='Send game request' icon={<HamburgerIcon />}
      />
      {
        isOpen &&
        <Box
          maxW="90px"
          outline="2px solid yellow"
        >
          <Drawer
            size="menu"
            // variant="secondary"
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
          // finalFocusRef={btnRef}
          >
            <DrawerOverlay>
              <DrawerContent
                bg="pong_bg_secondary"
                color={"whiteAlpha.900"}
                borderRadius={24}
                border="1px solid rgba(251, 102, 19, 0.69)"
                boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
                backdropFilter={"blur(20px)"}
                bgImage={`url('src/assets/img/BlackNoise.png')`}
                bgSize="cover"
                bgRepeat="no-repeat"
              >
                <DrawerCloseButton />
                <DrawerHeader>Menu</DrawerHeader>

                <DrawerBody>
                  <Sidebar />
                </DrawerBody>
              </DrawerContent>
            </DrawerOverlay>
          </Drawer>
        </Box>
      }
      <Search />
      <Notifications />
    </Flex>
  );
};

export default Header;
