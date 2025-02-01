import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Blog } from "../components/Blog";

describe("Blog", () => {
	test("blog renders author and title by default", () => {
		const blog = {
			title: "Test Blog",
			author: "bozha",
			url: "https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16",
			likes: 12,
		};

		const { container } = render(<Blog blog={blog} />);

		const blogDiv = container.querySelector("#blog");
		expect(blogDiv).toHaveTextContent(`${blog.title} ${blog.author}`);

		const detailsDiv = container.querySelector("#details");
		expect(detailsDiv).toBeNull();
	});

	test("blog renders url and likes when show details", async () => {
		const blog = {
			title: "Test Blog",
			author: "bozha",
			url: "https://fullstackopen.com/en/part5/testing_react_apps#exercises-5-13-5-16",
			likes: 12,
		};

		const { container } = render(<Blog blog={blog} />);

		const user = userEvent.setup();
		const showDetailsButton = container.querySelector(
			"#show-details-button"
		);
		await user.click(showDetailsButton);

		const detailsDiv = container.querySelector("#details");
		expect(detailsDiv).toBeDefined();

		const urlDiv = container.querySelector("#url");
		expect(urlDiv).toHaveTextContent(`url: ${blog.url}`);

		const likesDiv = container.querySelector("#likes");
		expect(likesDiv).toHaveTextContent(`likes: ${blog.likes}`);
	});
});
