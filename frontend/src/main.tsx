import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Box, ChakraProvider, Flex, Spinner } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "@fontsource/poppins";
import "@fontsource/montserrat";
import theme from "./theme";
import store from "./app/store";
import BeatLoader from "react-spinners/BeatLoader";

const App = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <ChakraProvider theme={theme}>
        {/* <Flex style={{
          justifyContent: 'center',
          alignItems: 'start',
          minHeight: 'full',
          minWidth: 'full',
          background: 'red',

        }} > */}

        <Suspense fallback={<BeatLoader color="#FF8707" />}>
          <App />
        </Suspense>
        {/* </Flex> */}
      </ChakraProvider>
    </Router>
  </Provider>
);
