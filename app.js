//const { default: axios } = require("axios");

const apiUrl =
	"https://webapi.okd.liberty.edu/api/job-openings.jsonld?jobreqStatus=OPEN&itemsPerPage=15&order[jobreqJobTitle]=asc&page=1&pagination=false";


async function fetchApiData() {
	try {
		const response = await fetch(apiUrl);
		const js = response.json();
		console.log("JSON retrieved!");
		return js;
	} catch (error) {
		console.error("Error fetching WebAPI: ", error.message);
		return response.error;
	}
}

//return an array of objects according to key, value, or key and value matching
function getObjects(obj, key, val) {
	var objects = [];
	for (var i in obj) {
		if (!obj.hasOwnProperty(i)) continue;
		if (typeof obj[i] == "object") {
			objects = objects.concat(getObjects(obj[i], key, val));
		}
		//if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
		else if ((i == key && obj[i] == val) || (i == key && val == "") || (i == key && obj[i].toLowerCase().includes(val.toLowerCase()))) {
			//
			objects.push(obj);
		} else if (obj[i] == val && key == "") {
			//only add if the object is not already in the array
			if (objects.lastIndexOf(obj) == -1) {
				objects.push(obj);
			}
		}
	}
	return objects;
}

function getInput(obj) {
	const key = "jobreqJobTitle";
    const prompt = require('prompt-sync')();
    var val;
    
    val = prompt('What Job are you looking for? ');
    console.log(`Searching for job: ${val}\n`);

	return getObjects(obj, key, val);
}

fetchApiData()
	.then((js) => {
		var results = getInput(js);
		for (var i in results) {
			console.log(
				`${results[i].jobreqWdReqId}: ${results[i].jobreqJobTitle}\nDepartment: ${results[i].hierarchyDisplayName}\nPosted: ${results[i].jobreqPostDateDate}\n\n`
			);
		}
	})
	.catch((error) => {
		return;
	});

//console.log(getObjects(js, 'jobreqJobTitle', 'Software'));
