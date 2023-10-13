import { Routes, Route } from "react-router-dom";
import AuthVerification from "./features/auth/AuthVerification";
import StayLoggedIn from "./features/auth/StayLoggedIn.tsx";
import {
  Overview,
  Settings,
  Game,
  Chat,
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
import PrefetchUsers from "./components/PrefetchUsers.tsx";
import GameLayout from "./pages/Game/GameLayout.tsx";
import GameStarted from "./pages/Game/GameStarted.tsx";
import CheckOTP from "./features/auth/CheckOTP.tsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<StayLoggedIn />}>
        <Route index element={<Login />} />
      </Route>

      {/* <Route
        path="/login"
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
      /> */}
      <Route element={<AuthVerification />}>
        <Route element={<PrefetchUsers />}>
          {/* <Route element={<CheckOTP />}> */}
          <Route path="/" element={<Layout />}>
            {/* <Route index element={<Overview />} /> */}
            {/* <Route path="profile/:username" element={<PlayerProfile />} /> */}
            {/* <Route path="settings" element={<Settings />} /> */}
            <Route path="game" element={<GameLayout />}>
              <Route index element={<Game />} />
              {/* <Route path=":id" element={<GameStarted />} /> */}
            </Route>
            <Route path="chat" element={<Chat />}>
              <Route index element={<ChatSplashScreen />} />
              {/* <Route
                path="conversation/:id"
                element={<ConversationContent />}
              /> */}
              <Route path="channel/:channelname" element={<ChannelContent />} />
            </Route>
            {/* <Route path="support" element={<Support />} /> */}
          </Route>
          {/* </Route> */}
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

// TODO: socket jwt valid
