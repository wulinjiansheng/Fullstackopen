import { Link, Route, Routes } from "react-router-dom";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";

const App = () => {
	return (
		<div>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					gap: "10px",
				}}
			>
				<Link to={"/authors"}>authors</Link>
				<Link to={"/books"}>books</Link>
				<Link to={"/add-book"}>add book</Link>
			</div>

			<Routes>
				<Route path="/authors" element={<Authors />} />
				<Route path="/books" element={<Books />} />
				<Route path="/add-book" element={<NewBook />} />
			</Routes>
		</div>
	);
};

export default App;
