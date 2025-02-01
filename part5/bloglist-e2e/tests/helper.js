export const loginWith = async (page, username, password) => {
	await page.getByTestId("username").fill(username);
	await page.getByTestId("password").fill(password);
	await page.getByRole("button", { name: "login" }).click();
};

export const createBlog = async (page, title, author, url, likes) => {
	await page.getByRole("button", { name: "newNote" }).click();
	await page.getByTestId("title").fill(title);
	await page.getByTestId("author").fill(author);
	await page.getByTestId("url").fill(url);
	await page.getByTestId("likes").fill(likes);
	await page.getByRole("button", { name: "Create" }).click();
};

export const getBlogDetailsContainer = async (page, blog) => {
	const newBlogTitle = page.getByText(`${blog.title} ${blog.author}`);
	const newBlogTitleContainer = newBlogTitle.locator("..");
	await newBlogTitleContainer.locator("#show-details-button").click();
	const newBlogContainer = newBlogTitleContainer.locator("..");
	return newBlogContainer.locator("#details");
};
