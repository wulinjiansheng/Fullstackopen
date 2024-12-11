const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
	if (req.method !== "POST") {
		morgan("tiny")(req, res, next);
	} else {
		next();
	}
});

morgan.token("body", function (req, res) {
	return JSON.stringify(req.body);
});

app.post(
	"*",
	morgan(
		":method :url :status :res[content-length] - :response-time ms :body"
	)
);

let persons = [
	{
		id: "1",
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: "2",
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: "3",
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: "4",
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

const generateId = () => {
	const maxId =
		persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
	return String(maxId + 1);
};

app.get("/api/persons", (request, response) => response.json(persons));

app.get("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	const person = persons.find((p) => p.id === id);
	if (!person) {
		response.statusMessage = "No person found";
		response.status(404).end();
		return response;
	}
	return response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
	const id = request.params.id;
	const deletedPerson = persons.find((p) => p.id === id);
	persons = persons.filter((p) => p.id !== id);
	if (!deletedPerson) {
		response.statusMessage = "No person found";
		response.status(404).end();
		return response;
	} else {
		return response.status(200).json(deletedPerson);
	}
});

app.get("/api/info", (request, response) => {
	const info = `
		<div>Phonebook has info for ${persons.length} people</div>
		<br/>
		<div>${new Date()}</div>
	`;
	return response.send(info);
});

app.post("/api/persons", (request, response) => {
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

	if (persons.find((p) => p.name === name)) {
		return response.status(400).json({
			error: "name must be unique",
		});
	}

	const newPerson = {
		id: generateId(),
		name,
		number,
	};

	persons = [...persons, newPerson];
	return response.json(newPerson);
});

app.put("/api/persons/:id", (request, response) => {
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

	const existingPerson = persons.find((p) => p.name === name);
	const newPerson = {
		id: existingPerson ? existingPerson.id : generateId(),
		name,
		number,
	};
	persons = persons.map((p) => (p.id === newPerson.id ? newPerson : p));

	return response.json(newPerson);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
