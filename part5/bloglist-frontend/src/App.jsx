import { useEffect, useState } from "react";

import { Blog } from "./components/Blog";
import { BlogForm } from "./components/BlogForm";
import { LoginForm } from "./components/LoginForm";
import { Message } from "./components/Message";
import { useEffectAsync } from "./hooks/useEffectAsync";
import blogsService from "./services/blogs";
import loginService from "./services/login";

const loggedInUserKey = "loggedInUser";

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState();
	const [user, setUser] = useState(null);
	const sortedBlogs = [...blogs].sort((b1, b2) => b2.likes - b1.likes);

	const onLogIn = async (event) => {
		event.preventDefault();
		try {
			const res = await loginService.login(username, password);
			blogsService.setToken(res.token);
			window.localStorage.setItem(loggedInUserKey, JSON.stringify(res));
			setUser(res);
			setUsername("");
			setPassword("");
		} catch (e) {
			setMessage({
				isError: true,
				content: e.message,
			});
			setTimeout(() => {
				setMessage(null);
			}, 5000);
		}
	};

	const onLogOut = () => {
		window.localStorage.removeItem(loggedInUserKey);
		blogsService.setToken(null);
		setUser(null);
	};

	const checkBlog = (blog) => {
		if (!blog.title) {
			setMessage({
				isError: true,
				content: "title is required",
			});
			return false;
		}
		if (!blog.url) {
			setMessage({
				isError: true,
				content: "url is required",
			});
			return false;
		}

		return true;
	};

	const createBlog = async (blog, onSuccess) => {
		const checkPassed = checkBlog(blog);
		if (!checkPassed) {
			return;
		}

		try {
			const addedBlog = await blogsService.create(blog);
			setBlogs([...blogs, { ...addedBlog, user }]);
			setMessage({
				isError: false,
				content: `a new blog "${addedBlog.title}" was added to server`,
			});

			if (onSuccess) {
				onSuccess(addedBlog);
			}
		} catch (e) {
			setMessage({
				isError: true,
				content: e.message,
			});
		}
	};

	const updateBlog = async (blog, onSuccess) => {
		const checkPassed = checkBlog(blog);
		if (!checkPassed) {
			return;
		}

		try {
			const updatedBlog = await blogsService.update(blog);
			setBlogs(
				blogs.map((oldBlog) =>
					oldBlog.id === updatedBlog.id
						? { ...updatedBlog, user: oldBlog.user }
						: oldBlog
				)
			);
			setMessage({
				isError: false,
				content: `blog "${updatedBlog.title}" was updated on server`,
			});

			if (onSuccess) {
				onSuccess(updatedBlog);
			}
		} catch (e) {
			setMessage({
				isError: true,
				content: e.message,
			});
		}
	};

	const removeBlog = async (blog, onSuccess) => {
		try {
			await blogsService.remove(blog.id);
			setBlogs(blogs.filter((oldBlog) => oldBlog.id !== blog.id));
			setMessage({
				isError: false,
				content: `blog "${blog.title}" was removed from server`,
			});

			if (onSuccess) {
				onSuccess(blog);
			}
		} catch (e) {
			setMessage({
				isError: true,
				content: e.message,
			});
		}
	};

	useEffectAsync(async () => {
		setBlogs(await blogsService.getAll());
	}, []);

	useEffect(() => {
		const loggedInUserJSON = window.localStorage.getItem(loggedInUserKey);
		if (loggedInUserJSON) {
			const loggedInUser = JSON.parse(loggedInUserJSON);
			setUser(loggedInUser);
			blogsService.setToken(loggedInUser.token);
		}
	}, []);

	if (user === null) {
		return (
			<div>
				<h2>Log in to application</h2>
				<Message message={message} />
				<LoginForm
					onSubmit={onLogIn}
					username={username}
					setUsername={setUsername}
					password={password}
					setPassword={setPassword}
				/>
			</div>
		);
	}

	return (
		<div>
			<h2>blogs</h2>
			<Message message={message} />
			<div>
				{`${user.username} logged in `}
				<button onClick={onLogOut}>log out</button>
			</div>

			<BlogForm createBlog={createBlog} setMessage={setMessage} />
			<br />
			{sortedBlogs.map((blog) => (
				<Blog
					id="blog"
					key={blog.id}
					user={user}
					blog={blog}
					updateBlog={updateBlog}
					removeBlog={removeBlog}
				/>
			))}
		</div>
	);
};

export default App;
