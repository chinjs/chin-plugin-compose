import assert from 'assert'
import rewire from 'rewire'
import { resolve, extname } from 'path'

const modules = rewire('.')
const parseXbase = modules.__get__('parseXbase')

it('compose', () => {
  const { compose, dock } = modules
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
    dock('stream', [], { encoding: 'utf8' }),
    unified('h2m', [hast2mdast]),
    dock('stream', [], { encoding: 'utf8' }),
    json(),
    dock('stream', [], { encoding: 'utf8' })
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

describe('throwd', () => {
  const { compose, dock } = modules
  const test = (callback) => () => assert.throws(callback)
  it('compose(!Array.isArray())', test(() => compose('not_array')))
  it('compose([ not_object ])', test(() => compose([ 'not_object' ])))
  it('compose([ { isCompose: true } ])', test(() => compose([ dock('stream') ])))
  it('dock(invalid_type)', test(() => dock('invalid_type')))
})
