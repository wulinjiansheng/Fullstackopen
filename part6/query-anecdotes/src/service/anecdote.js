import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
	const response = await axios.get(baseUrl);
	return response.data;
};

const addAnecdote = async (content) => {
	const response = await axios.post(baseUrl, { content, votes: 0 });
	return response.data;
};

const voteAnecdote = async (id) => {
	const oldAnecdote = (await axios.get(`${baseUrl}/${id}`)).data;
	const response = await axios.put(`${baseUrl}/${id}`, {
		...oldAnecdote,
		votes: oldAnecdote.votes + 1,
	});
	return response.data;
};

export default { getAll, addAnecdote, voteAnecdote };
