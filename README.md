# chin-plugin-compose

[![npm](https://img.shields.io/npm/v/chin-plugin-compose.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/chin-plugin-compose)
[![npm](https://img.shields.io/npm/dm/chin-plugin-compose.svg?longCache=true&style=flat-square)](https://www.npmjs.com/package/chin-plugin-compose)
[![Build Status](https://img.shields.io/travis/chinjs/chin-plugin-compose.svg?longCache=true&style=flat-square)](https://travis-ci.org/chinjs/chin-plugin-compose)
[![Coverage Status](https://img.shields.io/codecov/c/github/chinjs/chin-plugin-compose.svg?longCache=true&style=flat-square)](https://codecov.io/github/chinjs/chin-plugin-compose)

[chin](https://github.com/chinjs/chin) plugin compose extensions.

## Installation
```shell
yarn add -D chin chin-plugin-compose
```

## Usage

### compose(extensions)
```js
const compose = require('chin-plugin-compose')
const unified = require('chin-plugin-unified')
const mdast2hast = require('remark-rehype')
const json = require('chin-plugin-json')

const md2html2json = compose([
  unified('m2h', [mdast2hast]),
  json()
])
```

### convert(type)

`convert` can be used in the situation when need to `compose` extensions that includes different type. At least, extensions must be made `extensions[0]` and `extensions[length - 1]` be same type.

```js
const { compose, convert } = require('chin-plugin-compose')
const inkscape = require('chin-plugin-inkscape')
const imagemin = require('chin-plugin-imagemin')

const svg2png2min = compose([
  inkscape('png'),          // { isStream: true }
  convert('stream2buffer'), // shift
  imagemin(),               // { isStream: false }
  convert('buffer2stream')  // restore
])

const svg2min2png = compose([
  imagemin(),               // { isStream: false }
  convert('buffer2stream'), // shift
  inkscape('png'),          // { isStream: true }
  convert('stream2buffer')  // restore
])
```

#### type
- `'stream2buffer'` || `'s2b'`
- `'buffer2stream'` || `'b2s'`

#### plugins as stream
- [`chin-plugin-inkscape`](https://github.com/chinjs/chin-plugin-inkscape)

## License
MIT (http://opensource.org/licenses/MIT)