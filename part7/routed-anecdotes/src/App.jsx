import { useState } from "react";
import { Navigate, Route, Routes, useMatch } from "react-router-dom";

import { About } from "./components/About";
import { Anecdote } from "./components/Anecdote";
import { AnecdoteForm } from "./components/AnecdoteForm";
import { AnecdoteList } from "./components/AnecdoteList";
import { Footer } from "./components/Footer";
import { Menu } from "./components/Menu";

const App = () => {
	const match = useMatch("/anecdotes/:id");

	const [anecdotes, setAnecdotes] = useState([
		{
			content: "If it hurts, do it more often",
			author: "Jez Humble",
			info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
			votes: 0,
			id: 1,
		},
		{
			content: "Premature optimization is the root of all evil",
			author: "Donald Knuth",
			info: "http://wiki.c2.com/?PrematureOptimization",
			votes: 0,
			id: 2,
		},
	]);

	const [notification, setNotification] = useState("");

	const addNew = (anecdote) => {
		anecdote.id = Math.round(Math.random() * 10000);
		setAnecdotes(anecdotes.concat(anecdote));
		setNotification(`a new anecdote "${anecdote.content}" created!`);
		setTimeout(() => setNotification(""), 5000);
		return anecdote;
	};

	const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

	const vote = (id) => {
		const anecdote = anecdoteById(id);

		const voted = {
			...anecdote,
			votes: anecdote.votes + 1,
		};

		setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
	};

	const anecdote = match ? anecdoteById(Number(match.params.id)) : null;

	console.log("anecdote: ", anecdote);

	return (
		<div>
			<h1>Software anecdotes</h1>
			{notification && (
				<div
					style={{
						border: "solid",
						padding: 10,
						borderWidth: 1,
						marginBottom: 5,
					}}
				>
					{notification}
				</div>
			)}
			<Menu />

			<Routes>
				<Route
					path="/anecdotes/:id"
					element={
						anecdote ? (
							<Anecdote anecdote={anecdote} />
						) : (
							<Navigate replace to="/" />
						)
					}
				/>
				<Route
					path="/create"
					element={<AnecdoteForm addNew={addNew} />}
				/>
				<Route path="/about" element={<About />} />
				<Route
					path="/"
					element={<AnecdoteList anecdotes={anecdotes} />}
				/>
			</Routes>
			<Footer />
		</div>
	);
};

export default App;
