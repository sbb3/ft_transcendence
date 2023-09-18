import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { AiFillDelete } from "react-icons/ai";
import Members from "./Members";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import ChannelSettings from "./ChannelSettings";
import ChannelInfo from "./ChannelInfo";
dayjs.extend(relativeTime);

const ChannelInfoAbout = ({
  isOpenChannelInfo,
  onToggleChannelInfo,
  channel = null,
}: {
  isOpenChannelInfo: boolean;
  onToggleChannelInfo: () => void;
  channel?: any;
}) => {
  const currentUser = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  const toast = useToast();

  return (
    <>
      <Modal
        isOpen={isOpenChannelInfo}
        onClose={onToggleChannelInfo}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent
          // bg="green"
          borderRadius={40}
          // maxH="350px"
          // maxW={{ base: "full", sm: "350px", md: 450 }}
          maxW={{ base: "350px", lg: "550px" }}
          mt={4}
          border="1px solid rgba(251, 102, 19, 0.3)"
          boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
          backdropFilter={"blur(20px)"}
          bgImage={`url('src/assets/img/BlackNoise.png')`}
          bgSize="cover"
          bgRepeat="no-repeat"
          bg="transparent"
          //   w={{ base: "full", sm: "full", md: 820 }}
        >
          <ModalHeader># {channel?.name}</ModalHeader>
          <ModalCloseButton onClick={onToggleChannelInfo} />
          <ModalBody p={2} borderRadius={40}>
            <Stack
              mt={0}
              spacing={4}
              //  w={{ base: "full", sm: "full", md: 620 }}
              align="center"
              borderRadius={40}
              pl={3}
              pr={2}
              w="full"
            >
              <Flex
                direction="row"
                align="center"
                justify="center"
                mt={4}
                w="full"
              >
                <Tabs
                  variant="soft-rounded"
                  colorScheme="orange"
                  align="center"
                  isFitted
                  isLazy
                  w="full"
                >
                  <TabList>
                    <Tab
                      _selected={{ color: "white", bg: "orange.500" }}
                      _focus={{ boxShadow: "none" }}
                      _hover={{ color: "orange.500", bg: "white" }}
                      borderRadius={40}
                      letterSpacing={1}
                      fontSize="md"
                      fontWeight="bold"
                      px={4}
                      py={2}
                      mr={2}
                    >
                      About
                    </Tab>
                    <Tab
                      _selected={{ color: "white", bg: "orange.500" }}
                      _focus={{ boxShadow: "none" }}
                      _hover={{ color: "orange.500", bg: "white" }}
                      borderRadius={40}
                      letterSpacing={1}
                      fontSize="md"
                      fontWeight="bold"
                      px={4}
                      py={2}
                      mr={2}
                    >
                      Members
                    </Tab>
                    <Tab
                      _selected={{ color: "white", bg: "orange.500" }}
                      _focus={{ boxShadow: "none" }}
                      _hover={{ color: "orange.500", bg: "white" }}
                      borderRadius={40}
                      letterSpacing={1}
                      fontSize="md"
                      fontWeight="bold"
                      px={4}
                      py={2}
                      mr={2}
                    >
                      Settings
                    </Tab>
                  </TabList>
                  <TabPanels p={0}>
                    <TabPanel>
                      <ChannelInfo channel={channel} />
                    </TabPanel>
                    <TabPanel>
                      <Members channel={channel} />
                    </TabPanel>
                    <TabPanel>
                      <ChannelSettings
                        channel={channel}
                        onToggleChannelInfo={onToggleChannelInfo}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Flex>
            </Stack>
          </ModalBody>

          <ModalFooter p={4}>
            <Button
              bg={"white"}
              color={"orange.500"}
              letterSpacing={1}
              mr={3}
              onClick={onToggleChannelInfo}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChannelInfoAbout;
