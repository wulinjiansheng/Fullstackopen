import axios from "axios";

import { errorHandler } from "./util";

const baseUrl = "/api/users";

const getAll = () =>
	errorHandler(async () => {
		const response = await axios.get(baseUrl);
		return response.data;
	}, "get users");

export default { getAll };
