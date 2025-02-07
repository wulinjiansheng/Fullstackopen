import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useContext } from "react";
import NotificationContext from "../NotificationContext";
import { default as anecdoteService } from "../service/anecdote";

const AnecdoteForm = () => {
	const queryClient = useQueryClient();

	const [_, notificationDispatch] = useContext(NotificationContext);

	const newAnecdoteMutation = useMutation({
		mutationFn: anecdoteService.addAnecdote,
		onSuccess: (newAnecdote) => {
			const anecdotes = queryClient.getQueryData(["anecdotes"]);
			queryClient.setQueryData(
				["anecdotes"],
				[...anecdotes, newAnecdote]
			);
			notificationDispatch({
				type: "SET",
				payload: `Added anecdote '${newAnecdote.content}'`,
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

	const onCreate = (event) => {
		event.preventDefault();
		const content = event.target.anecdote.value;
		event.target.anecdote.value = "";
		newAnecdoteMutation.mutate(content);
	};

	return (
		<div>
			<h3>create new</h3>
			<form onSubmit={onCreate}>
				<input name="anecdote" />
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
