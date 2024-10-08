import { HashRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import Vote from "./Vote";

import Wheel from "./app_wheel/Wheel";

function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path={"/"} element={<Wheel />} />
				<Route path={"/memeframe/"} element={<Home />} />
				<Route path={"/vote/"} element={<Vote />} />
			</Routes>
		</HashRouter>
	);
}

export default App;
