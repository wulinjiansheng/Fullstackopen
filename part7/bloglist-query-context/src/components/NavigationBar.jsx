import { Link } from "react-router-dom";

export const NavigationBar = ({ user, onLogOut }) => {
	const padding = {
		paddingRight: 5,
	};

	return (
		<div>
			<Link to="/" style={padding}>
				blogs
			</Link>
			<Link to="/users" style={padding}>
				users
			</Link>
			<div>
				{`${user.username} logged in `}
				<button onClick={onLogOut}>log out</button>
			</div>
		</div>
	);
};
