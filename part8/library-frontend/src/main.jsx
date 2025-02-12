import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";

const client = new ApolloClient({
	uri: "http://localhost:4000",
	cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Router>
			<ApolloProvider client={client}>
				<App />
			</ApolloProvider>
		</Router>
	</React.StrictMode>
);
