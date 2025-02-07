import { createSlice } from "@reduxjs/toolkit";

const notificationReducer = createSlice({
	name: "notification",
	initialState: "",
	reducers: {
		setNoticationMessage(state, action) {
			return action.payload;
		},
		resetNoticationMessage(state, action) {
			return "";
		},
	},
});

export const { setNoticationMessage, resetNoticationMessage } =
	notificationReducer.actions;

export const setNoticationMessageWithTimeout = (message, timeout = 5) => {
	return async (dispatch, getState) => {
		const hasNotification = !!getState().notification;
		dispatch(setNoticationMessage(message));
		if (!hasNotification) {
			setTimeout(
				() => dispatch(resetNoticationMessage(message)),
				timeout * 1000
			);
		}
	};
};

export default notificationReducer.reducer;
