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

### dock(type, extensions[, options])

Because composed extension's type  is determined by `extensions[0]`, `dock` can be used in the situation when need to `compose` extensions that includes different type.

```js
const { compose, dock } = require('chin-plugin-compose')
const inkscape = require('chin-plugin-inkscape')
const imagemin = require('chin-plugin-imagemin')

const svg2png2min = compose([
  inkscape('png'), // { isStream: true }
  dock('buffer', [ imagemin() ])
])

const svg2min2png = compose([
  imagemin(), // { isStream: false }
  dock('stream', [ inkscape('png') ])
])
```

#### type
- `'stream'`
- `'buffer'`

#### options
- `encoding` (= `null`)

## Plugins
|name|encoding|isStream|
|:-|:-:|:-:|
|[`chin-plugin-imagemin`](https://github.com/chinjs/chin-plugin-imagemin)|`null`|-|
|[`chin-plugin-unified`](https://github.com/chinjs/chin-plugin-unified)|`'utf8'`|-|
|[`chin-plugin-json`](https://github.com/chinjs/chin-plugin-json)|`'utf8'`|-|
|[`chin-plugin-convert-svg`](https://github.com/chinjs/chin-plugin-convert-svg)|`null`|-|
|[`chin-plugin-inkscape`](https://github.com/chinjs/chin-plugin-inkscape)|`null`|✔|
|[`chin-plugin-svgr`](https://github.com/chinjs/chin-plugin-svgr)|`null`|-|
|[`chin-plugin-favicons`](https://github.com/chinjs/chin-plugin-favicons)|`null`|-|
|[`chin-plugin-gulp`](https://github.com/chinjs/chin-plugin-gulp)|`null`|-|

## License
MIT (http://opensource.org/licenses/MIT)