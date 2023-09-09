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
import Layout from "./layouts/Layout.tsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<StayLoggedIn />}>
        <Route index element={<Login />} />
      </Route>
      {/* <Route element={<AuthVerification />}> */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="settings" element={<Settings />} />
        <Route path="play" element={<Game />} />
        <Route path="chat" element={<Chat />} />
        <Route path="watch" element={<Watch />} />
        <Route path="support" element={<Support />} />
      </Route>
      {/* </Route> */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
// {
//   /* <Route element={<PrefetchUsers />} > */
// }

export default App;
// TODO: search and notification z-index, chat sidebar functionalities, responsive, padding and margins
// TODO: hamburger menu on mobile, clean code, set back routes, then settings, then chat , then game and watch, then ts support, reduce border gradient
// TODO: fix layout, bg, login
// TODO: set the Button component customizations in theme.ts
// TODO: set up theme
// TODO: set up global styles
// TODO: set up index routes and nested routes for chat, game, watch, settings
// TODO: set 2FA and configure it with the modals
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
