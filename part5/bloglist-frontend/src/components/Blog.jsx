import { useState } from "react";

import { LikeButton } from "./LikeButton";

export const Blog = ({ blog, user, updateBlog, removeBlog }) => {
	const [detailsVisible, setDetailsVisible] = useState(false);

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: "solid",
		borderWidth: 1,
		marginBottom: 5,
	};

	const onLike = () => {
		const { user, ...blogWithoutUser } = blog;
		const updatedBlog = {
			...blogWithoutUser,
			likes: blog.likes + 1,
		};
		updateBlog(updatedBlog);
	};

	const onDelete = () => {
		const confirmToDelete = window.confirm(
			`Are you sure to remove blog "${blog.title}" ?`
		);
		if (confirmToDelete) {
			removeBlog(blog);
		}
	};

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
