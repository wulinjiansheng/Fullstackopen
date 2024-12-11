import axios from "axios";

const baseUrl = "http://localhost:3001/api/persons";

const getPersons = () => axios.get(baseUrl).then((res) => res.data);

const addPerson = (person) =>
	axios.post(baseUrl, person).then((res) => res.data);

const deletePerson = (person) =>
	axios.delete(`${baseUrl}/${person.id}`).then((res) => res.data);

const updatePerson = (id, person) =>
	axios.put(`${baseUrl}/${id}`, person).then((res) => res.data);

export default { getPersons, addPerson, deletePerson, updatePerson };