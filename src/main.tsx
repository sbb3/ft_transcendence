import { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider, Spinner } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "@fontsource/poppins";
import "@fontsource/montserrat";
import theme from "./theme";
import store from "./app/store";

const App = lazy(() => import("./App"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <ChakraProvider theme={theme} resetCSS>
        <Suspense fallback={<Spinner as={"progress"} />}>
          <App />
        </Suspense>
      </ChakraProvider>
    </Router>
  </Provider>
);
