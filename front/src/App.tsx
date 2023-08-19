import { BrowserRouter, Route, Routes } from "react-router-dom"
import Authentication from "./components/Authentication"
import Profile from "./components/Profile"

function App() {

  return (
	<BrowserRouter>
	  <Routes>
	  	<Route path='/' element={<Authentication />}/>
		<Route path='/profile' element={<Profile />} />
	  </Routes>
	</BrowserRouter>
  );

}

export default App
