import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import NotificationContext from "../NotificationContext";
import blogsService from "../services/blogs";

export const AddCommentForm = ({ blog }) => {
	const queryClient = useQueryClient();
	const [content, setContent] = useState("");
	const [_, notificationDispatch] = useContext(NotificationContext);

	const newCommentMutation = useMutation({
		mutationFn: blogsService.addComment,
		onSuccess: (newComment) => {
			const comments = queryClient.getQueryData(["comments", blog.id]);
			queryClient.setQueryData(
				["comments", blog.id],
				[...comments, newComment]
			);
			setContent("");

			notificationDispatch({
				type: "SET",
				payload: {
					isError: false,
					content: `a new comment was added for blog "${blog.title}"`,
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

	const onAddComment = (e) => {
		e.preventDefault();
		if (!content) {
			notificationDispatch({
				type: "SET",
				payload: {
					isError: true,
					content: "comment content is required",
				},
			});
		}

		newCommentMutation.mutate({ blogId: blog.id, content });
	};

	return (
		<Form onSubmit={onAddComment}>
			<Form.Group>
				<Form.Label>content:</Form.Label>
				<Form.Control
					type="text"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
			</Form.Group>
			<Button variant="primary" type="submit">
				add comment
			</Button>
		</Form>
	);
};
