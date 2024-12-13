import { useState, useEffect } from "react";

import { Filter } from "./components/Filter";
import { PersonForm } from "./components/PersonForm";
import { Persons } from "./components/Persons";
import { Message } from "./components/Message";
import PhonebookService from "./service/PhonebookService";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [filter, setFilter] = useState("");
	const [message, setMessage] = useState({ isError: false, content: "" });

	useEffect(() => {
		PhonebookService.getPersons().then((newPersons) =>
			setPersons(newPersons)
		);
	}, []);

	return (
		<div>
			<h2>Phonebook</h2>
			<Message message={message} />
			<Filter filter={filter} setFilter={setFilter} />
			<h2>Add a new person</h2>
			<PersonForm
				persons={persons}
				setPersons={setPersons}
				setMessage={setMessage}
			/>
			<h2>Numbers</h2>
			<Persons
				persons={persons}
				setPersons={setPersons}
				filter={filter}
				setMessage={setMessage}
			/>
		</div>
	);
};

export default App;
