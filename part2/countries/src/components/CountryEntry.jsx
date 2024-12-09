import { useState } from "react";

import { CountryInfo } from "./CountryInfo";

export const CountryEntry = ({ country }) => {
	const [showCountry, setShowCountry] = useState(false);

	return (
		<div>
			{`${country.name.common} `}
			<button onClick={() => setShowCountry(!showCountry)}>
				{showCountry ? "hide" : "show"}
			</button>
			{showCountry && <CountryInfo country={country} />}
		</div>
	);
};
