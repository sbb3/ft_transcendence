import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import store from "./app/store";
import { BrowserRouter as Router } from "react-router-dom";
import "@fontsource/poppins";
import "@fontsource/nunito";
import theme from "./theme";
import App from "./App";


ReactDOM.createRoot(document.getElementById("root")!).render(
	<Provider store={store}>
		<Router>
			<ChakraProvider theme={theme}>
				<App />
			</ChakraProvider>
		</Router>
	</Provider>
);
