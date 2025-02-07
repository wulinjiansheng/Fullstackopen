import { useDispatch } from "react-redux";

import { addAnecdote } from "../reducers/anecdoteReducer";

export const AnecdoteForm = () => {
	const dispatch = useDispatch();

	return (
		<>
			<h2>create new</h2>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					const content = e.target.anecdote.value;
					e.target.anecdote.value = "";
					dispatch(addAnecdote(content));
				}}
			>
				<div>
					<input name="anecdote" />
				</div>
				<button>create</button>
			</form>
		</>
	);
};
