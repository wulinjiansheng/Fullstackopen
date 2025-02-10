import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";

import { useNavigate } from "react-router-dom";
import NotificationContext from "../NotificationContext";
import blogsService from "../services/blogs";
import UserContext from "../UserContext";
import { Comments } from "./Comments";
import { LikeButton } from "./LikeButton";

export const Blog = ({ blog }) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [_, notificationDispatch] = useContext(NotificationContext);
	const [user] = useContext(UserContext);

	const updateBlogMutation = useMutation({
		mutationFn: blogsService.update,
		onSuccess: (updatedBlog) => {
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(
				["blogs"],
				blogs.map((oldBlog) =>
					oldBlog.id === updatedBlog.id
						? { ...updatedBlog, user: oldBlog.user }
						: oldBlog
				)
			);
			navigate("/");
			notificationDispatch({
				type: "SET",
				payload: {
					isError: false,
					content: `blog "${updatedBlog.title}" was updated on server`,
				},
			});
		},
		onError: (e) => {
			notificationDispatch({
				type: "SET",
				payload: {
					isError: true,
					content: e.message,
				},
			});
		},
	});

	const deleteBlogMutation = useMutation({
		mutationFn: blogsService.remove,
		onSuccess: (_, deletedBlogId) => {
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(
				["blogs"],
				blogs.filter((b) => b.id !== deletedBlogId)
			);
			notificationDispatch({
				type: "SET",
				payload: {
					isError: false,
					content: `blog "${blog.title}" was removed from server`,
				},
			});
		},
		onError: (error) => {
			notificationDispatch({
				type: "SET",
				payload: {
					isError: true,
					content: error.message,
				},
			});
		},
	});

	const onLike = () => {
		const { user, ...blogWithoutUser } = blog;
		updateBlogMutation.mutate({
			...blogWithoutUser,
			likes: blog.likes + 1,
		});
	};

	const onDelete = () => {
		const confirmToDelete = window.confirm(
			`Are you sure to remove blog "${blog.title}" ?`
		);
		if (confirmToDelete) {
			deleteBlogMutation.mutate(blog.id);
		}
	};

	return (
		<div>
			<h2>
				{blog.title} {blog.author}
			</h2>
			<div id="details">
				<div id="url">url: {blog.url}</div>
				<div id="likes">
					likes: <span id="likes-count">{blog.likes}</span>
					&nbsp;
					<LikeButton onClick={onLike} />
				</div>
				{blog.user && <div>creator: {blog.user.username}</div>}
				{blog.user && blog.user.username === user.username && (
					<button
						style={{
							backgroundColor: "#0000ff",
							color: "#ffffff",
						}}
						onClick={onDelete}
					>
						remove
					</button>
				)}
			</div>
			<Comments blog={blog} />
		</div>
	);
};
