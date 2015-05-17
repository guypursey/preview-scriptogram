// Run in Node.js

var fs = require("fs");

fs.readFile("./themes/basic/main.html", { "encoding": "utf-8" }, function (err, data) {
	if (err) return err;
	var context_array = data.match(/\{\{(.*?)\}\}/g),
		context_object = {};

	context_array.forEach((function (top_context) {
		var domain = [top_context];
		return function (v, i, a) {
			var property = v.replace(/\{\{(.*?)\}\}/, "$1"),
				valuetype,
				context_object = domain[0];

			// Domain shift or unshift based on block character.
			if (property.match(/^#/)) {
				// Create exemplary object within block.
				valuetype = context_object[property.substr(1)] || [{}];
				domain.unshift(valuetype[0]);
			} else if (property.match(/^\^/)) {
				domain.unshift(context_object);
			} else if (property.match(/^\//)) {
				domain.shift();
			} else {
				valuetype = "";
			}

			if (typeof valuetype !== "undefined") {
				property = property.replace(/^[#\^\/]/, "");
				if (context_object.hasOwnProperty(property)) {
					if (typeof context_object[property] !== typeof valuetype) {
						console.log("WARNING: Property `" + property + "` originally logged as " + typeof context_object[property] + " now found as " + typeof valuetype);
					}
				} else {
					context_object[property] = valuetype;
				}
			}
		}
	}(context_object)));

	fs.writeFile("context-array.json", JSON.stringify(context_object, null, "\t"), {"encoding": "utf-8"});

	console.log(context_object);
});
