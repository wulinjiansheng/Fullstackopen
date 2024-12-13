import PhonebookService from "../service/PhonebookService";

export const Persons = ({ persons, setPersons, filter, setMessage }) => {
	const regex = new RegExp(filter, "i");
	return (
		<div>
			{persons
				.filter((person) => regex.test(person.name))
				.map((person) => (
					<div key={person.name}>
						{person.name} {person.number} &nbsp;
						<button
							onClick={() => {
								const confirm = window.confirm(
									`Delete ${person.name}?`
								);
								if (!confirm) {
									return;
								}

								PhonebookService.deletePerson(person)
									.then((deletedPerson) => {
										setPersons(
											persons.filter(
												(p) => p.id != deletedPerson.id
											)
										);
										setMessage({
											isError: false,
											content: `${deletedPerson.name} was deleted from server`,
										});
									})
									.catch(() =>
										setMessage({
											isError: true,
											content: `${person.name} has already been removed from server`,
										})
									);
							}}
						>
							delete
						</button>
					</div>
				))}
		</div>
	);
};
