const { parse, format } = require('path')
const { assign } = Object

module.exports = (extensions) => ({
  options: extensions[0].options,
  isStream: extensions[0].isStream,
  processor: (data, util) =>
    recursiveProcess([].concat(extensions), data, util)
})

const recursiveProcess = (extensions, data, util) =>
  Promise.resolve()
  .then(() =>
    extensions
    .splice(0, 1)[0]
    .processor(data, util)
  )
  .then(result => resultNormalize(result, util.out))
  .then(results =>
    !extensions.length
    ?
    results
    :
    Promise.all(
      results.map(([ outpath, processed ]) =>
        recursiveProcess(
          extensions,
          processed,
          assign({}, util, { out: parseXbase(outpath) })
        )
      )
    )
    .then(([ results ]) => results)
  )

const resultNormalize = (result, out) =>
  !Array.isArray(result) ?
  [ [format(out), result] ] :

  !Array.isArray(result[0]) ?
  [ result ] :

  result

const parseXbase = (path) =>
  Object
  .entries(parse(path))
  .filter(([key]) => key !== 'base')
  .reduce((a, [key,value]) => assign(a, { [key]: value }), {})