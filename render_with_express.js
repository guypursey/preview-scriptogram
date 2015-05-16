var fs = require("fs"),
	express = require("express"),
	app = express(),
	marked = require("marked"),
	mustache = require("./mustache.js"),
	template = fs.readFileSync("./themes/basic/main.html", { "encoding": "utf-8" }),
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
	},
	tripled_variables = ["css", "content", "profile_image"],
	context;

// By inserting a space in each triplet of braces, this prevents an error with the CSS and Mustache template.
template = template.replace(/\}\}\}/g, "}} }");

// Because Scriptogram only ever uses double-braced variables, replace these with triple-braced.
tripled_variables.forEach(function (v, i, a) {
	template = template.replace(new RegExp("\{\{(" + v + ")\}\}", "g"), "{{{$1}}}");
});

app.use("/themes", express.static('themes'));

app.use(function (req, res, next) {
	fs.readdir("../content/archives/", function (err, files) {
		if (err) {
			res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
		} else {
			archives = files.filter(function (e, i, a) {
				return (e.match(/^\d{12}/));
			});
			context = object_factory();
			archives.forEach(function(v, i, a) {
				var current_post = {},
					post_file = fs.readFileSync("../content/archives/" + v  + "/" + v + ".md", { "encoding": "utf-8" }),
					tags_file = fs.readFileSync("../content/archives/" + v  + "/" + "tags.txt", { "encoding": "utf-8" });

				current_post["title"] = "Test post";
				current_post["content"] = marked(post_file);
				current_post["tags"] = [{ "name": "test" }];

				context.posts.push(current_post);
			});

			// TODO: sort out synchronicity
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