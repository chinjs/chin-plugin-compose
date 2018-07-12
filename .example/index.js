import compose, { convert } from '..'
import unified from 'chin-plugin-unified'
import hast2mdast from 'rehype-remark'
import mdast2hast from 'remark-rehype'
import json from 'chin-plugin-json'
import inkscape from 'chin-plugin-inkscape'
import gulp from 'chin-plugin-gulp'
import gulpImagemin from 'gulp-imagemin'
import chinImagemin from 'chin-plugin-imagemin'

import { join } from 'path'
const put = join(__dirname, 'put')
const out = join(__dirname, 'out')

const md2html2json = compose([
  unified('m2h', [mdast2hast]),
  json()
])

const html2md2json = compose([
  unified('h2m', [hast2mdast]),
  json()
])

const ink2min2png2min = compose([
  gulp(() => [ gulpImagemin() ]),
  convert('buffer2stream'),
  inkscape('png'),
  convert('stream2buffer'),
  chinImagemin()
])

const ink2png2min = compose([
  inkscape('png'),
  convert('s2b'),
  gulp(() => [ gulpImagemin() ]),
  convert('b2s')
])

export default {
  put,
  out,
  clean: true,
  processors: [
    ['read_as_buffer', { svg: ink2min2png2min }],
    ['read_as_stream', { svg: ink2png2min }],
    ['*', { md: md2html2json, html: html2md2json }]
  ]
}