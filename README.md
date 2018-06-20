# chin-plugin-compose

[![npm](https://img.shields.io/npm/v/chin-plugin-compose.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/chin-plugin-compose)
[![npm](https://img.shields.io/npm/dm/chin-plugin-compose.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/chin-plugin-compose)
[![Build Status](https://img.shields.io/travis/kthjm/chin-plugin-compose.svg?longCache=true&style=flat-square)](https://travis-ci.org/kthjm/chin-plugin-compose)
[![Coverage Status](https://img.shields.io/codecov/c/github/kthjm/chin-plugin-compose.svg?longCache=true&style=flat-square)](https://codecov.io/github/kthjm/chin-plugin-compose)

[chin](https://github.com/kthjm/chin) plugin compose extensions.

## Installation
```shell
yarn add -D chin chin-plugin-compose
```

## Usage

### compose(extensions)
```js
import compose from 'chin-plugin-compose'
import json from 'chin-plugin-json'
import unified from 'chin-plugin-unified'
import mdast2hast from 'remark-rehype'

const md2html2json = compose([
  unified('m2h', [mdast2hast]),
  json()
])
```

## License
MIT (http://opensource.org/licenses/MIT)