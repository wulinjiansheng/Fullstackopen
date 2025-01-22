const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
	const blogs = await Blog.find({}).populate("user", {
		username: 1,
		name: 1,
	});
	response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
	const body = request.body;
	const { title, url } = body;

	if (!title) {
		return response.status(400).json({
			error: "title is missing",
		});
	}

	if (!url) {
		return response.status(400).json({
			error: "url is missing",
		});
	}

	const user = request.user;
	const blog = { likes: 0, user: user._id, ...body };
	const savedBlog = await new Blog(blog).save();

	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();

	response.status(201).json(savedBlog);
});

blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
	const { id } = request.params;
	const body = request.body;
	const user = request.user;

	const oldBlog = await Blog.findById(id);

	if (!oldBlog) {
		return response.status(404).json({ error: "Blog not found" });
	}

	if (oldBlog.user.toString() !== user.id.toString()) {
		return response
			.status(401)
			.json({ error: "Only creator can update blog" });
	}

	const updatedBlog = await Blog.findByIdAndUpdate(
		id,
		{ ...body },
		{ new: true, runValidators: true }
	);

	response.json(updatedBlog);
});

blogsRouter.get("/:id", async (request, response) => {
	const blog = await Blog.findById(request.params.id).populate("user", {
		username: 1,
		name: 1,
	});
	if (blog) {
		response.json(blog);
	} else {
		response.status(404).end();
	}
});

blogsRouter.delete(
	"/:id",
	middleware.userExtractor,
	async (request, response) => {
		const { id } = request.params;
		const user = request.user;

		const oldBlog = await Blog.findById(id);
		if (!oldBlog) {
			return response.status(204).end();
		}

		if (oldBlog.user.toString() !== user.id.toString()) {
			return response
				.status(401)
				.json({ error: "Only creator can delete blog" });
		}

		await Blog.findByIdAndDelete(id);
		response.status(204).end();
	}
);

module.exports = blogsRouter;
