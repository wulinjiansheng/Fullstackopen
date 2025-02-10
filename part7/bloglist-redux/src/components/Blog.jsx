import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { deleteBlog, setBlogs } from "../reducers/blogsReducer";
import { setNotification } from "../reducers/notificationReducer";
import blogsService from "../services/blogs";
import { LikeButton } from "./LikeButton";

export const Blog = ({ blog }) => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const blogs = useSelector((state) => state.blogs);
	const [detailsVisible, setDetailsVisible] = useState(false);

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
	};

	const onLike = async () => {
		const { user, ...blogWithoutUser } = blog;

		try {
			const updatedBlog = await blogsService.update({
				...blogWithoutUser,
				likes: blog.likes + 1,
			});
			dispatch(
				setBlogs(
					blogs.map((oldBlog) =>
						oldBlog.id === updatedBlog.id
							? { ...updatedBlog, user: oldBlog.user }
							: oldBlog
					)
				)
			);
			dispatch(
				setNotification({
					isError: false,
					content: `blog "${updatedBlog.title}" was updated on server`,
				})
			);
		} catch (e) {
			dispatch(
				setNotification({
					isError: true,
					content: e.message,
				})
			);
		}
	};

	const onDelete = async () => {
		const confirmToDelete = window.confirm(
			`Are you sure to remove blog "${blog.title}" ?`
		);
		if (!confirmToDelete) {
			return;
		}

		try {
			await blogsService.remove(blog.id);
			dispatch(deleteBlog(blog.id));
			dispatch(
				setNotification({
					isError: false,
					content: `blog "${blog.title}" was removed from server`,
				})
			);
		} catch (e) {
			dispatch(
				setNotification({
					isError: true,
					content: e.message,
				})
			);
		}
	};

	console.log("blog: ", blog);
	console.log("blog.user.username: ", blog.user.username);
	console.log("user.username:", user.username);

	return (
		<div style={blogStyle}>
			<div id="blog">
				{blog.title} {blog.author}
				&nbsp;
				<button
					id="show-details-button"
					onClick={() => {
						setDetailsVisible(!detailsVisible);
					}}
				>
					{detailsVisible ? "Hide Details" : "Show Details"}
				</button>
			</div>
			{detailsVisible && (
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
			)}
		</div>
	);
};
