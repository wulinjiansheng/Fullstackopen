import { useQuery } from "@tanstack/react-query";
import Table from "react-bootstrap/Table";

import { Link } from "react-router-dom";
import usersService from "../services/users";

export const Users = () => {
	const {
		isLoading,
		isPending,
		isError,
		data: users,
		error,
	} = useQuery({
		queryKey: ["users"],
		queryFn: usersService.getAll,
		retry: 3,
		refetchOnWindowFocus: false,
	});

	if (isError) {
		return <div>users service not available error: {error.message}</div>;
	}

	if (isLoading) {
		return <div>loading users data...</div>;
	}

	return (
		<>
			<h2>Users</h2>
			<Table striped bordered size="sm">
				<thead>
					<tr>
						<th></th>
						<th>blogs Created</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>
								<Link to={`/users/${user.id}`}>
									{user.name}
								</Link>
							</td>
							<td>{user.blogs.length}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	);
};
