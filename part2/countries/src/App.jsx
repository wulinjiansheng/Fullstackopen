import { useState, useEffect } from "react";

import { Countries } from "./components/Countries";
import CountryService from "./service/CountryService";

function App() {
	const [searchTerm, setSearchTerm] = useState("");
	const [allCountries, setAllCountries] = useState([]);

	const regex = searchTerm.length > 0 ? new RegExp(searchTerm, "i") : null;

	const filteredCountries = regex
		? allCountries.filter((c) => regex.test(c.name.common))
		: [];

	useEffect(() => {
		CountryService.getAllContries().then((data) => setAllCountries(data));
	}, []);

	if (!allCountries) {
		return <h1>Loading data...</h1>;
	}

	return (
		<>
			<div>
				{"find countries "}
				<input
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<Countries countries={filteredCountries} />
			</div>
		</>
	);
}

export default App;
