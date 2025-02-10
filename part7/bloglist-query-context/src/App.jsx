import { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Navigate, Route, Routes, useMatch } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";
import { Blog } from "./components/Blog";
import { Blogs } from "./components/Blogs";
import { LoginForm } from "./components/LoginForm";
import { NavigationBar } from "./components/NavigationBar";
import { Notification } from "./components/Notification";
import { User } from "./components/User";
import { Users } from "./components/Users";
import NotificationContext from "./NotificationContext";
import blogsService from "./services/blogs";
import loginService from "./services/login";
import UserContext from "./UserContext";

const loggedInUserKey = "loggedInUser";

const App = () => {
	const queryClient = useQueryClient();

	const blogMatch = useMatch("/blogs/:id");
	const userMatch = useMatch("/users/:id");
	const [_, notificationDispatch] = useContext(NotificationContext);
	const [user, userDispatch] = useContext(UserContext);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const blogs = queryClient.getQueryData(["blogs"]);
	const users = queryClient.getQueryData(["users"]);

	const onLogIn = async (event) => {
		event.preventDefault();
		try {
			const res = await loginService.login(username, password);
			blogsService.setToken(res.token);
			window.localStorage.setItem(loggedInUserKey, JSON.stringify(res));
			userDispatch({
				type: "SET",
				payload: res,
			});
			setUsername("");
			setPassword("");
		} catch (e) {
			notificationDispatch({
				type: "SET",
				payload: {
					isError: true,
					content: e.message,
				},
			});
			setTimeout(() => {
				notificationDispatch({ type: "RESET" });
			}, 5000);
		}
	};

	const onLogOut = () => {
		window.localStorage.removeItem(loggedInUserKey);
		blogsService.setToken(null);
		userDispatch({ type: "RESET" });
	};

	useEffect(() => {
		const loggedInUserJSON = window.localStorage.getItem(loggedInUserKey);
		if (loggedInUserJSON) {
			const loggedInUser = JSON.parse(loggedInUserJSON);
			userDispatch({
				type: "SET",
				payload: loggedInUser,
			});
			blogsService.setToken(loggedInUser.token);
		}
	}, [userDispatch]);

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

	const matchedUser =
		userMatch && users
			? users.find((u) => u.id === userMatch.params.id)
			: null;
	const matchedBlog =
		blogMatch && blogs
			? blogs.find((b) => b.id === blogMatch.params.id)
			: null;

	return (
		<Container>
			<h2>blogs</h2>
			<Notification />
			<NavigationBar user={user} onLogOut={onLogOut} />

			<Routes>
				<Route
					path="/users/:id"
					element={
						matchedUser ? (
							<User user={matchedUser} />
						) : (
							<Navigate replace to="/users" />
						)
					}
				/>
				<Route path="/users" element={<Users />} />
				<Route
					path="/blogs/:id"
					element={
						matchedBlog ? (
							<Blog blog={matchedBlog} />
						) : (
							<Navigate replace to="/" />
						)
					}
				/>
				<Route path="/" element={<Blogs />} />
			</Routes>
		</Container>
	);
};

export default App;
