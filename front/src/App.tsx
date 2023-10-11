import { BrowserRouter, Route, Routes } from "react-router-dom"
import Authentication from "./components/Authentication"
import Profile from "./components/Profile"
import TwoFactorAuth from "./components/TwoFactorAuth";

function App() {

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/profile' element={<Profile />}/>
				<Route path='/' element={<Authentication />} />
				<Route path='/2fa' element={<TwoFactorAuth />} />
			</Routes>
		</BrowserRouter>
  );

}

export default App
