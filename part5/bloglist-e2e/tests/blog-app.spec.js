const { test, expect, beforeEach, describe } = require("@playwright/test");

const { loginWith, createBlog, getBlogDetailsContainer } = require("./helper");

describe("Blog app", () => {
	const userData = {
		name: "bozha",
		username: "Bo Zhang",
		password: "666666",
	};

	const user2Data = {
		name: "judy",
		username: "Judy Liu",
		password: "88888",
	};

	beforeEach(async ({ page, request }) => {
		await request.post("/api/testing/reset");
		await request.post("/api/users", {
			data: userData,
		});
		await request.post("/api/users", {
			data: user2Data,
		});
		await page.goto("/");
		page.pause();
	});

	test("Login form is shown", async ({ page }) => {
		await expect(page.getByText("Log in to application")).toBeVisible();
		await expect(page.getByTestId("loginForm")).toBeVisible();
	});

	describe("Login", () => {
		test("succeeds with correct credentials", async ({ page }) => {
			const { username, password } = userData;
			await loginWith(page, username, password);
			await expect(page.getByText(`${username} logged in`)).toBeVisible();
		});

		test("fails with wrong credentials", async ({ page }) => {
			await loginWith(
				page,
				userData.username,
				`wrong${userData.password}`
			);
			const errorDiv = page.locator(".error");
			await expect(errorDiv).toContainText(
				"invalid username or password"
			);
		});
	});

	describe("When logged in", () => {
		const blog = {
			title: "Test blog",
			author: "bozha",
			url: "https://123.com",
			likes: "30",
		};
		beforeEach(async ({ page }) => {
			const { username, password } = userData;
			await loginWith(page, username, password);
			await createBlog(
				page,
				blog.title,
				blog.author,
				blog.url,
				blog.likes
			);
		});

		test("a new blog can be created", async ({ page }) => {
			const successDiv = page.locator(".success");
			await expect(successDiv).toContainText(
				`a new blog "${blog.title}" was added to server`
			);
		});

		test("newly created blog can be liked", async ({ page }) => {
			const newBlogDetails = await getBlogDetailsContainer(page, blog);
			await newBlogDetails.locator("#likes").waitFor();
			await newBlogDetails.getByRole("button", { name: "like" }).click();
		});

		test("newly created blog can be deleted by the creator", async ({
			page,
		}) => {
			page.on("dialog", async (dialog) => {
				expect(dialog.message()).toBe(
					`Are you sure to remove blog "${blog.title}" ?`
				);

				await dialog.accept();
			});

			const newBlogDetails = await getBlogDetailsContainer(page, blog);
			await newBlogDetails
				.getByRole("button", { name: "remove" })
				.click();
			await expect(
				page.getByText(`${blog.title} ${blog.author}`)
			).not.toBeVisible();
		});

		test("only blog's creator could delete the blog", async ({ page }) => {
			let newBlogDetails = await getBlogDetailsContainer(page, blog);
			await expect(
				newBlogDetails.getByRole("button", { name: "remove" })
			).toBeVisible();

			// Log in as another user
			await page.getByRole("button", { name: "log out" }).click();
			await loginWith(page, user2Data.username, user2Data.password);
			newBlogDetails = await getBlogDetailsContainer(page, blog);
			await expect(
				newBlogDetails.getByRole("button", { name: "remove" })
			).not.toBeVisible();
		});
	});

	test("Blogs sorted by likes", async ({ page }) => {
		const { username, password } = userData;
		await loginWith(page, username, password);
		await expect(page.getByText(`${username} logged in`)).toBeVisible();

		const blogs = [
			{
				title: "Test blog likes 1",
				author: "bozha",
				url: "https://123.com",
				likes: "1",
			},
			{
				title: "Test blog likes 5",
				author: "bozha",
				url: "https://123.com",
				likes: "5",
			},
			{
				title: "Test blog likes 7",
				author: "bozha",
				url: "https://123.com",
				likes: "7",
			},
			{
				title: "Test blog likes 2",
				author: "bozha",
				url: "https://123.com",
				likes: "2",
			},
		];

		for (const blog of blogs) {
			await createBlog(
				page,
				blog.title,
				blog.author,
				blog.url,
				blog.likes
			);
			const successDiv = page.locator(".success");
			await successDiv
				.getByText(`a new blog "${blog.title}" was added to server`)
				.waitFor();
		}

		const blogsElements = await page.locator("#blog").all();
		expect(blogsElements.length).toEqual(blogs.length);

		const sortedByLikesBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
		for (let i = 0; i < blogsElements.length; ++i) {
			await blogsElements[i].locator("#show-details-button").click();
			const blogContainer = blogsElements[i].locator("..");
			const blogDetailsContainer = blogContainer.locator("#details");
			const blogLikes = await blogDetailsContainer
				.locator("#likes-count")
				.textContent();
			expect(blogLikes).toEqual(sortedByLikesBlogs[i].likes);
		}

		const getLastBlogDetailsContainer = () =>
			page
				.getByText(`${blogs[0].title} ${blogs[0].author}`)
				.locator("..")
				.locator("#details");

		// Update least-liked blog likes should make the blog the first blog in list
		const lastBlogLikes = await getLastBlogDetailsContainer()
			.locator("#likes-count")
			.textContent();
		const addLikes = 7;
		for (let i = 0; i < addLikes; ++i) {
			const previousLikes = parseInt(
				await getLastBlogDetailsContainer()
					.locator("#likes-count")
					.textContent(),
				10
			);
			await getLastBlogDetailsContainer()
				.getByRole("button", { name: "like" })
				.click();
			await getLastBlogDetailsContainer()
				.locator("#likes-count")
				.filter({ hasText: `${previousLikes + 1}` })
				.waitFor();
		}

		const updatedBlogsElements = await page.locator("#blog").all();
		const updatedBlogLikes = await updatedBlogsElements[0]
			.locator("..")
			.locator("#details")
			.locator("#likes-count")
			.textContent();

		expect(parseInt(updatedBlogLikes)).toEqual(
			parseInt(lastBlogLikes) + addLikes
		);
	});
});
