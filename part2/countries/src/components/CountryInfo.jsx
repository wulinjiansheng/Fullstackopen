import { CountryWeather } from "./CountryWeather";

export const CountryInfo = ({ country }) => {
	const { name, capital, area, flag, flags, languages } = country;

	return (
		<div>
			<h1>{name.common}</h1>
			<br />
			<br />
			<div>captial {capital}</div>
			<div>area {area}</div>
			<br />
			<br />
			<h2>languages:</h2>
			<ul>
				{Object.entries(languages).map(([code, lang]) => (
					<li key={code}>{lang}</li>
				))}
			</ul>
			<img width={320} alt={flag} src={flags.png} />
			<br />
			<br />
			<CountryWeather country={country} />
			<br />
			<br />
		</div>
	);
};
