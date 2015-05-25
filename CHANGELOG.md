# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/) and the standard outlined at [Keep a CHANGELOG](keepachangelog.com).

## [Unreleased]
### Changed
- No changes as yet.

## [0.0.2] -- 2015-05-25
### Added
 - Property in initialised `config.json` via `setup.js`. This allows users to opt into the [`ahem` workflow conventions].

## [0.0.1] -- 2015-05-25
### Added
 - Date display. Dates now rendered as they are in Scriptogram itself, based on `dates.txt` for each post.
 - Ordering of posts; previews will now show in reverse-chronological order.

### Changed
 - Title display. Instead of a test title, actual title pulled from first `h1` of main post file.
 - Tag display. Instead of a test tag, actual tags are now pulled from each post's corresponding `tags.txt` file.

### Fixed
 - Archive location. This was hard-coded in one place before; now the folder is controlled completely by `config.json`.

## 0.0.0 -- 2015-05-17
### Added
 - Basic preview script of files stored in specified `archives` location according to [`ahem` workflow conventions].
 - Ability to see JSON lists of `archives` and `drafts` files in pretty-printed plain-text.


[`ahem` workflow conventions]: https://github.com/guypursey/ahem

[0.0.2]: https://github.com/guypursey/preview-scriptogram/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/guypursey/preview-scriptogram/compare/v0.0.0...v0.0.1
[Unreleased]: https://github.com/guypursey/preview-scriptogram/compare/v0.0.1...HEAD