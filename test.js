import assert from 'assert'
import rewire from 'rewire'
import { resolve, extname } from 'path'

const modules = rewire('.')
const parseXbase = modules.__get__('parseXbase')

it('compose', () => {
  const { compose } = modules
  const unified = require('chin-plugin-unified')
  const mdast2hast = require('remark-rehype')
  const hast2mdast = require('rehype-remark')
  const json = require('chin-plugin-json')

  const markdown = `
# title

[![alt](https://www.w3schools.com/w3images/lights.jpg)](https://github.com/chinjs/chin-plugin-compose)

- 0
- 1
- 2

*italics* and **bold** and ~~strikethrough~~.`

  return compose([
    unified('m2h', [mdast2hast]),
    unified('h2m', [hast2mdast]),
    json()
  ])
  .processor(
    markdown,
    { out: parseXbase(resolve('./stub.md')) }
  )
  .then(([ [ outpath, processed ] ]) => {
    assert.equal(extname(outpath), '.json')
    assert.ok(processed.includes('# title'))
  })
})

it('compose with convert', () => {
  const { compose, convert } = modules
  const { createReadStream } = require('fs')
  const stream = createReadStream('package.json')
  const pipe = (...arg) => stream.pipe(...arg)

  return compose([
    convert('stream2buffer'),
    convert('buffer2stream'),
    convert('s2b'),
    convert('b2s')
  ])
  .processor(
    pipe,
    { out: parseXbase(resolve('./stub.md')) }
  )
  .then(([ [ outpath, processed ] ]) => {
    assert.equal(outpath, resolve('./stub.md'))
    assert.ok(processed.readable)
  })
})

it('convert(invalid_type) => throwd', () => {
  const { convert } = modules
  assert.throws(() => convert('invalid_type'))
})