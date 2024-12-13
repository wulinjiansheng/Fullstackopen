const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("give password as argument");
	process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://wulinjiansheng:${password}@cluster0.jslus.mongodb.net/phoneBook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const phoneBookSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Phonebook = mongoose.model("Phonebook", phoneBookSchema);

if (name && number) {
	const phoneBook = new Phonebook({
		name,
		number,
	});

	phoneBook.save().then((result) => {
		console.log("phoneBook saved: phoneBook");
		mongoose.connection.close();
	});
} else {
	Phonebook.find({}).then((result) => {
		console.log("phonebook: ");
		result.forEach((phonebook) => {
			console.log(`${phonebook.name} ${phonebook.number}`);
		});
		mongoose.connection.close();
	});
}
