import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";
import Author from "./Author";
import UpdateAuthor from "./UpdateAuthor";

const Authors = () => {
	const result = useQuery(ALL_AUTHORS);
	if (result.loading) {
		return <div>loading authors...</div>;
	}
	const authors = result.data.allAuthors;

	return (
		<div>
			<h2>authors</h2>
			<table>
				<tbody>
					<tr>
						<th></th>
						<th>born</th>
						<th>books</th>
					</tr>
					{authors.map((a) => (
						<tr key={a.name}>
							<Author author={a} />
						</tr>
					))}
				</tbody>
			</table>
			<UpdateAuthor authors={authors} />
		</div>
	);
};

export default Authors;
