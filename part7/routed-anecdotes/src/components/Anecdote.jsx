export const Anecdote = ({ anecdote }) => {
	return (
		<div>
			<h1>{anecdote.content}</h1>
			<div style={{ padding: 5 }}>
				has {anecdote.votes} votes
				<div>
					for more information see{" "}
					<a href={anecdote.info}>{anecdote.info}</a>
				</div>
			</div>
		</div>
	);
};
