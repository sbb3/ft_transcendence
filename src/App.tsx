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
  PlayerProfile,
} from "./pages";
import Layout from "./layouts/Layout.tsx";
import ConversationContent from "./pages/Chat/ConversationContent.tsx";
import ChannelContent from "./pages/Chat/ChannelContent.tsx";
import ChatSplashScreen from "./pages/Chat/ChatSplashScreen.tsx";
import Signin from "./pages/Signin.tsx";
import Public from "./pages/Public.tsx";
import Register from "./pages/Register.tsx";
import Basic from "./Stepper.tsx";

function App() {
  return (
    <Routes>
      {/* <Route path="/login" element={<StayLoggedIn />}>
        <Route index element={<Login />} />
      </Route> */}
      <Route
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
        }
        // style={{}}
      />

      <Route element={<AuthVerification />}>
        <Route path="/" element={<Layout />}>
          {/* <Route index element={<Overview />} /> */}
          {/* <Route path="profile/:username" element={<PlayerProfile />} /> */}
          {/* <Route path="settings" element={<Settings />} /> */}
          <Route path="play" element={<Game />} />
          <Route path="chat" element={<Chat />}>
            <Route index element={<ChatSplashScreen />} />
            <Route path="conversation/:id" element={<ConversationContent />} />
            <Route path="channel/:channelname" element={<ChannelContent />} />
          </Route>
          <Route path="watch" element={<Watch />} />
          {/* <Route path="support" element={<Support />} /> */}
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
// {
//   /* <Route element={<PrefetchUsers />} > */
// }

export default App;

// TODO: handle scrollbars
// TODO: toast component
// TODO: handle later the case when a user removed a conversation but the other user still have it in his list when he is in the conversation component, (maybe I should use the useQuery hook and refetch it when the user is in the conversation component or send a socket event to the other user to remove the conversation from his list) + invalidate the conversation cache

// TODO: test the auth verification with the backend
// TODO: Solution1: usePrefetch onclick or onhover on the searchbar, `https://redux-toolkit.js.org/rtk-query/usage/prefetching` with force: true, Problem: when a new user login, I should now if he already in the db or not, so I could invalidate the getUsers cache and refetch it, for ex: in the search bar, when I search for a user, I should get the new user in the search result.
// TODO: Solution2: fetch on scroll down,
// TODO: Solution3: refetchOnMountOrArgChange and refetchOnFocus
// TODO: color spinner

// for channels.tsx menubutton
// sx={{
//   "&:hover": {
//     background: "none",
//     boxShadow: "none",
//     border: "none",
//   },
//   "&:active": {
//     background: "none",
//     boxShadow: "none",
//     border: "none",
//   },
//   "&:focus": {
//     background: "none",
//     boxShadow: "none",
//     border: "none",
//   },
//   "&:selected": {
//     background: "none",
//     boxShadow: "none",
//     border: "none",
//   },
//   fontSize: "14px",
//   fontWeight: "semibold",
//   color: "white",
//   padding: "0px",
//   height: "auto",
//   background: "none",
//   boxShadow: "none",
//   border: "none",
// }}
// _active={{
//   background: "none",
//   boxShadow: "none",
//   border: "none",
// }}
// _focus={{
//   background: "none",
//   boxShadow: "none",
//   border: "none",
// }}
// _hover={{
//   background: "none",
//   boxShadow: "none",
//   border: "none",
// }}
// _selected={{
//   background: "none",
//   boxShadow: "none",
//   border: "none",
// }}
