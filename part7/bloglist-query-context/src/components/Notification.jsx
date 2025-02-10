import { useContext } from "react";
import NotificationContext from "../NotificationContext";
import { Alert } from "react-bootstrap";

export const Notification = () => {
	const [message] = useContext(NotificationContext);
	if (!message || !message.content) {
		return null;
	}

	return (
		<Alert variant={message.isError ? "danger" : "success"}>
			{message.content}
		</Alert>
	);
};
