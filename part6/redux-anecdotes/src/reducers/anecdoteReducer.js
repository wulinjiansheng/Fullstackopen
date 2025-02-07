import { createSlice } from "@reduxjs/toolkit";

import anecdoteService from "../service/anecdote";

const anecdoteSlice = createSlice({
	name: "anecdote",
	initialState: [],
	reducers: {
		appendAnecdote(state, action) {
			state.push(action.payload);
		},
		updateAnecdote(state, action) {
			return state.map((item) =>
				item.id === action.payload.id ? action.payload : item
			);
		},
		setAnecdotes(state, action) {
			console.log(state);
			console.log(action);
			return action.payload;
		},
	},
});

export const { appendAnecdote, updateAnecdote, setAnecdotes } =
	anecdoteSlice.actions;

export const initAnecdotes = () => {
	return async (dispatch) => {
		const anecdotes = await anecdoteService.getAll();
		dispatch(setAnecdotes(anecdotes));
	};
};

export const addAnecdote = (content) => {
	return async (dispatch) => {
		const newAnecdote = await anecdoteService.addAnecdote(content);
		dispatch(appendAnecdote(newAnecdote));
	};
};

export const voteAnecdote = (id) => {
	return async (dispatch) => {
		const newAnecdote = await anecdoteService.voteAnecdote(id);
		console.log("newAnecdote: ", newAnecdote);
		dispatch(updateAnecdote(newAnecdote));
	};
};

export default anecdoteSlice.reducer;
