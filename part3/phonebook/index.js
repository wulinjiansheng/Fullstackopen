require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const Person = require("./models/person");

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
	if (req.method !== "POST") {
		morgan("tiny")(req, res, next);
	} else {
		next();
	}
});

morgan.token("body", function (req) {
	return JSON.stringify(req.body);
});

app.post(
	"*",
	morgan(
		":method :url :status :res[content-length] - :response-time ms :body"
	)
);

const unknownEndpoint = (_, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.get("/api/persons", (_, response) =>
	Person.find({}).then((persons) => {
		response.json(persons);
	})
);

app.get("/api/persons/:id", (request, response, next) => {
	const id = request.params.id;
	Person.findById(id)
		.then((person) => {
			if (person) {
				response.json(person);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
	const id = request.params.id;
	Person.findByIdAndDelete(id)
		.then((deletedPerson) => {
			response.status(200).json(deletedPerson);
		})
		.catch((error) => next(error));
});

app.get("/api/info", (_, response) => {
	Person.find({}).then((persons) => {
		const info = `
			<div>Phonebook has info for ${persons.length} people</div>
			<br/>
			<div>${new Date()}</div>
		`;
		return response.send(info);
	});
});

app.post("/api/persons", (request, response, next) => {
	const body = request.body;
	const { name, number } = body;

	if (!name) {
		return response.status(400).json({
			error: "name is missing",
		});
	}

	if (!number) {
		return response.status(400).json({
			error: "number is missing",
		});
	}

	const newPerson = new Person({
		name,
		number,
	});

	// newPerson.save().then(() => response.json(newPerson));
	Person.findOneAndUpdate({ name }, newPerson, {
		new: true,
		upsert: true,
		runValidators: true,
	})
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const body = request.body;
	const { name, number } = body;

	if (!name) {
		return response.status(400).json({
			error: "name is missing",
		});
	}

	if (!number) {
		return response.status(400).json({
			error: "number is missing",
		});
	}

	const id = request.params.id;
	Person.findByIdAndUpdate(
		id,
		{ name, number },
		{ new: true, runValidators: true, context: "query" }
	)
		.then((updatedPerson) => {
			response.json(updatedPerson);
		})
		.catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
	console.error(error.message);
	if (error.name === "CastError") {
		return response.status(400).send({ error: "malformed id" });
	} else if (error.name === "ValidationError") {
		return response.status(400).json({ error: error.message });
	}

	next(error);
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
