const Header = ({ value }) => <h1>{value}</h1>;

const Total = ({ sum }) => <strong>Number of exercises {sum}</strong>;

const Part = ({ part }) => (
	<p>
		{part.name} {part.exercises}
	</p>
);

const Content = ({ parts }) => (
	<>
		{parts.map((p) => (
			<Part key={p.id} part={p} />
		))}
	</>
);

export const Course = ({ name, parts }) => {
	const total = parts.reduce((sum, p) => sum + p.exercises, 0);
	return (
		<div>
			<Header value={name} />
			<Content parts={parts} />
			<Total sum={total} />
		</div>
	);
};
