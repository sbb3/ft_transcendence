import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Box,
  Flex,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { MdLeaderboard } from "react-icons/md";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "./recentGamesStyles.css";
import { createIcon } from "@chakra-ui/react";
// import { createIcon } from '@chakra-ui/icons';

export const RankIcon = createIcon({
  displayName: "RankIcon",
  viewBox: "0 0 20 24", // Set the viewBox to match the original SVG
  path: (
    <g clipPath="url(#clip0_2343_641)">
      <path
        d="M15.25 0.375H4.75C2.33369 0.375 0.375 2.33369 0.375 4.75V15.25C0.375 17.6663 2.33369 19.625 4.75 19.625H15.25C17.6663 19.625 19.625 17.6663 19.625 15.25V4.75C19.625 2.33369 17.6663 0.375 15.25 0.375Z"
        fill="#FD3C4F"
      />
      <path
        opacity="0.3"
        d="M10 24C14.8325 24 18.75 23.4124 18.75 22.6875C18.75 21.9626 14.8325 21.375 10 21.375C5.16751 21.375 1.25 21.9626 1.25 22.6875C1.25 23.4124 5.16751 24 10 24Z"
        fill="#FD3C4F"
      />
      <path
        opacity="0.3"
        d="M9.5625 2.5625C10.7704 2.5625 11.75 1.58337 11.75 0.375H4.75C2.33369 0.375 0.375 2.33369 0.375 4.75V14.375C1.58294 14.375 2.5625 13.3959 2.5625 12.1875V4.75C2.5625 3.54381 3.54381 2.5625 4.75 2.5625H9.5625Z"
        fill="white"
      />
      <path
        opacity="0.15"
        d="M19.625 15.25V5.625C18.4171 5.625 17.4375 6.60412 17.4375 7.8125V15.25C17.4375 16.4562 16.4562 17.4375 15.25 17.4375H10.4375C9.22956 17.4375 8.25 18.4166 8.25 19.625H15.25C17.6663 19.625 19.625 17.6663 19.625 15.25Z"
        fill="#FD3C4F"
      />
      <path
        d="M2.125 5.40625C1.76231 5.40625 1.46875 5.11269 1.46875 4.75C1.46875 2.9405 2.9405 1.46875 4.75 1.46875C5.11269 1.46875 5.40625 1.76231 5.40625 2.125C5.40625 2.48769 5.11269 2.78125 4.75 2.78125C3.66456 2.78125 2.78125 3.66456 2.78125 4.75C2.78125 5.11269 2.48769 5.40625 2.125 5.40625Z"
        fill="white"
      />
      <path
        d="M10.3916 13.6029L7.46994 15.139C6.77431 15.5047 5.961 14.9137 6.09356 14.1389L6.65138 10.8852L4.28756 8.5813C3.7245 8.03267 4.03513 7.0763 4.813 6.96342L8.07938 6.48873L9.54019 3.52861C9.888 2.8238 10.8934 2.8238 11.2416 3.52861L12.7024 6.48873L15.9688 6.96342C16.7467 7.0763 17.0573 8.03267 16.4943 8.5813L14.1304 10.8856L14.6883 14.1393C14.8212 14.9141 14.0079 15.5052 13.3119 15.1394L10.3916 13.6029Z"
        fill="#FFCE29"
      />
    </g>
  ),
});

const CrownIcon = createIcon({
  displayName: "CrownIcon",
  viewBox: "0 0 75 74",
  path: (
    <g fill="none">
      <path
        d="M54.7258 12.5952C56.1349 11.9138 57.1109 10.4758 57.1109 8.80685C57.1109 7.69183 56.6679 6.62248 55.8795 5.83404C55.091 5.0456 54.0217 4.60266 52.9067 4.60266C51.7916 4.60266 50.7223 5.0456 49.9339 5.83404C49.1454 6.62248 48.7025 7.69183 48.7025 8.80685C48.7025 10.4989 49.7015 11.9484 51.1395 12.6183C49.4763 21.6273 46.9238 28.3321 37.4239 29.7643C37.4239 29.7643 39.9822 42.5559 51.948 42.5559C63.9138 42.5559 65.1265 29.8913 65.1265 29.8913C55.4188 30.388 54.5987 18.1854 54.7258 12.5952Z"
        fill="#F19534"
      />
      <path
        d="M20.2029 12.5952C18.7938 11.9138 17.8178 10.4758 17.8178 8.80685C17.8178 7.69183 18.2608 6.62248 19.0492 5.83404C19.8377 5.0456 20.907 4.60266 22.022 4.60266C23.137 4.60266 24.2064 5.0456 24.9948 5.83404C25.7833 6.62248 26.2262 7.69183 26.2262 8.80685C26.2262 10.4989 25.2271 11.9484 23.7892 12.6183C25.4524 21.6273 28.0049 28.3321 37.5048 29.7643C37.5048 29.7643 34.9465 42.5559 22.9807 42.5559C11.0149 42.5559 9.80792 29.8971 9.80792 29.8971C19.5099 30.388 20.33 18.1854 20.2029 12.5952Z"
        fill="#F19534"
      />
      <path
        d="M51.7863 42.5559C51.8383 42.5559 51.8903 42.5616 51.9422 42.5616C55.2398 42.5616 57.7172 41.5972 59.5768 40.2054L51.7863 42.5559Z"
        fill="#FFCA28"
      />
      <path
        d="M69.0015 9.73662C67.0785 9.47674 65.242 11.3074 64.9071 13.8138C64.6992 15.3788 65.1208 16.8399 65.935 17.7812L64.549 23.5273C64.549 23.5273 62.4296 37.1043 51.7228 39.7839C43.1642 41.9264 40.0631 26.2589 39.3123 21.4194C40.9409 20.6109 42.067 18.9362 42.067 16.99C42.067 14.2584 39.8552 12.0466 37.1236 12.0466C34.392 12.0466 32.1802 14.2584 32.1802 16.99C32.1802 18.9477 33.3237 20.6398 34.9811 21.4367C34.3863 26.2127 31.7644 41.3605 22.5244 39.7781C13.1458 38.1669 9.05138 22.3723 8.10428 18.0757C9.2304 17.1517 9.85988 15.5232 9.62888 13.7733C9.29393 11.2612 7.30733 9.45942 5.19369 9.74239C3.08004 10.0254 1.64207 12.2892 1.97702 14.7955C2.21957 16.6204 3.33991 18.0699 4.74324 18.6185L12.089 64.2583C12.089 64.2583 18.4993 69.323 37.1236 69.323C55.7479 69.323 62.1582 64.2583 62.1582 64.2583L69.5213 18.4973C70.7109 17.8736 71.6465 16.4703 71.8775 14.7493C72.2182 12.2372 70.9304 9.99649 69.0015 9.73662Z"
        fill="#FFCA28"
      />
      <path
        d="M37.3546 57.6979C40.4611 57.6979 42.9794 54.6961 42.9794 50.9932C42.9794 47.2902 40.4611 44.2884 37.3546 44.2884C34.2481 44.2884 31.7298 47.2902 31.7298 50.9932C31.7298 54.6961 34.2481 57.6979 37.3546 57.6979Z"
        fill="#1B3A4B"
      />
      <path
        d="M37.3546 45.9458C37.5741 46.1884 37.7704 46.633 37.3546 47.4993C36.9388 48.3655 34.6981 49.5379 34.2881 49.7746C33.8781 50.0172 33.6066 49.9075 33.4796 49.8093C32.8732 49.3242 33.1042 48.2269 33.4969 47.557C34.3401 46.1075 36.1245 44.6118 37.3546 45.9458Z"
        fill="#006466"
      />
      <path
        d="M36.9388 53.4937C36.3036 53.7998 34.2188 54.7296 34.906 55.8326C35.3103 56.4852 36.1477 56.7624 36.9157 56.797C37.6838 56.8317 38.4403 56.5891 39.1218 56.2368C42.3558 54.5621 42.6156 50.1615 41.9862 49.8266C41.3394 49.4801 40.9005 50.3752 40.5655 50.7564C39.5471 51.897 38.3149 52.8269 36.9388 53.4937Z"
        fill="#144552"
      />
      <path
        d="M68.3375 45.5069C69.2384 40.5231 65.8889 39.2757 65.8889 39.2757C65.8889 39.2757 63.729 38.883 62.7126 44.4905C61.6962 50.0923 63.8561 50.485 63.8561 50.485C63.8561 50.485 67.4308 50.4907 68.3375 45.5069Z"
        fill="#1B3A4B"
      />
      <path
        d="M66.8475 40.9793C67.6329 42.0303 66.7031 43.5838 65.1959 44.6175C64.7512 44.9236 64.1622 44.8081 64.0755 44.554C63.833 43.8264 63.9369 43.0005 64.2603 42.3018C65.219 40.2054 66.449 40.448 66.8475 40.9793Z"
        fill="#006466"
      />
      <path
        d="M5.77698 45.6571C4.87031 40.679 8.22558 39.4258 8.22558 39.4258C8.22558 39.4258 10.3854 39.0332 11.4018 44.6407C12.4182 50.2424 10.2584 50.6351 10.2584 50.6351C10.2584 50.6351 6.67788 50.6409 5.77698 45.6571Z"
        fill="#1B3A4B"
      />
      <path
        d="M9.25353 41.1179C10.0274 41.6954 9.70976 42.452 9.12648 42.9775C8.46236 43.5839 7.95416 44.248 7.38821 44.9352C7.30159 45.0392 7.20341 45.1547 7.06481 45.1835C6.79916 45.2413 6.58549 44.9699 6.49886 44.71C6.25054 43.9823 6.29674 43.1276 6.66634 42.4577C7.71739 40.5462 8.95323 40.8927 9.25353 41.1179Z"
        fill="#006466"
      />
      <path
        d="M57.8847 50.3348C57.4863 52.6044 55.6671 54.1809 53.8134 53.8575C51.9596 53.5341 51.7055 51.5995 52.104 49.33C52.5025 47.0604 53.3976 45.3221 55.2456 45.6455C57.0993 45.9689 58.2832 48.071 57.8847 50.3348Z"
        fill="#4D194D"
      />
      <path
        d="M17.7139 50.3348C18.1124 52.6044 19.9315 54.1809 21.7853 53.8575C23.639 53.5341 23.8931 51.5995 23.4947 49.33C23.0962 47.0604 22.2011 45.3221 20.3531 45.6455C18.5051 45.9689 17.3212 48.071 17.7139 50.3348Z"
        fill="#4D194D"
      />
      <path
        d="M20.3992 48.8217C19.9776 49.2953 18.9497 50.2482 18.5859 49.5205C18.0892 48.5272 18.7765 47.0257 19.5618 46.5291C20.3472 46.0324 20.9883 46.4251 21.098 46.8698C21.2308 47.4358 20.7746 48.3944 20.3992 48.8217Z"
        fill="#FFA8A4"
        fillOpacity="0.1"
      />
      <path
        d="M53.259 50.2713C52.6873 50.1846 52.6237 48.2154 54.1599 46.6677C54.8933 45.9285 55.9443 46.8063 55.6787 47.9901C55.4246 49.1163 54.3043 50.433 53.259 50.2713Z"
        fill="#FFA8A4"
        fillOpacity="0.1"
      />
      <path
        d="M63.1746 56.7162C59.7154 58.4487 51.7806 63.0629 37.1294 63.0629C22.4783 63.0629 14.5434 58.4487 11.0842 56.7162C11.0842 56.7162 9.84259 57.3803 9.84259 58.0733V63.3921C9.84259 64.1024 10.218 64.755 10.8301 65.1188C13.5328 66.7127 21.7679 70.478 37.1352 70.478C52.5024 70.478 60.7376 66.7127 63.4403 65.1188C63.7407 64.9416 63.9899 64.6892 64.163 64.3864C64.3362 64.0836 64.4275 63.7409 64.4278 63.3921V58.0733C64.4162 57.3803 63.1746 56.7162 63.1746 56.7162Z"
        fill="#FFCA28"
      />
      <path
        d="M23.0096 64.01C24.6266 64.3276 25.1175 64.4662 25.0077 65.3671C24.7825 67.14 21.1038 66.7184 18.9267 66.1467C14.428 64.9628 13.5155 63.7154 13.5155 62.6009C13.5155 61.5787 14.3009 61.4574 15.5136 61.8848C16.9632 62.3987 19.2039 63.265 23.0096 64.01Z"
        fill="#FFF59D"
      />
      <path
        d="M63.1746 57.8827C63.1746 57.8827 53.6055 63.2996 37.1294 63.2996C20.6534 63.2996 11.0842 57.8827 11.0842 57.8827"
        stroke="#F19534"
        strokeWidth="2.95679"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
      <path
        d="M15.7158 28.6266C18.7881 26.4321 20.4397 22.4994 20.5841 16.2393C20.5956 15.6733 20.7573 15.5059 21.0634 15.4712C21.5543 15.4192 21.6351 15.8639 21.6294 16.1815C21.4908 22.9383 20.6303 27.1598 17.223 29.5391C17.0556 29.6546 15.8601 30.3822 15.3519 29.8798C14.7456 29.2908 15.5194 28.7652 15.7158 28.6266Z"
        fill="#FFCA28"
      />
      <path
        d="M18.5282 8.97435C18.43 7.92907 18.6725 6.04643 21.4156 5.19173C22.2184 4.9434 22.715 5.3361 22.8074 5.64218C23.0384 6.40448 22.3685 6.70478 22.0624 6.80295C19.9546 7.4844 19.8506 8.53545 19.4175 9.20535C18.9844 9.87524 18.5628 9.29197 18.5282 8.97435Z"
        fill="#FFCA28"
      />
      <path
        d="M45.3126 27.2406C48.0903 24.7747 49.9326 22.0201 51.1453 15.7484C51.255 15.194 51.4167 15.0439 51.717 15.0554C52.2079 15.067 52.231 15.5232 52.179 15.835C51.1511 22.5225 50.1751 24.4282 46.7505 28.2224C46.3636 28.6497 45.4223 29.0367 44.891 28.592C44.4117 28.1935 44.9661 27.5525 45.3126 27.2406Z"
        fill="#FFCA28"
      />
      <path
        d="M49.4013 9.02629C49.3031 7.98101 49.5456 6.09837 52.2888 5.24367C53.0915 4.99534 53.5881 5.38804 53.6805 5.69412C53.9115 6.45642 53.2416 6.75672 52.9355 6.85489C50.8277 7.53634 50.7237 8.58739 50.2906 9.25729C49.8633 9.92719 49.4359 9.34391 49.4013 9.02629Z"
        fill="#FFCA28"
      />
      <path
        d="M18.3838 41.3605C11.6733 38.317 9.69821 30.3764 8.64716 26.9288C8.50856 26.4725 8.57786 26.0394 9.03409 25.9008C9.49031 25.7622 9.76174 26.0567 9.90611 26.513C10.6684 29.0135 13.631 37.3642 19.7467 39.7377C20.1914 39.9109 20.8844 40.3325 20.509 41.0544C20.2607 41.5222 19.4637 41.8513 18.3838 41.3605Z"
        fill="#FFF59D"
      />
      <path
        d="M7.46328 14.2238C7.13988 13.5539 7.00705 12.9187 5.24568 12.1852C4.80101 12.0004 4.50648 11.5904 4.62776 11.1284C4.74903 10.6664 5.21103 10.3199 5.88093 10.4354C8.0581 10.8108 8.53165 13.0226 8.62405 13.7907C8.71068 14.5299 7.79245 14.8937 7.46328 14.2238Z"
        fill="#FFF59D"
      />
      <path
        d="M56.0829 41.3605C62.7934 38.317 64.7685 30.3764 65.8195 26.9288C65.9581 26.4725 65.8888 26.0394 65.4326 25.9008C64.9764 25.7622 64.705 26.0567 64.5606 26.513C63.7983 29.0135 60.8357 37.3642 54.72 39.7377C54.2753 39.9109 53.5823 40.3325 53.9577 41.0544C54.206 41.5222 55.003 41.8513 56.0829 41.3605Z"
        fill="#FFF59D"
      />
      <path
        d="M67.0035 14.2238C67.3269 13.5539 67.4597 12.9187 69.221 12.1852C69.6657 12.0004 69.9602 11.5904 69.839 11.1284C69.7177 10.6664 69.2557 10.3199 68.5858 10.4354C66.4086 10.8108 65.9351 13.0226 65.8427 13.7907C65.7561 14.5299 66.6801 14.8937 67.0035 14.2238Z"
        fill="#FFF59D"
      />
      <path
        d="M34.4325 17.0651C34.7848 16.3432 35.4027 15.3557 37.4182 14.9399C38.192 14.7782 38.4172 14.4433 38.3479 13.9351C38.2093 12.8782 36.8926 12.9533 36.1823 13.1208C33.8146 13.6752 33.289 15.7773 33.1909 16.6089C33.0927 17.4001 34.086 17.787 34.4325 17.0651Z"
        fill="#FFF59D"
      />
    </g>
  ),
});

// generate the same leaderboardData with random names and image urls, except remove the score
const leaderboardData = [
  {
    rank: "1",
    name: "Anas Douib",
    image: "https://anasdouib.me/images/picture.webp",
  },
  {
    rank: "2",
    name: "Dan Abramov",
    image: "https://bit.ly/dan-abramov",
  },
  {
    rank: "3",
    name: "Prosper Otemuyiwa",
    image: "https://bit.ly/prosper-baba",
  },
  {
    rank: "4",
    name: "code-beast",
    image: "https://bit.ly/code-beast",
  },
  {
    rank: "5",
    name: "Ryan Florence",
    image: "https://bit.ly/ryan-florence",
  },
  {
    rank: "6",
    name: "Kent C. Dodds",
    image: "https://bit.ly/kent-c-dodds",
  },
  {
    rank: "7",
    name: "prosper-baba",
    image: "https://bit.ly/prosper-baba",
  },
  {
    rank: "8",
    name: "prosper-baba",
    image: "https://bit.ly/code-beast",
  },
  {
    rank: "9",
    name: "Ryan Florence",
    image: "https://bit.ly/ryan-florence",
  },
  {
    rank: "10",
    name: "Ryan Florence",
    image: "https://bit.ly/kent-c-dodds",
  },
  {
    rank: "11",
    name: "Ryan Florence",
    image: "https://bit.ly/prosper-baba",
  },
  {
    rank: "12",
    name: "Ryan Florence",
    image: "https://bit.ly/code-beast",
  },
  {
    rank: "13",
    name: "Ryan Florence",
    image: "https://bit.ly/ryan-florence",
  },
  {
    rank: "14",
    name: "Ryan Florence",
    image: "https://bit.ly/kent-c-dodds",
  },
  {
    rank: "15",
    name: "Ryan Florence",
    image: "https://bit.ly/prosper-baba",
  },
  {
    rank: "16",
    name: "Ryan Florence",
    image: "https://bit.ly/code-beast",
  },
];

const Card = ({ person }) => {
  const { rank, name, image } = person;

  return (
    <Flex
      direction="row"
      justify="space-between"
      borderRadius="22px"
      align="center"
      gap={2}
      pl={2}
      pr={2}
      w="220px"
      h="40px"
      bgColor={
        rank == "1"
          ? "#FFCA28"
          : rank == "2"
          ? "#F4F4F4"
          : rank == "3"
          ? "#FF8228"
          : "rgba(255, 255, 255, 0.2)"
      }
    >
      <Flex direction="row" gap={3} align="center" pl={2} pr={2}>
        <Text fontSize="12px" fontWeight="bold" color="#312244">
          {rank}
        </Text>
        <Avatar size="sm" name={name} src={image} />
        <Text fontSize="14px" fontWeight="medium" color="#312244">
          {name}
        </Text>
      </Flex>
      <RankIcon boxSize={6} />
    </Flex>
  );
};

const Leaderboard = () => {
  return (
    <Stack
      // outline="2px solid yellow"
      // p={2}
      direction={{ base: "column" }}
      spacing="12px"
      borderRadius={24}
      border="1px solid rgba(251, 102, 19, 0.69)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.25)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('src/assets/img/BlackNoise.png')`}
      bgSize="cover"
      bgRepeat="no-repeat"
      w={{ base: "350px", lg: "350px" }}
      h={{ base: "600px" }}
      p={2}
    >
      <Flex direction="row" align="center" justify="center" gap={1.5} mt={2}>
        <Icon boxSize="22px" as={MdLeaderboard} color="white" />
        <Text
          fontSize="20px"
          fontWeight="semibold"
          color="whiteAlpha.900"
          letterSpacing={1}
        >
          Leaderboard
        </Text>
      </Flex>
      <Flex
        direction="row"
        align="center"
        justify="space-evenly"
        gap={1.5}
        mt={16}
      >
        <Stack direction="column" spacing={4} align="center">
          <Avatar
            size="lg"
            name={"Anas Douib"}
            src={"https://anasdouib.me/images/picture.webp"}
            borderColor={"white"}
            borderWidth="4px"
            // borderRadius="0px"
          >
            <AvatarBadge
              boxSize="0.9em"
              border="4px solid #312244"
              bg={"white"}
              position="absolute"
              bottom={"-15%"}
              left={"25%"}
              translateY={"50%"}
            >
              <Text fontSize="10px" fontWeight="bold" color="#312244">
                {"2"}
              </Text>
            </AvatarBadge>
          </Avatar>
          <Flex direction="column" align="center" justify="center" gap={0}>
            <Text fontSize="12px" fontWeight="semibold" color="whiteAlpha.800">
              {"Anas Douib"}
            </Text>
            <Text fontSize="10px" fontWeight="light" color="whiteAlpha.600">
              {"Level 2"}
            </Text>
          </Flex>
        </Stack>
        <Stack direction="column" spacing={4} align="center">
          <Avatar
            size="xl"
            name={"Anas Douib"}
            src={"https://anasdouib.me/images/picture.webp"}
            borderColor={"#FFCA28"}
            borderWidth="4px"
            // borderRadius="0px"
          >
            <Box
              position="absolute"
              top={"-14"}
              // top={"0"}
              translateY={"-50%"}
            >
              <CrownIcon boxSize="75px" />
            </Box>
            <AvatarBadge
              boxSize="0.9em"
              border="5px solid #312244"
              bg={"#FFCA28"}
              position="absolute"
              bottom={"-15%"}
              left={"25%"}
              translateY={"50%"}
            >
              <Text fontSize="10px" fontWeight="bold" color="#312244">
                {"1"}
              </Text>
            </AvatarBadge>
          </Avatar>
          <Flex direction="column" align="center" justify="center" gap={0}>
            <Text fontSize="12px" fontWeight="semibold" color="whiteAlpha.800">
              {"Anas Douib"}
            </Text>
            <Text fontSize="10px" fontWeight="light" color="whiteAlpha.600">
              {"Level 1"}
            </Text>
          </Flex>
        </Stack>
        <Stack direction="column" spacing={4} align="center">
          <Avatar
            size="lg"
            name={"Anas Douib"}
            src={"https://anasdouib.me/images/picture.webp"}
            borderColor={"#FF8228"}
            borderWidth="4px"
            // borderRadius="0px"
          >
            <AvatarBadge
              boxSize="0.9em"
              border="4px solid #312244"
              bg={"#FF8228"}
              position="absolute"
              bottom={"-15%"}
              left={"25%"}
              translateY={"50%"}
            >
              <Text fontSize="10px" fontWeight="bold" color="#312244">
                {"3"}
              </Text>
            </AvatarBadge>
          </Avatar>
          <Flex direction="column" align="center" justify="center" gap={0}>
            <Text fontSize="12px" fontWeight="semibold" color="whiteAlpha.800">
              {"Anas Douib"}
            </Text>
            <Text fontSize="10px" fontWeight="light" color="whiteAlpha.600">
              {"Level 3"}
            </Text>
          </Flex>
        </Stack>
      </Flex>
      <Box
        w="100%"
        h="100%"
        borderRadius="xl"
        p={2}
        mb={0}
        overflow="hidden"
        // outline="2px solid red"
      >
        <ScrollArea.Root className="ScrollAreaRoot">
          <ScrollArea.Viewport className="ScrollAreaViewport">
            <Stack
              // p={2}
              id="scrollableStack"
              gap={"12px"}
              justify="center"
              align="center"
              wrap="wrap"
              overflow="hidden"
              outline="2px solid red"
              // mr={2}
            >
              {leaderboardData.map((person, i) => (
                <Card key={i} person={person} />
              ))}
            </Stack>
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
      </Box>
    </Stack>
  );
};

export default Leaderboard;
