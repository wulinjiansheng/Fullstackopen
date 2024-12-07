import { useState } from "react";

const Button = (props) => {
	return <button onClick={props.onClick}>{props.title}</button>;
};

const AnecdoteOfDay = ({ anecdotes }) => {
	const len = anecdotes.length;

	const [selected, setSelected] = useState(0);
	const [votes, setVotes] = useState(Array(len).fill(0));

	return (
		<>
			<h1>Anecdote of the day</h1>
			<div>{anecdotes[selected]}</div>
			<div>has {votes[selected]} votes</div>
			<Button
				title="vote"
				onClick={() => {
					const newVotes = [...votes];
					newVotes[selected]++;
					setVotes(newVotes);
				}}
			/>
			<Button
				title="next anecdote"
				onClick={() => setSelected(Math.floor(Math.random() * len))}
			/>
			<AnecdoteMostVoted anecdotes={anecdotes} votes={votes} />
		</>
	);
};

const AnecdoteMostVoted = ({ anecdotes, votes }) => {
	const maxVotes = Math.max(...votes);
	const maxIndex = votes.indexOf(maxVotes);

	return (
		<>
			<h1>Anecdote with most votes</h1>
			{maxVotes > 0 ? (
				<>
					<div>{anecdotes[maxIndex]}</div>
					<div>has {votes[maxIndex]} votes</div>
				</>
			) : (
				<div>Vote first</div>
			)}
		</>
	);
};

const App = () => {
	const anecdotes = [
		"If it hurts, do it more often.",
		"Adding manpower to a late software project makes it later!",
		"The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
		"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
		"Premature optimization is the root of all evil.",
		"Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
		"Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
		"The only way to go fast, is to go well.",
	];

	return <AnecdoteOfDay anecdotes={anecdotes} />;
};

export default App;
