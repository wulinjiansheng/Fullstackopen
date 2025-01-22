const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favorite = (blogs) => {
	if (blogs.length === 0) {
		return;
	}
	let i = 0;
	blogs.forEach((blog, index) => {
		if (blog.likes > blogs[i].likes) {
			i = index;
		}
	});
	return blogs[i];
};

const popularAuthor = (blogs) => {
	if (blogs.length === 0) {
		return;
	}
	const authorMap = new Map();
	blogs.forEach(({ author }) =>
		authorMap.set(author, (authorMap.get(author) ?? 0) + 1)
	);

	const res = [...authorMap.entries()].reduce((max, entry) =>
		entry[1] > max[1] ? entry : max
	);

	return {
		author: res[0],
		blogs: res[1],
	};
};

const mostLikedAuthor = (blogs) => {
	if (blogs.length === 0) {
		return;
	}
	const authorMap = new Map();
	blogs.forEach(({ author, likes }) =>
		authorMap.set(author, (authorMap.get(author) ?? 0) + likes)
	);

	const res = [...authorMap.entries()].reduce((max, entry) =>
		entry[1] > max[1] ? entry : max
	);

	return {
		author: res[0],
		likes: res[1],
	};
};

module.exports = {
	dummy,
	totalLikes,
	favorite,
	popularAuthor,
	mostLikedAuthor,
};
