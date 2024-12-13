export const Message = ({ message }) => {
	if (!message.content) {
		return null;
	}

	return (
		<div className={message.isError ? "error" : "success"}>
			{message.content}
		</div>
	);
};
