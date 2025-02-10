import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Blog } from "./components/Blog";
import { BlogForm } from "./components/BlogForm";
import { LoginForm } from "./components/LoginForm";
import { Notification } from "./components/Notification";
import { useEffectAsync } from "./hooks/useEffectAsync";
import blogsService from "./services/blogs";
import loginService from "./services/login";

import { setBlogs } from "./reducers/blogsReducer";
import {
	resetNotification,
	setNotification,
} from "./reducers/notificationReducer";
import { resetUser, setUser } from "./reducers/userReducer";

const loggedInUserKey = "loggedInUser";

const App = () => {
	const dispatch = useDispatch();
	const blogs = useSelector((state) => state.blogs);
	const user = useSelector((state) => state.user);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const sortedBlogs = [...blogs].sort((b1, b2) => b2.likes - b1.likes);

	const onLogIn = async (event) => {
		event.preventDefault();
		try {
			const res = await loginService.login(username, password);
			blogsService.setToken(res.token);
			window.localStorage.setItem(loggedInUserKey, JSON.stringify(res));
			dispatch(setUser(res));
			setUsername("");
			setPassword("");
		} catch (e) {
			dispatch(
				setNotification({
					isError: true,
					content: e.message,
				})
			);
			setTimeout(() => {
				dispatch(resetNotification());
			}, 5000);
		}
	};

	const onLogOut = () => {
		window.localStorage.removeItem(loggedInUserKey);
		blogsService.setToken(null);
		dispatch(resetUser());
	};

	useEffectAsync(async () => {
		dispatch(setBlogs(await blogsService.getAll()));
	}, []);

	useEffect(() => {
		const loggedInUserJSON = window.localStorage.getItem(loggedInUserKey);
		if (loggedInUserJSON) {
			const loggedInUser = JSON.parse(loggedInUserJSON);
			dispatch(setUser(loggedInUser));
			blogsService.setToken(loggedInUser.token);
		}
	}, []);

	if (user === null) {
		return (
			<div>
				<h2>Log in to application</h2>
				<Notification />
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
			<Notification />
			<div>
				{`${user.username} logged in `}
				<button onClick={onLogOut}>log out</button>
			</div>

			<BlogForm />
			<br />
			{sortedBlogs.map((blog) => (
				<Blog id="blog" key={blog.id} blog={blog} />
			))}
		</div>
	);
};

export default App;
