import axios from "axios";

import { errorHandler } from "./util";

let token = null;
const baseUrl = "/api/blogs";

const getAll = () =>
	errorHandler(async () => {
		const response = await axios.get(baseUrl);
		return response.data;
	}, "get blogs");

const create = (blog) =>
	errorHandler(async () => {
		const config = {
			headers: { Authorization: token },
		};
		const response = await axios.post(baseUrl, blog, config);
		return response.data;
	}, "add blog");

const update = (updatedBlog) =>
	errorHandler(async () => {
		const config = {
			headers: { Authorization: token },
		};
		const response = await axios.put(
			`${baseUrl}/${updatedBlog.id}`,
			updatedBlog,
			config
		);
		return response.data;
	}, "update blog");

const remove = (removeBlogId) =>
	errorHandler(async () => {
		const config = {
			headers: { Authorization: token },
		};
		const response = await axios.delete(
			`${baseUrl}/${removeBlogId}`,
			config
		);
		return response.data;
	}, "remove blog");

const getComments = ({ blogId }) =>
	errorHandler(async () => {
		const response = await axios.get(`${baseUrl}/${blogId}/comments`);
		return response.data;
	}, "get comments");

const addComment = ({ blogId, content }) =>
	errorHandler(async () => {
		const response = await axios.post(`${baseUrl}/${blogId}/comments`, {
			content,
		});
		return response.data;
	}, "add comment");

const setToken = (newToken) => (token = `Bearer ${newToken}`);

export default {
	create,
	update,
	remove,
	getAll,
	getComments,
	addComment,
	setToken,
};
