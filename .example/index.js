import compose, { dock } from '..'
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

export default [
  {
    put: `${put}/unified`,
    out: `${out}/unified`,
    clean: true,
    processors: {
      md: compose([
        unified('m2h', [mdast2hast]),
        json()
      ]),
      html: compose([
        unified('h2m', [hast2mdast]),
        dock('stream', [], { encoding: 'utf8' }),
        json(),
        dock('stream', [], { encoding: 'utf8' })
      ])
    }
  },
  {
    put: `${put}/inkscape`,
    out: `${out}/inkscape.dock_as_stream`,
    clean: true,
    processors: {
      svg: compose([
        gulp(() => [ gulpImagemin() ]),
        dock('stream', [ inkscape('png') ]),
        chinImagemin()
      ])
    }
  },
  {
    put: `${put}/inkscape`,
    out: `${out}/inkscape.dock_as_buffer`,
    clean: true,
    processors: {
      svg: compose([
        inkscape('png'),
        dock('buffer', [ gulp(() => [ gulpImagemin() ]) ])
      ])
    }
  }
]