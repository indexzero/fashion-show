## Comparison of JavaScript Lint tool CLI options

Compiled against:
- `jshint@2.8.0`
- `jscs@2.0.0`
- `eslint@1.0.0`

| jshint            | jscs             | eslint           |
|:------------------|:-----------------|:-----------------|
| --config          | --config         | --config         |
| --reporter        | --reporter       | --format         |
| --verbose         | --verbose        |                  |
| --show-non-errors |                  |                  |
| --extra-ext       |                  | --ext .js        |
| --extract         |                  |                  |
| --exclude-path    |                  |                  |
| --prereq          |                  | --global         |
| --help            | --help           | --help           |
| --version         | --version        | --version        |
|                   | --fix            |                  |
|                   | --auto-configure |                  |
|                   | --preset         |                  |
|                   | --esnext         |                  |
|                   | --esprima        |                  |
|                   | --error-filter   |                  |
|                   | --no-colors      | --no-color       |
|                   | --max-errors     |                  |
|                   |                  | --ignore-path    |
|                   |                  | --no-eslintrc    |
|                   |                  | --no-ignore      |
|                   |                  | --output-file    |
|                   |                  | --plugin         |
|                   |                  | --quiet          |
|                   |                  | --rule           |
|                   |                  | --rulesdir       |
|                   |                  | --stdin          |
|                   |                  | --stdin-filename |
