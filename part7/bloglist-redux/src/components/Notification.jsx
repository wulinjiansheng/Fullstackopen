import { useSelector } from "react-redux";

export const Notification = () => {
	const message = useSelector((state) => state.notification);

	if (!message || !message.content) {
		return null;
	}

	return (
		<div className={message.isError ? "error" : "success"}>
			{message.content}
		</div>
	);
};
