import { Box, Divider, Flex, Icon, IconButton, Stack, Text, createIcon } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { HiOutlineStatusOnline } from "react-icons/hi";
import useTitle from "src/hooks/useTitle";

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


const Sidebar = () => {
	const players_online = 10;
	const player_lvl = 2;

	return (
		<Stack spacing={4} align="center" p={2}
			outline="2px solid yellow"
			w="full"
		>
			<BrandIcon boxSize={'40px'} borderRadius={'50%'} bg={'white'} border="1px solid " borderColor={'#FF8707'} onClick={() => console.log('clicked')} />

			<Box as='span' w="full" h="2px" background="linear-gradient(270deg, rgba(255, 255, 255, 0.00) 0%, #FFF 55.73%, rgba(255, 255, 255, 0.00) 100%)" />

			<Text fontSize='18px' fontStyle={'normal'} fontWeight='semibold' color='whiteAlpha.900' lineHeight={'28px'} letterSpacing={1} >
				Anas Douib
			</Text>

			<Text fontSize='10px' fontStyle={'normal'} fontWeight='medium' color='pong_cl_primary' >
				Level {'   '} {player_lvl}
			</Text>
			<Flex w="full" justify="center" align="center" gap={1}
			>
				<Icon as={HiOutlineStatusOnline} boxSize={'15px'} borderRadius={'50%'} color={'green.400'} />
				<Text fontSize='10px' fontWeight='light' color='whiteAlpha.900' >
					{players_online} {'   '} players online
				</Text>
			</Flex>

			<Box as='span' w="full" h="2px" background="linear-gradient(270deg, rgba(255, 255, 255, 0.00) 0%, #FFF 55.73%, rgba(255, 255, 255, 0.00) 100%)" />
			{/* tooltip */}
			<Flex direction={'column'} w="full" justify="center" align="center" gap={1} >

			</Flex>

		</Stack>
	);
};

export default Sidebar;
