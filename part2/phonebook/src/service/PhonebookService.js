import axios from "axios";

const baseUrl = "/api/persons";

const getPersons = () => axios.get(baseUrl).then((res) => res.data);

const addPerson = (person) =>
	axios
		.post(baseUrl, person)
		.then((res) => res.data)
		.catch((error) => {
			const errorMessage =
				error.response?.data?.error || "An unknown error occurred";
			console.log("Error caught in addPerson:", errorMessage);
			throw { message: errorMessage };
		});

const deletePerson = (person) =>
	axios.delete(`${baseUrl}/${person.id}`).then((res) => res.data);

const updatePerson = (id, person) =>
	axios
		.put(`${baseUrl}/${id}`, person)
		.then((res) => res.data)
		.catch((error) => {
			const errorMessage =
				error.response?.data?.error || "An unknown error occurred";
			console.log("Error caught in updatePerson:", errorMessage);
			throw { message: errorMessage };
		});

export default { getPersons, addPerson, deletePerson, updatePerson };
