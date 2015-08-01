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
- **2.** Add your `.jshintrc` and `.jscsrc` files:
```
cd your-styleguide
mkdir dist
mkdir dotfiles
touch dotfiles/.jshintrc
touch dotfiles/.jscsrc
```
- **3.** Install `fashion-show`
```
npm install fashion-show --save
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
  configDir: path.join(__dirname, '..', 'dist'),
  targets: process.argv.splice(2)
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
  "pretest": "./node_modules/.bin/your-styleguide lib test"
}
```

## API Documentation

At its core `fashion-show` will run the CLI versions of the lint tools you choose to use it with. A [comparison of JavaScript lint CLI options](COMMANDS.md) is available if you're interested in exploring this in depth, but `fashion-show` has gone to length to pick the best tool for the job where applicable so when you run:

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
| `targets`     | `['lib/', 'test/'`   | `...args`     | `...args`    | `...args`    |
| `dist`        | `['../dist']`        | `--config`    | `--config`   | `--config`   |
| `reporter`    | `'checkstyle'`       | `--reporter`  | `--reporter` | `--reporter` |
| `fix`         | `true`               | `---`         | `--fix`      | `---`        |
| `exts`        | `['.jsx']`           | `--extra-ext` | `---`        | `--ext .js`  |
| `global`      | `['my-global']`      | `--prereq`    | `---`        | `--global`   |
| `tests`       | `'mocha'`            | `---`         | `---`        | `---`        |

### # `commands`

Array of commands to actually run against. Each item in the Array can be a string command or an object:

``` js
{
  'command': 'jscs',
  'args': ['extra', 'jscs', 'specific', 'args']
}
```

### # `targets`

The set of targets to run the given commands against. If any of these arguments match `/test/` then the [tests](#tests) options will also be included.

### # `dist`

Directory where all of your lint files is located. It will be default look for `.{command}rc`: `.jscsrc`, `.jshintrc`, `.eslintrc`

### # `reporter`

Reporter passed to the linters that you are running.

### # `fix`

If enabled will turn on [auto fixing in `jscs`](http://jscs.info/overview.html#cli) (Currently whitespace rules, EOF rule, and validateIndentation)

### # `exts`

Set of **additional** extensions that you want to include running lint(s) against.

### # `global`

Set of additional globals that you wish to enable

### # `tests`

Ensures that the additional globals required by your test framework are included in any [targets](#targets) which match `/test/`.


##### Author: [Charlie Robbins](charlie.robbins@gmail.com)
##### License: MIT
