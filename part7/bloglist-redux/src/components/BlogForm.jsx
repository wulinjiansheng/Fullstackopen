import { useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { addBlog } from "../reducers/blogsReducer";
import { setNotification } from "../reducers/notificationReducer";
import blogsService from "../services/blogs";
import { Togglable } from "./Togglable";

export const BlogForm = () => {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const togglableRef = useRef();
	const [blogInfo, setBlogInfo] = useState({});

	const onSubmit = async (e) => {
		e.preventDefault();
		if (!blogInfo.title || !blogInfo.url) {
			dispatch(
				setNotification({
					isError: true,
					content: "title and url is required",
				})
			);
			return;
		}

		try {
			const addedBlog = await blogsService.create(blogInfo);
			dispatch(addBlog({ ...addedBlog, user }));
			dispatch(
				setNotification({
					isError: false,
					content: `a new blog "${addedBlog.title}" was added to server`,
				})
			);

			setBlogInfo({});
			if (togglableRef.current) {
				togglableRef.current.toggleVisible();
			}
		} catch (e) {
			dispatch(
				setNotification({
					isError: true,
					content: e.message,
				})
			);
		}
	};

	return (
		<Togglable ref={togglableRef} visibleLabel="newNote">
			<h2>Create Blog</h2>
			<form onSubmit={onSubmit}>
				<div>
					title:{" "}
					<input
						data-testid="title"
						id="title-input"
						type="text"
						value={blogInfo.title ?? ""}
						onChange={(e) =>
							setBlogInfo({
								...blogInfo,
								title: e.target.value,
							})
						}
					/>
				</div>
				<div>
					author:{" "}
					<input
						data-testid="author"
						id="author-input"
						type="text"
						value={blogInfo.author ?? ""}
						onChange={(e) =>
							setBlogInfo({
								...blogInfo,
								author: e.target.value,
							})
						}
					/>
				</div>
				<div>
					url:{" "}
					<input
						data-testid="url"
						id="url-input"
						type="text"
						value={blogInfo.url ?? ""}
						onChange={(e) =>
							setBlogInfo({
								...blogInfo,
								url: e.target.value,
							})
						}
					/>
				</div>
				<div>
					likes:{" "}
					<input
						data-testid="likes"
						id="likes-input"
						type="number"
						value={blogInfo.likes ?? 0}
						onChange={(e) =>
							setBlogInfo({
								...blogInfo,
								likes: e.target.value,
							})
						}
					/>
				</div>
				<button id="submit" type="submit">
					Create
				</button>
			</form>
		</Togglable>
	);
};
