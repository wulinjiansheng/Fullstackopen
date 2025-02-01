import axios from "axios";

import { errorHandler } from "./util";

const baseUrl = "/api/login";

const login = async (username, password) =>
	errorHandler(async () => {
		const response = await axios.post(baseUrl, { username, password });
		return response.data;
	}, "login");

export default { login };
