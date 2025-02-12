import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, UPDATE_AUTHOR } from "../queries";

const UpdateAuthor = ({ authors }) => {
	const [name, setName] = useState("");
	const [born, setBorn] = useState("");

	const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
		onError: (error) => {
			const messages = error.graphQLErrors
				.map((e) => e.message)
				.join("\n");
		},
	});

	const submit = async (event) => {
		event.preventDefault();

		updateAuthor({
			variables: { name, born: parseInt(born) },
		});

		setBorn("");
	};

	return (
		<div>
			<h2>Set birthyear</h2>
			<form onSubmit={submit}>
				<select onChange={({ target }) => setName(target.value)}>
					{authors.map((a) => (
						<option key={a.name} value={a.name}>
							{a.name}
						</option>
					))}
				</select>
				<div>
					born
					<input
						type="number"
						value={born}
						onChange={({ target }) => setBorn(target.value)}
					/>
				</div>
				<button type="submit">update author</button>
			</form>
		</div>
	);
};

export default UpdateAuthor;
