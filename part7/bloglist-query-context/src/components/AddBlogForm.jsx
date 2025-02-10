import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";

import NotificationContext from "../NotificationContext";
import blogsService from "../services/blogs";
import UserContext from "../UserContext";
import { Togglable } from "./Togglable";

export const AddBlogForm = () => {
	const queryClient = useQueryClient();
	const togglableRef = useRef();
	const [blogDetails, setBlogDetails] = useState({});
	const [_, notificationDispatch] = useContext(NotificationContext);
	const [user] = useContext(UserContext);

	const newBlogMutation = useMutation({
		mutationFn: blogsService.create,
		onSuccess: (newBlog) => {
			const blogs = queryClient.getQueryData(["blogs"]);
			queryClient.setQueryData(
				["blogs"],
				[...blogs, { ...newBlog, user }]
			);
			setBlogDetails({});
			if (togglableRef.current) {
				togglableRef.current.toggleVisible();
			}

			notificationDispatch({
				type: "SET",
				payload: {
					isError: false,
					content: `a new blog "${newBlog.title}" was added to server`,
				},
			});
			setTimeout(() => {
				notificationDispatch({ type: "CLEAR" });
			}, 5000);
		},
		onError: (error) => {
			notificationDispatch({
				type: "SET",
				payload: error.response.data.error,
			});
			setTimeout(() => {
				notificationDispatch({ type: "CLEAR" });
			}, 5000);
		},
	});

	const onSubmit = (e) => {
		e.preventDefault();
		newBlogMutation.mutate(blogDetails);
	};

	return (
		<Togglable ref={togglableRef} visibleLabel="newNote">
			<h2>Create Blog</h2>
			<Form style={{ width: "30%" }} onSubmit={onSubmit}>
				<Form.Group>
					<Form.Label>title:</Form.Label>
					<Form.Control
						type="text"
						value={blogDetails.title ?? ""}
						onChange={(e) =>
							setBlogDetails({
								...blogDetails,
								title: e.target.value,
							})
						}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>author:</Form.Label>
					<Form.Control
						type="text"
						value={blogDetails.author ?? ""}
						onChange={(e) =>
							setBlogDetails({
								...blogDetails,
								author: e.target.value,
							})
						}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>url:</Form.Label>
					<Form.Control
						type="text"
						value={blogDetails.url ?? ""}
						onChange={(e) =>
							setBlogDetails({
								...blogDetails,
								url: e.target.value,
							})
						}
					/>
				</Form.Group>
				<Form.Group>
					<Form.Label>url:</Form.Label>
					<Form.Control
						type="number"
						value={blogDetails.likes ?? 0}
						onChange={(e) =>
							setBlogDetails({
								...blogDetails,
								likes: e.target.value,
							})
						}
					/>
				</Form.Group>
				<Button variant="primary" type="submit">
					Create
				</Button>
			</Form>
		</Togglable>
	);
};
