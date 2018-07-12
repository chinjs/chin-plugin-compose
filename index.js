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
    processor: (data_or_pipe, util) =>
      reprocess(
        [].concat(extensions),
        data_or_pipe,
        util
      )
  }
}

const result2results = (result, out) =>
  !Array.isArray(result) ? [ [format(out), result] ] :
  !Array.isArray(result[0]) ? [ result ] :
  result

const reprocess = (extensions, data_or_pipe, util) =>
  Promise.resolve()
  .then(() => {
    const extension = extensions.splice(0, 1)[0]
    asserts(extension, `(${NAME}) !extension`)
    asserts(typeof extension.processor === 'function', `(${NAME}) typeof extension.processor !== "function"`)
    return extension.processor(data_or_pipe, util)
  })
  .then(result => {
    const results = result2results(result, util.out)

    if (!extensions.length) return results

    const firstProcessed = results[0][1]
    const resultIsStream = firstProcessed && typeof firstProcessed.pipe === 'function'
    return Promise.all(results.map(([ outpath, processed ]) =>
      reprocess(
        extensions,
        resultIsStream ? (...arg) => processed.pipe(...arg) : processed,
        assign({}, util, { out: parseXbase(outpath) })
      )
    ))
    .then(alled => [].concat(...alled))
  })

/* dock */
const dock = (type, extensions = [], { encoding } = {}) => {
  const _buffer2stream = buffer2stream(encoding)
  const _stream2buffer = stream2buffer(encoding)

  if (type === 'stream') {
    extensions.unshift(_buffer2stream)
    extensions.push(_stream2buffer)
  } else if (type === 'buffer') {
    extensions.unshift(_stream2buffer)
    extensions.push(_buffer2stream)
  } else {
    throws(`(${NAME}) dock(type) is invalid`)
  }

  return compose(extensions, true)
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