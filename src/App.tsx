import { Routes, Route } from "react-router-dom";
import AuthVerification from "./features/auth/AuthVerification";
import StayLoggedIn from "./features/auth/StayLoggedIn.tsx";
import {
	Overview,
	Settings,
	Game,
	Chat,
	Watch,
	Support,
	Login,
	NotFoundPage,
} from "./pages";
import Background from "./Background.tsx";
import Layout from "./layouts/Layout.tsx";
import { Box, Flex } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar.tsx";

function App() {
	return (
		<Flex pos="relative" justify="center" align="center" boxSizing="border-box" m={0} bg="teal.700" color={"whiteAlpha.900"} w="100%">

			<Box w="150px" h={'900px'} bg="purple.400"
				display={{ base: "none", lg: "flex" }}
				mt={2}
				mb={2}

			>
				<Sidebar />
			</Box>
		</Flex>
		// <Routes>
		// 	{/* <Route path="/bg" element={<Background />} /> */}
		// 	{/* {/* <Route path="/login" element={<StayLoggedIn />} > */}
		// 	{/* <Route index element={<Login />} /> */}
		// 	{/* <Route path="/login" element={<Login />} /> */}
		// 	{/* </Route> */}
		// 	{/* <Route element={<AuthVerification />} > */}
		// 	<Route path="/" element={<Layout />} >
		// 		<Route index element={<Overview />} />
		// 		<Route path="settings" element={<Settings />} />
		// 		<Route path="play" element={<Game />} />
		// 		<Route path="chat" element={<Chat />} />
		// 		<Route path="watch" element={<Watch />} />
		// 		<Route path="support" element={<Support />} />
		// 	</Route>
		// 	{/* </Route> */}


		// 	{/* <Route path="*" element={<NotFoundPage />} /> */}
		// </Routes>

	);
}
{
	/* <Route element={<PrefetchUsers />} > */
}

export default App;

// TODO: set layout, bg, login
// TODO: set the Button component customizations in theme.ts
// TODO: set up theme
// TODO: set up global styles
// TODO: set up index routes and nested routes for chat, game, watch, settings
// TODO: set up 2FA
// TODO: set up expressjs server
// TODO: set up login page AND navigate to overview page after login, and navigate to login page after logout
// TODO: set up hooks for login and logout
// TODO: create components for each page
// TODO: protect routes,
// TODO: set up auth verification
// TODO: set providesTags for query endpoints
// TODO: set up prefetching before overview page
// TODO: set user and auth state and api slices
// TODO: set Login page, set up login and logout hooks, dispatch login and logout actions

// TODO: make the project compatible with typescript
// TODO: test the auth verification with the backend
// TODO: Solution1: usePrefetch onclick or onhover on the searchbar, `https://redux-toolkit.js.org/rtk-query/usage/prefetching` with force: true, Problem: when a new user login, I should now if he already in the db or not, so I could invalidate the getUsers cache and refetch it, for ex: in the search bar, when I search for a user, I should get the new user in the search result.
// TODO: Solution2: fetch on scroll down,
// TODO: Solution3: refetchOnMountOrArgChange and refetchOnFocus
// TODO: color spinner
