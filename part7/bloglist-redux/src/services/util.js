export const errorHandler = async (func, method) => {
	try {
		return await func();
	} catch (error) {
		const errorMessage =
			error.response?.data?.error || "An unknown error occurred";
		console.log(`Error caught in ${method}:`, errorMessage);
		throw { message: errorMessage };
	}
};
