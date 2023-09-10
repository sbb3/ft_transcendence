import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  IconButton,
  Stack,
  Text,
  Tooltip,
  createIcon,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import { GoPlay } from "react-icons/go";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { IoChatbubbleEllipsesSharp, IoSettingsOutline } from "react-icons/io5";
import { MdSpaceDashboard, MdContactSupport } from "react-icons/md";
import { BsBinocularsFill } from "react-icons/bs";
import { BiSolidLogOutCircle } from "react-icons/bi";
import { BeatLoader } from "react-spinners";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const BrandIcon = createIcon({
  displayName: "BrandIcon",
  viewBox: "0 0 40 40", // Set the viewBox to match the original SVG
  path: (
    <path
      d="M3.52388 16.5093L23.4907 36.4762C23.7822 36.7677 23.6415 37.2627 23.2363 37.3383C22.5537 37.4658 21.864 37.5528 21.1711 37.599C21.0972 37.6037 21.0231 37.5925 20.9538 37.5662C20.8846 37.5399 20.8218 37.4991 20.7696 37.4465L2.55354 19.2305C2.50098 19.1783 2.46019 19.1155 2.43389 19.0462C2.40759 18.977 2.39639 18.9029 2.40105 18.829C2.4478 18.1284 2.53553 17.4393 2.66175 16.7637C2.73738 16.3585 3.23238 16.2178 3.52388 16.5093ZM2.96123 24.5938C2.82785 24.0969 3.41498 23.7834 3.77881 24.1472L15.8527 36.2212C16.2167 36.5851 15.9032 37.1721 15.4062 37.0388C9.35211 35.4156 4.58456 30.6481 2.96123 24.5938ZM4.7112 11.2226C4.88073 10.929 5.28141 10.8839 5.52107 11.1237L28.8765 34.4788C29.1163 34.7186 29.0713 35.1193 28.7775 35.2889C28.2818 35.575 27.7724 35.8368 27.2512 36.0733C27.0546 36.1627 26.8236 36.1176 26.6710 35.9647L4.03524 13.3295C3.88248 13.1766 3.83738 12.9459 3.92662 12.7491C4.16311 12.2279 4.42495 11.7185 4.7112 11.2229V11.2226ZM19.9807 2.40002C29.7116 2.40002 37.6 10.2884 37.6 20.0193C37.6 25.1852 35.3769 29.8316 31.8352 33.0543C31.6307 33.2405 31.3171 33.2281 31.1216 33.0327L6.9673 8.87849C6.77191 8.68296 6.75968 8.36932 6.94558 8.16486C10.1684 4.62313 14.815 2.40002 19.9807 2.40002Z"
      fill="#FF8707"
    />
  ),
});

const MotionBrandIcon = motion(Box);

const NavigationPanel = [
  {
    name: "Overview",
    icon: MdSpaceDashboard,
    path: "/",
  },
  {
    name: "Settings",
    icon: IoSettingsOutline,
    path: "/settings",
  },
  {
    name: "Play",
    icon: GoPlay,
    path: "/play",
  },
  {
    name: "Watch",
    icon: BsBinocularsFill,
    path: "/watch",
  },
  {
    name: "Chat",
    icon: IoChatbubbleEllipsesSharp,
    path: "/chat",
  },
  {
    name: "Support",
    icon: MdContactSupport,
    path: "/support",
  },
  {
    name: "Logout",
    icon: BiSolidLogOutCircle,
    path: "/login",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const players_online = 10;
  const player_lvl = 2;

  return (
    <Stack
      w="160px"
      display={{ base: "none", lg: "flex" }}
      justify="start"
      spacing={8}
      pt={4}
      pb={6}
      borderRadius={24}
      bg="pong_bg_secondary"
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
      // m={2}
    >
      <Stack
        spacing={5}
        align="center"
        w="full"
        // h="full"
        pos="relative"
        // outline="2px solid red"
      >
        {/* <BrandIcon
					boxSize={"40px"}
					borderRadius={"50%"}
					bg={"white"}
					border="1px solid "
					borderColor={"#FF8707"}
					onClick={() => console.log("clicked")}
	/> */}
        <MotionBrandIcon
          // pos="absolute"
          w={{ base: "40px" }}
          h={{ base: "40px" }}
          bgImage="url('src/assets/svgs/brand_icon.svg')"
          bgPosition="center"
          bgSize="contain"
          bgRepeat="no-repeat"
          bgBlendMode="lighten"
          // animate={{ rotate: 360 }}
          // transition={{ ease: "linear", duration: 5, repeat: Infinity }}
          opacity={0.9}
        />

        <Box
          as="span"
          w="full"
          h="2px"
          background="linear-gradient(270deg, rgba(255, 255, 255, 0.00) 0%, #FFF 55.73%, rgba(255, 255, 255, 0.00) 100%)"
        />
        <Stack spacing={2} align="center" justify="center">
          <Text
            fontSize="16px"
            fontStyle={"normal"}
            fontWeight="semibold"
            color="whiteAlpha.900"
            lineHeight={"28px"}
            letterSpacing={1}
            textAlign={"center"}
          >
            Anas Douib
          </Text>

          <Text
            fontSize="10px"
            fontStyle={"normal"}
            fontWeight="medium"
            color="pong_cl_primary"
          >
            Level {"   "} {player_lvl}
          </Text>
          <Flex w="full" justify="center" align="center" gap={1}>
            <Icon
              as={HiOutlineStatusOnline}
              boxSize={"20px"}
              borderRadius={"50%"}
              color={"green.400"}
            />
            <Text fontSize="10px" fontWeight="light" color="whiteAlpha.900">
              {players_online} {"   "} players online
            </Text>
          </Flex>
        </Stack>

        <Box
          as="span"
          w="full"
          h="2px"
          background="linear-gradient(270deg, rgba(255, 255, 255, 0.00) 0%, #FFF 55.73%, rgba(255, 255, 255, 0.00) 100%)"
        />
        <Stack spacing={0} align="end" w="full">
          <Flex direction={"column"} justify="center" align="center" gap={5}>
            {NavigationPanel.map((nav, index) => (
              <Tooltip
                label={nav.name}
                aria-label={nav.name}
                placement="right"
                key={index}
                closeOnClick
                hasArrow
                bg={nav.name === "Logout" ? "#E53E3E" : "#FB6613"}
              >
                <Button
                  key={index}
                  w="120px"
                  size="lg"
                  color={"white"}
                  bg={"none"}
                  pr={{ base: 0, md: "10px", lg: "20px" }}
                  alignItems={"center"}
                  alignSelf={"stretch"}
                  borderRight="7px solid rgba(253, 127, 44, 0)"
                  leftIcon={
                    <Icon as={nav.icon} boxSize={"22px"} borderRadius={"50%"} />
                  }
                  _hover={{
                    background:
                      nav.name === "Logout"
                        ? "linear-gradient(90deg, rgba(229,62,62,0.2) 3.89%, rgba(253,127,44,0.12) 47.44%, rgba(133,30,30,0.5) 80.48%)"
                        : "linear-gradient(270deg, rgba(118, 56, 20, 0.60) 3.89%, rgba(253, 127, 44, 0.12) 47.44%, rgba(253, 127, 44, 0.15) 80.48%)",
                    borderRight:
                      nav.name === "Logout"
                        ? "7px solid #E53E3E"
                        : "7px solid #FB6613",
                    borderRadius:
                      nav.name === "Logout"
                        ? "6px 0px 6px 6px"
                        : "6px 0px 0px 6px",
                    color: nav.name === "Logout" ? "#E53E3E" : "#FB6613",
                  }}
                  onClick={() => navigate(nav.path)}
                />
              </Tooltip>
            ))}
          </Flex>
        </Stack>
        <Box
          as="span"
          w="full"
          h="2px"
          background="linear-gradient(270deg, rgba(255, 255, 255, 0.00) 0%, #FFF 55.73%, rgba(255, 255, 255, 0.00) 100%)"
        />
      </Stack>
      <Stack
        spacing={0}
        align="end"
        // p={2}
        // outline="1px solid yellow"
        w="full"
        // h="full"
      >
        {/* <Flex
          direction={"column"}
          justify="center"
          align="center"
          gap={5}
          // outline="1px solid red"
        >
          <Tooltip
            label={"Logout"}
            aria-label={"Logout"}
            placement="right"
            closeOnClick
            hasArrow
            bg={"red.500"}
          >
            <Button
              w="120px"
              size="lg"
              color={"white"}
              bg={"none"}
              pr={{ base: 0, md: "10px", lg: "20px" }}
              alignItems={"center"}
              alignSelf={"stretch"}
              borderRight="7px solid rgba(255, 255, 255, 0)"
              leftIcon={
                <Icon
                  as={BiSolidLogOutCircle}
                  boxSize={"22px"}
                  borderRadius={"50%"}
                />
              }
              _hover={{
                background:
                  "linear-gradient(90deg, rgba(229,62,62,0.2) 3.89%, rgba(253,127,44,0.12) 47.44%, rgba(133,30,30,0.5) 80.48%)",
                borderRight: "7px solid #E53E3E",
                borderRadius: "6px 0px 6px 6px",
                color: "#E53E3E",
              }}
              onClick={() => console.log("clicked on dashboard")}
            />
          </Tooltip>
        </Flex> */}
      </Stack>
    </Stack>
  );
};

export default Sidebar;
