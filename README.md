# fashion-show

Automatically enforce and run consistent lint files across projects.

## Motivation

Your styleguide should be **verisoned** and **consistent** across all of your projects. This means that you should only have _ONE_ `.jshintrc` and/or `.jscsrc` file anywhere. But how can this be accomplished easily? By making your own styleguide using `fashion-show`.

## Writing your "requireable" styleguide

**A fully working example at [indexzero/styleguide](https://github.com/indexzero/styleguide).** Basically it happens in a few steps:

1. Make a new repository, `your-styleguide`
2. Add your `.jshintrc` and `.jscsrc` files:
```
cd your-styleguide
mkdir dist
mkdir dotfiles
touch dotfiles/.jshintrc
touch dotfiles/.jscsrc
```
3. Install `fashion-show`
```
npm install fashion-show --save
```
4. "Build" your dotfiles on prepublish (i.e. remove comments)
``` js
"scripts": {
  "prepublish": "./node_modules/.bin/fashion-show-build"
}
```
5. Write a simple wrapper script to "lint"
``` js
var path = require('path');
require('fashion-show')({
  configDir: path.join(__dirname, '..', 'dist'),
  targets: process.argv.splice(2)
});
```
6. Expose that script as a "bin" in `your-styleguide`
``` js
"bin": {
  "your-styleguide": "./bin/your-styleguide"
}
```
7. Depend on `your-styleguide`
```
cd your-styleguide
npm publish
cd some/other/project
npm install your-styleguide --save-dev
```
6. Use the bin you created on "pretest"
```
"scripts": {
  "pretest": "./node_modules/.bin/your-styleguide lib test"
}
```

##### Author: [Charlie Robbins](charlie.robbins@gmail.com)
##### License: MIT
