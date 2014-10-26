// Run in Node.js

var fs = require("fs");

fs.readFile("./theme/main.html", { "encoding": "utf-8" }, function (err, data) {
	if (err) return err;
	var context_array = data.match(/\{\{(.*?)\}\}/g),
		context_object = {};

	context_array.forEach(function (v, i, a) {
		var property = v.replace(/\{\{(.*?)\}\}/, "$1"),
			valuetype;
		if (!context_object.hasOwnProperty(property) && property.match(/^[#\^\/]/)) {
			property = property.replace(/^[#\^\/]/, "");
			valuetype = [];
		} else if (!property.match(/^\//)) {
			valuetype = "";
		}

		context_object[property] = valuetype;

	});

	fs.writeFile("context-array.json", JSON.stringify(context_object, null, "\t"), {"encoding": "utf-8"});

	console.log(context_object);
});
