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
const compose = (extensions) => {
  asserts(Array.isArray(extensions), `(${NAME}) !Array.isArray(extensions)`)
  asserts(typeof extensions[0] === 'object', `(${NAME}) typeof extensions[0] !== 'object'`)
  return {
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
    .then(alled => alled.map(([ results ]) => results))
  })


/* convert */
const convert = (type) =>
  (type === 's2b' || type === 'stream2buffer') ? stream2buffer() :
  (type === 'b2s' || type === 'buffer2stream') ? buffer2stream() :
  throws(`(${NAME}) convert(${type}) is invalid`)

const stream2buffer = () => ({
  isStream: true,
  processor: (pipe, { out }) => new Promise((resolve, reject) => {
    const buffers = []
    const transform = new Transform({ transform(chunk, enc, cb) { cb(null, chunk) } })
    const stream = pipe(transform)
    stream.on('error', reject)
    stream.on('data', (chunk) => buffers.push(chunk))
    stream.on('end', () => resolve([ format(out), Buffer.concat(buffers) ]))
  })
})

const buffer2stream = () => ({
  isStream: false,
  processor: (data, { out }) => {
    const stream = new Readable()
    stream.push(data)
    stream.push(null)
    return [ format(out), stream ]
  }
})

module.exports = compose
module.exports.compose = compose
module.exports.convert = convert