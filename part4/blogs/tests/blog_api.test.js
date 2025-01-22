const assert = require("node:assert");
const bcrypt = require("bcrypt");
const { test, before, beforeEach, after, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const { blogs } = require("./test_data");

const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);

describe("Init with some blogs", () => {
	const username1 = "Bob";
	const username2 = "Alice";
	const user1Name = "bob";
	const user2Name = "alice";
	const password1 = "666666";
	const password2 = "888888";
	let user1Token;
	let user2Token;

	before(async () => {
		await User.deleteMany({});
		let passwordHash = await bcrypt.hash(password1, 10);

		await new User({
			username: username1,
			name: user1Name,
			passwordHash,
		}).save();

		passwordHash = await bcrypt.hash(password2, 10);
		await new User({
			username: username2,
			name: user2Name,
			passwordHash,
		}).save();

		user1Token = (
			await api.post("/api/login").send({
				username: username1,
				password: password1,
			})
		).body.token;
		user2Token = (
			await api.post("/api/login").send({
				username: username2,
				password: password2,
			})
		).body.token;
	});

	beforeEach(async () => {
		await Blog.deleteMany({});
		const promises = blogs.map((b) => new Blog(b).save());
		await Promise.all(promises);
	});

	test("blogs are returned as json, all blogs are returned", async () => {
		const response = await api
			.get("/api/blogs")
			.expect(200)
			.expect("Content-Type", /application\/json/);
		assert.strictEqual(response.body.length, blogs.length);
	});

	test("each blog has unique id", async () => {
		const blogs = (await api.get("/api/blogs")).body;
		const blogIdsSet = new Set();
		blogs.forEach((element) => {
			assert(element.id !== undefined);
			blogIdsSet.add(element.id);
		});
		assert.strictEqual(blogIdsSet.length, blogIdsSet.length);
	});

	describe("add blog", () => {
		test("verify adding new blog", async () => {
			const newBlog = {
				title: "Test Blog",
				author: "BoZha",
				url: "http://blog.cleancoder.com/uncle-bob/2018/05/05/TestDefinitions.html",
				likes: 1,
			};
			await api
				.post("/api/blogs")
				.set("Authorization", `Bearer ${user1Token}`)
				.send(newBlog)
				.expect(201)
				.expect("Content-Type", /application\/json/);

			const newBlogs = (await api.get("/api/blogs")).body;
			assert.strictEqual(newBlogs.length, blogs.length + 1);
			const addedBlog = newBlogs.find((b) => b.title === "Test Blog");
			assert.strictEqual(addedBlog.title, "Test Blog");
			assert.strictEqual(
				addedBlog.url,
				"http://blog.cleancoder.com/uncle-bob/2018/05/05/TestDefinitions.html"
			);
			assert.strictEqual(addedBlog.likes, 1);
			const { username, name } = addedBlog.user;
			assert.deepStrictEqual(
				{ username, name },
				{
					username: username1,
					name: user1Name,
				}
			);
		});

		test("verify new blog missing likes will has default likes as 0", async () => {
			const newBlog = {
				title: "Test Blog",
				author: "BoZha",
				url: "http://blog.cleancoder.com/uncle-bob/2018/05/05/TestDefinitions.html",
			};
			await api
				.post("/api/blogs")
				.set("Authorization", `Bearer ${user1Token}`)
				.send(newBlog)
				.expect(201)
				.expect("Content-Type", /application\/json/);

			const newBlogs = (await api.get("/api/blogs")).body;
			assert.strictEqual(newBlogs.length, blogs.length + 1);
			const addedBlog = newBlogs.find((b) => b.title === "Test Blog");
			assert.strictEqual(addedBlog.likes, 0);
		});

		test("verify new blog missing title or url returns 400", async () => {
			let newBlog = {
				author: "BoZha",
				url: "http://blog.cleancoder.com/uncle-bob/2018/05/05/TestDefinitions.html",
			};
			await api
				.post("/api/blogs")
				.set("Authorization", `Bearer ${user1Token}`)
				.send(newBlog)
				.expect(400);

			newBlog = {
				title: "Test Blog",
				author: "BoZha",
			};
			await api
				.post("/api/blogs")
				.set("Authorization", `Bearer ${user1Token}`)
				.send(newBlog)
				.expect(400);
		});

		test("verify adding blog without user token returns 401", async () => {
			const newBlog = {
				title: "Test Blog",
				author: "BoZha",
				url: "http://blog.cleancoder.com/uncle-bob/2018/05/05/TestDefinitions.html",
				likes: 1,
			};
			await api
				.post("/api/blogs")
				.send(newBlog)
				.expect(401)
				.expect("Content-Type", /application\/json/);
		});
	});

	describe("delete blog", () => {
		test("delete existed blog", async () => {
			const newBlog = {
				title: "Test Blog",
				author: "BoZha",
				url: "http://blog.cleancoder.com/uncle-bob/2018/05/05/TestDefinitions.html",
				likes: 1,
			};
			const newBlogId = (
				await api
					.post("/api/blogs")
					.set("Authorization", `Bearer ${user1Token}`)
					.send(newBlog)
			).body.id;

			const oldBlogs = (await api.get("/api/blogs")).body;
			await api
				.delete(`/api/blogs/${newBlogId}`)
				.set("Authorization", `Bearer ${user1Token}`)
				.expect(204);
			const newBlogs = (await api.get("/api/blogs")).body;
			assert.strictEqual(newBlogs.length, oldBlogs.length - 1);
		});

		test("delete non-exist blog has no-op", async () => {
			const newBlog = {
				title: "Test Blog",
				author: "BoZha",
				url: "http://blog.cleancoder.com/uncle-bob/2018/05/05/TestDefinitions.html",
				likes: 1,
			};
			const newBlogId = (
				await api
					.post("/api/blogs")
					.set("Authorization", `Bearer ${user1Token}`)
					.send(newBlog)
			).body.id;
			await Blog.findByIdAndDelete(newBlogId);

			const oldBlogs = (await api.get("/api/blogs")).body;
			await api
				.delete(`/api/blogs/${newBlogId}`)
				.set("Authorization", `Bearer ${user1Token}`)
				.expect(204);
			const newBlogs = (await api.get("/api/blogs")).body;
			assert.strictEqual(newBlogs.length, oldBlogs.length);
		});

		test("delete existed blog without user token returns 401", async () => {
			const newBlog = {
				title: "Test Blog",
				author: "BoZha",
				url: "http://blog.cleancoder.com/uncle-bob/2018/05/05/TestDefinitions.html",
				likes: 1,
			};
			const newBlogId = (
				await api
					.post("/api/blogs")
					.set("Authorization", `Bearer ${user1Token}`)
					.send(newBlog)
			).body.id;

			await api.delete(`/api/blogs/${newBlogId}`).expect(401);
			await api
				.delete(`/api/blogs/${newBlogId}`)
				.set("Authorization", `Bearer ${user2Token}`)
				.expect(401);
		});
	});

	describe.only("update blog", () => {
		test("update blog likes", async () => {
			const newBlog = (
				await api
					.post("/api/blogs")
					.set("Authorization", `Bearer ${user1Token}`)
					.send({
						title: "Test Blog",
						author: "BoZha",
						url: "http://blog.cleancoder.com/uncle-bob/2018/05/05/TestDefinitions.html",
						likes: 1,
					})
			).body;

			const newLikes = newBlog.likes + 10;
			await api
				.put(`/api/blogs/${newBlog.id}`)
				.set("Authorization", `Bearer ${user1Token}`)
				.send({ likes: newLikes });
			const updatedBlog = (await api.get("/api/blogs")).body.find(
				(b) => b.id == newBlog.id
			);
			assert.strictEqual(updatedBlog.likes, newLikes);
		});

		test("update blog likes with invalid token returns 401", async () => {
			const newBlog = (
				await api
					.post("/api/blogs")
					.set("Authorization", `Bearer ${user1Token}`)
					.send({
						title: "Test Blog",
						author: "BoZha",
						url: "http://blog.cleancoder.com/uncle-bob/2018/05/05/TestDefinitions.html",
						likes: 1,
					})
			).body;

			const oldLikes = newBlog.likes;
			const newLikes = oldLikes + 10;
			await api
				.put(`/api/blogs/${newBlog.id}`)
				.send({ likes: newLikes })
				.expect(401);
			await api
				.put(`/api/blogs/${newBlog.id}`)
				.set("Authorization", `Bearer ${user2Token}`)
				.send({ likes: newLikes })
				.expect(401);
			const updatedBlog = (await api.get("/api/blogs")).body.find(
				(b) => b.id == newBlog.id
			);
			assert.strictEqual(updatedBlog.likes, oldLikes);
		});
	});
});

after(async () => {
	await mongoose.connection.close();
});
