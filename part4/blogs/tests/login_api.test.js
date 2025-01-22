const assert = require("node:assert");
const bcrypt = require("bcrypt");
const { test, beforeEach, after, describe } = require("node:test");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const User = require("../models/user");

const api = supertest(app);

describe("Login with", () => {
	beforeEach(async () => {
		await User.deleteMany({});
		const passwordHash = await bcrypt.hash("888888", 10);
		const user = new User({
			username: "root",
			name: "Root User",
			passwordHash,
		});

		await user.save();
	});

	test("correct username and password returns 200", async () => {
		await api
			.post("/api/login")
			.send({ username: "root", password: "888888" })
			.expect(200)
			.expect("Content-Type", /application\/json/);
	});

	test("wrong username returns 401", async () => {
		await api
			.post("/api/login")
			.send({ username: "root wrong", password: "888888" })
			.expect(401)
			.expect("Content-Type", /application\/json/);
	});

	test("wrong password returns 401", async () => {
		await api
			.post("/api/login")
			.send({ username: "root", password: "666666" })
			.expect(401)
			.expect("Content-Type", /application\/json/);
	});
});

after(async () => {
	await mongoose.connection.close();
});
