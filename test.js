import assert from 'assert'
import rewire from 'rewire'
import { resolve, extname } from 'path'
import compose from '.'
import json from 'chin-plugin-json'
import unified from 'chin-plugin-unified'
import mdast2hast from 'remark-rehype'
import hast2mdast from 'rehype-remark'

const parseXbase = rewire('.').__get__('parseXbase')

it('mount', () =>
  compose([
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
)

const markdown = `
# title

[![alt](https://www.w3schools.com/w3images/lights.jpg)](https://github.com/kthjm/chin-plugin-compose)

- 0
- 1
- 2

*italics* and **bold** and ~~strikethrough~~.`