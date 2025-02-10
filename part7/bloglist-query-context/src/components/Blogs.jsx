import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import blogsService from "../services/blogs";
import { AddBlogForm } from "./AddBlogForm";

export const Blogs = () => {
	const {
		isLoading,
		isPending,
		isError,
		data: blogs,
		error,
	} = useQuery({
		queryKey: ["blogs"],
		queryFn: blogsService.getAll,
		retry: 3,
		refetchOnWindowFocus: false,
	});

	if (isError) {
		return <div>blogs service not available error: {error.message}</div>;
	}

	if (isLoading) {
		return <div>loading blogs data...</div>;
	}

	const sortedBlogs = [...blogs].sort((b1, b2) => b2.likes - b1.likes);

	return (
		<>
			<AddBlogForm />
			<br />
			{sortedBlogs.map((blog) => (
				<div
					key={blog.id}
					style={{
						border: "1px solid black",
						padding: 5,
						marginBottom: 10,
					}}
				>
					<Link to={`/blogs/${blog.id}`}>
						{blog.title} by {blog.author}
					</Link>
				</div>
			))}
		</>
	);
};
