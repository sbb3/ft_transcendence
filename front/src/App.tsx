import { BrowserRouter, Route, Routes } from "react-router-dom"
import Authentication from "./components/Authentication"
import Profile from "./components/Profile"

function App() {

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/profile' element={<Profile />}/>
				<Route path='/' element={<Authentication />} />
			</Routes>
		</BrowserRouter>
  );

}

export default App
