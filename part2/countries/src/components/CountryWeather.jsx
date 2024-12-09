import { useEffect, useState } from "react";

import OpenWeatherService from "../service/OpenWeatherService";

const weatherIconBaseUrl = "https://openweathermap.org/img/wn";

export const CountryWeather = ({ country }) => {
	const { capital } = country;
	const [weatherData, setWeatherData] = useState(null);

	useEffect(() => {
		OpenWeatherService.getWeather(capital)
			.then(setWeatherData)
			.catch((e) => alert(e));
	}, []);

	if (!weatherData) {
		return <div>Loading weather info...</div>;
	}

	const { main, weather, wind } = weatherData;

	return (
		<>
			<h1>Weather in {capital}</h1>
			<div>temperature {main.temp} Celcius</div>
			<img src={`${weatherIconBaseUrl}/${weather[0].icon}@2x.png`} />
			<div>wind {wind.speed} m/s</div>
		</>
	);
};
