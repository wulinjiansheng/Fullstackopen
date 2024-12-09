export const SuccessMessage = ({ message }) => {
	if (!message) {
		return null;
	}

	return <div className="success">{message}</div>;
};
