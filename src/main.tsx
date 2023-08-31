import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import "@fontsource/poppins";
import "@fontsource/montserrat";
import theme from "./theme";
import store from "./app/store";


ReactDOM.createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
		<Router>
			<ChakraProvider theme={theme}>
				<App />
			</ChakraProvider>
		</Router>
	</Provider>
);
