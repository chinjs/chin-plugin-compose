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
  .then(result =>
    !extensions.length
    ? result
    : Promise.all(
      resultNormalize(result).map(processed =>
        recursiveProcess(extensions, processed, util)
      )
    )
  )

const resultNormalize = (result) =>
  !Array.isArray(result) ?
  [ result ] :

  !Array.isArray(result[0]) ?
  [ result[1] ] :

  result.map(_result => _result[1])