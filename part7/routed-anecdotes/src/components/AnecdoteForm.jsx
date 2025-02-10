import { useNavigate } from "react-router-dom";
import { useField } from "../hooks";

export const AnecdoteForm = (props) => {
	const navigate = useNavigate();

	const { reset: contentReset, ...contentInputProps } = useField("content");
	const { reset: authorReset, ...authorInputProps } = useField("author");
	const { reset: infoReset, ...infoInputProps } = useField("info");

	const handleSubmit = (e) => {
		e.preventDefault();
		const newAnecdote = props.addNew({
			content: contentInputProps.value,
			author: authorInputProps.value,
			info: infoInputProps.value,
			votes: 0,
		});
		navigate(`/anecdotes/${newAnecdote.id}`);
	};

	return (
		<div>
			<h2>create a new anecdote</h2>
			<form onSubmit={handleSubmit}>
				<div>
					content
					<input {...contentInputProps} />
				</div>
				<div>
					author
					<input {...authorInputProps} />
				</div>
				<div>
					url for more info
					<input {...infoInputProps} />
				</div>
				<button type="submit">create</button>
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						authorReset();
						contentReset();
						infoReset();
					}}
				>
					reset
				</button>
			</form>
		</div>
	);
};
