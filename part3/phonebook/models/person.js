const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
	.connect(url)
	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 2,
		maxLength: 20,
		required: [true, "User name required"],
	},
	number: {
		type: String,
		minLength: 8,
		maxLength: 20,
		validate: {
			validator: function (value) {
				return /^\d{2,3}-\d{5,}$/.test(value);
			},
			message: (props) => `${props.value} is not a valid phone number!`,
		},
		required: [true, "User phone number required"],
	},
});

personSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
