# fashion-show

Build consistent and versioned styleguides by including and running consistent lint files across projects.

- [Motivation](#motivation)
- [Writing your requireable styleguide](#writing-your-requireable-styleguide)
- [API Documentation](#api-documentation)

## Motivation

Your styleguide should be **verisoned** and **consistent** across all of your projects. This means that you should only have _ONE_ `.jshintrc` and/or `.jscsrc` file anywhere. But how can this be accomplished easily? By making your own styleguide using `fashion-show`.

## Writing your "requireable" styleguide

**A fully working example at [indexzero/styleguide](https://github.com/indexzero/styleguide).** Basically it happens in a few steps:

- **1.** Make a new repository, `your-styleguide`
- **2.** Add your `.elintrc` and `.jscsrc` files:
```
cd your-styleguide
mkdir dist
mkdir dotfiles
touch dotfiles/.eslintrc
touch dotfiles/.jscsrc

# Also works with jshint
# touch dotfiles/.jshintrc
```
- **3.** Install `fashion-show` and your favorite linters: `jscs`, `eslint` and `jshint` are supported.
```
npm install fashion-show jscs eslint --save
```
- **4.** "Build" your dotfiles on prepublish (i.e. remove comments)
``` js
"scripts": {
  "prepublish": "./node_modules/.bin/fashion-show-build"
}
```
- **5.** Write a simple wrapper script to "lint"
``` js
var path = require('path');

require('fashion-show')({
  commands: ['jscs', 'eslint'],
  rc: path.join(__dirname, '..', 'dist')
}, function (err, code) {
  if (err) { return process.exit(1); }
  process.exit(code);
});
```
- **6.** Expose that script as a "bin" in `your-styleguide`
``` js
"bin": {
  "your-styleguide": "./bin/your-styleguide"
}
```
- **7.** Depend on `your-styleguide`
```
cd your-styleguide
npm publish
cd some/other/project
npm install your-styleguide --save-dev
```
- **8.** Use the bin you created on "pretest"
```
"scripts": {
  "pretest": "your-styleguide lib test"
}
```

## API Documentation

At its core `fashion-show` will run the CLI versions of the lint tools you choose to use it with. A [comparison of JavaScript lint CLI options](https://github.com/indexzero/js-lint-compat/blob/master/CLI-OPTIONS.md) is available if you're interested in exploring this in depth, but `fashion-show` has gone to length to pick the best tool for the job where applicable so when you run:

``` js
require('fashion-show')(options, function (err, code) {
  if (err) { return process.exit(1); }
  process.exit(code);
});
```

The list of all available `options` is:

| option name   | example              | jshint        | jscs         | eslint       |
|:--------------|:---------------------|:--------------|:-------------|:-------------|
| `commands`    | `['jscs', 'eslint']` | `---`         | `---`        | `---`        |
| `targets`     | `['lib/', 'test/']`  | `...args`     | `...args`    | `...args`    |
| `rc`          | `'../rc'`            | `--config`    | `--config`   | `--config`   |
| `fix`         | `true`               | `---`         | `--fix`      | `---`        |
| `exts`        | `['.jsx']`           | `--extra-ext` | `---`        | `--ext .js`  |
| `reporter`    | `'checkstyle'`       | `--reporter`  | `--reporter` | `--format`   |
| `format`      | `'checkstyle'`       | `---`         | `---`        | `--format`   |
| `global`      | `['my-global']`      | `--prereq`    | `---`        | `--global`   |
| `binPath`     | `node_modules/.bin`  | `---`         | `---`        | `---`        |

All of these options are also configurable through the binary scripts that you define in **Step 5** above:

| CLI option      | option name   | Sample usage     |
|:----------------|:--------------|:-----------------|
| `...args`       | `targets`     | `lib/ test/`     |
| `-c,--command`  | `commands`    | `-c jscs`        |
| `-r,--rc`       | `rc`          | `-d ~/.lintrcs`  |
| `-f,--fix`      | `fix`         | `--fix`          |
| `-e,--ext`      | `exts`        | `--ext .jsx`     |
| `-r,--reporter` | `reporter`    | `-r checkstyle`  |
| `-g,--global`   | `global`      | `-g my-global`   |

#### # `commands`

Array of commands to actually run against. Each item in the Array can be a string command or an object:

``` js
{
  'command': 'jscs',
  'args': ['extra', 'jscs', 'specific', 'args']
}
```

#### # `targets`

The set of targets to run the given commands against.

#### # `dist`

Directory where all of your lint files is located. It will be default look for `.{command}rc`: `.jscsrc`, `.jshintrc`, `.eslintrc`

#### # `reporter`

Reporter passed to the linters that you are running.

#### # `fix`

If enabled will turn on [auto fixing in `jscs`](http://jscs.info/overview.html#cli) (Currently whitespace rules, EOF rule, and validateIndentation)

#### # `exts`

Set of **additional** extensions that you want to include running lint(s) against.

#### # `global`

Set of additional globals that you wish to enable


## Tests

Tests are written with `mocha` and code coverage is provided by `istanbul`:

```
npm test
```

##### Author: [Charlie Robbins](charlie.robbins@gmail.com)
##### License: MIT
