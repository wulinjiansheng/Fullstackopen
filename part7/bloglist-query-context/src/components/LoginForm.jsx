import PropTypes from "prop-types";

export const LoginForm = ({
	onSubmit,
	username,
	setUsername,
	password,
	setPassword,
}) => {
	return (
		<form data-testid="loginForm" onSubmit={onSubmit}>
			<div>
				username:{" "}
				<input
					data-testid="username"
					type="text"
					name="username"
					value={username}
					onChange={({ target }) => {
						setUsername(target.value);
					}}
				/>
			</div>
			<div>
				password:{" "}
				<input
					data-testid="password"
					type="password"
					name="password"
					value={password}
					onChange={({ target }) => {
						setPassword(target.value);
					}}
				/>
			</div>
			<button type="submit">login</button>
		</form>
	);
};

LoginForm.propTypes = {
	onSubmit: PropTypes.func.isRequired,
	username: PropTypes.string.isRequired,
	setUsername: PropTypes.func.isRequired,
	password: PropTypes.string.isRequired,
	setPassword: PropTypes.func.isRequired,
};
