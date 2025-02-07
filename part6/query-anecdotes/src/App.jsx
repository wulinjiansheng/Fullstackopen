import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

import { useContext } from "react";
import NotificationContext from "./NotificationContext";
import anecdoteService from "./service/anecdote";

const App = () => {
	const queryClient = useQueryClient();

	const [_, notificationDispatch] = useContext(NotificationContext);

	const voteAnecdoteMutation = useMutation({
		mutationFn: anecdoteService.voteAnecdote,
		onSuccess: (newAnecdote) => {
			const anecdotes = queryClient.getQueryData(["anecdotes"]);
			queryClient.setQueryData(
				["anecdotes"],
				anecdotes.map((item) =>
					item.id !== newAnecdote.id ? item : newAnecdote
				)
			);
			notificationDispatch({
				type: "SET",
				payload: `Voted anecdote '${newAnecdote.content}'`,
			});
			setTimeout(() => {
				notificationDispatch({ type: "CLEAR" });
			}, 5000);
		},
	});

	const handleVote = (anecdote) => {
		voteAnecdoteMutation.mutate(anecdote.id);
	};

	const {
		isLoading,
		isPending,
		isError,
		data: anecdotes,
		error,
	} = useQuery({
		queryKey: ["anecdotes"],
		queryFn: anecdoteService.getAll,
		retry: 1,
		refetchOnWindowFocus: false,
	});

	if (isError) {
		return <div>anecdote service not available error: {error.message}</div>;
	}

	if (isLoading) {
		return <div>loading data...</div>;
	}

	return (
		<div>
			<h3>Anecdote app</h3>

			<Notification />
			<AnecdoteForm />

			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => handleVote(anecdote)}>
							vote
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default App;
