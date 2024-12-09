import { useState } from "react";
import PhonebookService from "../service/PhonebookService";

export const PersonForm = ({
	persons,
	setPersons,
	setSuccessMessage,
	setErrorMessage,
}) => {
	const [newPerson, setNewPerson] = useState({});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();

				if (!newPerson.name || !newPerson.number) {
					alert("Name and number cannot be empty.");
					return;
				}

				const existingPerson = persons.find(
					(p) => p.name === newPerson.name
				);
				if (existingPerson) {
					const confirm = window.confirm(
						`${newPerson.name} is already added to phonebook, ` +
							"replace the old number with a new one?"
					);
					if (!confirm) {
						return;
					}
					PhonebookService.updatePerson(
						existingPerson.id,
						newPerson
					).then((updatedPerson) => {
						setPersons(
							persons.map((p) =>
								p.id === updatedPerson.id ? updatedPerson : p
							)
						);
						setNewPerson({});
						setSuccessMessage(
							`${updatedPerson.name} number was updated`
						);
					});
					return;
				}

				PhonebookService.addPerson(newPerson).then((addedPerson) => {
					setPersons([...persons, addedPerson]);
					setNewPerson({});
					setSuccessMessage(
						`${addedPerson.name} was added to server`
					);
				});
			}}
		>
			<div>
				name:{" "}
				<input
					value={newPerson.name ?? ""}
					onChange={(e) =>
						setNewPerson({ ...newPerson, name: e.target.value })
					}
				/>
			</div>
			<div>
				number :{" "}
				<input
					value={newPerson.number ?? ""}
					onChange={(e) =>
						setNewPerson({
							...newPerson,
							number: e.target.value,
						})
					}
				/>
			</div>
			<div>
				<button type="submit">add</button>
			</div>
		</form>
	);
};
