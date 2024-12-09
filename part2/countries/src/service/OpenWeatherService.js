import axios from "axios";

const baseUrl = "https://api.openweathermap.org/data/2.5/weather";
const api_key = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

const getWeather = (city, units = "metric") => {
	return axios
		.get(`${baseUrl}?q=${city}&appid=${api_key}&units=${units}`)
		.then((response) => response.data);
};

export default { getWeather };
