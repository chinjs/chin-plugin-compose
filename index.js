const { parse, format } = require('path')
const { Transform, Readable } = require('stream')
const { assign } = Object

const NAME = 'chin-plugin-compose'

const throws = (message) => { throw new Error(message) }
const asserts = (conditon, message) => !conditon && throws(message)
const parseXbase = (path) => {
  const { root, dir, name, ext } = parse(path)
  return { root, dir, name, ext }
}

/* compose */
const compose = (extensions, isDock) => {
  asserts(Array.isArray(extensions), `(${NAME}) !Array.isArray(extensions)`)
  asserts(typeof extensions[0] === 'object', `(${NAME}) typeof extensions[0] !== 'object'`)
  asserts(isDock || !extensions[0].isCompose, `(${NAME}) extensions[0] === dock()`)
  return {
    isCompose: true,
    options: extensions[0].options,
    isStream: extensions[0].isStream,
    processor: (data_or_pipe, util) => {
      return reprocess(data_or_pipe, util, extensions)
    }
  }
}

const result2results = (result, out) =>
  !Array.isArray(result) ? [ [format(out), result] ] :
  !Array.isArray(result[0]) ? [ result ] :
  result

const reprocess = async (data_or_pipe, util, [extension, ...extensions]) => {
  asserts(extension, `(${NAME}) !extension`)
  asserts(typeof extension.processor === 'function', `(${NAME}) typeof extension.processor !== "function"`)

  const results = await Promise.resolve().then(() => {
    return extension.processor(data_or_pipe, util)
  }).then(result => {
    return result2results(result, util.out)
  })

  if (!extensions.length) return results

  const firstProcessed = results[0][1]

  const createNextFirstArg = firstProcessed && typeof firstProcessed.pipe === 'function'
  ? (processed) => (...arg) => processed.pipe(...arg)
  : (processed) => processed

  return Promise.all(results.map(([ outpath, processed ]) => {
    return reprocess(
      createNextFirstArg(processed),
      assign({}, util, { out: parseXbase(outpath) }),
      extensions
    )
  })).then(all_results => {
    return [].concat(...all_results)
  })
}

/* dock */
const dock = (type, extensions = [], { encoding } = {}) => {
  asserts(type === 'buffer' || type === 'stream', `(${NAME}) dock(type) is invalid`)
  const b2s = buffer2stream(encoding)
  const s2b = stream2buffer(encoding)
  return compose({
    'buffer': [s2b, ...extensions, b2s],
    'stream': [b2s, ...extensions, s2b],
  }[type], true)
}

const buffer2stream = (encoding = null) => ({
  isStream: false,
  options: { encoding },
  processor: (data, { out }) => {
    asserts(typeof data !== 'function', `(${NAME}) buffer2stream passed "pipe"`)
    const stream = new Readable()
    stream.push(data)
    stream.push(null)
    return [
      format(out),
      stream
    ]
  }
})

const stream2buffer = (encoding = null) => ({
  isStream: true,
  options: { encoding },
  processor: (pipe, { out }) => new Promise((resolve, reject) => {
    asserts(typeof pipe === 'function', `(${NAME}) stream2buffer passed "data"`)
    const buffers = []
    const transform = new Transform({ encoding, transform: (chunk, enc, cb) => cb(null, chunk) })
    const stream = pipe(transform)
    stream.on('error', reject)
    stream.on('data', (chunk) => buffers.push(chunk))
    stream.on('end', () => resolve([
      format(out),
      Buffer.isBuffer(buffers[0]) ? Buffer.concat(buffers) : buffers.join('')
    ]))
  })
})

module.exports = compose
module.exports.compose = compose
module.exports.dock = dock
