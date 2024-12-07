import { useState } from "react";

const Button = (props) => {
	return <button onClick={props.onClick}>{props.title}</button>;
};

const StatisticLine = (props) => {
	return (
		<div>
			{props.text} {props.value}
		</div>
	);
};

const StatisticTableRow = (props) => {
	return (
		<tr>
			<td>{props.text}</td>
			<td>{props.value}</td>
		</tr>
	);
};

const StatisticTable = ({ good, neutral, bad }) => {
	const all = good + neutral + bad;
	const score = good - bad;
	const average = (score / all).toFixed(1);
	const positive = ((good / all) * 100).toFixed(1) + "%";
	return (
		<table>
			<tbody>
				<StatisticTableRow text="good" value={good} />
				<StatisticTableRow text="neutral" value={neutral} />
				<StatisticTableRow text="bad" value={bad} />
				<StatisticTableRow text="all" value={all} />
				<StatisticTableRow text="average" value={average} />
				<StatisticTableRow text="positive" value={positive} />
			</tbody>
		</table>
	);
};

const Statistics = ({ good, neutral, bad }) => {
	const all = good + neutral + bad;

	return (
		<>
			<h1>statistics</h1>
			{all > 0 ? (
				<StatisticTable good={good} neutral={neutral} bad={bad} />
			) : (
				<div>No feedback given</div>
			)}
		</>
	);
};

const App = () => {
	// save clicks of each button to its own state
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	return (
		<>
			<h1>give feedback</h1>
			<Button title="good" onClick={() => setGood(good + 1)} />
			<Button title="neutral" onClick={() => setNeutral(neutral + 1)} />
			<Button title="bad" onClick={() => setBad(bad + 1)} />
			<Statistics good={good} neutral={neutral} bad={bad} />
		</>
	);
};

export default App;
