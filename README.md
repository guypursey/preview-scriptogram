# preview-scriptogram

> A simple way to preview your Scriptogram blog offline.

v0.0.1

## Dependencies

	nodejs
	npm

### NPM dependencies

    "express": "4.12.x",
    "marked": "0.3.x",
    "mustache": "2.0.x"

## Set-up

 1. Run `npm install` after download to make sure you have all dependencies.
 2. Run `setup.js` with Node to create `config.json` and `context.json` files.
 3. Ensure that the `archives` and `drafts` properties in `config.json` point to the folders containing your published and unpublished posts respectively.
 4. Enter all the values for your blog (your name, the blog's name, etc.) into the `context.json` file.

## Usage

 1. Run `preview-scriptogram.js` with Node.
 2. Visit `127.0.0.1:1337/preview`.
