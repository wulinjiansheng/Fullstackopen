const app = require("./app");
const cofig = require("./utils/config");

app.listen(cofig.PORT, () => {
	console.log(`Server running on port ${cofig.PORT}`);
});
