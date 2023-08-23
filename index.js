// This JavaScript code handles the serverside logic for my fictional website storing
// color data.
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import bodyParser from "body-parser";

//Begin to use Express.
const app = express();
const port = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//Set up body-parser to handle JSON as something
let stringParser = bodyParser.text();

//The default values for the colors database. Each color in the database is encoded
//with a hex value, an alpha value, a color name, and a case-sensitive ID which is
//the same as the key the color is stored under.
let colors = {
	//Red
	red: {
		col: "#ff0401",
		alpha: 1,
		name: "Red",
		id: "red",
	},
	//Green
	green: {
		col: "#02ff04",
		alpha: 1,
		name: "Green",
		id: "green",
	},
	//Blue
	blue: {
		col: "#0404ff",
		alpha: 1,
		name: "Blue",
		id: "blue",
	},
};

//This function takes in any string and determines if it is a hex code If it is, then
//the function returns true; otherwise, it returns false.
const isValidColor = (str) => {
	const regex = /\#[\da-f]{6}/gi;
	const arr = str.match(regex);

	return arr !== null;
};

const isValidData = (obj) => {
	//Test 1: the object in question has all the valid properties
	if (obj.col && obj.id && obj.alpha && obj.name) {
		//console.log("all properties are present");
		//Test 2: the object's col property is valid.
		if (isValidColor(obj.col)) {
			//console.log("col property is valid");
			//Test 3: the database does not already contain an object of the same id
			//as the object in question.
			if (Object.hasOwn(colors, obj.id) === false) {
				return true;
			}
		}
	}
	return false;
};

//A cheaty maneuver. This code will only run on my computer, but it is worth it...
//for now.


//Handles GET requests coming in to the root by sending out the homepage.
app.get("/", (req, res) => {
	res.sendFile(`${__dirname}\\home.html`);
});

//Handles GET requests coming in to the /colors path by sending the entire colors
//database.
app.get("/colors", (req, res) => {
	res.send(colors);
});

//Handles GET requests coming in to a specific subset of the /colors path by sending
//the requested color from the database, or simply returning a 404 error if the color
//does not exist.
app.get("/colors/:color", (req, res) => {
	let color = colors[req.params.color];

	if (color) {
		res.send(color);
	} else {
		res.status(404).send(
			'This color does not exist.</br><a href="\\">Go back to home</a>'
		);
	}
});

//Once upon a time, this code to handle POST requests coming in to the /colors path
//might have seen use. However, with an easy-to-use form handling the addition of new
//colors, this code is now unneeded.
// app.post("/colors", (req, res) => {
// 	console.log(req);
// });

//Handles GET requests coming in to the /addcolor path. The form for adding new colors
//to the database is contained in the addcolor.html file.
app.get("/addcolor", (req, res) => {
	res.sendFile(`${__dirname}\\addcolor.html`);
});

//Handles POST requests coming in to the /addcolor path. Most of these requests will
//come from the form at the same location; however, there is an off-chance that there
//will be a user who sends POST requests directly. This code will take in the JSON
//from the form, ensure that it has the same format as the colors already in the
//database, and (if it is) attempt to add it. It will send also a message
//corresponding to the successfulness of the request.
app.post("/addcolor", stringParser, (req, res) => {
	let contents = JSON.parse(req.body);

	if (isValidData(contents)) {
		Object.defineProperty(colors, contents.id, {
			value: contents,
			enumerable: true,
			writable: true,
		});

		res.send("Successfully added to database!<br><a href=\"/\">Back to home</a>");
	} else {
		res.status(400).send("Invalid data. Please try again.");
	}
});

//Listens for requests coming in on the localhost port of our choosing, handling them
//according to the above requirements.
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
