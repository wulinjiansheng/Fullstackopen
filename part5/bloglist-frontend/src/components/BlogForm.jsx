import { useRef, useState } from "react";

import { Togglable } from "./Togglable";

export const BlogForm = ({ createBlog }) => {
	const togglableRef = useRef();
	const [blog, setBlog] = useState({});

	const onSubmit = async (e) => {
		e.preventDefault();
		createBlog(blog, () => {
			setBlog({});
			if (togglableRef.current) {
				togglableRef.current.toggleVisible();
			}
		});
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
						value={blog.title ?? ""}
						onChange={(e) =>
							setBlog({
								...blog,
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
						value={blog.author ?? ""}
						onChange={(e) =>
							setBlog({
								...blog,
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
						value={blog.url ?? ""}
						onChange={(e) =>
							setBlog({
								...blog,
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
						value={blog.likes ?? 0}
						onChange={(e) =>
							setBlog({
								...blog,
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
