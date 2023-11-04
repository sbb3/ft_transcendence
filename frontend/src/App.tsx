import { Routes, Route } from "react-router-dom";

import {
  Overview,
  Settings,
  Game,
  Chat,
  Support,
  Login,
  NotFoundPage,
  PlayerProfile,
  ConversationContent,
  ChannelContent,
  ChatSplashScreen,
  Layout,
  PrefetchUsers,
  GameLayout,
  CheckOTP,
  AuthVerification,
  StayLoggedIn,
} from ".";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<StayLoggedIn />}>
        <Route index element={<Login />} />
      </Route>
      <Route element={<AuthVerification />}>
        <Route element={<PrefetchUsers />}>
          <Route element={<CheckOTP />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Overview />} />
              <Route path="profile/:username" element={<PlayerProfile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="game" element={<GameLayout />}>
                <Route index element={<Game />} />
              </Route>
              <Route path="chat" element={<Chat />}>
                <Route index element={<ChatSplashScreen />} />
                <Route
                  path="conversation/:id"
                  element={<ConversationContent />}
                />
                <Route
                  path="channel/:channelname"
                  element={<ChannelContent />}
                />
              </Route>
              <Route path="support" element={<Support />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

// TODO: recent games, player rank ...
// TODO: set port 80 on the backend .env, set canvas back, npm run build for nestjs
/*

<Flex
          justify="space-around"
          align="center"
          w={"full"}
          borderRadius={15}
          p={{ base: 1, md: 2 }}
          // gap={{ base: 4, sm: 6, md: 8 }}
          // bg="pong_bg.300"
          bg="pong_cl.500"
          boxShadow={"0px 4px 24px -1px rgba(0, 0, 0, 0.35)"}
        >
          <Stack
            align={"center"}
            justify={"center"}
            spacing={{ base: 1, md: 2 }}
          >
            <Avatar
              size={{ base: "md", md: "lg" }}
              // name={user?.name}
              // src={user?.avatar}
              borderWidth="1px"
            />
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              color="whiteAlpha.900"
              textTransform={"uppercase"}
              textAlign={"center"}
              letterSpacing={1}
            >
               sbb3
            </Text>
          </Stack>
          <Text
            fontSize={{ base: "md", md: "xl" }}
            fontWeight="bold"
            color="whiteAlpha.900"
            textTransform={"uppercase"}
            textAlign={"center"}
            letterSpacing={1}
          >
            Game started
          </Text>
          <Stack
            align={"center"}
            justify={"center"}
            spacing={{ base: 1, md: 2 }}
          >
            <Avatar
              size={{ base: "md", md: "lg" }}
              // name={user?.name}
              // src={user?.avatar}
              borderWidth="1px"
            />
            <Text
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              color="whiteAlpha.900"
              textTransform={"uppercase"}
              textAlign={"center"}
              letterSpacing={1}
            >
              lopez
            </Text>
          </Stack>
        </Flex> 
      */