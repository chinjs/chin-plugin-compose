import assert from 'assert'
import { resolve, parse, extname } from 'path'
import compose from '.'
import json from 'chin-plugin-json'
import unified from 'chin-plugin-unified'
import mdast2hast from 'remark-rehype'

it('mount', () =>
  compose([
    unified('m2h', [mdast2hast]),
    json()
  ])
  .processor(
    markdown,
    { out: parseXbase(resolve('./stub.md')) }
  )
  .then(([ [ outpath, processed ] ]) => {
    assert.equal(extname(outpath), '.json')
    assert.ok(processed.includes('<h1>title</h1>'))
  })
)

const markdown = `
# title

[![alt](https://www.w3schools.com/w3images/lights.jpg)](https://github.com/kthjm/chin-plugin-compose)

- 0
- 1
- 2

*italics* and **bold** and ~~strikethrough~~.`

const parseXbase = (path) =>
  Object
  .entries(parse(path))
  .filter(([key]) => key !== 'base')
  .reduce((a, [key,value]) => Object.assign(a, { [key]: value }), {})