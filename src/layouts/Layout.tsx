import { Outlet } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import Header from "./Header";
import Sidebar from "src/components/Sidebar";

const Layout = () => {
	return (
		<Box // outter-container - outter box
			minW="100vw"
			bg="#F5F5F5" // set colors in theme.ts
			color="#2B373A"
			boxSizing="border-box"
			m={0}
			mb={6}
			pos="relative"
		>
			<Flex // inner-container - inner box
				mx="auto"
				maxW={{ base: "full", md: 748, lg: 972, xl: 1260 }} // full of its parent Box, sm of its parent width, md of 708px, lg of 964px and so
				// !! TODO: set maxH 
				bg="red"
			>
				<Flex
					w="60px"
					h="100vh"
					bg="red"
				>
					<Sidebar />
				</Flex>
				<Flex
					flex={1}
					direction={'column'}
				>
					<Header />
					<Flex
						flex={1}
						bg="green"
					>
						<Outlet />
					</Flex>
				</Flex>
			</Flex>
		</Box>
	);
}

export default Layout;

// ! TODO search and notification and sidebar
// ! TODO set colors in theme.ts
