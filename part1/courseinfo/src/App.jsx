const Header = (props) => {
	console.log(props);
	return <h1>{props.course}</h1>;
};

const Part = (props) => {
	return (
		<p>
			{props.part} {props.exercises}
		</p>
	);
};

const Content = (props) => {
	return (
		<div>
			{props.parts.map((p) => (
				<Part key={p.name} part={p.name} exercises={p.exercises} />
			))}
		</div>
	);
};

const Total = (props) => {
	const total = props.parts.reduce((sum, part) => sum + part.exercises, 0);
	return <p>Number of exercises {total}</p>;
};

const App = () => {
	const course = {
		name: "Half Stack application development",
		parts: [
			{
				name: "Fundamentals of React",
				exercises: 10,
			},
			{
				name: "Using props to pass data",
				exercises: 7,
			},
			{
				name: "State of a component",
				exercises: 14,
			},
		],
	};

	return (
		<div>
			<Header course={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</div>
	);
};

export default App;
