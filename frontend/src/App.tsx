import { Routes, Route } from "react-router-dom";
// import AuthVerification from "./features/auth/AuthVerification.tsx";
// import StayLoggedIn from "./features/auth/StayLoggedIn.tsx";
import {
  Overview,
  Settings,
  Game,
  Chat,
  Watch,
  Support,
  Login,
  NotFoundPage,
  PlayerProfile,
} from "./pages/index.tsx";
import Layout from "./layouts/Layout.tsx";
// import ChatContent from "./pages/Chat/ChatContent.tsx";
// import ChatSplashScreen from "./pages/Chat/ChatSplashScreen.tsx";
// import Signin from "./pages/Signin.tsx";
// import Public from "./pages/Public.tsx";
// import Register from "./pages/Register.tsx";

function App() {
  return (
    <Routes>
      {/* <Route path="/login" element={<StayLoggedIn />}>
        <Route index element={<Login />} />
      </Route> */}
      {/* <Route
        path="/"
        element={
          <Public>
            <Signin />
          </Public>
        }
      />
      <Route
        path="/register"
        element={
          <Public>
            <Register />
          </Public>
        } style={{}}

      /> */}

      {/* <Route element={<AuthVerification />}> */}
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Overview />} /> */}
          {/* <Route path="profile/:username" element={<PlayerProfile />} /> */}
          {/* <Route path="settings" element={<Settings />} /> */}
          <Route path="play" element={<Game />} />
          {/* <Route path="chat" element={<Chat />}>
            <Route index element={<ChatSplashScreen />} />
            <Route path="conversation/:id" element={<ChatContent />} />
          </Route> */}
          <Route path="watch" element={<Watch />} />
          {/* <Route path="support" element={<Support />} /> */}
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

// TODO: test the auth verification with the backend
// TODO: Solution1: usePrefetch onclick or onhover on the searchbar, `https://redux-toolkit.js.org/rtk-query/usage/prefetching` with force: true, Problem: when a new user login, I should now if he already in the db or not, so I could invalidate the getUsers cache and refetch it, for ex: in the search bar, when I search for a user, I should get the new user in the search result.
// TODO: Solution2: fetch on scroll down,
// TODO: Solution3: refetchOnMountOrArgChange and refetchOnFocus
// TODO: color spinner
