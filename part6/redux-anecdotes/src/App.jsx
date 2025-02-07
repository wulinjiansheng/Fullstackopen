import { useEffect } from "react";

import { useDispatch } from "react-redux";
import { AnecdoteForm } from "./components/AnecdoteForm";
import { AnecdoteList } from "./components/AnecdoteList";
import Filter from "./components/Filter";
import { Notification } from "./components/Notification";
import { initAnecdotes } from "./reducers/anecdoteReducer";

const App = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(initAnecdotes());
	}, []);

	return (
		<div>
			<h2>Anecdotes</h2>
			<Notification />
			<AnecdoteList />
			<AnecdoteForm />
			<Filter />
		</div>
	);
};

export default App;
