import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BlogForm } from "../components/BlogForm";

describe("BlogForm", () => {
	test("create new blog", async () => {
		const blog = {
			title: "Test Blog",
			author: "bozha",
			url: "https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16",
			likes: "12",
		};

		const mockCreateBlog = vi.fn();
		const { container } = render(<BlogForm createBlog={mockCreateBlog} />);

		const user = userEvent.setup();
		// Find and click the toggle button to reveal the form
		const toggleButton = screen.getByText("newNote");
		await user.click(toggleButton);

		// Input form
		const titleInput = container.querySelector("#title-input");
		const authorInput = container.querySelector("#author-input");
		const urlInput = container.querySelector("#url-input");
		const likesInput = container.querySelector("#likes-input");
		const submitButton = container.querySelector("#submit");

		await user.type(titleInput, blog.title);
		await user.type(authorInput, blog.author);
		await user.type(urlInput, blog.url);
		await user.type(likesInput, blog.likes);
		await user.click(submitButton);
		expect(mockCreateBlog.mock.calls).toHaveLength(1);
		expect(mockCreateBlog.mock.calls[0][0]).toEqual(blog);
	});
});
