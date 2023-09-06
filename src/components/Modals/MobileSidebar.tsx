import {
  Box,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import Sidebar from "src/components/Sidebar";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";

const MobileSidebar = ({ isOpen, onClose }) => {
  return (
    <Collapse in={isOpen} animateOpacity>
      <Drawer
        autoFocus={false}
        //   blockScrollOnMount={false}
        size="menu"
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
      >
        <DrawerOverlay>
          <DrawerContent
            bg="pong_bg_primary"
            borderRadius={40}
            border="1px solid rgba(251, 102, 19, 0.69)"
          >
            {/* <DrawerCloseButton /> */}

            <DrawerBody bg="pong_bg_secondary" borderRadius={40} p={0}>
              <Sidebar />
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Collapse>
  );
};

export default MobileSidebar;
