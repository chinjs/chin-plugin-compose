import compose from '..'
import json from 'chin-plugin-json'
import unified from 'chin-plugin-unified'
import hast2mdast from 'rehype-remark'
import mdast2hast from 'remark-rehype'
import { join } from 'path'

const md2html2json = compose([
  unified('m2h', [mdast2hast]),
  json()
])

const html2md2json = compose([
  unified('h2m', [hast2mdast]),
  json()
])

export default {
  put: join(__dirname, 'put'),
  out: join(__dirname, 'out'),
  clean: true,
  processors: {
    md: md2html2json,
    html: html2md2json
  }
}