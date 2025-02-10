import { Link } from "react-router-dom";

export const AnecdoteList = ({ anecdotes }) => (
	<div>
		<h2>Anecdotes</h2>
		<ul>
			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<Link to={`/anecdotes/${anecdote.id}`}>
						{anecdote.content}
					</Link>
				</div>
			))}
		</ul>
	</div>
);
