var fs = require("fs"),
	express = require("express"),
	app = express(),
	marked = require("marked"),
	mustache = require("mustache"),
	months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
	archives,
	drafts,
	get_config = function () {
		var config;
		try {
			config = fs.readFileSync("config.json", { "encoding": "utf-8" });
		} catch (e) {
			console.log("ERROR", "Could not find `config.json`. Please run `setup.js`.")
		}
		return config ? JSON.parse(config) : {};
	},
	get_context = function () {
		var context;
		try {
			context = fs.readFileSync("context.json", { "encoding": "utf-8" });
		} catch (e) {
			console.log("ERROR", "Could not find `context.json`. Please run `setup.js`.")
		}
		return context ? JSON.parse(context) : {};
	},
	tripled_variables = ["css", "content", "profile_image"],
	config = get_config(),
	context = get_context(),
	template = context.theme
		? fs.readFileSync("./themes/" + context.theme + "/main.html", { "encoding": "utf-8" })
		: "";

// Alert if template has not been read.
if (!template) {
	console.log("Template could not be found. Check theme referenced in `context.json` is valid has corresponding folder and `main.html` under `themes` folder.")
}

// By inserting a space in each triplet of braces, this prevents an error with the CSS and Mustache template.
template = template.replace(/\}\}\}/g, "}} }");

// Because Scriptogram only ever uses double-braced variables, replace these with triple-braced.
tripled_variables.forEach(function (v, i, a) {
	template = template.replace(new RegExp("\{\{(" + v + ")\}\}", "g"), "{{{$1}}}");
});

app.use("/themes", express.static('themes'));

app.use(function (req, res, next) {

	var archive_location = config.archives || "";

	fs.readdir(archive_location, function (err, files) {

		var vanilla_fn = function(v, i, a) {
				var current_post = {},
					post_file = "",
					post_title,
					post_tags,
					post_date,
					post_slug;

				console.log("Running vanilla Scriptogram preview.");

				try {
					post_file = fs.readFileSync(archive_location + v, { "encoding": "utf-8" });
				} catch (e) {
					console.log("Could not find `" + v + "`. May be an issue with the `archives` property in `config.json`.")
				}

				post_title = post_file.match(/Title\:[\ \t]*(.*?)[\n\r]/) || "";
				current_post["title"] =  post_title[1] || "";
				post_file = post_title[0] ? post_file.replace(post_title[0], "") : post_file;

				current_post["tags"] = [];
				post_tags = post_file.match(/Tags\:[\ \t]*([^\n\r]*?)[\n\r]/) || ["", ""];
				post_tags[1].split(/\,/g).forEach(function (v, i, a) {
					current_post.tags.push({ "name": v });
				});
				current_post["if_tags"] = current_post.tags.length;
				post_file = post_tags[0] ? post_file.replace(post_tags[0], "") : post_file;

				post_date = post_file.match(/Date\:[\ \t]*(.*?)[\n\r]/) || ["", ""];
				current_post["date"] = new Date(post_date[1].substr(0,4), post_date[1].substr(5,2) - 1, post_date[1].substr(8,2), post_date[1].substr(11,2) + 1, post_date[1].substr(14,2), 0);
				current_post["prettydate"] = months[current_post["date"].getMonth()] + " " + (+(post_date[1].substr(8,2))) + ", " + post_date[1].substr(0,4);
				post_file = post_date[0] ? post_file.replace(post_date[0], "") : post_file;

				post_slug = post_file.match(/Slug\:[\ \t]*(.*?)[\n\r]/) || ["", ""];
				post_file = post_slug[0] ? post_file.replace(post_slug[0], "") : post_file;

				current_post["content"] = marked(post_file);

				if (context.hasOwnProperty("posts")) {
					context.posts.push(current_post);
				}

			},
			ahem_fn = function(v, i, a) {
				var current_post = {},
					post_file = "",
					tags_file = "",
					date_file = "",
					post_title = "";

				console.log("Running Scriptogram preview with `ahem` workflow.");

				try {
					post_file = fs.readFileSync(archive_location + v + "/" + v + ".md", { "encoding": "utf-8" });
					tags_file = fs.readFileSync(archive_location + v + "/" + "tags.txt", { "encoding": "utf-8" });
					date_file = fs.readFileSync(archive_location + v + "/" + "date.txt", { "encoding": "utf-8"});
				} catch (e) {
					console.log("Could not find `" + v + ".md`. May be an issue with the `archives` property in `config.json`.")
				}

				post_title = post_file.match(/^[\s\n\r\t]*\#[\s\t]*([^\n]*)\n*/) || "";
				current_post["title"] =  post_title[1] || "";
				current_post["content"] = marked(post_title[0] ? post_file.replace(post_title[0], "") : "");

				current_post["tags"] = [];
				tags_file.split(/\n/g).forEach(function (v, i, a) {
					current_post.tags.push({ "name": v });
				});
				current_post["if_tags"] = current_post.tags.length;

				current_post["date"] = new Date(date_file.substr(0,4), date_file.substr(5,2) - 1, date_file.substr(8,2), date_file.substr(11,2) + 1, date_file.substr(14,2), 0);
				current_post["prettydate"] = months[current_post["date"].getMonth()] + " " + (+(date_file.substr(8,2))) + ", " + date_file.substr(0,4);

				if (context.hasOwnProperty("posts")) {
					context.posts.push(current_post);
				}

			};

		if (err) {
			res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
		} else {
			archives = files.filter(function (e, i, a) {
				return (e.match(/^\d{12}/));
			});
			context = get_context();
			archives.forEach(config.ahem ? ahem_fn : vanilla_fn);

			context.posts.sort(function (a, b) {
				return b.date - a.date;
			});

			// TODO: sort out synchronicity
			next();
		}
	});
});

app.use("/draft", function (req, res, next) {
	fs.readdir(config.drafts || "", function (err, files) {
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

app.use("/preview", function (req, res, next) {
	res.writeHead(200, "text/html");
	res.write(mustache.render(template, context));
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