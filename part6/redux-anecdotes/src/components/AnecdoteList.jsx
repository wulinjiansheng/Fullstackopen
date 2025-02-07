import { useDispatch, useSelector } from "react-redux";

import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNoticationMessageWithTimeout } from "../reducers/notificationReducer";

export const AnecdoteList = () => {
	const anecdotes = useSelector((state) => state.anecdotes);
	const filter = useSelector((state) => state.filter);
	const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);
	const dispatch = useDispatch();

	return (
		<>
			{sortedAnecdotes
				.filter((anecdote) => anecdote.content.includes(filter))
				.map((anecdote) => (
					<div key={anecdote.id}>
						<div>{anecdote.content}</div>
						<div>
							has {anecdote.votes}{" "}
							<button
								onClick={() => {
									dispatch(voteAnecdote(anecdote.id));
									dispatch(
										setNoticationMessageWithTimeout(
											`You voted "${anecdote.content}"`,
											10
										)
									);
								}}
							>
								vote
							</button>
						</div>
					</div>
				))}
		</>
	);
};
