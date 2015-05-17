// To set up `preview-scriptogram` for the first time, run this script with Node.js.

var fs = require("fs");

fs.readFile("context.json", function (err, data) {
	if (err) {
		// If file does not exist, write the file.

		// Basic values required for Scriptogram.
		var context = {
			"author": "",
			"title": "",
			"blog_title": "",
			"posts": [],
			"base_url": "",
			"css": "",
			"profile_image": "",
			"cover_image": "",
			"accent_color": "",
			"theme": "basic",
			"pages": [],
			"page": "",
			"is_archive": false,
			"pagination": ""
		};

		// Stringify context object and write to new context file.
		fs.writeFile("context.json", JSON.stringify(context, null, "\t"));

		console.log("`context.json` now created. Populate with own values to run the preview.");

	} else {
		console.log("`context.json` already exists. Please delete and run this script again to reinitialise.");

	}
});