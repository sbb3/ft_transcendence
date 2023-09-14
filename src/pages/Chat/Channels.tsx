import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FiHash, FiInfo, FiPlus, FiSearch } from "react-icons/fi";
import channels from "src/config/data/channels";

const Channels = ({
  toggleContent,
  setType,
  setChannelData,
  setIsSearchForChannelOpen,
  setIsChannelInfoOpen,
  setIsCreateChannelOpen,
}) => {
  return (
    <Stack justify="start" align="start" w="full" gap="0px">
      <Flex direction="row" justify="space-between" align="center" w="full">
        <Flex justify="start" align="center" direction="row" gap="2px">
          <Menu
            gutter={14}
            computePositionOnMount={true}
            defaultIsOpen
            preventOverflow={true}
            boundary="scrollParent"
            closeOnBlur={false}
            strategy="absolute"
            closeOnSelect={false}
            flip={false}
          >
            {({ isOpen }) => (
              <>
                <MenuButton
                  isActive={isOpen}
                  as={Button}
                  leftIcon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  sx={{
                    "&:hover": {
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    },
                    "&:active": {
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    },
                    "&:focus": {
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    },
                    "&:selected": {
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    },
                    fontSize: "14px",
                    fontWeight: "semibold",
                    color: "white",
                    padding: "0px",
                    height: "auto",
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                  _active={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                  _focus={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                  _hover={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                  _selected={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                >
                  Channels
                </MenuButton>
                <MenuList
                  p={0}
                  bg={"trasparent"}
                  w={{ base: "250px", sm: "360px", md: "284px" }}
                  h="250px"
                  borderRadius={"16px"}
                  border={"none"}
                  // bg={"red"}
                  // overflowY={"hidden"}
                >
                  <ScrollArea.Root className="ScrollAreaRoot">
                    <ScrollArea.Viewport className="ScrollAreaViewport">
                      {channels.map((channel, index) => (
                        <>
                          <MenuItem
                            key={index}
                            bg={"trasparent"}
                            borderRadius={"6px"}
                            icon={<FiHash />}
                            _focus={{ bg: "pong_bg.200" }}
                            _hover={{ bg: "pong_bg.200" }}
                            _selected={{ bg: "pong_bg.200" }}
                            fontSize={{
                              base: "13px",
                              sm: "14px",
                              md: "15px",
                            }}
                            onClick={() => {
                              // TODO: dispatch to close drawer when changing between dm and channels
                              toggleContent(true);
                              setType("channel");
                              setChannelData(channel);
                            }}
                          >
                            {channel.name}
                          </MenuItem>
                        </>
                      ))}
                    </ScrollArea.Viewport>
                    <ScrollArea.Scrollbar
                      className="ScrollAreaScrollbar"
                      orientation="vertical"
                    >
                      <ScrollArea.Thumb className="ScrollAreaThumb" />
                    </ScrollArea.Scrollbar>
                    <ScrollArea.Scrollbar
                      className="ScrollAreaScrollbar"
                      orientation="horizontal"
                    >
                      <ScrollArea.Thumb className="ScrollAreaThumb" />
                    </ScrollArea.Scrollbar>
                    <ScrollArea.Corner className="ScrollAreaCorner" />
                  </ScrollArea.Root>
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>
        <Flex direction="row" gap="2px" align={"center"} justify="center">
          <IconButton
            size="xs"
            fontSize="lg"
            bg={"pong_bg_secondary"}
            color={"white"}
            borderRadius={8}
            aria-label="Search for a channel"
            icon={<FiSearch />}
            _hover={{ bg: "white", color: "pong_bg_secondary" }}
            onClick={() => {
              setIsSearchForChannelOpen(true);
            }}
          />
          <IconButton
            size="xs"
            fontSize="lg"
            bg={"pong_bg_secondary"}
            color={"white"}
            borderRadius={8}
            aria-label="Channel info"
            icon={<FiInfo />}
            _hover={{ bg: "white", color: "pong_bg_secondary" }}
            onClick={() => {
              setIsChannelInfoOpen(true);
            }}
          />
          <IconButton
            size="xs"
            fontSize="lg"
            bg={"pong_bg_secondary"}
            color={"white"}
            borderRadius={8}
            aria-label="Add a channel"
            icon={<FiPlus />}
            _hover={{ bg: "white", color: "pong_bg_secondary" }}
            onClick={() => {
              setIsCreateChannelOpen(true);
            }}
          />
        </Flex>
      </Flex>
      <Box mt={3} w="full" height="255px"></Box>
    </Stack>
  );
};

export default Channels;
