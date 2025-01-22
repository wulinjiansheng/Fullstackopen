const assert = require("node:assert");
const bcrypt = require("bcrypt");
const { test, beforeEach, after, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const User = require("../models/user");

const api = supertest(app);

describe("Init with one user", () => {
	beforeEach(async () => {
		await User.deleteMany({});
		const passwordHash = await bcrypt.hash("sekret", 10);
		const user = new User({
			username: "root",
			name: "Root User",
			passwordHash,
		});

		await user.save();
	});

	test("users are returned as json, all blogs are returned", async () => {
		const response = await api
			.get("/api/users")
			.expect(200)
			.expect("Content-Type", /application\/json/);
		assert.strictEqual(response.body.length, 1);
	});

	test("create user with fresh username", async () => {
		const oldUsers = (await api.get("/api/users")).body;
		const addUser = {
			username: "wulinjiansheng",
			name: "Bo Zhang",
			password: "r1dghas",
		};
		await api
			.post("/api/users")
			.send(addUser)
			.expect(201)
			.expect("Content-Type", /application\/json/);
		const newUsers = (await api.get("/api/users")).body;

		assert.strictEqual(oldUsers.length + 1, newUsers.length);
		assert(
			newUsers.filter((user) => user.username === addUser.username)
				.length === 1
		);
	});

	test("create user with invalid operations", async () => {
		const updateUserResult = async (user) =>
			await api
				.post("/api/users")
				.send(user)
				.expect(400)
				.expect("Content-Type", /application\/json/);

		// Duplicated user
		let result = await updateUserResult({
			username: "root",
			name: "Bo Zhang",
			password: "r1dghas",
		});
		assert(result.body.error.includes("expected `username` to be unique"));

		// Missing username
		result = await updateUserResult({
			name: "Bo Zhang",
			password: "r1dghas",
		});
		assert(
			result.body.error.includes(
				"User validation failed: username: Path `username` is required."
			)
		);

		// Missing name
		result = await updateUserResult({
			username: "wulinjiansheng",
			password: "r1dghas",
		});
		assert(
			result.body.error.includes(
				"User validation failed: name: Path `name` is required."
			)
		);

		// Missing password
		result = await updateUserResult({
			username: "wulinjiansheng",
			name: "Bo Zhang",
		});
		console.log("result.body.error: ", result.body.error);
		assert(result.body.error.includes("password must be provided"));

		// Missing password
		result = await updateUserResult({
			username: "wulinjiansheng",
			name: "Bo Zhang",
			password: "12",
		});
		assert(
			result.body.error.includes("password must be at least 3 characters")
		);
	});
});

after(async () => {
	await mongoose.connection.close();
});
