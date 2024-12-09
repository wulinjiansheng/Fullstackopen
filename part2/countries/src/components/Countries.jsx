import { CountryInfo } from "./CountryInfo";
import { CountryEntry } from "./CountryEntry";

export const Countries = ({ countries }) => {
	if (countries.length == 0) {
		return <div>No matching country</div>;
	}

	if (countries.length > 10) {
		return <div>To many matches, specify another filter</div>;
	}

	if (countries.length == 1) {
		return <CountryInfo country={countries[0]} />;
	}

	return countries.map((c) => (
		<CountryEntry key={c.name.common} country={c} />
	));
};
