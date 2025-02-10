import { createContext, useReducer } from "react";

const userReducer = (state, action) => {
	switch (action.type) {
		case "SET":
			return action.payload;
		case "RESET":
			return null;
		default:
			return state;
	}
};

const UserContext = createContext();

export const UserProvider = (props) => {
	const [user, userDispatch] = useReducer(userReducer, null);

	return (
		<UserContext.Provider value={[user, userDispatch]}>
			{props.children}
		</UserContext.Provider>
	);
};

export default UserContext;
