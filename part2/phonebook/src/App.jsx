import { useState, useEffect } from "react";

import { Filter } from "./components/Filter";
import { PersonForm } from "./components/PersonForm";
import { Persons } from "./components/Persons";
import { SuccessMessage } from "./components/SuccessMessage";
import { ErrorMessage } from "./components/ErrorMessage";
import PhonebookService from "./service/PhonebookService";

const App = () => {
	const [persons, setPersons] = useState([]);
	const [filter, setFilter] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		PhonebookService.getPersons().then((newPersons) =>
			setPersons(newPersons)
		);
	}, []);

	return (
		<div>
			<h2>Phonebook</h2>
			<SuccessMessage message={successMessage} />
			<ErrorMessage message={errorMessage} />
			<Filter filter={filter} setFilter={setFilter} />
			<h2>Add a new person</h2>
			<PersonForm
				persons={persons}
				setPersons={setPersons}
				setSuccessMessage={setSuccessMessage}
				setErrorMessage={setErrorMessage}
			/>
			<h2>Numbers</h2>
			<Persons
				persons={persons}
				setPersons={setPersons}
				filter={filter}
				setSuccessMessage={setSuccessMessage}
				setErrorMessage={setErrorMessage}
			/>
		</div>
	);
};

export default App;
