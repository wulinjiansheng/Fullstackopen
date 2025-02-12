const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");
const { GraphQLError } = require("graphql");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Author = require("./models/author");
const Book = require("./models/book");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connection to MongoDB:", error.message);
	});

let authors = [
	{
		name: "Robert Martin",
		id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
		born: 1952,
	},
	{
		name: "Martin Fowler",
		id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
		born: 1963,
	},
	{
		name: "Fyodor Dostoevsky",
		id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
		born: 1821,
	},
	{
		name: "Joshua Kerievsky", // birthyear not known
		id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
	},
	{
		name: "Sandi Metz", // birthyear not known
		id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
	},
];

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
 */

let books = [
	{
		title: "Clean Code",
		published: 2008,
		author: "Robert Martin",
		id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
		genres: ["refactoring"],
	},
	{
		title: "Agile software development",
		published: 2002,
		author: "Robert Martin",
		id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
		genres: ["agile", "patterns", "design"],
	},
	{
		title: "Refactoring, edition 2",
		published: 2018,
		author: "Martin Fowler",
		id: "afa5de00-344d-11e9-a414-719c6709cf3e",
		genres: ["refactoring"],
	},
	{
		title: "Refactoring to patterns",
		published: 2008,
		author: "Joshua Kerievsky",
		id: "afa5de01-344d-11e9-a414-719c6709cf3e",
		genres: ["refactoring", "patterns"],
	},
	{
		title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
		published: 2012,
		author: "Sandi Metz",
		id: "afa5de02-344d-11e9-a414-719c6709cf3e",
		genres: ["refactoring", "design"],
	},
	{
		title: "Crime and punishment",
		published: 1866,
		author: "Fyodor Dostoevsky",
		id: "afa5de03-344d-11e9-a414-719c6709cf3e",
		genres: ["classic", "crime"],
	},
	{
		title: "Demons",
		published: 1872,
		author: "Fyodor Dostoevsky",
		id: "afa5de04-344d-11e9-a414-719c6709cf3e",
		genres: ["classic", "revolution"],
	},
];

/*
  you can remove the placeholder query once your first one has been implemented 
*/

const typeDefs = `
  type Query {
    dummy: Int
    bookCount: Int
	allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
    personCount: Int
  }

  type Mutation {
    addBook(
      title: String!
	  published: Int!
      author: String!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }

  type Author {
    name: String!
	born: Int
	bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
	published: Int!
	author: Author!
    genres: [String!]!
    id: ID!
  }
`;

const resolvers = {
	Query: {
		dummy: () => 0,
		bookCount: () => Book.collection.countDocuments(),
		personCount: () => Author.collection.countDocuments(),
		allBooks: (root, { author, genre }) => {
			return Book.find({ author, genres: { $in: [genre] } });
		},
		allAuthors: async () => {
			const authors = await Author.find({}); // Fetch all authors from the database

			// Count the number of books for each author using the Book model
			const authorWithBookCount = await Promise.all(
				authors.map(async (author) => {
					const bookCount = await Book.countDocuments({
						author: author._id,
					}); // Count books that match the author's ObjectId
					return {
						...author.toObject(), // Convert the Mongoose document to a plain object
						bookCount,
					};
				})
			);

			return authorWithBookCount;
		},
	},
	Mutation: {
		addBook: async (root, args) => {
			const newBook = new Book({ ...args });
			if (Author.find({ name: args.author })) {
				const newAuthor = new Author({ name: args.author });
				await newAuthor.save();
			}
			return newBook.save().catch((error) => {
				throw new GraphQLError("Creating the book failed", {
					extensions: {
						code: "BAD_USER_INPUT",
						invalidArgs: args,
						error,
					},
				});
			});
		},
		editAuthor: (root, args) => {
			const author = authors.find((a) => a.name === args.name);
			if (!author) {
				return;
			}
			const updatedAuthor = { ...author, born: args.setBornTo };
			authors = authors.map((a) =>
				a.name === updatedAuthor.name ? updatedAuthor : a
			);
			return updatedAuthor;
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

startStandaloneServer(server, {
	listen: { port: 4000 },
}).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
