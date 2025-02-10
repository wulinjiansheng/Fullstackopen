import React, { useEffect, useRef, useState } from "react";

const useField = (type) => {
	const [value, setValue] = useState("");

	const onChange = (event) => {
		setValue(event.target.value);
	};

	return {
		type,
		value,
		onChange,
	};
};

const useCountry = (name) => {
	const [country, setCountry] = useState(null);
	const nameRef = useRef(name);

	useEffect(() => {
		nameRef.current = name; // Keep track of the latest name
		if (!name) {
			return;
		}
		const fetchCountry = async () => {
			try {
				const fetchName = name;
				const response = await fetch(
					`https://studies.cs.helsinki.fi/restcountries/api/name/${fetchName}`
				);
				if (fetchName !== nameRef.current) {
					return;
				}

				if (!response.ok) {
					setCountry({ found: false });
					return;
				}

				const data = await response.json();

				setCountry({ data, found: true });
			} catch (e) {
				console.log("error: ", e.message);
			}
		};
		fetchCountry();
	}, [name]);

	return country;
};

const Country = ({ country }) => {
	if (!country) {
		return null;
	}

	if (!country.found) {
		return <div>not found...</div>;
	}

	return (
		<div>
			<h3>{country.data.name.common} </h3>
			{country.data.capital.length > 0 && (
				<div>capital {country.data.capital[0]} </div>
			)}
			<div>population {country.data.population}</div>
			<img
				src={country.data.flags.png}
				height="100"
				alt={`flag of ${country.data.name}`}
			/>
		</div>
	);
};

const App = () => {
	const nameInput = useField("text");
	const [name, setName] = useState("");
	const country = useCountry(name);

	const fetch = (e) => {
		e.preventDefault();
		setName(nameInput.value);
	};

	return (
		<div>
			<form onSubmit={fetch}>
				<input {...nameInput} />
				<button>find</button>
			</form>

			<Country country={country} />
		</div>
	);
};

export default App;
