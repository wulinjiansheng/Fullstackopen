import { createSlice } from "@reduxjs/toolkit";

const blogsSlice = createSlice({
	name: "blogs",
	initialState: [],
	reducers: {
		setBlogs(state, action) {
			return action.payload;
		},
		addBlog(state, action) {
			return [...state, action.payload];
		},
		updateBlog(state, action) {
			return state.map((b) =>
				b.id === action.payload.id ? action.payload : b
			);
		},
		deleteBlog(state, action) {
			return state.filter((b) => b.id !== action.payload);
		},
	},
});

export const { addBlog, deleteBlog, updateBlog, setBlogs } = blogsSlice.actions;

export default blogsSlice.reducer;
