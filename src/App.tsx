import './App.css'
import { Routes, Route } from "react-router-dom";
import Layout from './layouts/Layout.tsx';
import Overview from './pages/Overview.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import Game from './pages/Game.tsx';
import Chat from './pages/Chat.tsx';
import Support from './pages/Support';
import Settings from './pages/Settings';
import Watch from './pages/Watch';
import Login from './pages/Login';
import AuthVerification from './features/auth/AuthVerification';
// import { FileUploader } from "react-drag-drop-files";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route element={<AuthVerification />} >
				{/* <Route element={<PrefetchUsers />} > */}
				<Route path="/" element={<Layout />} >
					<Route index element={<Overview />} />
					<Route path="settings" element={<Settings />} />
					<Route path="game" element={<Game />} />
					<Route path="chat" element={<Chat />} />
					<Route path="watch" element={<Watch />} />
					<Route path="support" element={<Support />} />
				</Route>
				<Route path="*" element={<NotFoundPage />} />
			</Route>
		</Routes>
	)
}

export default App

// TODO: set up index routes and nested routes for chat, game, watch, settings
// TODO: set up login page AND navigate to overview page after login, and navigate to login page after logout
// TODO: set up hooks for login and logout
// TODO: create components for each page
// TODO: set up theme
// TODO: set up global styles
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