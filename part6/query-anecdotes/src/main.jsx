import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";

import App from "./App";
import { NotificationProvider } from "./NotificationContext";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
	<NotificationProvider>
		<QueryClientProvider client={queryClient}>
			<App />
		</QueryClientProvider>
	</NotificationProvider>
);
