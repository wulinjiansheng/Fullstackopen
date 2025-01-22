const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { blogs } = require("./test_data");

const listWithOneBlog = [
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
		likes: 5,
		__v: 0,
	},
];

test("dummy returns one", () => {
	const blogs = [];

	const result = listHelper.dummy(blogs);
	assert.strictEqual(result, 1);
});

describe("total likes", () => {
	test("of empty list is zero", () => {
		assert.strictEqual(listHelper.totalLikes([]), 0);
	});

	test("when list has only one blog, equals the likes of that", () => {
		assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5);
	});

	test("total likes is sum of all blogs likes", () => {
		assert.strictEqual(listHelper.totalLikes(blogs), 36);
	});
});

describe("favorite", () => {
	test("of empty list is undefined", () => {
		assert.strictEqual(listHelper.favorite([]), undefined);
	});

	test("when list has only one blog, equals the blog", () => {
		assert.deepStrictEqual(
			listHelper.favorite(listWithOneBlog),
			listWithOneBlog[0]
		);
	});

	test("when list has multiple blogs, equals the blog with most likes", () => {
		assert.deepStrictEqual(listHelper.favorite(blogs), blogs[2]);
	});
});

describe("popular author", () => {
	test("of empty list is undefined", () => {
		assert.strictEqual(listHelper.popularAuthor([]), undefined);
	});

	test("when list has only one blog, equals the blog's author", () => {
		assert.deepStrictEqual(listHelper.popularAuthor(listWithOneBlog), {
			author: "Edsger W. Dijkstra",
			blogs: 1,
		});
	});

	test("when list has multiple blogs, equals the author with most blogs", () => {
		assert.deepStrictEqual(listHelper.popularAuthor(blogs), {
			author: "Robert C. Martin",
			blogs: 3,
		});
	});
});

describe("most liked author", () => {
	test("of empty list is undefined", () => {
		assert.strictEqual(listHelper.mostLikedAuthor([]), undefined);
	});

	test("when list has only one blog, equals the blog's author", () => {
		assert.deepStrictEqual(listHelper.mostLikedAuthor(listWithOneBlog), {
			author: "Edsger W. Dijkstra",
			likes: 5,
		});
	});

	test("when list has multiple blogs, equals the author with most likes", () => {
		assert.deepStrictEqual(listHelper.mostLikedAuthor(blogs), {
			author: "Edsger W. Dijkstra",
			likes: 17,
		});
	});
});
