var fs = require("fs"),
	express = require("express"),
	app = express(),
	archives,
	drafts,
	object_factory = function () {
		var obj = {
			"author": "Guy Pursey",
			"title": "Coughing & Chopping",
			"blog_title": "A testing blog.",
			"posts": [],
			"base_url": "http://scriptogr.am/guypursey",
			"css": "<link href=\"/themes/basic/style.css\" rel=\"stylesheet\" type=\"text/css\" />",
			"profile_image": "http://www.gravatar.com/avatar/97e4c3c79d57e4e9df2f78aaa5c39361?d=mm&s=128",
			"cover_image": "",
			"accent_color": "",
			"theme": "basic",
			"pages": [
				{
					"permalink": "",
					"title": ""
				}
			],
			"page": "",
			"is_archive": false,
			"pagination": ""
		};
		return obj;
	};

app.use(function (req, res, next) {
	fs.readdir("../content/archives/", function (err, files) {
		if (err) {
			res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
		} else {
			archives = files.filter(function (e, i, a) {
				return (e.match(/^\d{12}/));
			});
			next();
		}
	});
});

app.use("/draft", function (req, res, next) {
	fs.readdir("../content/drafts/", function (err, files) {
		if (err) {
			res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
		} else {
			drafts = files.filter(function (e, i, a) {
				return true;
			});
			next();
		}
	});
});


app.get("/", function (req, res, next) {
	res.writeHead(200, "text/html");
	res.write(JSON.stringify(archives, null, "\t"));
	next();
});

app.get("/draft", function (req, res, next) {
	res.writeHead(200, "text/html");
	res.write(JSON.stringify(archives, null, "\t"));
	res.write(JSON.stringify(drafts, null, "\t") || " ");
	next();
});

app.use(function (req, res, next) {
	res.end();
});



app.listen(1337);