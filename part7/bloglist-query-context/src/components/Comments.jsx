import { useQuery } from "@tanstack/react-query";

import blogsService from "../services/blogs";
import { AddCommentForm } from "./AddCommentForm";

export const Comments = ({ blog }) => {
	const {
		isLoading,
		isPending,
		isError,
		data: comments,
		error,
	} = useQuery({
		queryKey: ["comments", blog.id],
		queryFn: ({ queryKey }) => {
			const [, blogId] = queryKey;
			return blogsService.getComments({ blogId });
		},
		retry: 3,
		refetchOnWindowFocus: false,
	});

	if (isError) {
		return <div>comments service not available error: {error.message}</div>;
	}

	if (isLoading) {
		return <div>loading comments data...</div>;
	}

	return (
		<>
			<h2>comments</h2>
			<br />
			<AddCommentForm blog={blog} />
			<ul>
				{comments.map((c) => (
					<li key={c.id}>{c.content}</li>
				))}
			</ul>
		</>
	);
};
