const Author = ({ author }) => {
	return (
		<>
			<td>{author.name}</td>
			<td>{author.born}</td>
			<td>{author.bookCount}</td>
		</>
	);
};

export default Author;
