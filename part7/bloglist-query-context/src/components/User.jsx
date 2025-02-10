export const User = ({ user }) => {
	return (
		<>
			<h2>{user.name}</h2>
			<h2>added blogs: {user.blogs.length}</h2>
			<ul>
				{user.blogs.map((blog) => (
					<li key={blog.id}>{blog.title}</li>
				))}
			</ul>
		</>
	);
};
